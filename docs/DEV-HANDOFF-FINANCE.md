# Finance Domain Hardening — Dev Handoff

> **Date:** 2026-02-22 | **Branch:** `erp` | **Plan:** [oss-finance-ext.md](oss-finance-ext.md)
> **Scope:** 37 finance packages, 160+ schema tables, 46 SK entries, 76 domain intents

---

## 1. What Was Done

### Workstream E — Period Close & Intercompany

| Item                                             | Status | Files Changed                                                          |
| ------------------------------------------------ | ------ | ---------------------------------------------------------------------- |
| **M-04a** DomainError in ic-service              | Done   | `intercompany/src/services/ic-service.ts`                              |
| **M-04b** Bidirectional IC mirroring (2 intents) | Done   | `intercompany/src/services/ic-service.ts`                              |
| **M-04c** Export `reconcileFromDb`               | Done   | `intercompany/src/index.ts`                                            |
| **M-04d** Fix truncated JSDoc                    | Done   | `intercompany/src/calculators/ic-matching.ts`                          |
| **M-04 registry** `ic.mirror` in SK writes       | Done   | `packages/canon/src/registries/shared-kernel-registry.ts`              |
| **M-04 tests** 16 tests (matching + service)     | Done   | `intercompany/src/__tests__/ic-service.test.ts`, `ic-matching.test.ts` |
| **M-08** Period close trigger                    | Done   | `packages/database/drizzle/0003_sync_fiscal_period_close.sql`          |

### Workstream F — Elimination & Consolidation

| Item                                             | Status | Files Changed                                                 |
| ------------------------------------------------ | ------ | ------------------------------------------------------------- |
| **M-09** `elimination_journals` schema           | Done   | `packages/database/src/schema/elimination-journals.ts`        |
| **M-09** DDL + unique constraint + RLS           | Done   | `packages/database/drizzle/0003_sync_fiscal_period_close.sql` |
| **M-09** Schema barrel export                    | Done   | `packages/database/src/schema/index.ts`                       |
| **M-09** Table registry entry                    | Done   | `packages/database/src/schema/_registry.ts`                   |
| **M-09** SK registry — `ic.eliminate` writes     | Done   | `packages/canon/src/registries/shared-kernel-registry.ts`     |
| **M-09** Intent registry — `ic.eliminate` target | Done   | `packages/canon/src/registries/domain-intent-registry.ts`     |

### Workstream G — CI Gate Hardening

| Item                                       | Status | Files Changed                                   |
| ------------------------------------------ | ------ | ----------------------------------------------- |
| **CIG-01** DomainError enforcement         | Done   | `tools/ci-gates/sk-12-domain-error.test.ts`     |
| **CIG-02** FX precision gate               | Done   | `tools/ci-gates/fin-06-fx-precision.test.ts`    |
| **CIG-03** Schema helper consistency       | Done   | `tools/ci-gates/far-schema-helpers.test.ts`     |
| **CIG-04** Registry coherence              | Done   | `tools/ci-gates/far-registry-coherence.test.ts` |
| **CIG-05** Integration test coverage floor | Done   | `tools/ci-gates/g-int-01.test.ts`               |

### ESLint Config Fix (Cross-Cutting)

| Item                                       | Status | Files Changed                                         |
| ------------------------------------------ | ------ | ----------------------------------------------------- |
| `disableTypeChecked` for domain test files | Done   | `packages/eslint-config/domain.js`                    |
| Non-null assertion fix                     | Done   | `intercompany/src/queries/ic-query.ts`                |
| Import order fixes                         | Done   | `ic-service.ts`, `ic-query.ts`, `ic-matching.test.ts` |
| Sync/async service functions               | Done   | `ic-service.ts`, `ic-service.test.ts`                 |

### Documentation Updates

| File                                    | What Changed                                                                                |
| --------------------------------------- | ------------------------------------------------------------------------------------------- |
| `business-domain/finance/README.md`     | Service contract (sync/async), lint section, migrations, CI gates, status                   |
| `business-domain/AGENT.md`              | B5 sync/async, B6 ic.mirror, A5 disableTypeChecked, C5 elimination_journals, error patterns |
| `.agents/skills/eslint-config/SKILL.md` | RULE-04 updated, RULE-08 added (disableTypeChecked)                                         |

---

## 2. Verification Results

| Check                                                                                     | Result                                              |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Type-check** (9 tasks: canon, database, acct-hub, fx, ic, consol + deps)                | 9/9 pass, 0 errors                                  |
| **Build** (canon + database)                                                              | CJS + ESM + DTS all success                         |
| **Unit tests** (core finance)                                                             | 134/134 pass (acct-hub 42, fx 36, ic 16, consol 40) |
| **CI gates** (31 vitest gate files + 3 scripts = 34 total; CIG-01–CIG-06 + fin-03 update) | 25/25 new gate tests pass                           |
| **Lint** (intercompany)                                                                   | 0 errors, 0 warnings                                |

---

## 3. Key Architecture Decisions Made

| #     | Decision                                                             | Rationale                                                                                                   |
| ----- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| AD-03 | All eliminations route to `consolidation.elimination_journals`       | Single audit trail; `sourceType` discriminator for IC/consol/translation/ownership                          |
| AD-09 | Period close via trigger sync (not schema merge)                     | Two tables serve different purposes; trigger fires only on `false->true` transition                         |
| AD-12 | Unique constraint `(org_id, period_key, source_type, source_ref_id)` | Prevents duplicate eliminations per run; `sourceRefId` enables traceability                                 |
| —     | `disableTypeChecked` over `allowDefaultProject`                      | `allowDefaultProject` has 8-file limit + perf hit; `disableTypeChecked` keeps non-type-checked rules active |
| —     | Sync service functions when no `await`                               | ESLint `require-await` enforces; callers must drop `await`                                                  |

---

## 4. New Database Objects

### Migration: `0003_sync_fiscal_period_close.sql`

**Trigger: `sync_fiscal_period_close`** (M-08)

- Fires: `AFTER UPDATE ON fiscal_periods` when `is_closed` transitions `false -> true`
- Action: `UPDATE posting_periods SET status = 'hard-close'` for matching `org_id + fiscal_year + period_number`
- Guards: Idempotent (`WHERE status <> 'hard-close'`), multi-ledger scoped

**Table: `elimination_journals`** (M-09)

- Columns: `erpEntityColumns` + `periodKey`, `sourceType`, `sourceRefId`, `eliminationType`, `debitAccountCode`, `creditAccountCode`, `amountMinor`, `currencyCode`, `description`
- `sourceType` enum: `ic_elimination`, `consolidation_adjustment`, `translation`, `ownership_change`
- Unique: `uq__elimination_journals__org_period_source_ref` on `(org_id, period_key, source_type, source_ref_id)`
- Index: `idx__elimination_journals__org_source_period` on `(org_id, source_type, period_key)`
- RLS: `tenantPolicy('elimination_journals')`

---

## 5. Must-Have Status (M-01 → M-12)

All 12 must-have items are **implemented**. Verified by auditing source code on 2026-02-22.

| Item                                     | Status  | Evidence                                                                                                          |
| ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| **M-01** SHA-256 + canonical fingerprint | ✅ Done | `derivation-engine.ts` uses `createHash('sha256')` + `stableCanonicalJson`; `derivation-hash.test.ts` (5 tests)   |
| **M-02** FX decimalization               | ✅ Done | `fx-triangulation.ts` uses `Decimal.js`; `constants.ts` exports `FX_RATE_SCALE=10`, `ROUNDING_MODE=ROUND_HALF_UP` |
| **M-03** Testcontainers infra            | ✅ Done | `testcontainers-helper.ts` + `db-contracts.integration.test.ts` (6 contracts) + `test:db-contracts` script        |
| **M-04** Intercompany fixes              | ✅ Done | DomainError, bidirectional mirroring, barrel export, JSDoc, 16 tests                                              |
| **M-05** fxRate() precision              | ✅ Done | `fx-rates.ts`: `rate: fxRate('rate').notNull()`                                                                   |
| **M-06** Reconciliation type             | ✅ Done | `reconciliation-items.ts`: `integer('match_confidence')` + CHECK 0–100                                            |
| **M-07** Ownership thresholds            | ✅ Done | `CONSOLIDATION_THRESHOLDS` with 50/20 split, 3-way method discriminator                                           |
| **M-08** Period close trigger            | ✅ Done | `0003_sync_fiscal_period_close.sql` trigger + DDL                                                                 |
| **M-09** Elimination schema              | ✅ Done | `elimination-journals.ts` + registry + intent routing                                                             |
| **M-10** tsconfig references             | ✅ Done | `tsconfig.json` has `"path": "./packages/observability"`                                                          |
| **M-11** Zero-amount handling            | ✅ Done | `derivation-engine.ts` has `skippedRules` array                                                                   |
| **M-12** Reclass/alloc evidence          | ✅ Done | `accounting-hub-service.ts` includes `reclassEvidence` + `allocationEvidence` in payloads                         |

## 6. CI Gate Status (CIG-01 → CIG-06)

All 6 gates are **implemented**. Total: 31 vitest gate files + 3 standalone scripts = **34 enforcement points**.

| Gate                                | File                                  | Tests      | Status |
| ----------------------------------- | ------------------------------------- | ---------- | ------ |
| **CIG-01** DomainError enforcement  | `sk-12-domain-error.test.ts`          | 2          | ✅     |
| **CIG-02** FX precision             | `fin-06-fx-precision.test.ts`         | 2          | ✅     |
| **CIG-03** Schema helpers           | `far-schema-helpers.test.ts`          | 3          | ✅     |
| **CIG-04** Registry coherence       | `far-registry-coherence.test.ts`      | 5          | ✅     |
| **CIG-05** Integration coverage     | `g-int-01.test.ts`                    | 3          | ✅     |
| **CIG-06** SK registry completeness | `sk-registry-completeness.test.ts`    | 5          | ✅     |
| **fin-03** SHA-256 verification     | `fin-03-deterministic-replay.test.ts` | 5 (+1 new) | ✅     |

## 7. What Remains

### CI Wiring

| Item                                           | Status                |
| ---------------------------------------------- | --------------------- |
| `db-contract-tests` job in `quality-gates.yml` | ✅ Added (2026-02-22) |

### Good-to-Have (G-01 → G-14) — All Implemented (2026-02-22)

| Item     | Description                                          | Evidence                                              |
| -------- | ---------------------------------------------------- | ----------------------------------------------------- |
| **G-01** | Country-specific tax box schemas (MY/SG/UK/EU/US)    | `tax-box-schema.ts` + 10 tests                        |
| **G-02** | Policy-driven dunning escalation (count+days+amount) | `dunning-letters.ts` refactored + 10 tests            |
| **G-03** | Full cycle path in dependency resolver               | `dependency-resolver.ts` `cyclePath` + 4 new tests    |
| **G-04** | Task guard: `allowRestart` option                    | `dependency-resolver.ts` options param + 2 new tests  |
| **G-05** | Remove dead `moneyDocumentColumns`                   | Deleted from `field-types.ts` + barrel                |
| **G-06** | Journal lines FK to journal_entries                  | `.references(() => journalEntries.id)`                |
| **G-07** | ARCHITECTURE.md package count 116→130                | Updated 3 references                                  |
| **G-08** | FAR posting balance threshold → 0                    | Comment-stripping + zero tolerance                    |
| **G-09** | Equity method consolidation (IAS 28/IFRS 11)         | `equity-method.ts` + 15 tests                         |
| **G-10** | RLS skip-list ADR governance                         | ADR-RLS-01..04 references on all entries              |
| **G-11** | IC test expansion ≥30 tests                          | 30 tests across 3 files                               |
| **G-12** | Budget availability check (PO gate)                  | `checkBudgetAvailability()` in `budget-commitment.ts` |
| **G-13** | IFRS 15.21 contract modification classification      | `createsNewPobs` flag + IFRS comments                 |
| **G-14** | Payment posting lifecycle (3-state)                  | `posting_status` column + CHECK constraint            |

---

## 8. How to Verify

```bash
# Type-check all finance packages
pnpm turbo type-check --filter=./business-domain/finance/*

# Unit tests (core finance)
pnpm turbo test --filter=afenda-accounting-hub --filter=afenda-fx-management --filter=afenda-intercompany --filter=afenda-consolidation

# CI gates (20 tests across 6 new gate files + updated fin-03)
pnpm vitest run -c vitest.mcp.config.ts tools/ci-gates/far-schema-helpers.test.ts tools/ci-gates/sk-12-domain-error.test.ts tools/ci-gates/fin-06-fx-precision.test.ts tools/ci-gates/far-registry-coherence.test.ts tools/ci-gates/g-int-01.test.ts tools/ci-gates/sk-registry-completeness.test.ts tools/ci-gates/fin-03-deterministic-replay.test.ts

# Lint (single package)
pnpm turbo lint --filter=afenda-intercompany

# Build (canon + database — required before downstream type-check)
pnpm turbo build --filter=afenda-canon --filter=afenda-database
```

---

## 9. Files Modified (Complete List)

### New Files

| File                                                                            | Purpose                                             |
| ------------------------------------------------------------------------------- | --------------------------------------------------- |
| `packages/database/src/schema/elimination-journals.ts`                          | Drizzle schema for M-09                             |
| `packages/database/drizzle/0003_sync_fiscal_period_close.sql`                   | SQL migration for M-08 + M-09                       |
| `tools/ci-gates/sk-registry-completeness.test.ts`                               | CIG-06 SK registry completeness gate (5 tests)      |
| `business-domain/finance/tax-engine/src/calculators/tax-box-schema.ts`          | G-01 country-specific tax box schemas (5 countries) |
| `business-domain/finance/tax-engine/src/__tests__/tax-box-schema.test.ts`       | G-01 tests (10)                                     |
| `business-domain/finance/consolidation/src/calculators/equity-method.ts`        | G-09 equity method consolidation (IAS 28/IFRS 11)   |
| `business-domain/finance/consolidation/src/__tests__/equity-method.test.ts`     | G-09 tests (15)                                     |
| `business-domain/finance/intercompany/src/__tests__/ic-intent-and-edge.test.ts` | G-11 IC test expansion (14 new tests)               |

### Modified Files

| File                                                                                   | Change                                                        |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `packages/database/src/schema/index.ts`                                                | Added `eliminationJournals` export                            |
| `packages/database/src/schema/_registry.ts`                                            | Added `elimination_journals` entry                            |
| `packages/canon/src/registries/shared-kernel-registry.ts`                              | `ic.eliminate` in writes, updated natural key                 |
| `packages/canon/src/registries/domain-intent-registry.ts`                              | `ic.eliminate` target -> `consolidation.elimination_journals` |
| `business-domain/finance/intercompany/src/services/ic-service.ts`                      | Sync functions, import order                                  |
| `business-domain/finance/intercompany/src/queries/ic-query.ts`                         | Non-null assertion fix, import order                          |
| `business-domain/finance/intercompany/src/__tests__/ic-service.test.ts`                | Sync test calls                                               |
| `business-domain/finance/intercompany/src/__tests__/ic-matching.test.ts`               | Import order fix                                              |
| `packages/eslint-config/domain.js`                                                     | Added `disableTypeChecked` for test files (RULE-08)           |
| `business-domain/finance/README.md`                                                    | Updated with latest implementation info                       |
| `business-domain/AGENT.md`                                                             | Added B5, B6, A5, C5, error patterns                          |
| `.agents/skills/eslint-config/SKILL.md`                                                | RULE-04 updated, RULE-08 added                                |
| `tools/ci-gates/fin-03-deterministic-replay.test.ts`                                   | Added SHA-256 verification + simpleHash rejection assertions  |
| `.github/workflows/quality-gates.yml`                                                  | Added `db-contract-tests` CI job                              |
| `docs/oss-finance-ext.md`                                                              | Updated CI enforcement point counts (28→34)                   |
| `packages/database/src/helpers/field-types.ts`                                         | G-05: Removed dead `moneyDocumentColumns`                     |
| `packages/database/src/index.ts`                                                       | G-05: Removed `moneyDocumentColumns` export                   |
| `packages/database/src/schema/journal-lines.ts`                                        | G-06: Added FK `.references(() => journalEntries.id)`         |
| `packages/database/src/schema/payments.ts`                                             | G-14: Added `posting_status` column + CHECK constraint        |
| `ARCHITECTURE.md`                                                                      | G-07: Updated package count 116→130                           |
| `tools/ci-gates/far-posting-balanced.test.ts`                                          | G-08: Comment-stripping + threshold→0                         |
| `tools/ci-gates/far-rls-isolation.test.ts`                                             | G-10: ADR-RLS-01..04 governance on skip-list                  |
| `business-domain/finance/financial-close/src/calculators/dependency-resolver.ts`       | G-03: `cyclePath` + G-04: `allowRestart`                      |
| `business-domain/finance/financial-close/src/__tests__/financial-close.test.ts`        | G-03/G-04: 6 new tests                                        |
| `business-domain/finance/credit-management/src/calculators/dunning-letters.ts`         | G-02: Policy-driven escalation                                |
| `business-domain/finance/credit-management/src/__tests__/dunning-letters.test.ts`      | G-02: 4 new tests                                             |
| `business-domain/finance/budgeting/src/calculators/budget-commitment.ts`               | G-12: `checkBudgetAvailability()` function                    |
| `business-domain/finance/revenue-recognition/src/calculators/contract-modification.ts` | G-13: `createsNewPobs` + IFRS 15.21 comments                  |
| `business-domain/finance/tax-engine/src/index.ts`                                      | G-01: Added tax box schema exports                            |
| `business-domain/finance/consolidation/src/index.ts`                                   | G-09: Added equity method exports                             |

---

## 10. Known Issues (Pre-Existing, Not Introduced)

| Issue                                               | Scope                    | Notes                                                                                                               |
| --------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Consolidation package has 40+ lint errors           | `afenda-consolidation`   | Pre-existing: import order, require-await, test file parsing (now fixed by disableTypeChecked)                      |
| Other finance packages may have similar lint errors | All 37 packages          | `disableTypeChecked` fixes test file parsing; remaining errors are code-level (import order, require-await)         |
| `CalculatorResult` IDE noise                        | All new calculator files | IDE shows "no exported member" — resolves at runtime via vitest alias. Type is at `packages/canon/src/index.ts:511` |

---

_Generated: 2026-02-22 11:12 UTC+08:00_
_Reference: [oss-finance-ext.md](oss-finance-ext.md) — Finance Domain Hardening & ERP Maturity Plan_
