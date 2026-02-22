# Finance Domain Hardening & ERP Maturity — Final Plan

> **Date:** 2026-02-22 · **Branch:** `erp` · **Perspective:** AIS / ERP System Design Director (20 yr)
> **Companion:** [OSS-FINANCE-DEEP-DIVE.md](OSS-FINANCE-DEEP-DIVE.md) · **AIS Benchmark:** 280/280 (100 %, avg confidence 92.2)

Production hardening plan for AFENDA-NEXUS **Finance Domain** — 37 packages, 157 schema files (~160+ tables), 46 shared-kernel entries, 76 domain intents, 34 CI enforcement points (31 vitest gate tests + 3 standalone scripts; CIG-01–CIG-06 all implemented), 1 921 unit tests, 13 integration test files. Every item below is measurable, file-referenced, and release-gated.

---

## Table of Contents

0. [Scope & Definition of Done](#0-scope--definition-of-done)
1. [Non-Negotiable Standards (Finance v3)](#1-non-negotiable-standards-finance-v3)
2. [Codebase Audit — Bugs & Inconsistencies](#2-codebase-audit--bugs--inconsistencies)
3. [Silent Killers (Release-Blocking Risks)](#3-silent-killers-release-blocking-risks)
4. [Must-Have Fixes (M-01 → M-12)](#4-must-have-fixes-m-01--m-12)
5. [CI Gate Additions (CIG-01 → CIG-06)](#5-ci-gate-additions-cig-01--cig-06)
6. [Good-to-Have Improvements (G-01 → G-14)](#6-good-to-have-improvements-g-01--g-14)
7. [ERP Pain Points — Director's Assessment](#7-erp-pain-points--directors-assessment)
8. [Workstreams (Ordered Execution)](#8-workstreams-ordered-execution)
9. [Test Strategy (Two-Tier)](#9-test-strategy-two-tier)
10. [Release Gates (RG-01 → RG-25)](#10-release-gates-rg-01--rg-25)
11. [Deliverables Manifest](#11-deliverables-manifest)
12. [Execution Checklist](#12-execution-checklist)
13. [Architecture Decisions Log](#13-architecture-decisions-log)

---

## 0) Scope & Definition of Done

### In Scope

| Layer            | Path                                                                           | Count                                                 |
| ---------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------- |
| Finance packages | `business-domain/finance/**`                                                   | 37 packages                                           |
| Schema + helpers | `packages/database/src/schema/**`, `packages/database/src/helpers/**`          | 160 tables                                            |
| Canon registries | `packages/canon/src/registries/**`, `packages/canon/src/types/**`              | 46 SK entries, 76 intents                             |
| CI gates         | `tools/ci-gates/**` + `tools/ci-*-gate.mjs`                                    | 28 total: 25 vitest gate tests + 3 standalone scripts |
| CI workflows     | `.github/workflows/{ci,quality-gates,quality-metrics,database-gates,sbom}.yml` | 5 workflows                                           |

### Out of Scope

- Non-finance domains (O2C, SCM, HR, Manufacturing) except canonical ID references
- UI / frontend work
- Infrastructure / deployment

### Definition of Done

A change set is complete only when **all Release Gates RG-01 → RG-25** pass (§10).

---

## 1) Non-Negotiable Standards (Finance v3)

These standards are enforced by tests and / or CI gates.

| ID  | Standard                                                                                                                                                                                                              | Enforcement                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| S1  | **Multi-Tenancy & RLS** — every finance table: `erpEntityColumns` + `tenantPk()` + `tenantPolicy()`. Every query: `eq(t.orgId, ctx.orgId)`                                                                            | `far-rls-isolation.test.ts` — 34 tables enumerated |
| S2  | **Company Auth Boundary** — company-scoped reads use `ctx.companyId` or `ctx.allowedCompanyIds`. Never accept unvalidated `input.companyId`                                                                           | SK-01 through SK-11                                |
| S3  | **Soft-Delete Filter** — canonical filter `eq(t.isDeleted, false)`                                                                                                                                                    | Base entity column contract                        |
| S4  | **Money & Currency** — `moneyMinor(name)` → bigint; `currencyCodeStrict(name)` → text NOT NULL, **no default**; rates via `fxRate()` helper                                                                           | CIG-03 (new), schema review                        |
| S5  | **Time Axis** — ledger facts: `periodKey text NOT NULL` + CHECK `^[0-9]{4}-[0-9]{2}$`; valuations: `date NOT NULL`                                                                                                    | FIN-01 through FIN-05                              |
| S6  | **Type Exports** — each table exports `$inferSelect` and `$inferInsert`                                                                                                                                               | G-TS-01 gate                                       |
| S7  | **Query Read Models** — `select({ ... })` only; never return raw rows                                                                                                                                                 | CRUD architecture contract                         |
| S8  | **Registry Governance** — every finance table in `_registry.ts` with: `kind`, `hasRls`, `hasTenant`, `hasCompositePk`, `domain`, `subdomain`, `timeAxis`, `dataSensitivity`, `retentionClass`, `supportsIntercompany` | CIG-04 (new)                                       |
| S9  | **Natural Key Enforcement** — named unique index `uq__{table}__{cols}`; UPDATE blocked by DB trigger via `natural-key-immutability.ts`                                                                                | FAR-DOM gate (13+ assertions)                      |

---

## 2) Codebase Audit — Bugs & Inconsistencies

Comprehensive audit of all 37 finance packages, schema files, and CI gates. Every item below was verified by reading the source files.

### 2.1 Confirmed Bugs

| #    | Sev      | File (click to jump)                                                                                       | Line   | Issue                                                                                                      | Impact                                                  |
| ---- | -------- | ---------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| B-01 | **High** | [derivation-engine.ts](../business-domain/finance/accounting-hub/src/calculators/derivation-engine.ts)     | L50    | `simpleHash` uses additive `charCodeAt` loop — not SHA-256. Comment admits placeholder.                    | Hash collisions → duplicate / dropped journal entries   |
| B-02 | **Med**  | [ic-service.ts](../business-domain/finance/intercompany/src/services/ic-service.ts)                        | L94    | `throw new Error('IC transaction cannot be within the same company')` — raw Error instead of `DomainError` | Violates INV-DOM-03; unstructured error in production   |
| B-03 | **Med**  | [fx-triangulation.ts](../business-domain/finance/fx-management/src/calculators/fx-triangulation.ts)        | L48–51 | Cross-rate uses native float `*` / `/` while `fx-convert.ts` uses `Decimal.js`                             | Precision loss on cross-currency trades                 |
| B-04 | **Med**  | [consolidation-service.ts](../business-domain/finance/consolidation/src/services/consolidation-service.ts) | L172   | `updateGroupOwnership` emits `eliminationEntries: []` — empty intent payload                               | Ownership changes produce no substantive audit evidence |
| B-05 | **Low**  | [ic-matching.ts](../business-domain/finance/intercompany/src/calculators/ic-matching.ts)                   | L5     | Truncated JSDoc: `"receivabl"` instead of `"receivable"`                                                   | Documentation defect                                    |

### 2.2 Inconsistencies

| #    | Sev     | Location                                                                                                                                | Issue                                                                                                                                                                                                                       |
| ---- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I-01 | **Med** | [fx-rates.ts L24](../packages/database/src/schema/fx-rates.ts) vs [field-types.ts L30](../packages/database/src/helpers/field-types.ts) | `rate` column uses inline `numeric(18,8)` but `fxRate()` helper defines `numeric(20,10)`. Precision mismatch.                                                                                                               |
| I-02 | **Med** | [reconciliation-items.ts L41](../packages/database/src/schema/reconciliation-items.ts) vs `match-results.ts`                            | `matchConfidence` is `text` in reconciliation-items (L41) while `match-results.ts` uses `score: integer` (L30) with CHECK 0–100. Column names differ (`matchConfidence` vs `score`) and types differ (`text` vs `integer`). |
| I-03 | **Med** | `shared-kernel-registry.ts` vs `domain-intent-registry.ts`                                                                              | IC eliminations route to `accounting.journal_lines` but consolidation eliminations have dedicated `consolidation.elimination_journals`. Inconsistent elimination storage.                                                   |
| I-04 | **Med** | `shared-kernel-registry.ts` `ic.ic_transactions`                                                                                        | Writes list only includes `ic.match` — missing `ic.mirror` from `createAndMirrorIc`.                                                                                                                                        |
| I-05 | **Low** | [ARCHITECTURE.md L55](../ARCHITECTURE.md) vs [architecture.domain.md L735](../business-domain/architecture.domain.md)                   | Package count: root says 116, domain doc says 130 (80 core + 39 industry + 11 cross-cutting).                                                                                                                               |
| I-06 | **Low** | [field-types.ts L41](../packages/database/src/helpers/field-types.ts)                                                                   | `moneyDocumentColumns` defined + exported but **never used** across all schema tables. Dead code.                                                                                                                           |
| I-07 | **Low** | [tsconfig.json](../tsconfig.json) references array                                                                                      | `packages/observability` missing from project references (9 entries; should be 10). Note: `packages/crud-convenience` does NOT have `composite: true` so it correctly does not need a reference entry.                      |
| I-08 | **Low** | `intercompany/src/index.ts`                                                                                                             | `reconcileFromDb` not exported in barrel — consumers can only use `reconcileIntercompany` (pure) and `createAndMirrorIc`.                                                                                                   |

### 2.3 CI Gate Weaknesses

| #     | Gate File                                                                          | Issue                                                                                                       |
| ----- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| CW-01 | [far-posting-balanced.test.ts L99](../tools/ci-gates/far-posting-balanced.test.ts) | Threshold of 5 violations before failure — too lenient; masks regressions                                   |
| CW-02 | `far-rls-isolation.test.ts`                                                        | Skip-list has 16 entries; no governance on additions                                                        |
| CW-03 | `outbox-intent-coverage.test.ts` (G-CRUD-04)                                       | `HANDLERS_WITH_SIDE_EFFECTS = []` — gate is a no-op until finance document handlers exist                   |
| CW-04 | `ci.yml`                                                                           | Adapter gates job is a placeholder no-op                                                                    |
| CW-05 | `accounting-hub-service.ts`                                                        | `_reclassResult` and `_allocResult` computed then discarded (prefixed `_`), not included in intent payloads |

---

## 3) Silent Killers (Release-Blocking Risks)

From a 20-year AIS / ERP director perspective, these are the issues that look minor in code review but cause **catastrophic production failures**. Every SK maps to a specific workstream in §8.

### SK-1: Derivation Engine Hash Collisions — CRITICAL

**What:** [derivation-engine.ts L50–L56](../business-domain/finance/accounting-hub/src/calculators/derivation-engine.ts) uses a `simpleHash` function — a basic additive `charCodeAt` loop returning base-36 representation. The idempotency key for every journal derivation depends on this hash.

```ts
// CURRENT — collision-prone placeholder
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36).padStart(10, '0');
}
```

**Why it kills:** With ~10K daily source events, the 32-bit hash space (~4.3 billion) hits 50 % collision probability at ~77K events (birthday paradox). A collision causes either: (a) a legitimate event silently dropped as "already processed", or (b) a duplicate journal entry posted. Both corrupt the general ledger silently — the trial balance still balances but individual account balances are wrong. This won't surface until period-end review or external audit.

**Blast radius:** Every domain that flows through `accounting-hub` — all 37 finance packages.

**OSS reference:** ERPNext uses `naming_series` + UUID for document identity; Kill Bill uses `UUID.randomUUID()` for all idempotency keys — both avoid hash-based idempotency entirely.

---

### SK-2: FX Cross-Rate Float Precision — HIGH

**What:** [fx-triangulation.ts L48–L51](../business-domain/finance/fx-management/src/calculators/fx-triangulation.ts) computes cross-rates using native JS float:

```ts
// CURRENT — float precision loss
const crossBid = sourceToVehicleBid * vehicleToTargetBid;
const crossAsk = sourceToVehicleAsk * vehicleToTargetAsk;
const crossMid = (crossBid + crossAsk) / 2;
const spread = crossMid > 0 ? ((crossAsk - crossBid) / crossMid) * 100 : 0;
```

Meanwhile [fx-convert.ts](../business-domain/finance/fx-management/src/calculators/fx-convert.ts) correctly uses `Decimal.js` for all arithmetic.

**Why it kills:** A $10M USD→MYR trade triangulated through EUR accumulates ~$10–$1000 variance depending on rate magnitude (IEEE 754 double has ~15–17 significant digits; a 6-digit rate × 6-digit rate × 10-digit amount overflows precision). The bank's confirmation will show a different amount. Treasury will need manual adjustments every day. Recon will never fully close.

**Blast radius:** Every cross-currency transaction lacking a direct exchange rate.

**OSS reference:** ERPNext uses Python `Decimal` with `ROUND_HALF_UP` for all FX; Tryton mandates `decimal.Decimal` in all currency calculations.

---

### SK-3: No Real DB Testing in CI — HIGH

**What:** All 13 integration test files use `mockDbSession` — a recursive `Proxy` object from `test-utils/integration-helper.ts`. No CI pipeline actually runs SQL against Postgres. The critical DB-level controls are **never tested**:

| DB Control                             | Schema File        | What It Guards           |
| -------------------------------------- | ------------------ | ------------------------ |
| `je_balance` CHECK                     | journal-entries.ts | DR = CR balance          |
| `reject_posted_mutation` trigger       | journal-entries.ts | Posting immutability     |
| `reject_closed_period_posting` trigger | journal-entries.ts | Period close enforcement |
| `tenantPolicy` RLS                     | 34 finance tables  | Tenant data isolation    |
| Posting lifecycle CHECK                | journal-entries.ts | 5-state state machine    |

**Why it kills:** A Drizzle migration refactor could accidentally drop the `reject_posted_mutation` trigger. The entire test suite would pass green. In production, posted journal entries become mutable — anyone can edit historical financial data. This is a **Sarbanes-Oxley violation** for any public company and would trigger immediate audit qualification.

**Blast radius:** Every finance table with RLS / triggers / CHECKs (34 tables).

---

### SK-4: Dual Period-Close Mechanism — MEDIUM-HIGH

**What:** Two parallel period-close systems exist:

| Table             | Column     | Values                             | Trigger                        |
| ----------------- | ---------- | ---------------------------------- | ------------------------------ |
| `fiscal_periods`  | `isClosed` | `boolean`                          | **None**                       |
| `posting_periods` | `status`   | `open \| soft-close \| hard-close` | `reject_closed_period_posting` |

The DB trigger only checks `posting_periods.status`. A developer closing a period via `fiscal_periods.isClosed = true` without updating `posting_periods` will believe the period is closed — but entries will still post freely.

**Why it kills:** Entries posted to "closed" periods → restated financials. In regulated industries, this triggers a material weakness disclosure. The period-end P&L reversal (ERPNext pattern: dimension-wise closing entries) would also produce incorrect results since it reads from `posting_periods`.

**OSS reference:** ERPNext uses a single `PeriodClosingVoucher` document with one authoritative state. Tryton uses `fiscalyear.close()` which sets a single `state` field. Neither has dual mechanisms.

---

### SK-5: Elimination Audit Trail Fragmentation — MEDIUM

**What:** IC eliminations write to `accounting.journal_lines` (per `SHARED_KERNEL_REGISTRY`). Consolidation eliminations write to dedicated `consolidation.elimination_journals`. An auditor querying "show me all elimination entries" must search two tables with different schemas — and if they query only one, they'll miss half the eliminations.

Additionally, the `close_tasks` dependency graph has no explicit ordering between IC elimination and consolidation elimination — they could run in parallel on overlapping entity sets.

**Why it kills:** Audit firms will refuse to sign off on consolidated financial statements if they can't produce a single reconcilable elimination schedule. Manual workarounds cost weeks of staff time at every period end.

**OSS reference:** ERPNext and Tryton both route all elimination entries through the general journal — one table, one audit trail.

---

## 4) Must-Have Fixes (M-01 → M-12)

Every item below is **release-blocking**. Each includes the exact file(s), function(s), and change specification.

### M-01: Replace Derivation Hash with SHA-256 + Canonical Fingerprint

| Attr             | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**         | `business-domain/finance/accounting-hub/src/calculators/derivation-engine.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Function**     | Replace `simpleHash` (L50–L56) with `createSha256Hash` + new `canonicalDerivationFingerprint`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Change**       | (1) Create `canonicalDerivationFingerprint(input): string` that takes a **minimal, stable** field set (`sourceType`, `sourceId`, `postingPeriod`, `companyId`, `currencyCode`, `ruleSetVersion`, line economic attributes) and serializes via **stable JSON** (sorted keys, no whitespace, normalized numerics). (2) Import `crypto` from Node.js. Hash the fingerprint: `crypto.createHash('sha256').update(fingerprint).digest('hex').slice(0, 32)` (32 hex = 128 bits, far safer than 20). (3) Delete old `simpleHash`. Update `computeDerivationId` (L62) to call `canonicalDerivationFingerprint` → `createSha256Hash`. |
| **Tests**        | Add `derivation-hash.test.ts`: (1) determinism — same input → same hash, (2) collision resistance — hash 100K unique inputs, assert 0 collisions, (3) different-input divergence — two inputs differing by 1 char produce different hashes, (4) **key-order stability** — same semantic input with different object key order → same hash, (5) **numeric normalization** — `1` vs `1.00` normalized before hashing → same hash                                                                                                                                                                                               |
| **CI gate**      | Update `fin-03-deterministic-replay.test.ts` to scan for `crypto.createHash` import and reject `simpleHash`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Architecture** | AD-01 updated: fingerprint input must be **canonical** (sorted keys, stable serialization) to prevent "false non-idempotency" where the same economic event produces different hashes due to serialization variance                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Resolves**     | SK-1, B-01                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### M-02: Decimalize FX Triangulation + Rounding Contract

| Attr                  | Value                                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**              | `business-domain/finance/fx-management/src/calculators/fx-triangulation.ts`                                                                                                                                                                                                                                                                                         |
| **Lines**             | L48–L51                                                                                                                                                                                                                                                                                                                                                             |
| **Change**            | Replace all native `*`, `/`, `+`, `-` on rate variables with `new Decimal(x).mul(y)`, `.div()`, `.plus()`, `.minus()`. Import `Decimal` from `decimal.js` (already a dependency).                                                                                                                                                                                   |
| **Rounding contract** | Define and enforce: `FX_RATE_SCALE = 10` (decimal places for rates), `AMOUNT_SCALE = 0` (minor units are integers), `ROUNDING_MODE = ROUND_HALF_UP` (standard accounting rounding). Export these as constants from `fx-management/src/constants.ts` for reuse across all FX calculators. Spread calculation must also use `Decimal` with explicit scale + rounding. |
| **Tests**             | Add to existing test file: (1) triangulate USD→EUR→JPY with known rates, assert result matches manual `Decimal` calculation to 10 decimal places, (2) verify rounding mode is `ROUND_HALF_UP`, (3) verify spread uses `Decimal` not float.                                                                                                                          |
| **Resolves**          | SK-2, B-03                                                                                                                                                                                                                                                                                                                                                          |

### M-03: Real DB Contract Test Infrastructure

| Attr               | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **New file**       | `business-domain/finance/test-utils/testcontainers-helper.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Config**         | Update `vitest.integration.config.ts` — replace `mockDbSession` stub fallback with Testcontainers Postgres setup. Use `@testcontainers/postgresql` to create ephemeral container, apply full Drizzle schema + RLS + triggers.                                                                                                                                                                                                                                                                                                                    |
| **Role setup**     | Create at least **two DB roles** mimicking runtime (`app_user`, `app_admin`). Ensure RLS is **enabled + forced** (`ALTER TABLE … ENABLE ROW LEVEL SECURITY; ALTER TABLE … FORCE ROW LEVEL SECURITY;`). Set tenant context the same way production does (e.g., `set_config('app.org_id', ...)` or whatever `tenantPolicy()` expects).                                                                                                                                                                                                             |
| **Contract tests** | Create `business-domain/finance/test-utils/__tests__/db-contracts.integration.test.ts` proving: (1) RLS isolation — insert with org_A, query with org_B returns 0, (2) **RLS bypass resistance** — cross-org read cannot be forced by raw SQL even with crafted WHERE clause (policy truly blocks it), (3) `je_balance` CHECK — insert DR ≠ CR fails, (4) `reject_posted_mutation` — UPDATE on `status='posted'` throws, (5) `reject_closed_period_posting` — INSERT to hard-closed period throws, (6) periodKey CHECK — invalid format rejected |
| **CI**             | Add `db-contract-tests` job to `.github/workflows/quality-gates.yml` (required, not skippable). Cache container layers. Separate job with clear timeouts.                                                                                                                                                                                                                                                                                                                                                                                        |
| **Local runner**   | Add `pnpm test:db-contracts` script to root `package.json` so devs can run locally without CI.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Resolves**       | SK-3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

### M-04: Fix Intercompany Package (4 sub-fixes)

| Sub           | File                                                                                                                                                                                      | Change                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| M-04a         | `intercompany/src/services/ic-service.ts` L94                                                                                                                                             | Replace `throw new Error(...)` → `throw new DomainError('IC_SAME_COMPANY', 'IC transaction cannot be within the same company')` |
| M-04b         | `intercompany/src/services/ic-service.ts` `createAndMirrorIc`                                                                                                                             | Emit **2** mirror intents (one per entity direction) matching ERPNext bidirectional JV pattern                                  |
| M-04c         | `intercompany/src/index.ts`                                                                                                                                                               | Add `reconcileFromDb` to barrel exports                                                                                         |
| M-04d         | `intercompany/src/calculators/ic-matching.ts` L5                                                                                                                                          | Fix truncated JSDoc: `"receivabl"` → `"receivable"`                                                                             |
| **New tests** | `intercompany/src/__tests__/ic-service.test.ts` — ≥12 tests covering: DomainError throw, bidirectional intent emission, mirror validation, `reconcileFromDb` flow, same-company rejection |
| **Registry**  | `shared-kernel-registry.ts` — add `ic.mirror` to `ic.ic_transactions` writes array                                                                                                        |
| **Resolves**  | B-02, B-05, I-04, I-08                                                                                                                                                                    |

### M-05: Fix fxRate() Precision Mismatch

| Attr          | Value                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**      | `packages/database/src/schema/fx-rates.ts` L24                                                                                                                       |
| **Change**    | Replace `rate: numeric('rate', { precision: 18, scale: 8 }).notNull()` → `rate: fxRate('rate').notNull()`. Import `fxRate` from helpers. Standardizes to `(20, 10)`. |
| **Migration** | Run `pnpm drizzle-kit generate` — will produce ALTER COLUMN for precision upgrade.                                                                                   |
| **Resolves**  | I-01                                                                                                                                                                 |

### M-06: Fix Reconciliation Type Inconsistency

| Attr          | Value                                                                                                                                                                                                            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**      | `packages/database/src/schema/reconciliation-items.ts` L41                                                                                                                                                       |
| **Change**    | Replace `matchConfidence: text('match_confidence')` → `matchConfidence: integer('match_confidence')` with CHECK `(match_confidence >= 0 AND match_confidence <= 100)`, matching `match-results.ts` score column. |
| **Migration** | Generate ALTER COLUMN + ADD CHECK.                                                                                                                                                                               |
| **Resolves**  | I-02                                                                                                                                                                                                             |

### M-07: Fix Consolidation Ownership Threshold

| Attr         | Value                                                                                                                                                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**     | `business-domain/finance/consolidation/src/services/consolidation-service.ts`                                                                                                                                                                                                                                                |
| **Lines**    | L153 (threshold), L172 (empty intent)                                                                                                                                                                                                                                                                                        |
| **Change**   | (1) Replace hardcoded `ownershipPct > 50` with configurable thresholds: `>50%` = full consolidation, `20–50%` = equity method (IAS 28), `<20%` = fair value. Add `consolidationType` discriminator to result. (2) Replace empty `eliminationEntries: []` — emit `consolidation.ownership_change` intent with ownership data. |
| **Resolves** | B-04                                                                                                                                                                                                                                                                                                                         |

### M-08: Period-Close Mechanism Alignment

| Attr              | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Files**         | `packages/database/src/schema/fiscal-periods.ts`, `packages/database/src/schema/posting-periods.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Change**        | Add DB trigger `sync_fiscal_period_close` on `fiscal_periods` with the following safeguards: (1) Fire only **WHEN `isClosed` changes `false→true`** (use `WHEN (OLD.is_closed = false AND NEW.is_closed = true)`) to prevent recursion. (2) Use idempotent update: `UPDATE posting_periods SET status='hard-close' WHERE status <> 'hard-close' AND org_id = NEW.org_id AND fiscal_year = NEW.fiscal_year`. (3) Scope by **org + fiscalYear + ledgerId** to respect multi-ledger independence (different ledgers can close independently). If `posting_periods` lacks `ledgerId` scoping, flag as schema smell to address. |
| **Contract test** | Prove: (1) setting `fiscal_periods.isClosed = true` → `posting_periods.status` becomes `hard-close` → subsequent INSERT to `journal_entries` in that period is rejected. (2) Already-closed posting periods are not re-triggered (idempotent). (3) Multi-ledger: closing fiscal period only affects posting periods for the correct ledger(s).                                                                                                                                                                                                                                                                             |
| **Resolves**      | SK-4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### M-09: Unify Elimination Routing

| Attr              | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Files**         | `shared-kernel-registry.ts`, `domain-intent-registry.ts`, `consolidation-service.ts`, `ic-service.ts`, elimination journal schema                                                                                                                                                                                                                                                                                                                                                                                  |
| **Change**        | Route **all** eliminations (IC + consolidation) to `consolidation.elimination_journals`. Update `ic.eliminate` intent `tableTarget` from `accounting.journal_lines` to `consolidation.elimination_journals`. Add `sourceType` discriminator (`ic \| consolidation \| translation`) + `sourceRefId` (FK to originating IC doc / consolidation run) to elimination journal schema.                                                                                                                                   |
| **Schema adds**   | (1) Add `sourceRefId uuid` column for traceability back to IC doc / consolidation run. (2) Add unique constraint `uq__elimination_journals__org_period_source_ref` on `(org_id, period_key, source_type, source_ref_id)` to prevent duplicate eliminations per run. (3) Add index on `(org_id, source_type, period_key)` for efficient audit queries. (4) Optional: create a view `v_all_eliminations` to preserve backward compatibility if anything currently reads `accounting.journal_lines` for eliminations. |
| **Migration**     | Add `source_type`, `source_ref_id` columns + unique constraint + index. Backfill existing rows if any.                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Contract test** | Single query on `elimination_journals` retrieves all eliminations regardless of source. Duplicate insert with same `(org, period, source_type, source_ref_id)` is rejected.                                                                                                                                                                                                                                                                                                                                        |
| **Resolves**      | SK-5, I-03                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### M-10: Fix tsconfig References

| Attr         | Value                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**     | `tsconfig.json`                                                                                                                                          |
| **Change**   | Add `{ "path": "./packages/observability" }` to `references` array. (`packages/crud-convenience` lacks `composite: true` and does not need a reference.) |
| **Resolves** | I-07                                                                                                                                                     |

### M-11: Zero-Amount Derivation Handling

| Attr         | Value                                                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**     | `business-domain/finance/accounting-hub/src/calculators/derivation-engine.ts`                                                                                                                                                |
| **Change**   | When `Math.round(amountMinor * fraction) === 0`, emit a warning trace event (`accounting-hub.zero_rule_skipped`) with rule details instead of silently dropping the line. Add `skippedRules` array to the derivation result. |
| **Test**     | 3-way allocation where one fraction rounds to zero — assert `skippedRules.length === 1` and remaining lines still balance.                                                                                                   |
| **Resolves** | CW-05 (partial)                                                                                                                                                                                                              |

### M-12: Capture Reclass & Allocation Results

| Attr         | Value                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File**     | `business-domain/finance/accounting-hub/src/services/accounting-hub-service.ts`                                                                          |
| **Change**   | Remove `_` prefix from `_reclassResult` and `_allocResult`. Include both in the returned intent payload's `evidence` field for audit trail completeness. |
| **Resolves** | CW-05                                                                                                                                                    |

---

## 5) CI Gate Additions (CIG-01 → CIG-06)

New gates to add alongside the existing 28.

### CIG-01: DomainError Enforcement (`sk-12-domain-error.test.ts`)

```
Scan: business-domain/finance/*/src/**/*.ts
Exclude: **/__tests__/**, **/*.test.ts, **/*.spec.ts
Assert: zero occurrences of:
  - /throw\s+new\s+Error\(/
  - /Promise\.reject\(new\s+Error\(/
  - /return\s+new\s+Error\(/
Exception: lines with // ADR: comment are allowed (must cite decision number).
All throws must use DomainError from @afenda/canon with stable error codes.
```

**Rationale:** B-02 (intercompany) is the known instance; there may be others. Gate prevents regression. Excluding test files avoids false positives from test setup code.

### CIG-02: FX Arithmetic Safety (`fin-06-fx-precision.test.ts`)

```
Approach: AST-based (lightweight TS parser), NOT regex — regex is too noisy on
          amount math, percentages, and non-rate operations.
Scan: business-domain/finance/fx-management/src/calculators/*.ts
Detect: binary ops (*, /, +, -) where either side identifier matches
        /rate|bid|ask|cross|spread/i
Allow: numeric literals and Decimal method chains only.
Verify: every schema column named *rate* uses fxRate() helper.
```

**Rationale:** SK-2 is the known instance. AST-based detection avoids false positives from non-rate arithmetic while catching all rate-related float operations. Gate prevents future FX calculators from using float math.

### CIG-03: Schema Helper Consistency (`far-schema-helpers.test.ts`)

```
Scan: packages/database/src/schema/*.ts
Assert: no inline numeric('rate'...) for FX columns where fxRate() exists.
Assert: no currency columns with .default() on finance truth tables.
Assert: no inline numeric('...amount...') where moneyMinor() exists.
Exceptions: explicitly curated allowlist with ADR justification.
```

**Rationale:** I-01 (fx-rates) is the known instance. Gate enforces DRY for financial column definitions.

### CIG-04: Registry ↔ Schema Coherence (`far-registry-coherence.test.ts`)

```
For every finance entry in _registry.ts:
  Assert: hasRls === true → schema file calls tenantPolicy()
  Assert: hasTenant === true → schema file calls erpEntityColumns or has orgId
  Assert: timeAxis claim → schema file has matching date / periodKey column
  Assert: hasCompositePk === true → schema file calls tenantPk()
  Assert: supportsIntercompany === true → schema has companyId + counterpartyCompanyId
          (or canonical IC keys) AND has indexes suitable for IC matching
```

**Rationale:** Registry claims are used by CI-gates and documentation — if they drift from schema reality, gate guarantees become meaningless. The IC key assertion prevents tables declared as IC-capable from lacking the columns needed for matching.

### CIG-05: Integration Test Coverage Floor (`g-int-01.test.ts`)

```
For every finance package with src/services/*.ts:
  Assert: at least 1 matching *.integration.test.ts exists
Current: 11 of 37 packages have integration tests.
Ratchet: floor increases by 2 packages per quarter.
```

**Rationale:** SK-3 mitigation — forces progressive expansion of real DB testing.

### CIG-06: SHARED_KERNEL_REGISTRY Completeness (enhance `sk-04`)

```
Scan: all buildXxxIntent functions in business-domain/finance/*/src/**/*.ts
For each: assert tableTarget exists in SHARED_KERNEL_REGISTRY
For each: assert the intent type is listed in the target table's writes array.
```

**Rationale:** I-04 (ic.mirror missing from writes) is the known instance.

---

## 6) Good-to-Have Improvements (G-01 → G-14)

Valuable but not release-blocking. Ordered by business impact.

### G-01: Country-Specific Tax Box Structures

| Current                                                                               | Proposed                                                                                                         |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Generic 6-box format for all countries (MY_SST, SG_GST, UK_VAT, EU_VAT, US_SALES_TAX) | Configurable box schema per country format: UK = 9 boxes, EU = 25-field SAF-T, India = GSTR-1, Malaysia = SST-02 |

**File:** `business-domain/finance/tax-engine/src/calculators/` — add `tax-box-schema.ts` with country-keyed box definitions.

### G-02: Configurable Dunning Rules

| Current                                                                                                                               | Proposed                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Only `priorNoticeCount` determines escalation (L20 of `dunning-letters.ts`). `daysOverdue` and `overdueMinor` are carried but unused. | Policy-driven escalation: `level = max(countLevel, daysLevel, amountLevel)` with configurable thresholds per customer segment. |

**File:** `business-domain/finance/credit-management/src/calculators/dunning-letters.ts` — add `DunningPolicy` type, threshold-based level computation.

### G-03: Full Cycle Path in Financial Close

| Current                                                                                                                                                    | Proposed                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [dependency-resolver.ts L50](../business-domain/finance/financial-close/src/calculators/dependency-resolver.ts) — cycle detection captures only first node | Track full DFS stack, return `cyclePath: string[]` showing the complete cycle (e.g., `A → B → C → A`) |

### G-04: In-Progress Task Guard

| Current                                                                   | Proposed                                                                                                    |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `in-progress` tasks appear in `readyTasks` — no guard against re-starting | Add `allowRestart` option (default `false`). Exclude in-progress from ready set unless explicitly opted in. |

### G-05: Remove Dead `moneyDocumentColumns`

| Current                                                                                                                                                              | Proposed                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Defined at [field-types.ts L37](../packages/database/src/helpers/field-types.ts), exported from index, never used. Decision documented in `erpnext.md` to NOT adopt. | Delete the function and its export. Individual helpers (`moneyMinor()` + `currencyCodeStrict()` + `fxRate()`) are the established pattern. |

### G-06: Journal Lines FK Constraint

| Current                                                                   | Proposed                                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| No Drizzle-level FK from `journal_lines.journalId` → `journal_entries.id` | Add `.references(() => journalEntries.id)` for referential integrity beyond RLS |

### G-07: Architecture Doc Package Count Reconciliation

| Current                                                                                                                                                                                        | Proposed                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [ARCHITECTURE.md L55](../ARCHITECTURE.md): "116 packages"; [architecture.domain.md L735](../business-domain/architecture.domain.md): "130 packages" (80 core + 39 industry + 11 cross-cutting) | Update root ARCHITECTURE.md to 130. Add note: "37 implemented, 130 planned." |

### G-08: Reduce FAR Posting Balance Threshold

| Current                                                                                                                                                    | Proposed                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [far-posting-balanced.test.ts L99](../tools/ci-gates/far-posting-balanced.test.ts): allows up to 5 files referencing `journalLines` without balance checks | Reduce threshold to **0** — every file touching journal lines must have balance verification |

### G-09: Consolidation Equity Method (IAS 28 / IFRS 11)

| Current                                                              | Proposed                                                                                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Only full consolidation (`>50%`). No equity method or joint venture. | Add `equityMethodConsolidation` calculator (20–50%), `jointVentureConsolidation` (proportionate), `fairValueInvestment` (<20%). |

### G-10: FAR RLS Skip-List Governance

| Current                                                               | Proposed                                                                                                                     |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `far-rls-isolation.test.ts` has 16 skipped files; no approval process | Require ADR reference comment for each skip-list entry. Gate fails if count exceeds threshold (current + 2) without new ADR. |

### G-11: Intercompany Test Coverage Expansion

| Current                                                              | Proposed                                                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1 test file, 8 tests — only `ic-matching.test.ts`. No service tests. | Target: 3 test files, ≥30 tests covering matching, service flows, mirror validation, DB-reconciliation, netting, and cycle detection. |

### G-12: Budget Commitment Real-Time Checking

| Current                                                                | Proposed                                                                                                                                                       |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `budget-commitment.ts` exists but no real-time PO/invoice budget check | Add `checkBudgetAvailability` gate that blocks PO approval when budget line remaining < commitment amount (ERPNext pattern: `budget_against` dimension check). |

### G-13: Revenue Recognition — Contract Modification Types

| Current                                                                                                              | Proposed                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contract-modification.ts` classifies modifications but doesn't specify cumulative catch-up vs prospective treatment | Add IFRS 15.21 classification: if modification creates new performance obligations → prospective; if modification changes existing → cumulative catch-up with reallocation. |

### G-14: Payment Posting Lifecycle

| Current                                                                                                            | Proposed                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `payments.ts` has no `postingStatus` column — GL posting via `journal_entries.sourceType = 'payment'` linkage only | Add 3-state posting lifecycle (`draft → approved → posted`) to payments table for consistency with journal entries. Gate payment → GL entry creation only for `posted` payments. |

---

## 7) ERP Pain Points — Director's Assessment

From 20 years of AIS / ERP implementation across SAP, Oracle, and mid-market systems, these are the pain points every finance module must address. Assessment against AFENDA current state.

### 7.1 The "Month-End Close" Problem

**Pain:** Month-end close takes 5–15 business days at most enterprises. The bottleneck is always: (a) unreconciled IC transactions, (b) manual FX revaluation, (c) missing accruals, (d) open items not matched.

**AFENDA status:**

- ✅ `financial-close` has topological sort + dependency resolution — **best-in-class**
- ✅ `bank-reconciliation` has confidence scoring — ahead of OSS peers
- ⚠️ IC reconciliation creates 1 intent, not 2 — incomplete (M-04)
- ⚠️ No real DB validation of close integrity — risk (SK-3)
- ⚠️ Period close has dual mechanisms — risk (SK-4)

**Verdict:** Architecture is strong. Fix M-04, M-08, M-03 and close time drops from "at risk" to "automated."

### 7.2 The "Multi-Entity Consolidation" Problem

**Pain:** Groups with 50+ entities spend 2–4 weeks on consolidation. Key issues: elimination completeness, FX translation consistency, minority interest calculation, step acquisitions.

**AFENDA status:**

- ✅ 8 consolidation calculators (elimination, FX translation, NCI, goodwill, step acquisition, IC netting, auto-consol journal, IC dividend elimination) — **comprehensive**
- ⚠️ Ownership threshold hardcoded at 50% — no equity method (M-07)
- ⚠️ Elimination routes split between 2 tables (SK-5)
- ⚠️ Empty elimination intent on ownership change (B-04)

**Verdict:** Calculator breadth is excellent. Fix M-07, M-09, and consolidation is production-grade.

### 7.3 The "Audit Trail Integrity" Problem

**Pain:** External auditors require: (a) every financial posting traceable to source document, (b) no mutation of posted entries, (c) all elimination entries in one reconcilable schedule, (d) segregation of duties evidence.

**AFENDA status:**

- ✅ 5-state posting lifecycle with DB trigger immutability — **strong**
- ✅ 76 registered domain intents with full idempotency / ledger impact metadata
- ✅ `evidence` table kind in registry — architecture supports audit trail
- ⚠️ Derivation hash could cause untraceable duplicates (SK-1)
- ⚠️ Elimination split fragments audit trail (SK-5)
- ⚠️ No DB tests validate immutability trigger actually works (SK-3)

**Verdict:** Design intent is excellent. Fix SK-1, SK-3, SK-5 to close the gap between design and enforcement.

### 7.4 The "Multi-Currency Reporting" Problem

**Pain:** Companies operating in 10+ currencies need: functional currency conversion, presentation currency translation, unrealized FX gain/loss, hedge accounting effectiveness testing.

**AFENDA status:**

- ✅ 7 FX calculators including triangulation, forward contracts, rate audit
- ✅ `hedge-accounting` package with effectiveness testing
- ✅ Schema supports dual-amount pattern (`amountMinor` + `fxRate`)
- ⚠️ Triangulation uses float (SK-2)
- ⚠️ fxRate precision mismatch (I-01)

**Verdict:** Excellent breadth. Fix M-02 and M-05 for production accuracy.

### 7.5 The "Regulatory Compliance" Problem

**Pain:** Every country has unique: tax return formats, e-invoicing mandates, transfer pricing documentation, statutory reporting requirements.

**AFENDA status:**

- ✅ `tax-engine` with 5 rounding methods, 4 charge types, SAF-T export
- ✅ `transfer-pricing` package with TP documentation
- ✅ `statutory-reporting` package
- ⚠️ Tax box format is generic 6-box — insufficient for UK (9), EU (25+), India (GSTR-1) (G-01)
- ⚠️ No e-invoicing / CTC support (roadmap: `GLOBAL_ENTERPRISE_GAPS.md` Tier 2)

**Verdict:** Foundation is solid. G-01 adds compliance depth. E-invoicing is correctly scoped as a future domain.

---

## 8) Workstreams (Ordered Execution)

> **Sequencing rationale:** DB harness first (A) because M-01/M-02/M-05/M-06/M-08/M-09 all touch areas where DB guarantees matter — building the harness after would rediscover issues late. Schema precision (B) next because migrations ripple into tests and calculators. Logic correctness (C/D) after schema is stable. Cross-module authority (E/F) last to avoid fix→migrate→break→refix loops.

### Workstream A — Real DB Contract Tests (Day 1–3)

| Step | Item                                 | File(s)         |
| ---- | ------------------------------------ | --------------- |
| A1   | Testcontainers infra + helper        | M-03 (infra)    |
| A2   | Role setup (app_user, app_admin)     | M-03 (roles)    |
| A3   | RLS isolation + bypass resistance    | M-03 (test 1–2) |
| A4   | Posting immutability contract test   | M-03 (test 3)   |
| A5   | Period close rejection contract test | M-03 (test 4)   |
| A6   | Balance CHECK contract test          | M-03 (test 5)   |
| A7   | PeriodKey CHECK contract test        | M-03 (test 6)   |
| A8   | CI workflow job + local runner       | M-03 (CI)       |

### Workstream B — Schema Precision & Type Fixes (Day 3–4)

| Step | Item                                  | File(s)    |
| ---- | ------------------------------------- | ---------- |
| B1   | Fix fxRate() precision mismatch       | M-05       |
| B2   | Fix reconciliation type inconsistency | M-06       |
| B3   | Fix tsconfig references               | M-10       |
| B4   | Generate + review migrations          | M-05, M-06 |
| B5   | Add schema helper consistency gate    | CIG-03     |

### Workstream C — Deterministic Posting Integrity (Day 4–5)

| Step | Item                                                      | File(s)        |
| ---- | --------------------------------------------------------- | -------------- |
| C1   | Replace `simpleHash` with SHA-256 + canonical fingerprint | M-01           |
| C2   | Handle zero-amount derivation rules                       | M-11           |
| C3   | Capture reclass / allocation results                      | M-12           |
| C4   | Update `fin-03` gate                                      | M-01 (CI gate) |

### Workstream D — FX Monetary Correctness (Day 5–6)

| Step | Item                                            | File(s) |
| ---- | ----------------------------------------------- | ------- |
| D1   | Decimalize FX triangulation + rounding contract | M-02    |
| D2   | Add `fin-06` FX precision gate (AST-based)      | CIG-02  |

### Workstream E — Period Close & Intercompany (Day 6–7)

| Step | Item                                                          | File(s)         |
| ---- | ------------------------------------------------------------- | --------------- |
| E1   | Add `sync_fiscal_period_close` trigger (with recursion guard) | M-08            |
| E2   | Contract test: close sync + posting rejection + multi-ledger  | M-08 (test)     |
| E3   | Fix raw Error → DomainError                                   | M-04a           |
| E4   | Fix bidirectional mirroring                                   | M-04b           |
| E5   | Export `reconcileFromDb`                                      | M-04c           |
| E6   | Fix truncated JSDoc                                           | M-04d           |
| E7   | Update shared kernel registry                                 | M-04 (registry) |
| E8   | Add DomainError enforcement gate                              | CIG-01          |

### Workstream F — Elimination & Consolidation (Day 7–8)

| Step | Item                                                                            | File(s)          |
| ---- | ------------------------------------------------------------------------------- | ---------------- |
| F1   | Unify elimination routing + schema adds (sourceRefId, unique constraint, index) | M-09             |
| F2   | Fix consolidation ownership threshold                                           | M-07             |
| F3   | Elimination contract test (single query + duplicate rejection)                  | M-09 (test)      |
| F4   | Generate migration for elimination schema change                                | M-09 (migration) |

### Workstream G — CI Gate Hardening (Day 8–9)

| Step | Item                                                         | File(s) |
| ---- | ------------------------------------------------------------ | ------- |
| G1   | Add registry ↔ schema coherence gate (with IC key assertion) | CIG-04  |
| G2   | Add SK registry completeness gate                            | CIG-06  |
| G3   | Add integration test coverage gate                           | CIG-05  |

### Workstream H — Good-to-Have (Day 9+, non-blocking)

Items G-01 through G-14, prioritized by business impact. Can be parallelized.

---

## 9) Test Strategy (Two-Tier)

### Tier 1 — Unit & Service Tests (Mocked queries)

| What                  | How                                                                 | Count                      |
| --------------------- | ------------------------------------------------------------------- | -------------------------- |
| Calculator purity     | Direct function calls, assert `CalculatorResult` envelope           | ~1 200 tests               |
| Service orchestration | `mockDbSession` proxy, verify intent emission & DomainError mapping | ~700 tests                 |
| CI gate correctness   | AST / regex scan of source files                                    | 34 gates (all implemented) |

**Run:** `pnpm turbo test --filter=./business-domain/finance/*`

### Tier 2 — DB Contract Tests (Real Postgres)

| What                | Infrastructure          | Count                            |
| ------------------- | ----------------------- | -------------------------------- |
| RLS isolation       | Testcontainers Postgres | 1 per finance table              |
| Trigger enforcement | Full schema + triggers  | 3 triggers × 2 scenarios each    |
| CHECK constraints   | Full schema             | 4 constraints × 2 scenarios each |
| Period close sync   | Trigger + FK            | 2 scenarios                      |

**Run:** `pnpm vitest run -c business-domain/finance/vitest.integration.config.ts`

### Coverage Targets

| Metric                 | Current             | Target                                          |
| ---------------------- | ------------------- | ----------------------------------------------- |
| Unit tests             | 1 921               | 1 980+ (after M-01 through M-12 test additions) |
| Integration test files | 13                  | 18+ (cover all packages with services)          |
| CI gates               | 34 (CIG-01–06 done) | 34 — target met                                 |
| AIS benchmark          | 280/280 (100%)      | Maintain 280/280                                |
| Average confidence     | 92.2                | ≥93.0 (from fixing known gaps)                  |

## 10) Release Gates (RG-01 → RG-25)

All must pass before merge. Grouped by category.

### Core Quality

| Gate  | Description                                | Command                                                      |
| ----- | ------------------------------------------ | ------------------------------------------------------------ |
| RG-01 | Finance unit tests pass                    | `pnpm turbo test --filter=./business-domain/finance/*`       |
| RG-02 | CI gate suite passes (existing 28 + 6 new) | `pnpm vitest run -c vitest.mcp.config.ts`                    |
| RG-03 | Type check passes                          | `pnpm turbo type-check --filter=./business-domain/finance/*` |
| RG-04 | Zero lint errors                           | `pnpm turbo lint --filter=./business-domain/finance/*`       |
| RG-05 | AIS benchmark 280/280 maintained           | AIS benchmark gate                                           |

### SK-1 Resolution (Deterministic Posting)

| Gate  | Description                                                            |
| ----- | ---------------------------------------------------------------------- |
| RG-06 | SHA-256 derivation id implemented; `simpleHash` deleted                |
| RG-07 | Deterministic replay gate passes with `crypto.createHash` verification |
| RG-08 | Zero-amount derivation produces `skippedRules` — no silent drop        |

### SK-2 Resolution (FX Precision)

| Gate  | Description                                                        |
| ----- | ------------------------------------------------------------------ |
| RG-09 | FX triangulation uses `Decimal` only; native float path deleted    |
| RG-10 | FX precision tests pass (known-rate triangulation matches Decimal) |
| RG-11 | All FX rate schema columns use `fxRate()` helper                   |

### SK-3 Resolution (DB Contract Tests)

| Gate  | Description                                               |
| ----- | --------------------------------------------------------- |
| RG-12 | DB contract tests run in CI and pass                      |
| RG-13 | RLS isolation contract test passes (no cross-org leakage) |
| RG-14 | Posting immutability contract test passes                 |
| RG-15 | DR=CR balance CHECK contract test passes                  |
| RG-16 | PeriodKey CHECK contract test passes                      |

### SK-4 Resolution (Period Close)

| Gate  | Description                                                        |
| ----- | ------------------------------------------------------------------ |
| RG-17 | Period close alignment trigger installed                           |
| RG-18 | Period close contract tests pass (fiscal→posting sync + rejection) |

### SK-5 Resolution (Elimination Audit)

| Gate  | Description                                                   |
| ----- | ------------------------------------------------------------- |
| RG-19 | All eliminations route to single table                        |
| RG-20 | Elimination contract test passes (single query retrieves all) |

### Structural Integrity

| Gate  | Description                                                       |
| ----- | ----------------------------------------------------------------- |
| RG-21 | No `throw new Error(` in finance domain (DomainError enforcement) |
| RG-22 | Registry ↔ schema coherence gate passes                           |

### Self-Defending Architecture

| Gate  | Description                                                                                                                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RG-23 | **Migration Safety** — No raw SQL migrations outside Drizzle pipeline for finance schemas (unless ADR-whitelisted). Scan `drizzle/` for non-generated files.                                         |
| RG-24 | **Registry Coverage Drift** — Finance table count in `_registry.ts` matches schema file count for finance-domain tables. Ratchet allowed (count can increase, never decrease).                       |
| RG-25 | **Deterministic Intent Payload** — Intent payloads for postings / eliminations contain required evidence fields (non-empty). Prevents the `eliminationEntries: []` class of failures from returning. |

---

## 11) Deliverables Manifest

### Code Changes

| Category        | Files                                                                                                       | Description                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Calculators** | `derivation-engine.ts`, `fx-triangulation.ts`, `dunning-letters.ts` (G-02), `dependency-resolver.ts` (G-03) | SHA-256 + canonical fingerprint, FX decimalization + rounding contract, improved logic |
| **Services**    | `ic-service.ts`, `consolidation-service.ts`, `accounting-hub-service.ts`                                    | DomainError, bidirectional IC, ownership thresholds, result capture                    |
| **Schema**      | `fx-rates.ts`, `reconciliation-items.ts`, `fiscal-periods.ts`, `posting-periods.ts`                         | Precision fix, type fix, period sync trigger                                           |
| **Registry**    | `shared-kernel-registry.ts`, `domain-intent-registry.ts`                                                    | IC mirror write, elimination routing                                                   |
| **Barrel**      | `intercompany/src/index.ts`                                                                                 | Add `reconcileFromDb` export                                                           |
| **Config**      | `tsconfig.json`                                                                                             | Add 1 missing reference (observability)                                                |
| **Dead code**   | `field-types.ts` (G-05)                                                                                     | Remove `moneyDocumentColumns`                                                          |

### New Files

| File                                                                            | Purpose                                              |
| ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `business-domain/finance/test-utils/testcontainers-helper.ts`                   | Testcontainers Postgres setup / teardown             |
| `business-domain/finance/test-utils/__tests__/db-contracts.integration.test.ts` | DB contract tests (RLS, triggers, CHECKs)            |
| `business-domain/finance/intercompany/src/__tests__/ic-service.test.ts`         | IC service tests (≥12)                               |
| `tools/ci-gates/sk-12-domain-error.test.ts`                                     | DomainError enforcement gate                         |
| `tools/ci-gates/fin-06-fx-precision.test.ts`                                    | FX arithmetic safety gate                            |
| `tools/ci-gates/far-schema-helpers.test.ts`                                     | Schema helper consistency gate                       |
| `tools/ci-gates/far-registry-coherence.test.ts`                                 | Registry ↔ schema coherence gate                     |
| `tools/ci-gates/g-int-01.test.ts`                                               | Integration test coverage floor gate                 |
| `tools/ci-gates/sk-registry-completeness.test.ts`                               | SK registry completeness gate (CIG-06)               |
| `business-domain/finance/fx-management/src/constants.ts`                        | FX_RATE_SCALE, AMOUNT_SCALE, ROUNDING_MODE constants |

### Database Migrations

| Migration                                                               | Cause |
| ----------------------------------------------------------------------- | ----- |
| ALTER `fx_rates.rate` precision 18,8 → 20,10                            | M-05  |
| ALTER `reconciliation_items.match_confidence` text → integer + CHECK    | M-06  |
| ADD trigger `sync_fiscal_period_close`                                  | M-08  |
| ADD `source_type` + `source_ref_id` columns to `elimination_journals`   | M-09  |
| ADD unique constraint `uq__elimination_journals__org_period_source_ref` | M-09  |
| ADD index on `(org_id, source_type, period_key)` for audit queries      | M-09  |

### CI Workflow Changes

| Workflow            | Change                                                              |
| ------------------- | ------------------------------------------------------------------- |
| `quality-gates.yml` | Add required `db-contract-tests` job (with container layer caching) |
| `ci.yml`            | Verify adapter gates job is no longer a no-op or remove placeholder |
| `package.json`      | Add `pnpm test:db-contracts` script for local DB contract testing   |

### Documentation

| File                     | Change                                       |
| ------------------------ | -------------------------------------------- |
| `ARCHITECTURE.md` L55    | 116 → 130 packages (G-07)                    |
| `architecture.domain.md` | Add "37 implemented, 130 planned" annotation |

---

## 12) Execution Checklist

Operator-readable step-by-step. Each step corresponds to a workstream from §8.

```
☑ Workstream A — Real DB Contract Tests (Day 1–3)
  ☑ A1  Create testcontainers-helper.ts
  ☑ A2  Set up DB roles (app_user, app_admin) + ENABLE/FORCE RLS
  ☑ A3  Create db-contracts.integration.test.ts (6 contract tests incl. RLS bypass resistance)
  ☑ A4  Add db-contract-tests job to quality-gates.yml
  ☑ A5  Add pnpm test:db-contracts local runner script
  ☑ A6  Verify all 6 tests pass locally

☑ Workstream B — Schema Precision & Type Fixes (Day 3–4)
  ☑ B1  Change fx-rates.ts rate column to use fxRate() helper
  ☑ B2  Fix reconciliation-items.ts matchConfidence → integer
  ☑ B3  Add observability to tsconfig references
  ☑ B4  Generate + review migrations for precision/type changes
  ☑ B5  Add far-schema-helpers gate

☑ Workstream C — Deterministic Posting Integrity (Day 4–5)
  ☑ C1  Create canonicalDerivationFingerprint (stable JSON, sorted keys, normalized numerics)
  ☑ C2  Replace simpleHash → SHA-256 (32 hex) in derivation-engine.ts
  ☑ C3  Add zero-amount handling + skippedRules to derivation result
  ☑ C4  Capture _reclassResult / _allocResult in intent payloads
  ☑ C5  Update fin-03 gate to verify crypto.createHash
  ☑ C6  Add tests: key-order stability + numeric normalization

☑ Workstream D — FX Monetary Correctness (Day 5–6)
  ☑ D1  Replace float ops → Decimal.js in fx-triangulation.ts
  ☑ D2  Define FX_RATE_SCALE / AMOUNT_SCALE / ROUNDING_MODE constants
  ☑ D3  Add fin-06-fx-precision gate (AST-based, not regex)
  ☑ D4  Add tests: rounding mode + spread uses Decimal

☑ Workstream E — Period Close & Intercompany (Day 6–7)
  ☑ E1  Add sync_fiscal_period_close trigger (WHEN false→true only, idempotent, multi-ledger scoped)
  ☑ E2  Generate migration with trigger
  ☑ E3  Add contract tests: close sync + idempotent + multi-ledger
  ☑ E4  Fix Error → DomainError in ic-service.ts L94
  ☑ E5  Fix createAndMirrorIc to emit 2 mirror intents
  ☑ E6  Export reconcileFromDb from index.ts
  ☑ E7  Fix truncated JSDoc in ic-matching.ts
  ☑ E8  Add ic.mirror to shared-kernel-registry writes
  ☑ E9  Create ic-service.test.ts (≥12 tests)
  ☑ E10 Add sk-12-domain-error gate (excl. tests, scan Promise.reject + return new Error)

☑ Workstream F — Elimination & Consolidation (Day 7–8)
  ☑ F1  Unify elimination routing → consolidation.elimination_journals
  ☑ F2  Add sourceType + sourceRefId to elimination schema
  ☑ F3  Add unique constraint uq__elimination_journals__org_period_source_ref
  ☑ F4  Fix ownership threshold (>50 / 20-50 / <20)
  ☑ F5  Fix empty elimination intent in updateGroupOwnership
  ☑ F6  Generate migration for elimination schema change
  ☑ F7  Add contract test: single query + duplicate rejection

☑ Workstream G — CI Gate Hardening (Day 8–9)
  ☑ G1  Add far-registry-coherence gate (with IC key + index assertion)
  ☑ G2  Enhance sk-04 for SHARED_KERNEL completeness (sk-registry-completeness.test.ts)
  ☑ G3  Add g-int-01 integration coverage floor gate

☐ Verification
  ☐ pnpm turbo test --filter=./business-domain/finance/*
  ☐ pnpm vitest run -c vitest.mcp.config.ts
  ☐ pnpm turbo type-check --filter=./business-domain/finance/*
  ☐ pnpm test:db-contracts (local DB contract tests)
  ☐ pnpm vitest run -c business-domain/finance/vitest.integration.config.ts
  ☐ pnpm turbo lint --filter=./business-domain/finance/*
  ☐ AIS benchmark gate — maintain 280/280
  ☐ All RG-01 → RG-25 pass
```

---

## 13) Architecture Decisions Log

Decisions made during plan synthesis. Reference these when implementing.

| #     | Decision                                                          | Rationale                                                                                                                                                                                                                                                       |
| ----- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AD-01 | **SHA-256 + canonical fingerprint** for derivation idempotency    | SHA-256 preserves deterministic replay. Canonical fingerprint (sorted keys, stable JSON, normalized numerics) prevents "false non-idempotency" from serialization variance. 32 hex (128 bits) over 20 hex for operational safety.                               |
| AD-02 | **Testcontainers over Neon branching** for DB contract tests      | Testcontainers is deterministic and offline-capable. Neon branching depends on network + API key availability, creating flaky CI.                                                                                                                               |
| AD-03 | **Unify eliminations into `consolidation.elimination_journals`**  | Single audit trail > query flexibility. Auditors need one table. Add `sourceType` discriminator for IC vs consolidation vs translation.                                                                                                                         |
| AD-04 | **Remove `moneyDocumentColumns`** (not adopt)                     | Individual helpers are more explicit. Decision already documented in `erpnext.md`. Dead code should not persist.                                                                                                                                                |
| AD-05 | **130 as canonical package count**                                | `architecture.domain.md` has full breakdown (80+39+11). Root ARCHITECTURE.md "116" is stale.                                                                                                                                                                    |
| AD-06 | **Decimal.js + explicit rounding contract for all FX arithmetic** | Consistency with existing `fx-convert.ts`. JS `number` (IEEE 754) has 15–17 sig digits — insufficient for rate×rate×amount chains. `FX_RATE_SCALE=10`, `ROUNDING_MODE=ROUND_HALF_UP` prevents cross-calculator drift.                                           |
| AD-07 | **Configurable consolidation thresholds**                         | IFRS 10/11, IAS 28 require: >50% full consolidation, 20–50% equity method, <20% fair value. Hardcoding 50% violates standards.                                                                                                                                  |
| AD-08 | **Zero threshold for balance violations**                         | Current threshold of 5 in `far-posting-balanced.test.ts` masks regressions. Journal balance is non-negotiable — zero tolerance.                                                                                                                                 |
| AD-09 | **Period close via trigger sync** (not schema merge)              | Two tables serve different purposes: `fiscal_periods` = range definitions, `posting_periods` = per-ledger status. Merge would lose multi-ledger independent closing. Trigger fires only on `false→true` transition with idempotent update to prevent recursion. |
| AD-10 | **Integration test ratchet** (floor increases quarterly)          | Forcing all 37 packages to have integration tests immediately is impractical. Ratchet ensures progressive expansion.                                                                                                                                            |
| AD-11 | **Role-based RLS testing** (not just orgId filter)                | Tests must use actual DB roles (`app_user`, `app_admin`) with `FORCE ROW LEVEL SECURITY` to prove RLS cannot be bypassed by crafted SQL. OrgId-only filtering is insufficient.                                                                                  |
| AD-12 | **Elimination unique constraint** per run                         | `uq__elimination_journals__org_period_source_ref` on `(org_id, period_key, source_type, source_ref_id)` prevents duplicate eliminations. `sourceRefId` enables traceability back to IC doc / consolidation run.                                                 |
| AD-13 | **AST-based FX gate** over regex                                  | Regex scanning for arithmetic operators produces excessive false positives on non-rate math (amounts, percentages). Lightweight TS AST parsing targets only rate-related identifiers.                                                                           |
| AD-14 | **Self-defending release gates** (RG-23–RG-25)                    | Migration safety, registry coverage drift, and deterministic intent payload gates prevent future engineers from shipping unsafe changes even without understanding finance risks.                                                                               |
