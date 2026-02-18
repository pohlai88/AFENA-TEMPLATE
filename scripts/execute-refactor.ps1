#!/usr/bin/env pwsh
# Simple, reliable refactoring script
$ErrorActionPreference = 'Stop'

$domains = @(
    'cap-table-management', 'cash-pooling', 'central-kitchen', 'cold-chain',
    'crop-planning', 'external-audit-management', 'feed-mill', 'food-safety',
    'franchise-compliance', 'franchise-development', 'franchise-outlet-audit',
    'franchisee-operations', 'greenhouse-management', 'group-purchasing',
    'herd-management', 'innovation-management', 'investment-management',
    'livestock-analytics', 'livestock-processing', 'livestock-procurement',
    'marketing-fund-management', 'nutrition-labeling', 'precision-agriculture',
    'rd-project-management', 'recipe-management', 'regulatory-intelligence',
    'retail-pos', 'royalty-management', 'sec-reporting',
    'shared-services-management', 'stock-based-compensation', 'subscription-billing'
)

$success = 0
$failed = 0

foreach ($domain in $domains) {
    Write-Host "Processing: $domain" -ForegroundColor Cyan
    
    $typesFile = "business-domain\$domain\src\types.ts"
    $indexFile = "business-domain\$domain\src\index.ts"
    $commonDir = "business-domain\$domain\src\types"
    $commonFile = "$commonDir\common.ts"
    $servicesDir = "business-domain\$domain\src\services"
    
    try {
        # Skip if no types.ts
        if (-not (Test-Path $typesFile)) {
            Write-Host "  Skipped (no types.ts)" -ForegroundColor Yellow
            continue
        }
        
        # Create types directory
        if (-not (Test-Path $commonDir)) {
            New-Item -ItemType Directory -Path $commonDir -Force | Out-Null
        }
        
        # Copy types.ts to types/common.ts
        Copy-Item $typesFile $commonFile
        
        # Update index.ts
        if (Test-Path $indexFile) {
            $content = Get-Content $indexFile -Raw
            $content = $content -replace "from ['`"]\.\/types(?:\.js)?['`"]", "from './types/common.js'"
            Set-Content $indexFile $content
        }
        
        # Update service imports
        if (Test-Path $servicesDir) {
            Get-ChildItem "$servicesDir\*.ts" | ForEach-Object {
                $content = Get-Content $_.FullName -Raw
                if ($content -match "from ['`"]\.\.\/types") {
                    $content = $content -replace "from ['`"]\.\.\/types(?:\.js)?['`"]", "from '../types/common.js'"
                    Set-Content $_.FullName $content
                }
            }
        }
        
        # Delete old types.ts
        Remove-Item $typesFile
        
        Write-Host "  SUCCESS" -ForegroundColor Green
        $success++
    }
    catch {
        Write-Host "  FAILED: $_" -ForegroundColor Red
        $failed++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Success: $success" -ForegroundColor Green
Write-Host "  Failed: $failed" -ForegroundColor Red
