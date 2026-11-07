$ErrorActionPreference = 'Stop'

$patchRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Get-Location).Path

$required = @(
  (Join-Path $repoRoot 'admin-portal'),
  (Join-Path $repoRoot 'backend\admin_api')
)
foreach ($path in $required) {
  if (-not (Test-Path $path)) {
    throw "Could not find '$path'. Open PowerShell in the ownwash-clone repository root and run this script again."
  }
}

$files = @(
  @{ Source = 'admin-portal\app\admin\(protected)\services\page.tsx'; Destination = 'admin-portal\app\admin\(protected)\services\page.tsx' },
  @{ Source = 'admin-portal\app\admin\(protected)\services\new\page.tsx'; Destination = 'admin-portal\app\admin\(protected)\services\new\page.tsx' },
  @{ Source = 'admin-portal\app\admin\(protected)\services\[id]\page.tsx'; Destination = 'admin-portal\app\admin\(protected)\services\[id]\page.tsx' },
  @{ Source = 'backend\admin_api\service_views.py'; Destination = 'backend\admin_api\service_views.py' },
  @{ Source = 'backend\admin_api\urls.py'; Destination = 'backend\admin_api\urls.py' }
)

foreach ($file in $files) {
  $source = Join-Path $patchRoot $file.Source
  $destination = Join-Path $repoRoot $file.Destination
  if (-not (Test-Path $source)) { throw "Patch file is missing: $source" }
  $destinationDirectory = Split-Path -Parent $destination
  New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null
  if (Test-Path $destination) {
    Copy-Item $destination "$destination.bak" -Force
  }
  Copy-Item $source $destination -Force
  Write-Host "Updated $($file.Destination)"
}

$cssTarget = Join-Path $repoRoot 'admin-portal\app\globals.css'
$cssAddition = Join-Path $patchRoot 'admin-portal\app\globals.css.addition.css'
if (-not (Test-Path $cssTarget)) { throw "Could not find $cssTarget" }
$existingCss = Get-Content $cssTarget -Raw
$marker = '/* Service catalogue management */'
if (-not $existingCss.Contains($marker)) {
  Add-Content -Path $cssTarget -Value "`r`n`r`n$(Get-Content $cssAddition -Raw)"
  Write-Host 'Appended Services management styles to admin-portal\app\globals.css'
} else {
  Write-Host 'Services management styles are already present; skipped CSS append.'
}

Write-Host ''
Write-Host 'CleanKart Admin Portal Services update applied.' -ForegroundColor Green
Write-Host 'Next: restart/redeploy Django and then rebuild/redeploy the admin-portal Vercel project.'
