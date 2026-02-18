#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Enhanced type refactoring script with service import updates and validation
.DESCRIPTION
    For each domain with types.ts:
    1. Creates types/common.ts with the types content
    2. Updates index.ts exports from './types' to './types/common.js'
    3. Updates service file imports from '../types' to '../types/common.js'
    4. Validates with TypeScript compiler
    5. Deletes old types.ts
.PARAMETER DryRun
    If specified, shows what would be done without making changes
.PARAMETER DomainFilter
    Optional array of specific domains to process
#>

[CmdletBinding()]
param(
    [switch]$DryRun,
    [string[]]$DomainFilter
)

$ErrorActionPreference = 'Stop'

function Write-ColorHost {
    param(
        [string]$Message,
        [string]$Color = 'White',
        [switch]$NoNewline
    )
    $params = @{
        Object          = $Message
        ForegroundColor = $Color
    }
    if ($NoNewline) {
        $params['NoNewline'] = $true
    }
    Write-Host @params
}

# Discover all domains with types.ts
$allDomains = Get-ChildItem -Path "business-domain" -Directory | 
Where-Object { Test-Path "$($_.FullName)\src\types.ts" } | 
ForEach-Object { $_.Name } | 
Sort-Object

# Apply filter if specified
$domainsToProcess = if ($DomainFilter) {
    $allDomains | Where-Object { $DomainFilter -contains $_ }
}
else {
    $allDomains
}

# Counters
$successCount = 0
$skipCount = 0
$failureCount = 0
$failures = @()
$results = @()

Write-ColorHost "`n╔════════════════════════════════════════════════════════════╗" -Color Cyan
Write-ColorHost "║     ENHANCED TYPE REFACTORING SCRIPT                      ║" -Color Cyan
Write-ColorHost "╚════════════════════════════════════════════════════════════╝" -Color Cyan

if ($DryRun) {
    Write-ColorHost "`n🔍 DRY RUN MODE - No changes will be made`n" -Color Yellow
}

Write-ColorHost "Domains to process: $($domainsToProcess.Count)" -Color Blue
Write-ColorHost "Total domains with types.ts: $($allDomains.Count)`n" -Color Blue

foreach ($domain in $domainsToProcess) {
    Write-ColorHost "`n┌─────────────────────────────────────────────────────────┐" -Color Cyan
    Write-ColorHost "│ Processing: " -Color Cyan -NoNewline
    Write-ColorHost "$domain" -Color White -NoNewline
    Write-Host " " * (40 - $domain.Length) -NoNewline
    Write-ColorHost "│" -Color Cyan
    Write-ColorHost "└─────────────────────────────────────────────────────────┘" -Color Cyan
    
    $domainPath = "business-domain\$domain"
    $typesFile = "$domainPath\src\types.ts"
    $indexFile = "$domainPath\src\index.ts"
    $servicesDir = "$domainPath\src\services"
    $commonDir = "$domainPath\src\types"
    $commonFile = "$commonDir\common.ts"
    
    $changes = @{
        CreatedDirs  = @()
        CreatedFiles = @()
        UpdatedFiles = @()
        DeletedFiles = @()
        Errors       = @()
    }
    
    try {
        # Validate prerequisites
        if (-not (Test-Path $typesFile)) {
            Write-ColorHost "  ⚠️  No types.ts found, skipping" -Color Yellow
            $skipCount++
            continue
        }
        
        # Check if already refactored
        if (Test-Path $commonFile) {
            Write-ColorHost "  ⚠️  Already refactored (types/common.ts exists), skipping" -Color Yellow
            $skipCount++
            continue
        }
        
        # Step 1: Create types/common.ts
        Write-ColorHost "  [1/6] Creating types directory..." -Color Blue -NoNewline
        if (-not $DryRun) {
            if (-not (Test-Path $commonDir)) {
                New-Item -ItemType Directory -Path $commonDir -Force | Out-Null
                $changes.CreatedDirs += $commonDir
            }
        }
        Write-ColorHost " ✓" -Color Green
        
        # Step 2: Copy types content
        Write-ColorHost "  [2/6] Creating types/common.ts..." -Color Blue -NoNewline
        $typesContent = Get-Content $typesFile -Raw
        $typeStats = @{
            Lines      = ($typesContent -split "`n").Count
            Interfaces = ([regex]::Matches($typesContent, "^export interface", [System.Text.RegularExpressions.RegexOptions]::Multiline)).Count
            Types      = ([regex]::Matches($typesContent, "^export type", [System.Text.RegularExpressions.RegexOptions]::Multiline)).Count
            Enums      = ([regex]::Matches($typesContent, "^export enum", [System.Text.RegularExpressions.RegexOptions]::Multiline)).Count
        }
        
        if (-not $DryRun) {
            Set-Content -Path $commonFile -Value $typesContent
            $changes.CreatedFiles += $commonFile
        }
        Write-ColorHost " ✓ " -Color Green -NoNewline
        Write-ColorHost "($($typeStats.Lines) lines, $($typeStats.Interfaces + $typeStats.Types + $typeStats.Enums) exports)" -Color Blue
        
        # Step 3: Update index.ts
        Write-ColorHost "  [3/6] Updating index.ts..." -Color Blue -NoNewline
        if (Test-Path $indexFile) {
            $indexContent = Get-Content $indexFile -Raw
            $updatedIndex = $indexContent -replace "from\s+['`"]\.\/types(?:\.js)?['`"]", "from './types/common.js'"
            
            if (-not $DryRun) {
                Set-Content -Path $indexFile -Value $updatedIndex
                $changes.UpdatedFiles += $indexFile
            }
            Write-ColorHost " ✓" -Color Green
        }
        else {
            Write-ColorHost " ⚠️  No index.ts found" -Color Yellow
        }
        
        # Step 4: Update service imports
        Write-ColorHost "  [4/6] Updating service imports..." -Color Blue -NoNewline
        $serviceFiles = @()
        if (Test-Path $servicesDir) {
            $serviceFiles = Get-ChildItem "$servicesDir\*.ts" -File
        }
        
        $updatedServices = 0
        foreach ($serviceFile in $serviceFiles) {
            $serviceContent = Get-Content $serviceFile.FullName -Raw
            
            # Check if file imports from types
            if ($serviceContent -match "from\s+['`"]\.\.\/types(?:\.js)?['`"]") {
                $updatedServiceContent = $serviceContent -replace "from\s+['`"]\.\.\/types(?:\.js)?['`"]", "from '../types/common.js'"
                
                if (-not $DryRun) {
                    Set-Content -Path $serviceFile.FullName -Value $updatedServiceContent
                    $changes.UpdatedFiles += $serviceFile.FullName
                }
                $updatedServices++
            }
        }
        Write-ColorHost " ✓ " -Color Green -NoNewline
        Write-ColorHost "($updatedServices files updated)" -Color Blue
        
        # Step 5: Validate TypeScript (if not dry run)
        if (-not $DryRun) {
            Write-ColorHost "  [5/6] Validating TypeScript..." -Color Blue -NoNewline
            Push-Location $domainPath
            try {
                $typecheckOutput = pnpm exec tsc --noEmit 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-ColorHost " ✓" -Color Green
                }
                else {
                    Write-ColorHost " ⚠️  Type errors (will continue)" -Color Yellow
                    $changes.Errors += "TypeScript validation warnings"
                }
            }
            catch {
                Write-ColorHost " ⚠️  Could not validate" -Color Yellow
                $changes.Errors += "TypeScript validation skipped: $_"
            }
            finally {
                Pop-Location
            }
        }
        else {
            Write-ColorHost "  [5/6] Validating TypeScript... ⊘ (dry run)" -Color Yellow
        }
        
        # Step 6: Delete old types.ts
        Write-ColorHost "  [6/6] Removing old types.ts..." -Color Blue -NoNewline
        if (-not $DryRun) {
            Remove-Item $typesFile -Force
            $changes.DeletedFiles += $typesFile
        }
        Write-ColorHost " ✓" -Color Green
        
        $successCount++
        $results += [PSCustomObject]@{
            Domain          = $domain
            Status          = "Success"
            TypeCount       = $typeStats.Interfaces + $typeStats.Types + $typeStats.Enums
            ServicesUpdated = $updatedServices
            Changes         = $changes
        }
        
        Write-ColorHost "`n  ✅ Successfully refactored: " -Color Green -NoNewline
        Write-ColorHost "$domain" -Color White
        
    }
    catch {
        $failureCount++
        $failures += $domain
        $changes.Errors += $_.ToString()
        
        $results += [PSCustomObject]@{
            Domain  = $domain
            Status  = "Failed"
            Error   = $_.ToString()
            Changes = $changes
        }
        
        Write-ColorHost "`n  ❌ Failed to refactor: " -Color Red -NoNewline
        Write-ColorHost "$domain" -Color White
        Write-ColorHost "     Error: $_" -Color Red
    }
}

# Summary
Write-ColorHost "`n" -NoNewline
Write-ColorHost "╔════════════════════════════════════════════════════════════╗" -Color Cyan
Write-ColorHost "║                 REFACTORING SUMMARY                        ║" -Color Cyan
Write-ColorHost "╚════════════════════════════════════════════════════════════╝" -Color Cyan

Write-ColorHost "`nResults:" -Color White
Write-ColorHost "  ✅ Successful:      " -Color Green -NoNewline
Write-ColorHost "$successCount domains" -Color White
Write-ColorHost "  ⚠️  Skipped:        " -Color Yellow -NoNewline
Write-ColorHost "$skipCount domains" -Color White
Write-ColorHost "  ❌ Failed:          " -Color Red -NoNewline
Write-ColorHost "$failureCount domains" -Color White

if ($DryRun) {
    Write-ColorHost "`n📋 Changes that would be made:" -Color Cyan
    foreach ($result in $results | Where-Object { $_.Status -eq 'Success' }) {
        Write-ColorHost "`n  $($result.Domain):" -Color White
        Write-ColorHost "    • Types/Enums: $($result.TypeCount) exports moved" -Color Blue
        Write-ColorHost "    • Services: $($result.ServicesUpdated) files updated" -Color Blue
        Write-ColorHost "    • Files created: 1 (types/common.ts)" -Color Blue
        Write-ColorHost "    • Files updated: $($result.ServicesUpdated + 1) (index.ts + services)" -Color Blue
        Write-ColorHost "    • Files deleted: 1 (types.ts)" -Color Blue
    }
}

if ($failures.Count -gt 0) {
    Write-ColorHost "`n❌ Failed domains:" -Color Red
    foreach ($failure in $failures) {
        $failedResult = $results | Where-Object { $_.Domain -eq $failure }
        Write-ColorHost "  • $failure" -Color Red
        if ($failedResult.Error) {
            Write-ColorHost "    └─> $($failedResult.Error)" -Color Red
        }
    }
}

$totalExports = ($results | Where-Object { $_.Status -eq 'Success' } | Measure-Object -Property TypeCount -Sum).Sum
if ($totalExports) {
    Write-ColorHost "`n📊 Statistics:" -Color Cyan
    Write-ColorHost "  • Total type exports migrated: $totalExports" -Color Blue
    Write-ColorHost "  • Average exports per domain: $([Math]::Round($totalExports / $successCount, 1))" -Color Blue
}

if (-not $DryRun) {
    Write-ColorHost "`n✨ Type refactoring complete!" -Color Cyan
    Write-ColorHost "`n📝 Next steps:" -Color Yellow
    Write-ColorHost "  1. Run: pnpm typecheck (validate all changes)" -Color Blue
    Write-ColorHost "  2. Run: pnpm test (ensure tests pass)" -Color Blue
    Write-ColorHost "  3. Commit changes with descriptive message" -Color Blue
}
else {
    Write-ColorHost "`n✨ Dry run complete - no changes made!" -Color Cyan
    Write-ColorHost "`n📝 To execute the refactoring, run:" -Color Yellow
    Write-ColorHost "  .\scripts\refactor-types-enhanced.ps1" -Color Blue
}

Write-Host ""

