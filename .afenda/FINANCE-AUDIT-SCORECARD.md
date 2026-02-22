# Finance Audit Readiness Scorecard

> Generated: 2026-02-21 08:48:50 UTC | Registry: `finance-audit-registry.ts` | Version: 1.0

## Summary

| Metric | Value |
|--------|-------|
| **Total Requirements** | 23 |
| **Covered (≥60)** | 23 |
| **Partial (30–59)** | 0 |
| **Missing (<30)** | 0 |
| **Average Confidence** | 100 |
| **Coverage %** | 100% |
| **Weighted Score** | 100% |

## Signal Legend

| Signal | Description | Weight |
|--------|-------------|--------|
| E1 | Entity evidence (≥50% of mustHaveEntities found) | +20 |
| E2 | API evidence (≥50% of mustHaveApis found) | +20 |
| E3 | Test evidence (requirement ID or test name in test file) | +20 |
| E4 | Report evidence (≥50% of mustHaveReports found) | +10 |
| E5 | Evidence artifact kind keyword found | +10 |
| E6 | Gate reference in CI scripts | +10 |
| E7 | Traceability (requirement ID in JSDoc near export) | +10 |

## Requirements by Section

### Cross-Cutting Baseline (applies to all finance capabilities)

> Section: `finance.baseline` | Items: 2 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-BL-ISO-01` | Tenant isolation enforced on all finance tables | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |
| `FIN-BL-AUD-01` | Every mutation produces an auditable trail (who/what… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Finance Master Data (CoA, Periods, Dimensions, Policies)

> Section: `finance.masterdata` | Items: 3 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-MD-COA-01` | Published CoA versions are immutable; postings refer… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |
| `FIN-MD-PERIOD-01` | Period controls enforced (open/soft-close/hard-close… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |
| `FIN-MD-DIM-01` | Required dimensions enforced by rule (by account/doc… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### General Ledger (Journals, Posting Kernel, Reversal, Allocations)

> Section: `finance.gl` | Items: 2 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-GL-POST-01` | Posting is idempotent, atomic, and balanced-by-const… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |
| `FIN-GL-IMMUT-01` | Posted entries are immutable; corrections only via r… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Accounts Payable (Invoices, Matching, Payments, Reconciliation)

> Section: `finance.ap` | Items: 2 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-AP-INV-01` | AP invoice posting produces governed GL entries + ap… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |
| `FIN-AP-PAY-01` | Payments are controlled (maker-checker) and bank fil… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Accounts Receivable (Invoices, Receipts, Matching, Credit Control)

> Section: `finance.ar` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-AR-INV-01` | AR invoice posting generates GL entries, respects cr… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Cash & Bank (Statements, Reconciliation, Cash Positioning baseline)

> Section: `finance.cashbank` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-CB-REC-01` | Bank reconciliation sessions close immutably with fu… | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Fixed Assets (Capitalization, Depreciation, Disposal, Multi-book)

> Section: `finance.fa` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-FA-DEPR-01` | Depreciation runs are deterministic and post correct… | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Inventory Accounting Interface (Valuation → GL, GR/IR if enabled)

> Section: `finance.inventoryAccounting` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-INV-VAL-01` | Inventory valuation events post to GL and reconcile … | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Tax Engine (Determination, Calculation, Posting, Reporting)

> Section: `finance.tax` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-TAX-CALC-01` | Tax calculation is correct, rounded deterministicall… | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Multi-Currency & FX (Rates, Revaluation, Translation, Audit)

> Section: `finance.fx` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-FX-REV-01` | FX revaluation runs are reproducible with rate snaps… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Multi-Company & Group Accounting (Structure, Mapping, Consolidation readiness)

> Section: `finance.group` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-GRP-STRUCT-01` | Group structure is versioned by effective date; owne… | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Intercompany (Mirroring, Balancing, Reconciliation, Settlement, Eliminations)

> Section: `finance.intercompany` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-IC-MIRROR-01` | IC transactions are mirrored with shared references … | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Financial Close (Checklist, Runs, Locks, Evidence Pack)

> Section: `finance.close` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-CLOSE-PACK-01` | Close generates an evidence pack (TB, recons, run lo… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Financial Reporting (Statements, Drill-down, Snapshots)

> Section: `finance.reporting` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-REP-SNAP-01` | Statement snapshots are reproducible and drill-down … | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Controls & Security (SoD, approvals, privileged actions, overrides)

> Section: `finance.controls` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-CTRL-SOD-01` | Segregation of Duties enforced for posting, payments… | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Multi-GAAP / IFRS (Multi-book, Adjustments, Variance reporting)

> Section: `finance.multigaap` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-MG-ADJ-01` | Adjustments are isolated by book/ledger and variance… | 🟠 S1 | 4 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Integrations (Imports, outbox, replay safety, external references)

> Section: `finance.integrations` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-INT-OUTBOX-01` | Outbox-driven integration is replay-safe and idempotent | 🔴 S0 | 5 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

### Operational Excellence (SLAs, performance baselines, observability)

> Section: `finance.ops` | Items: 1 | Avg: 100

| ID | Title | Sev | W | Score | Status | Signals |
|----|-------|-----|---|-------|--------|---------|
| `FIN-OPS-SLA-01` | Posting and close meet performance baselines with ob… | 🟡 S2 | 3 | **100** | ✅ Covered | E1, E2, E3, E4, E5, E6, E7 |

## Confidence Distribution

| Band | Count | Bar |
|------|-------|-----|
| 90–100 | 23 | ███████████████████████ |
| 60–89 | 0 | █ |
| 30–59 | 0 | █ |
| 0–29 | 0 | █ |

---
*Auto-generated by `finance-audit-docs.mjs` — do not edit manually.*