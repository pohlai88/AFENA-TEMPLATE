#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Refactors centralized types.ts to colocated pattern across all business domains
.DESCRIPTION
    For each domain with types.ts:
    1. Creates types/common.ts with the types content
    2. Updates index.ts exports from './types' to './types/common.js'
    3. Deletes old types.ts
#>

$ErrorActionPreference = 'Stop'

# List of domains to refactor (excluding already done: animal-welfare, board-management, dividend-management)
$domainsToRefactor = @(
    'cap-table-management',
    'central-kitchen',
    'cold-chain',
    'crop-planning',
    'external-audit-management',
    'feed-mill',
    'food-safety',
    'franchise-compliance',
    'franchise-development',
    'franchisee-operations',
    'franchise-outlet-audit',
    'greenhouse-management',
    'group-purchasing',
    'herd-management',
    'innovation-management',
    'investment-management',
    'livestock-analytics',
    'livestock-processing',
    'livestock-procurement',
    'cash-pooling',
    'marketing-fund-management',
    'nutrition-labeling',
    'precision-agriculture',
    'rd-project-management',
    'recipe-management',
    'regulatory-intelligence',
    'retail-pos',
    'royalty-management',
    'sec-reporting',
    'shared-services-management',
    'stock-based-compensation',
    'subscription-billing'
)

$successCount = 0
$failureCount = 0
$failures = @()

foreach ($domain in $domainsToRefactor) {
    Write-Host "`n=== Processing: $domain ===" -ForegroundColor Cyan
    
    $domainPath = "business-domain\$domain"
    $typesFile = "$domainPath\src\types.ts"
    $indexFile = "$domainPath\src\index.ts"
    $commonDir = "$domainPath\src\types"
    $commonFile = "$commonDir\common.ts"
    
    try {
        # Check if types.ts exists
        if (-not (Test-Path $typesFile)) {
            Write-Host "  ⚠️  No types.ts found, skipping" -ForegroundColor Yellow
            continue
        }
        
        # Create types directory
        if (-not (Test-Path $commonDir)) {
            New-Item -ItemType Directory -Path $commonDir -Force | Out-Null
            Write-Host "  ✓ Created types/ directory" -ForegroundColor Green
        }
        
        # Read existing types.ts content
        $typesContent = Get-Content $typesFile -Raw
        
        # Create common.ts with existing types content
        Set-Content -Path $commonFile -Value $typesContent
        Write-Host "  ✓ Created types/common.ts" -ForegroundColor Green
        
        # Update index.ts if it exists
        if (Test-Path $indexFile) {
            $indexContent = Get-Content $indexFile -Raw
            
            # Replace './types' with './types/common.js'
            $updatedContent = $indexContent -replace "from\s+['`"]\.\/types['`"]", "from './types/common.js'"
            
            Set-Content -Path $indexFile -Value $updatedContent
            Write-Host "  ✓ Updated index.ts imports" -ForegroundColor Green
        }
        
        # Delete old types.ts
        Remove-Item $typesFile -Force
        Write-Host "  ✓ Deleted old types.ts" -ForegroundColor Green
        
        $successCount++
        Write-Host "  ✅ Successfully refactored: $domain" -ForegroundColor Green
        
    } catch {
        $failureCount++
        $failures += $domain
        Write-Host "  ❌ Failed to refactor: $domain" -ForegroundColor Red
        Write-Host "     Error: $_" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "REFACTORING SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Successful: $successCount domains" -ForegroundColor Green
Write-Host "❌ Failed: $failureCount domains" -ForegroundColor Red

if ($failures.Count -gt 0) {
    Write-Host "`nFailed domains:" -ForegroundColor Red
    $failures | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Write-Host "`n✨ Type refactoring batch complete!" -ForegroundColor Cyan
