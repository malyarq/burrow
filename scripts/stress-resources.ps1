param([Parameter(Mandatory=$true)][string]$Directory)
$ErrorActionPreference = 'Stop'
$previous = @{}
$logical = [Environment]::ProcessorCount
while (-not (Test-Path -LiteralPath "$Directory/stop")) {
  $control = Get-Content -LiteralPath "$Directory/control.json" -Raw | ConvertFrom-Json
  $processes = @(Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId)
  $ids = [System.Collections.Generic.HashSet[int]]::new()
  if ($control.rootPid -gt 0) { [void]$ids.Add([int]$control.rootPid) }
  do {
    $changed = $false
    foreach ($p in $processes) {
      if ($ids.Contains([int]$p.ParentProcessId) -and $ids.Add([int]$p.ProcessId)) { $changed = $true }
    }
  } while ($changed)
  $rows = @(Get-CimInstance Win32_PerfRawData_PerfProc_Process | Where-Object { $ids.Contains([int]$_.IDProcess) } | ForEach-Object {
    $cpu = $null
    $key = [int]$_.IDProcess
    if ($previous.ContainsKey($key)) {
      $old = $previous[$key]
      $delta = [double]$_.Timestamp_Sys100NS - $old.timestamp
      if ($delta -gt 0) { $cpu = [Math]::Max(0.0, 100.0 * ([double]$_.PercentProcessorTime - $old.ticks) / $delta / $logical) }
    }
    $previous[$key] = @{ timestamp=[double]$_.Timestamp_Sys100NS; ticks=[double]$_.PercentProcessorTime }
    [pscustomobject]@{ pid=$key; resident=[double]$_.WorkingSetPrivate; committed=[double]$_.PrivateBytes; cpu=$cpu }
  })
  $memory = Get-CimInstance Win32_PerfFormattedData_PerfOS_Memory
  [pscustomobject]@{
    time=[DateTime]::UtcNow.ToString('o'); phase=$control.phase; rootPid=$control.rootPid; logicalProcessors=$logical
    availableMiB=[double]$memory.AvailableMBytes; pagesOutPerSec=[double]$memory.PagesOutputPersec
    residentMiB=($rows | Measure-Object resident -Sum).Sum / 1MB
    committedMiB=($rows | Measure-Object committed -Sum).Sum / 1MB
    cpuMachinePct=($rows | Measure-Object cpu -Sum).Sum; processes=$rows
  } | ConvertTo-Json -Depth 4 -Compress | Add-Content -LiteralPath "$Directory/samples.jsonl" -Encoding utf8
  Start-Sleep -Seconds 1
}
