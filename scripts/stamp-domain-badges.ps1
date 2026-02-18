param()
$ErrorActionPreference = "Stop"

$classMap = @{
    "accounting"               = "A|Financial+Management|0052CC"
    "budgeting"                = "A|Financial+Management|0052CC"
    "cash-pooling"             = "A|Financial+Management|0052CC"
    "consolidation"            = "A|Financial+Management|0052CC"
    "e-invoicing-ctc"          = "A|Financial+Management|0052CC"
    "expense-management"       = "A|Financial+Management|0052CC"
    "financial-close"          = "A|Financial+Management|0052CC"
    "fixed-assets"             = "A|Financial+Management|0052CC"
    "forecasting"              = "A|Financial+Management|0052CC"
    "fx-management"            = "A|Financial+Management|0052CC"
    "intercompany"             = "A|Financial+Management|0052CC"
    "intercompany-governance"  = "A|Financial+Management|0052CC"
    "investment-management"    = "A|Financial+Management|0052CC"
    "lease-accounting"         = "A|Financial+Management|0052CC"
    "payables"                 = "A|Financial+Management|0052CC"
    "payments-orchestration"   = "A|Financial+Management|0052CC"
    "receivables"              = "A|Financial+Management|0052CC"
    "revenue-recognition"      = "A|Financial+Management|0052CC"
    "royalty-management"       = "A|Financial+Management|0052CC"
    "statutory-reporting"      = "A|Financial+Management|0052CC"
    "stock-based-compensation" = "A|Financial+Management|0052CC"
    "subscription-billing"     = "A|Financial+Management|0052CC"
    "tax-engine"               = "A|Financial+Management|0052CC"
    "transfer-pricing"         = "A|Financial+Management|0052CC"
    "treasury"                 = "A|Financial+Management|0052CC"
    "consignment"              = "B|Procurement+%26+Supply+Chain|36B37E"
    "export"                   = "B|Procurement+%26+Supply+Chain|36B37E"
    "global-trade"             = "B|Procurement+%26+Supply+Chain|36B37E"
    "group-purchasing"         = "B|Procurement+%26+Supply+Chain|36B37E"
    "inventory"                = "B|Procurement+%26+Supply+Chain|36B37E"
    "procurement"              = "B|Procurement+%26+Supply+Chain|36B37E"
    "purchasing"               = "B|Procurement+%26+Supply+Chain|36B37E"
    "rebate-mgmt"              = "B|Procurement+%26+Supply+Chain|36B37E"
    "receiving"                = "B|Procurement+%26+Supply+Chain|36B37E"
    "returns"                  = "B|Procurement+%26+Supply+Chain|36B37E"
    "shipping"                 = "B|Procurement+%26+Supply+Chain|36B37E"
    "supplier-portal"          = "B|Procurement+%26+Supply+Chain|36B37E"
    "trade-compliance"         = "B|Procurement+%26+Supply+Chain|36B37E"
    "transportation"           = "B|Procurement+%26+Supply+Chain|36B37E"
    "warehouse"                = "B|Procurement+%26+Supply+Chain|36B37E"
    "advertising"              = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "branding"                 = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "crm"                      = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "customer-service"         = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "marketing"                = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "marketing-fund-management"= "C|Sales%2C+Marketing+%26+CX|FF5630"
    "pricing"                  = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "promoter"                 = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "public-relations"         = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "sales"                    = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "trade-marketing"          = "C|Sales%2C+Marketing+%26+CX|FF5630"
    "central-kitchen"          = "D|Manufacturing+%26+Quality|6554C0"
    "cold-chain"               = "D|Manufacturing+%26+Quality|6554C0"
    "configurator"             = "D|Manufacturing+%26+Quality|6554C0"
    "feed-mill"                = "D|Manufacturing+%26+Quality|6554C0"
    "food-safety"              = "D|Manufacturing+%26+Quality|6554C0"
    "nutrition-labeling"       = "D|Manufacturing+%26+Quality|6554C0"
    "planning"                 = "D|Manufacturing+%26+Quality|6554C0"
    "plm"                      = "D|Manufacturing+%26+Quality|6554C0"
    "production"               = "D|Manufacturing+%26+Quality|6554C0"
    "quality-mgmt"             = "D|Manufacturing+%26+Quality|6554C0"
    "recipe-management"        = "D|Manufacturing+%26+Quality|6554C0"
    "benefits"                 = "E|Human+Capital+Management|00B8D9"
    "hr-core"                  = "E|Human+Capital+Management|00B8D9"
    "learning-dev"             = "E|Human+Capital+Management|00B8D9"
    "offboarding"              = "E|Human+Capital+Management|00B8D9"
    "onboarding"               = "E|Human+Capital+Management|00B8D9"
    "payroll"                  = "E|Human+Capital+Management|00B8D9"
    "performance-mgmt"         = "E|Human+Capital+Management|00B8D9"
    "recruitment"              = "E|Human+Capital+Management|00B8D9"
    "time-attendance"          = "E|Human+Capital+Management|00B8D9"
    "animal-welfare"           = "F|Agriculture+%26+AgriTech|2ECC71"
    "crop-planning"            = "F|Agriculture+%26+AgriTech|2ECC71"
    "greenhouse-management"    = "F|Agriculture+%26+AgriTech|2ECC71"
    "herd-management"          = "F|Agriculture+%26+AgriTech|2ECC71"
    "livestock-analytics"      = "F|Agriculture+%26+AgriTech|2ECC71"
    "livestock-processing"     = "F|Agriculture+%26+AgriTech|2ECC71"
    "livestock-procurement"    = "F|Agriculture+%26+AgriTech|2ECC71"
    "precision-agriculture"    = "F|Agriculture+%26+AgriTech|2ECC71"
    "predictive-analytics"     = "F|Agriculture+%26+AgriTech|2ECC71"
    "sustainability"           = "F|Agriculture+%26+AgriTech|2ECC71"
    "franchise-compliance"     = "G|Franchise+%26+Retail|FF8B00"
    "franchise-development"    = "G|Franchise+%26+Retail|FF8B00"
    "franchise-outlet-audit"   = "G|Franchise+%26+Retail|FF8B00"
    "franchisee-operations"    = "G|Franchise+%26+Retail|FF8B00"
    "retail-management"        = "G|Franchise+%26+Retail|FF8B00"
    "retail-pos"               = "G|Franchise+%26+Retail|FF8B00"
    "visual-merchandising"     = "G|Franchise+%26+Retail|FF8B00"
    "access-governance"        = "H|Governance%2C+Risk+%26+Compliance|403294"
    "audit"                    = "H|Governance%2C+Risk+%26+Compliance|403294"
    "board-management"         = "H|Governance%2C+Risk+%26+Compliance|403294"
    "cap-table-management"     = "H|Governance%2C+Risk+%26+Compliance|403294"
    "data-governance"          = "H|Governance%2C+Risk+%26+Compliance|403294"
    "dividend-management"      = "H|Governance%2C+Risk+%26+Compliance|403294"
    "enterprise-risk-controls" = "H|Governance%2C+Risk+%26+Compliance|403294"
    "external-audit-management"= "H|Governance%2C+Risk+%26+Compliance|403294"
    "legal-entity-management"  = "H|Governance%2C+Risk+%26+Compliance|403294"
    "regulatory-intelligence"  = "H|Governance%2C+Risk+%26+Compliance|403294"
    "regulatory-reporting"     = "H|Governance%2C+Risk+%26+Compliance|403294"
    "sec-reporting"            = "H|Governance%2C+Risk+%26+Compliance|403294"
    "secretariat"              = "H|Governance%2C+Risk+%26+Compliance|403294"
    "shareholder-portal"       = "H|Governance%2C+Risk+%26+Compliance|403294"
    "tax-compliance"           = "H|Governance%2C+Risk+%26+Compliance|403294"
    "asset-mgmt"               = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "bi-analytics"             = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "contract-mgmt"            = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "data-warehouse"           = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "document-mgmt"            = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "integration-hub"          = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "mdm"                      = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "notifications"            = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "project-accounting"       = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "workflow-bpm"             = "I|Analytics%2C+Data+%26+Integration|00C7E6"
    "innovation-management"      = "J|Corporate+%26+Strategy|8777D9"
    "rd-project-management"      = "J|Corporate+%26+Strategy|8777D9"
    "shared-services-management" = "J|Corporate+%26+Strategy|8777D9"
}

$MARKER     = "<!-- afenda:badges -->"
$domainRoot = "C:\AI-BOS\AFENDA-NEXUS\business-domain"
$stamped = 0; $done = 0; $miss = 0

$dirs = Get-ChildItem -LiteralPath $domainRoot -Directory | Sort-Object Name
foreach ($dir in $dirs) {
    $rp = Join-Path $dir.FullName "README.md"
    if (-not (Test-Path $rp)) { continue }
    if (-not $classMap.ContainsKey($dir.Name)) {
        Write-Warning "No class: $($dir.Name)"; $miss++; continue
    }
    $raw = [System.IO.File]::ReadAllText($rp, [System.Text.Encoding]::UTF8)
    if ($raw.Contains($MARKER)) { $done++; continue }

    $parts   = $classMap[$dir.Name] -split "\|"
    $letter  = $parts[0]; $name = $parts[1]; $color = $parts[2]
    $nameD   = $name -replace "\+"," " -replace "%26","&" -replace "%2C",","
    $pkg     = "afenda-$($dir.Name)"
    $pkgSlug = $pkg -replace "-","--"

    $cb = "![$letter - $nameD](https://img.shields.io/badge/$letter-$name-$color`?style=flat-square)"
    $lb = "![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square)"
    $pb = "![pkg](https://img.shields.io/badge/pkg-$pkgSlug-555555?style=flat-square)"
    $db = "![docs](https://img.shields.io/badge/class-$letter%20·%20of%2010-lightgrey?style=flat-square)"

    $envelope = "$MARKER`n$cb $lb $pb $db"

    if ($raw -match "(?m)^(# [^\r\n]+)") {
        $h1  = $Matches[1]
        $idx = $raw.IndexOf($h1)
        $end = $idx + $h1.Length
        $newRaw = $raw.Substring(0,$end) + "`n`n" + $envelope + "`n" + $raw.Substring($end)
    } else {
        $newRaw = $envelope + "`n`n" + $raw
    }

    [System.IO.File]::WriteAllText($rp, $newRaw, [System.Text.Encoding]::UTF8)
    Write-Host "stamped  $($dir.Name)"
    $stamped++
}

Write-Host "`nStamped:$stamped  Already done:$done  No class:$miss" -ForegroundColor Cyan
