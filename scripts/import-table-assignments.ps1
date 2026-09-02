<#
Imports the final seating chart (guest_id, full_name, first_name, last_name,
table_number, table_name, table_category, seat_number, status, notes) by
POSTing to /api/admin/import-tables, which matches guests by first/last name
case-insensitively and only ever touches table_number - existing phone/email
from the RSVP-form import is left untouched. Guests in the chart with no
matching database record (e.g. groomsmen added straight to the chart, not the
RSVP form) are inserted with no phone/email.

The table_number column in this CSV is actually a label (e.g. "Table 1",
"High Table - Anne", "Unassigned"), not a plain number - it's stored as-is.

Usage:
  ./scripts/import-table-assignments.ps1 -CsvPath "C:\path\to\wedding_seating_chart.csv" -SiteUrl "https://solowedsanne.com" -AdminPassword "..."
#>
param(
    [Parameter(Mandatory = $true)][string]$CsvPath,
    [Parameter(Mandatory = $true)][string]$SiteUrl,
    [Parameter(Mandatory = $true)][string]$AdminPassword
)

$ErrorActionPreference = "Stop"

$csvRows = Import-Csv -Path $CsvPath

$rows = @()
foreach ($row in $csvRows) {
    $firstName = ([string]$row.first_name).Trim()
    $lastName  = ([string]$row.last_name).Trim()
    $tableNumber = ([string]$row.table_number).Trim()
    if (-not $firstName -and -not $lastName) { continue }

    $rows += [PSCustomObject]@{
        first_name   = $firstName
        last_name    = $lastName
        table_number = $tableNumber
    }
}

Write-Host "Parsed $($rows.Count) seating chart rows."

$pair = "admin:$AdminPassword"
$b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($pair))
$headers = @{
    "Authorization" = "Basic $b64"
    "Content-Type"  = "application/json"
}

$batchSize = 50
$totalUpdated = 0
$totalInserted = 0
$allAmbiguous = @()
for ($i = 0; $i -lt $rows.Count; $i += $batchSize) {
    $batch = $rows[$i..([Math]::Min($i + $batchSize - 1, $rows.Count - 1))]
    $body = @{ rows = $batch } | ConvertTo-Json -Depth 4
    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)

    $uri = "$($SiteUrl.TrimEnd('/'))/api/admin/import-tables"
    $resp = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $bodyBytes
    $totalUpdated += $resp.updated
    $totalInserted += $resp.inserted
    if ($resp.ambiguous) { $allAmbiguous += $resp.ambiguous }
    Write-Host "Processed rows $($i + 1)-$([Math]::Min($i + $batchSize, $rows.Count)) - updated $($resp.updated), inserted $($resp.inserted)"
}

Write-Host "Done. $totalUpdated existing guests updated, $totalInserted new guests inserted."
if ($allAmbiguous.Count -gt 0) {
    Write-Warning "$($allAmbiguous.Count) name(s) matched more than one existing guest and were skipped - assign these manually:"
    $allAmbiguous | ForEach-Object { Write-Warning "  $($_.first_name) $($_.last_name)" }
}
