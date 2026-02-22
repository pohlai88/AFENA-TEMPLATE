# Copy GitHub Actions secrets and variables from source repo to target repo
# Variables: Can be read and copied (API returns values)
# Secrets: Cannot be read (encrypted). Script lists names only; you must set values manually.
#
# Usage: .\scripts\copy-gh-secrets-vars.ps1 [-SourceRepo "owner/source"] [-TargetRepo "owner/target"] [-CopyVariablesOnly]
#
# Prerequisites: gh auth login (needs repo + admin:org if using org vars)

param(
    [string]$SourceRepo = "pohlai88/AFENA-TEMPLATE",
    [string]$TargetRepo = "pohlai88/afenda-nexus",
    [switch]$CopyVariablesOnly,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Invoke-GhApi {
    param([string]$Method, [string]$Path, [object]$Body = $null)
    $args = @("api", $Path, "-X", $Method, "-H", "Accept: application/vnd.github+json")
    if ($Body) { $args += @("--input", "-"); $Body | gh @args } else { gh @args }
}

Write-Host "Source: $SourceRepo  ->  Target: $TargetRepo" -ForegroundColor Cyan
Write-Host ""

# --- 1. Copy REPOSITORY VARIABLES (readable via API) ---
Write-Host "=== Repository Variables (can copy) ===" -ForegroundColor Green
try {
    $vars = gh api "repos/$SourceRepo/actions/variables?per_page=100" 2>$null | ConvertFrom-Json
    $varList = @()
    if ($vars.variables) { $varList = $vars.variables }
    elseif ($vars.total_count -gt 0 -and $vars.PSObject.Properties.Name -contains "variables") { $varList = $vars.variables }
} catch {
    Write-Host "  Could not read variables from source (repo may be deleted or no access): $_" -ForegroundColor Yellow
    $varList = @()
}

foreach ($v in $varList) {
    $name = $v.name
    $value = $v.value
    if (-not $name) { continue }

    if ($DryRun) {
        Write-Host "  [DRY-RUN] Would copy variable: $name"
        continue
    }

    try {
        $body = @{ name = $name; value = $value } | ConvertTo-Json
        $body | gh api "repos/$TargetRepo/actions/variables" -X POST -H "Accept: application/vnd.github+json" --input -
        Write-Host "  OK: $name" -ForegroundColor Green
    } catch {
        try {
            $body = @{ name = $name; value = $value } | ConvertTo-Json
            $body | gh api "repos/$TargetRepo/actions/variables/$name" -X PATCH -H "Accept: application/vnd.github+json" --input -
            Write-Host "  OK (updated): $name" -ForegroundColor Green
        } catch {
            Write-Host "  FAIL: $name - $_" -ForegroundColor Red
        }
    }
}

if ($CopyVariablesOnly) {
    Write-Host "`nDone (variables only)." -ForegroundColor Cyan
    exit 0
}

# --- 2. List SECRETS (cannot read values) ---
Write-Host "`n=== Secrets (cannot copy - values are encrypted) ===" -ForegroundColor Yellow
try {
    $secretsOut = gh secret list --repo $SourceRepo 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Secret names in source repo (set these manually in target):" -ForegroundColor White
        $secretsOut | Where-Object { $_ -match "^\S+" } | ForEach-Object {
            $name = ($_ -split "\s+")[0]
            if ($name -and $name -ne "SECRET_NAME" -and $name -ne "NAME") { Write-Host "    - $name" }
        }
        Write-Host "`n  Set each in target: gh secret set SECRET_NAME --repo $TargetRepo" -ForegroundColor Gray
    }
} catch {
    Write-Host "  Could not list secrets (repo may be deleted or no access): $_" -ForegroundColor Yellow
}
Write-Host "  Expected: TURBO_TOKEN, CODECOV_TOKEN, DATABASE_URL, ORG_ID, DATABASE_URL_MIGRATIONS, NEON_API_KEY, NEON_PROJECT_ID" -ForegroundColor Gray
Write-Host "  Variable TURBO_TEAM: gh variable set TURBO_TEAM --repo $TargetRepo --body ""value""" -ForegroundColor Gray

Write-Host "`nDone." -ForegroundColor Cyan
