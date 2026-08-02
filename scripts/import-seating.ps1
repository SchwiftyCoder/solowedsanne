<#
Imports guests straight from the Google Forms RSVP CSV export (Timestamp | First Name |
Last Name | Phone | Email | RSVP answer | Message) by POSTing to this app's own
/api/admin/import-guests endpoint, which upserts them into the `seating` table.

There's no seating chart yet, so this auto-assigns table numbers in row order
(GUESTS_PER_TABLE per table) as a placeholder - move people between tables afterward
directly in the database if needed.

Upserts on the (first_name, last_name, phone) identity key, so re-running this after
the guest list changes updates existing guests in place (same id, same welcome link)
instead of deleting and regenerating everyone. Only a guest's first/last name/phone
change would create a duplicate row rather than update the existing one. Note this
also means table_number/is_family are recomputed and overwritten on every run - any
manual reseating done directly in the database will be reset if you re-run this.

Usage:
  ./scripts/import-seating.ps1 -CsvPath "C:\path\to\RSVP export.csv" -SiteUrl "https://solowedsanne.com" -AdminPassword "..."

  # Importing a separate family list into different tables, flagged as family:
  ./scripts/import-seating.ps1 -CsvPath "C:\path\to\family RSVP export.csv" -IsFamily -StartingTable 12 -SiteUrl "https://solowedsanne.com" -AdminPassword "..."
#>
param(
    [Parameter(Mandatory = $true)][string]$CsvPath,
    [Parameter(Mandatory = $true)][string]$SiteUrl,
    [Parameter(Mandatory = $true)][string]$AdminPassword,
    [int]$GuestsPerTable = 8,
    [int]$StartingTable = 1,
    [switch]$IsFamily
)

$ErrorActionPreference = "Stop"

function Normalize-Phone([string]$raw) {
    $digits = ($raw -replace '\D', '')
    # "00" is the international dialing prefix used in place of "+" outside the Americas
    if ($digits.StartsWith('00') -and $digits.Length -gt 2) {
        return "+$($digits.Substring(2))"
    }
    if ($digits.Length -eq 11 -and $digits.StartsWith('1')) {
        return "+$digits"
    }
    if ($digits.Length -eq 10) {
        return "+1$digits"
    }
    if ($digits.Length -gt 0) {
        return "+$digits"
    }
    return ''
}

$bundledPattern = '\band\b|\bwife\b|\bhusband\b|\bauntie\b|\baunty\b|\bbf\b|\+1\b'

$csvRows = Import-Csv -Path $CsvPath
$firstNameCol = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'First Name' })[0]
$lastNameCol  = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'Last Name' })[0]
$phoneCol     = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'phone number' })[0]
$emailCol     = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'email address' })[0]
$attendingCol = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'joining us' })[0]
$messageCol   = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'well wishes' })[0]

if (-not $firstNameCol -or -not $lastNameCol -or -not $phoneCol) {
    Write-Error "Could not find expected First Name / Last Name / phone number columns in $CsvPath"
    exit 1
}

$rows = @()
$tableNumber = $StartingTable
$guestInTable = 0

foreach ($row in $csvRows) {
    $firstName = ([string]$row.$firstNameCol).Trim()
    $lastName  = ([string]$row.$lastNameCol).Trim()
    if (-not $firstName -and -not $lastName) { continue }

    if ($attendingCol) {
        $attending = [string]$row.$attendingCol
        if ($attending -and $attending -notmatch '^Yes') {
            Write-Warning "Skipping $firstName $lastName (RSVP: '$attending')"
            continue
        }
    }

    if ("$firstName $lastName" -match $bundledPattern) {
        Write-Warning "Row looks like it bundles more than one guest: '$firstName $lastName' - imported as-is, split manually in the database if needed."
    }

    $phone = Normalize-Phone ([string]$row.$phoneCol)
    if ($phone -match '^\+0') {
        Write-Warning "Phone for $firstName $lastName ('$($row.$phoneCol)') normalized to '$phone', which looks malformed - check it manually in the database."
    }
    $email = if ($emailCol) { ([string]$row.$emailCol).Trim().ToLower() } else { '' }
    $message = if ($messageCol) { ([string]$row.$messageCol).Trim() } else { '' }

    $guestInTable++
    if ($guestInTable -gt $GuestsPerTable) {
        $guestInTable = 1
        $tableNumber++
    }

    $rows += [PSCustomObject]@{
        first_name   = $firstName
        last_name    = $lastName
        email        = $email
        phone        = $phone
        table_number = $tableNumber
        message      = $message
        is_family    = [bool]$IsFamily
    }
}

Write-Host "Parsed $($rows.Count) guests across $tableNumber tables ($GuestsPerTable per table)."

$pair = "admin:$AdminPassword"
$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pair))
$headers = @{
    "Authorization" = "Basic $b64"
    "Content-Type"  = "application/json"
}

$batchSize = 50
$totalUpserted = 0
for ($i = 0; $i -lt $rows.Count; $i += $batchSize) {
    $batch = $rows[$i..([Math]::Min($i + $batchSize - 1, $rows.Count - 1))]
    $body = @{ rows = $batch } | ConvertTo-Json -Depth 4

    $uri = "$($SiteUrl.TrimEnd('/'))/api/admin/import-guests"
    $resp = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
    $totalUpserted += $resp.upserted
    Write-Host "Upserted rows $($i + 1)-$([Math]::Min($i + $batchSize, $rows.Count))"
}

Write-Host "Done. $totalUpserted guests imported."
