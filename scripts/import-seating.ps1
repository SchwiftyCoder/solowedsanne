<#
Imports guests straight from the Google Forms RSVP CSV export (Timestamp | First Name |
Last Name | Phone | Email | RSVP answer | Message) into the Supabase `seating` table.

There's no seating chart yet, so this auto-assigns table numbers in row order
(GUESTS_PER_TABLE per table) as a placeholder - move people between tables afterward
directly in the Supabase table editor if needed.

Upserts on the (first_name, last_name, phone) identity key, so re-running this after
the guest list changes updates existing guests in place (same id, same welcome link)
instead of deleting and regenerating everyone. Only a guest's first/last name/phone
change would create a duplicate row rather than update the existing one.

Usage:
  $env:SUPABASE_URL = "https://xxxx.supabase.co"
  $env:SUPABASE_SERVICE_ROLE_KEY = "..."
  ./scripts/import-seating.ps1 -CsvPath "C:\path\to\RSVP export.csv"
#>
param(
    [Parameter(Mandatory = $true)][string]$CsvPath,
    [int]$GuestsPerTable = 8
)

$ErrorActionPreference = "Stop"

if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Error "Set `$env:SUPABASE_URL and `$env:SUPABASE_SERVICE_ROLE_KEY before running this script."
    exit 1
}

function Normalize-Phone([string]$raw) {
    $digits = ($raw -replace '\D', '')
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
$tableNumber = 1
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
        Write-Warning "Row looks like it bundles more than one guest: '$firstName $lastName' - imported as-is, split manually in Supabase if needed."
    }

    $phone = Normalize-Phone ([string]$row.$phoneCol)
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
    }
}

Write-Host "Parsed $($rows.Count) guests across $tableNumber tables ($GuestsPerTable per table)."

$headers = @{
    "apikey"        = $env:SUPABASE_SERVICE_ROLE_KEY
    "Authorization" = "Bearer $($env:SUPABASE_SERVICE_ROLE_KEY)"
    "Content-Type"  = "application/json"
    "Prefer"        = "return=minimal,resolution=merge-duplicates"
}

$batchSize = 50
for ($i = 0; $i -lt $rows.Count; $i += $batchSize) {
    $batch = $rows[$i..([Math]::Min($i + $batchSize - 1, $rows.Count - 1))]
    $body = $batch | ConvertTo-Json -Depth 3
    if ($batch.Count -eq 1) { $body = "[$body]" }

    $uri = "$($env:SUPABASE_URL)/rest/v1/seating?on_conflict=first_name,last_name,phone"
    Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body | Out-Null
    Write-Host "Upserted rows $($i + 1)-$([Math]::Min($i + $batchSize, $rows.Count))"
}

Write-Host "Done. $($rows.Count) guests imported."
