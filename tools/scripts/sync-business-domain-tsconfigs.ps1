# Synchronize all business-domain tsconfig.json files with consistent configuration
# These are type-check only packages (no build step)

$standardConfig = @'
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"]
}
'@

# Get the workspace root (2 levels up from tools/scripts)
$workspaceRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$businessDomainDir = Join-Path $workspaceRoot "business-domain"

# Get all business-domain directories
$domains = Get-ChildItem -Path $businessDomainDir -Directory

$domainsCount = $domains.Count
Write-Host "Synchronizing $domainsCount business-domain tsconfig files..." -ForegroundColor Cyan

$updated = 0
foreach ($domain in $domains) {
    $tsconfigPath = Join-Path $domain.FullName "tsconfig.json"
    
    if (Test-Path $tsconfigPath) {
        # Write standardized config
        $standardConfig | Set-Content -Path $tsconfigPath -Encoding UTF8 -NoNewline
        $domainName = $domain.Name
        Write-Host "Updated $domainName" -ForegroundColor Green
        $updated++
    } else {
        $domainName = $domain.Name
        Write-Host "No tsconfig.json found in $domainName" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Synchronization complete! Updated $updated tsconfig files." -ForegroundColor Green
