#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Enhanced type refactoring script - DRY RUN ONLY
.DESCRIPTION
    Shows what would be done without making changes
#>

$ErrorActionPreference = 'Stop'

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "    TYPE REFACTORING DRY RUN" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

# Discover all domains with types.ts
$allDomains = Get-ChildItem -Path "business-domain" -Directory | 
    Where-Object { Test-Path "$($_.FullName)\src\types.ts" } | 
    ForEach-Object { $_.Name } | 
    Sort-Object

Write-Host "Domains to process: $($allDomains.Count)`n" -ForegroundColor Blue

$summary = @()

foreach ($domain in $allDomains) {
    Write-Host "Processing: $domain" -ForegroundColor Cyan
    
    $domainPath = "business-domain\$domain"
    $typesFile = "$domainPath\src\types.ts"
    $servicesDir = "$domainPath\src\services"
    
    # Analyze types.ts
    $typesContent = Get-Content $typesFile -Raw
    $lines = ($typesContent -split "`n").Count
    $interfaces = @([regex]::Matches($typesContent, "^export interface", "Multiline")).Count
    $types = @([regex]::Matches($typesContent, "^export type", "Multiline")).Count
    $enums = @([regex]::Matches($typesContent, "^export enum", "Multiline")).Count
    $totalExports = $interfaces + $types + $enums
    
    # Count service files that import from types
    $serviceImports = 0
    if (Test-Path $servicesDir) {
        $serviceFiles = Get-ChildItem "$servicesDir\*.ts" -File
        foreach ($serviceFile in $serviceFiles) {
            $content = Get-Content $serviceFile.FullName -Raw
            if ($content -match "from\s+['`"]\.\.\/types") {
                $serviceImports++
            }
        }
    }
    
    Write-Host "  Lines: $lines | Exports: $totalExports | Services with imports: $serviceImports" -ForegroundColor Blue
    
    Write-Host "  Would create:" -ForegroundColor Green
    Write-Host "    - business-domain\$domain\src\types\common.ts" -ForegroundColor White
    
    Write-Host "  Would update:" -ForegroundColor Yellow
    Write-Host "    - business-domain\$domain\src\index.ts" -ForegroundColor White
    if ($serviceImports -gt 0) {
        Write-Host "    - $serviceImports service file(s)" -ForegroundColor White
    }
    
    Write-Host "  Would delete:" -ForegroundColor Red
    Write-Host "    - business-domain\$domain\src\types.ts`n" -ForegroundColor White
    
    $summary += [PSCustomObject]@{
        Domain = $domain
        Lines = $lines
        Exports = $totalExports
        Services = $serviceImports
    }
}

# Summary
Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`nTotal domains: $($summary.Count)" -ForegroundColor White
Write-Host "Total lines to migrate: $(($summary | Measure-Object -Property Lines -Sum).Sum)" -ForegroundColor White
Write-Host "Total exports to migrate: $(($summary | Measure-Object -Property Exports -Sum).Sum)" -ForegroundColor White
Write-Host "Total service files to update: $(($summary | Measure-Object -Property Services -Sum).Sum)" -ForegroundColor White

Write-Host "`nTop 5 largest migrations:" -ForegroundColor Yellow
$summary | Sort-Object -Property Lines -Descending | Select-Object -First 5 | ForEach-Object {
    Write-Host "  $($_.Domain): $($_.Lines) lines, $($_.Exports) exports" -ForegroundColor White
}

Write-Host "`n To execute the refactoring, run:" -ForegroundColor Cyan
Write-Host "  pnpm tsx scripts/refactor-types.ts`n" -ForegroundColor White
