<#
Imports guests straight from the Google Forms RSVP CSV export (Timestamp | First Name |
Last Name | Phone | Email | RSVP answer | Message) by POSTing to this app's own
/api/admin/import-guests endpoint, which upserts them into the `seating` table.

Table numbers aren't assigned yet, so every guest is imported with table_number
'TBA' - real seating gets assigned later by editing that column directly in the
database.

Upserts on the (first_name, last_name, phone) identity key, so re-running this after
the guest list changes updates existing guests in place (same id, same welcome link)
instead of deleting and regenerating everyone. Only a guest's first/last name/phone
change would create a duplicate row rather than update the existing one.

Usage:
  ./scripts/import-seating.ps1 -CsvPath "C:\path\to\RSVP export.csv" -SiteUrl "https://solowedsanne.com" -AdminPassword "..."

  # Full replace - wipes every existing guest first, then imports only this file:
  ./scripts/import-seating.ps1 -CsvPath "C:\path\to\RSVP export.csv" -Replace -SiteUrl "https://solowedsanne.com" -AdminPassword "..."

  # Importing a separate family list, flagged as family:
  ./scripts/import-seating.ps1 -CsvPath "C:\path\to\family RSVP export.csv" -IsFamily -SiteUrl "https://solowedsanne.com" -AdminPassword "..."
#>
param(
    [Parameter(Mandatory = $true)][string]$CsvPath,
    [Parameter(Mandatory = $true)][string]$SiteUrl,
    [Parameter(Mandatory = $true)][string]$AdminPassword,
    [switch]$IsFamily,
    [switch]$Replace
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
$emailCol     = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'email address' -or $_ -eq 'Column 5' })[0]
$attendingCol = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'joining us' })[0]
$messageCol   = @($csvRows[0].PSObject.Properties.Name | Where-Object { $_ -match 'well wishes' })[0]

if (-not $firstNameCol -or -not $lastNameCol -or -not $phoneCol) {
    Write-Error "Could not find expected First Name / Last Name / phone number columns in $CsvPath"
    exit 1
}

$rows = @()

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

    $rows += [PSCustomObject]@{
        first_name   = $firstName
        last_name    = $lastName
        email        = $email
        phone        = $phone
        table_number = 'TBA'
        message      = $message
        is_family    = [bool]$IsFamily
    }
}

Write-Host "Parsed $($rows.Count) guests."

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
    $isFirstBatch = $i -eq 0
    $body = @{ rows = $batch; replace = ([bool]$Replace -and $isFirstBatch) } | ConvertTo-Json -Depth 4
    # Windows PowerShell's Invoke-RestMethod can mangle non-ASCII characters (emoji, curly
    # quotes in guest messages) unless the body is sent as explicit UTF-8 bytes.
    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

    $uri = "$($SiteUrl.TrimEnd('/'))/api/admin/import-guests"
    $resp = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $bodyBytes
    $totalUpserted += $resp.upserted
    Write-Host "Upserted rows $($i + 1)-$([Math]::Min($i + $batchSize, $rows.Count))"
}

Write-Host "Done. $totalUpserted guests imported."
