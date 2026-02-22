# Finance Domain

**37 packages** implementing the complete financial management layer of AFENDA-NEXUS.

> Layer 2 (Domain Services) — depends on `afenda-canon` and `afenda-database`.
> Consumed by `afenda-crud` (Layer 3) and `apps/web`.

---

## Package Map

### Core Ledger & GL (4)

| Package          | IFRS | Key Functions                                                   |
| ---------------- | ---- | --------------------------------------------------------------- |
| `accounting`     | —    | `postJournalEntry`, `reverseEntry`, `trialBalance`              |
| `gl-platform`    | —    | `openPeriod`, `closePeriod`, `publishCoA`                       |
| `accounting-hub` | —    | `deriveJournalLines`, `reclassify`, `allocate`, `accrue`        |
| `intercompany`   | —    | `createAndMirrorIc`, `reconcileIntercompany`, `reconcileFromDb` |

### Sub-Ledgers (6)

| Package                | Key Functions                                |
| ---------------------- | -------------------------------------------- |
| `payables`             | `postApInvoice`, `approvePaymentRun`         |
| `receivables`          | `postArInvoice`, `allocatePayment`           |
| `revenue-recognition`  | `recognizeRevenue`, `deferRevenue` (IFRS 15) |
| `subscription-billing` | `generateInvoice`, `renewalForecast`         |
| `expense-management`   | `submitExpense`, `reimburse`                 |
| `project-accounting`   | `projectCost`, `wipValuation`                |

### Asset & Liability (3)

| Package             | IFRS    | Key Functions                                           |
| ------------------- | ------- | ------------------------------------------------------- |
| `fixed-assets`      | IAS 16  | `calculateDepreciation`, `disposeAsset`, `revalueAsset` |
| `lease-accounting`  | IFRS 16 | `calculateLiability`, `rightOfUseAsset`, `modifyLease`  |
| `intangible-assets` | IAS 38  | `capitalise`, `amortise`, `impair`                      |

### Treasury & FX (4)

| Package               | Key Functions                               |
| --------------------- | ------------------------------------------- |
| `treasury`            | `cashPosition`, `cashTransfer`              |
| `fx-management`       | `lookupFxRate`, `revalueFxBalance` (IAS 21) |
| `bank-reconciliation` | `matchStatementLine`, `closeReconciliation` |
| `credit-management`   | `checkCreditLimit`, `evaluateSoD`           |

### Tax & Transfer Pricing (3)

| Package            | Key Functions                                      |
| ------------------ | -------------------------------------------------- |
| `tax-engine`       | `calculateLineTax`, `resolveTaxRate`, `saftExport` |
| `withholding-tax`  | `computeWht`, `issueCertificate`, `remitWht`       |
| `transfer-pricing` | `computeArmLengthPrice`, `publishPolicy` (OECD TP) |

### Consolidation & Close (3)

| Package                  | IFRS    | Key Functions                                                              |
| ------------------------ | ------- | -------------------------------------------------------------------------- |
| `consolidation`          | IFRS 10 | `translateCurrency`, `eliminateIc`, `updateGroupOwnership`                 |
| _(elimination_journals)_ | AD-03   | Unified elimination routing table (M-09) — ic/consol/translation/ownership |
| `financial-close`        | —       | `closeChecklist`, `postAdjustment`, `generateClosePack`                    |
| `statutory-reporting`    | IAS 1   | `renderStatement`, `buildStatementArtifact`, `runReportSnapshot`           |

### Planning & Costing (2)

| Package           | Key Functions                                    |
| ----------------- | ------------------------------------------------ |
| `budgeting`       | `createBudget`, `budgetVariance`, `commitBudget` |
| `cost-accounting` | `allocateCost`, `varianceAnalysis`               |

### IFRS Packages (12)

| Package                 | Standard  | Key Functions                                                |
| ----------------------- | --------- | ------------------------------------------------------------ |
| `provisions`            | IAS 37    | `recognise`, `utilise`, `reverse`, `discount`                |
| `financial-instruments` | IFRS 9    | `classifyInstrument`, `computeEir`, `computeFvChange`        |
| `hedge-accounting`      | IFRS 9 §6 | `designateHedge`, `testEffectiveness`, `reclassOci`          |
| `deferred-tax`          | IAS 12    | `calculateTemporaryDifferences`, `computeDeferredTax`        |
| `impairment-of-assets`  | IAS 36    | `testImpairment`, `recogniseImpairment`, `reverseImpairment` |
| `inventory-valuation`   | IAS 2     | `computeNrv`, `costingMethod`, `nrvAdjust`                   |
| `government-grants`     | IAS 20    | `recogniseGrant`, `amortiseGrant`                            |
| `biological-assets`     | IAS 41    | `measureFairValue`, `harvestTransfer`                        |
| `investment-property`   | IAS 40    | `measureProperty`, `transferProperty`                        |
| `employee-benefits`     | IAS 19    | `accrueBenefitCost`, `remeasurePlan`                         |
| `borrowing-costs`       | IAS 23    | `capitaliseBorrowingCost`, `ceaseBorrowingCost`              |
| `share-based-payment`   | IFRS 2    | `grantAward`, `vestAward`, `recogniseSbpExpense`             |

---

## Architecture

```
business-domain/finance/<package>/
├── src/
│   ├── calculators/     Pure functions (no DB, no side effects)
│   ├── commands/        Intent builders (build*Intent functions)
│   ├── queries/         Drizzle read queries (db.read() wrapper)
│   ├── services/        Orchestration (db + ctx + input → DomainResult)
│   ├── adapters/        Port implementations (branded type boundaries)
│   └── index.ts         Barrel exports
├── tsconfig.json        composite: true (library package)
├── tsconfig.build.json  composite: false (tsup escape hatch)
├── tsup.config.ts       tsconfig: './tsconfig.build.json'
├── vitest.config.ts     uses createFinanceConfig() from vitest.base.ts
└── package.json         afenda-<name>, workspace deps
```

### Service Function Contract

Every service function follows this signature:

```ts
// Sync (pure domain logic — no DB reads)
export function myService(
  _db: DbSession,
  _ctx: DomainContext,
  input: { ... },
): DomainResult { ... }

// Async (needs DB reads)
export async function myService(
  db: DbSession,
  ctx: DomainContext,
  input: { ... },
): Promise<DomainResult> { ... }
```

- **`db`** — Drizzle session; queries use `db.read((tx) => tx.select()...)`
- **`ctx`** — Tenant context (`orgId`, `companyId`, `currency`, `actor`, `asOf`)
- **`input`** — Typed input; union types must match canon payload exactly
- **Returns** — `{ kind: 'read', data }` | `{ kind: 'intent', intents }` | `{ kind: 'intent+read', data, intents }`
- **Sync vs Async** — If a service only builds intents from input (no `await`), make it sync. ESLint `require-await` enforces this.

### Intent Flow

```
Service → buildXxxIntent(payload) → DomainIntent → Layer 3 (crud) persists
```

Payload types are defined in `packages/canon/src/types/domain-intent.ts` and re-exported from `packages/canon/src/domain/finance.ts`. Import from the sub-path:

```ts
import type { DomainContext, DomainResult } from 'afenda-canon/domain';
import type { JournalPostPayload, LedgerControlPort } from 'afenda-canon/domain/finance';
import { stableCanonicalJson } from 'afenda-canon/domain';
```

Every required field must be supplied — no partial payloads.

---

## Development

### Type-Check

```bash
# Single package
pnpm --filter afenda-accounting exec tsc --noEmit

# All 37 finance packages
pnpm --filter "./business-domain/finance/**" exec tsc --noEmit
```

### Tests

```bash
# Unit tests (single package)
pnpm vitest run --project afenda-accounting

# Integration tests
pnpm vitest run --config business-domain/finance/vitest.integration.config.ts
```

### Lint

```bash
# Single package
pnpm turbo lint --filter=afenda-intercompany

# All finance packages
pnpm turbo lint --filter="./business-domain/finance/**"
```

Test files (`*.test.*`, `*.spec.*`) are excluded from tsconfig but still linted.
Type-checked rules are disabled for them via `tseslint.configs.disableTypeChecked`
in `packages/eslint-config/domain.js` (RULE-08).

### Shared Config

All 37 packages use `vitest.base.ts` for shared vitest configuration:

```ts
import { createFinanceConfig } from '../vitest.base';
export default createFinanceConfig(__dirname, 'afenda-accounting');
```

---

## Key Rules

1. **Canon first** — Add intent payload types to canon before using them in domain code
2. **`exactOptionalPropertyTypes`** — Use conditional spread for optional fields: `...(v != null ? {k:v} : {})`
3. **Union types** — Match canon exactly; never widen to `string`
4. **`db.read()` wrapper** — Never call `db.select()` directly on `DbSession`
5. **Branded types** — Use `as*()` helpers at adapter boundaries; never bare `string`
6. **Read models** — Match Drizzle schema column types (`text()` → `string`, not `number`)
7. **Unused params** — Prefix with `_` (e.g., `_db: DbSession`)
8. **No cross-domain imports** — Packages never import each other; Layer 3 orchestrates

See `business-domain/AGENT.md` for the complete rule set with examples.

---

## Database Migrations

| Migration                           | Description                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `0003_sync_fiscal_period_close.sql` | M-08: `sync_fiscal_period_close` trigger (fiscal_periods → posting_periods hard-close sync) |
| `0003_sync_fiscal_period_close.sql` | M-09: `elimination_journals` table + unique constraint + RLS                                |

### Key Schema: `elimination_journals` (M-09)

Unified elimination routing — all IC eliminations, consolidation adjustments, FX translation, and ownership changes route here. Single audit trail per AD-03.

- **`source_type`** discriminator: `ic_elimination`, `consolidation_adjustment`, `translation`, `ownership_change`
- **`source_ref_id`** traceability ref back to source document/run
- **Unique constraint:** `(org_id, period_key, source_type, source_ref_id)` prevents duplicate eliminations (AD-12)

### Key Trigger: `sync_fiscal_period_close` (M-08)

Fires when `fiscal_periods.is_closed` transitions `false→true`. Updates matching `posting_periods` rows to `'hard-close'` (idempotent, multi-ledger scoped).

---

## CI Gates

| Gate   | Description                                                             |
| ------ | ----------------------------------------------------------------------- |
| CIG-01 | Domain error enforcement (ratchet: max 23 raw `Error` throws)           |
| CIG-02 | FX precision — no native float arithmetic on rate identifiers           |
| CIG-03 | Schema helpers — `fxRate()`, `moneyMinor()`, `currencyCode()` usage     |
| CIG-04 | Registry coherence — tenantPolicy, erpEntityColumns, tenantPk           |
| CIG-05 | Integration test coverage (ratchet: ≥5 packages with integration tests) |
| CIG-06 | SK registry completeness — intent types ↔ SK writes coherence           |

---

## Status

- **Type-check:** All 37 packages pass `tsc --noEmit` (2026-02-22)
- **Audit registry:** 23/23 requirements at 100% confidence
- **Core finance tests:** 134/134 (acct-hub 42, fx 36, ic 16, consol 40)
- **CI gates:** 34 enforcement points (31 vitest gate files + 3 scripts); 6 new finance gates (CIG-01–CIG-06, 20 tests) + updated fin-03 — all pass
- **Lint:** intercompany 0 errors; domain.js `disableTypeChecked` eliminates test file parsing errors across all 37 packages
