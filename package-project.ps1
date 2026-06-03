# package-project.ps1
# This script packages the Eventzone Blog project into a small zip file (under 1 MB)
# by excluding node_modules and the Next.js build cache.

$zipPath = Join-Path $PSScriptRoot "eventzone-blog-source.zip"

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host "Creating zip package of the source code..." -ForegroundColor Cyan

# Get all files except node_modules, .next, and the zip itself
$files = Get-ChildItem -Path $PSScriptRoot -Recurse | Where-Object { 
    $_.FullName -notlike "*\node_modules*" -and 
    $_.FullName -notlike "*\.next*" -and 
    $_.FullName -notlike "*eventzone-blog-source.zip*"
}

# Zip them up
Compress-Archive -Path $files.FullName -DestinationPath $zipPath -Force

Write-Host "Success! Created package at: $zipPath" -ForegroundColor Green
Write-Host "Total Package Size: $([Math]::Round((Get-Item $zipPath).Length / 1MB, 2)) MB" -ForegroundColor Green
