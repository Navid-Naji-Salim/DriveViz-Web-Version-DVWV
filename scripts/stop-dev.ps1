$ErrorActionPreference = "SilentlyContinue"

$workspace = (Resolve-Path "$PSScriptRoot\..").Path
$patterns = @(
  "*concurrently*",
  "*tsx watch src/server.ts*",
  "*backend\node_modules\tsx*",
  "*vite --host 127.0.0.1*",
  "*vite\bin\vite*",
  "*@esbuild\win32-x64\esbuild*"
)

$processes = Get-CimInstance Win32_Process | Where-Object {
  $commandLine = $_.CommandLine

  if ([string]::IsNullOrWhiteSpace($commandLine)) {
    return $false
  }

  if ($commandLine -notlike "*$workspace*") {
    return $false
  }

  foreach ($pattern in $patterns) {
    if ($commandLine -like $pattern) {
      return $true
    }
  }

  return $false
}

foreach ($process in $processes) {
  if ($process.ProcessId -ne $PID) {
    Stop-Process -Id $process.ProcessId -Force
  }
}

Write-Host "Stopped stale DriveViz dev servers."
