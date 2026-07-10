<#
Imports the "Ghana Wedding Guests" sheet (First Name | Last Name | Phone Number | Email | Seat Position)
into the Supabase `seating` table via the PostgREST API (upsert on the `email` unique constraint).

Usage:
  $env:SUPABASE_URL = "https://xxxx.supabase.co"
  $env:SUPABASE_SERVICE_ROLE_KEY = "..."
  ./scripts/import-seating.ps1 -ExcelPath "C:\path\to\guest list.xlsx"
#>
param(
    [Parameter(Mandatory = $true)][string]$ExcelPath,
    [string]$SheetName = "Ghana Wedding Guests"
)

$ErrorActionPreference = "Stop"

if (-not $env:SUPABASE_URL -or -not $env:SUPABASE_SERVICE_ROLE_KEY) {
    Write-Error "Set `$env:SUPABASE_URL and `$env:SUPABASE_SERVICE_ROLE_KEY before running this script."
    exit 1
}

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$wb = $excel.Workbooks.Open($ExcelPath)
try {
    $ws = $wb.Worksheets.Item($SheetName)
    $used = $ws.UsedRange
    $rowCount = $used.Rows.Count

    $rows = @()
    for ($r = 2; $r -le $rowCount; $r++) {
        $firstName = [string]$ws.Cells.Item($r, 1).Text
        $lastName  = [string]$ws.Cells.Item($r, 2).Text
        $phone     = [string]$ws.Cells.Item($r, 3).Text
        $email     = [string]$ws.Cells.Item($r, 4).Text
        $seatPos   = [string]$ws.Cells.Item($r, 5).Text

        if (-not $firstName -and -not $email) { continue }

        # "Table 1 - Seat 1" -> table_number=1, seat_number=1
        $tableNumber = $null
        $seatNumber = $null
        if ($seatPos -match 'Table\s+(\d+)\s*-\s*Seat\s+(\d+)') {
            $tableNumber = [int]$Matches[1]
            $seatNumber = [int]$Matches[2]
        } else {
            Write-Warning "Row $r ($email): could not parse seat position '$seatPos', skipping."
            continue
        }

        $rows += [PSCustomObject]@{
            first_name   = $firstName.Trim()
            last_name    = $lastName.Trim()
            email        = $email.Trim().ToLower()
            phone        = $phone.Trim()
            table_number = $tableNumber
            seat_number  = $seatNumber
        }
    }
} finally {
    $wb.Close($false)
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}

Write-Host "Parsed $($rows.Count) rows. Upserting to Supabase..."

$headers = @{
    "apikey"        = $env:SUPABASE_SERVICE_ROLE_KEY
    "Authorization" = "Bearer $($env:SUPABASE_SERVICE_ROLE_KEY)"
    "Content-Type"  = "application/json"
    "Prefer"        = "resolution=merge-duplicates"
}

$batchSize = 50
for ($i = 0; $i -lt $rows.Count; $i += $batchSize) {
    $batch = $rows[$i..([Math]::Min($i + $batchSize - 1, $rows.Count - 1))]
    $body = $batch | ConvertTo-Json -Depth 3
    if ($batch.Count -eq 1) { $body = "[$body]" }

    $uri = "$($env:SUPABASE_URL)/rest/v1/seating?on_conflict=email"
    Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body | Out-Null
    Write-Host "Upserted rows $($i + 1)-$([Math]::Min($i + $batchSize, $rows.Count))"
}

Write-Host "Done."
