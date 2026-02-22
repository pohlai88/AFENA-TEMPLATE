# business-domain/ — Agent Rules

Hard-won lessons from Phase 1 + Phase 2 (type-check sweep across 37 finance packages). **Read this entire file before creating or modifying any domain package.**

Last updated: 2026-02-22

---

## Part A — Setup & Tooling

### A1. Package Naming — `afenda-` (with `d`)

All workspace packages use the `afenda-` prefix. Verify before committing:

```bash
grep -r "afena-" src/   # must return nothing
```

### A2. pnpm Workspace Glob

Domain packages live two levels deep. The glob `'business-domain/*/*'` in `pnpm-workspace.yaml` covers all families. Do not add per-family entries.

### A3. Vitest Resolution

Every domain `vitest.config.ts` must use `resolve.alias` for workspace packages and a stub `DATABASE_URL`:

```ts
import { createFinanceConfig } from '../vitest.base';
export default createFinanceConfig(__dirname, 'afenda-<name>');
```

The shared `vitest.base.ts` handles aliases, env stubs, and coverage config.

### A5. ESLint — Test Files and `disableTypeChecked`

Domain package tsconfigs exclude `**/*.test.*` and `**/*.spec.*` (correct — tests shouldn't compile into dist). The shared `domain.js` ESLint preset applies `tseslint.configs.disableTypeChecked` for test files, which:

- **Disables** type-checked rules (`require-await`, `no-floating-promises`, etc.)
- **Keeps** non-type-checked rules (`import/order`, `no-restricted-syntax`, `no-console`)

Do NOT add test files to ESLint `ignores`. Do NOT use `allowDefaultProject` (8-file limit, perf hit).
See `packages/eslint-config/domain.js` RULE-08.

### A4. Running Tests

```bash
# Single package
pnpm vitest run --project afenda-receivables

# Type-check single package
pnpm --filter afenda-receivables exec tsc --noEmit

# Type-check ALL finance packages (the sweep command)
pnpm --filter "./business-domain/finance/**" exec tsc --noEmit
```

Never use `pnpm --filter` for running tests — use Vitest `--project` flags.

---

## Part B — Canon Contract Rules

### B0. Import from the Right Sub-Path

Canon provides family-specific sub-path exports. Always use the narrowest path:

```ts
// Shared types (all domain families)
import type { DomainContext, DomainResult } from 'afenda-canon/domain';
import { asCompanyId, stableCanonicalJson } from 'afenda-canon/domain';

// Finance-specific payloads + ports
import type { JournalPostPayload, LedgerControlPort } from 'afenda-canon/domain/finance';

// Future families:
// import type { PayrollRunPayload } from 'afenda-canon/domain/hr';
// import type { WorkOrderPayload } from 'afenda-canon/domain/manufacturing';
// import type { PurchaseOrderPayload } from 'afenda-canon/domain/supply-chain';
```

Never import from the root `'afenda-canon'` barrel in domain packages — it pulls in schemas, validators, registries, and lite-meta that domain code doesn't need.

### B1. Intent Payloads Must Exist in Canon FIRST

Before a domain package can return a `DomainIntent`, its payload type **must** exist in `packages/canon/src/types/domain-intent.ts` and the variant must be in the `DomainIntentVariant` union. Never cast to `DomainIntent` — the discriminated union will reject it.

When adding a new payload, also re-export it from `packages/canon/src/domain/<family>.ts`.

### B2. Every Required Field Must Be Supplied

Canon payload types are the **source of truth**. If canon says `effectiveAt: string` is required, every service that builds that intent must supply it. Common missing fields from the sweep:

- **`effectiveAt`** — required on `JournalPostPayload`, `AcctDeriveCommitPayload`, `GlReclassRunPayload`, `GlAllocationRunPayload`, `GlAccrualRunPayload`, `FiEirAccrualPayload`, `ExpenseReimbursePayload`, `TpPriceComputePayload`, `HedgeOciReclassPayload`
- **`generatedAt`** — required on `StatementArtifact` / `ReportSnapshot`

**Rule:** When adding a new field to a canon payload, immediately grep all consumers and update them. Do not merge the canon change without updating all callers.

### B3. Union Types Must Match Canon Exactly

Service input types must use the **exact same union** as the canon payload. Never widen to `string`.

```ts
// WRONG — widens the union, tsc won't catch invalid values
reason: string;

// CORRECT — matches BorrowCostCeasePayload exactly
reason: 'completed' | 'suspended' | 'abandoned';
```

Packages fixed in the sweep: `borrowing-costs`, `employee-benefits`, `share-based-payment`, `investment-property`.

### B4. `exactOptionalPropertyTypes` — Conditional Spread

The monorepo enables `exactOptionalPropertyTypes`. Passing `undefined` to an optional field is a type error. Use conditional spread:

```ts
// WRONG — TS2379 when input.cguId is undefined
buildImpairmentTestIntent({ assetId, cguId: input.cguId, ... });

// CORRECT
buildImpairmentTestIntent({
  assetId,
  ...(input.cguId != null ? { cguId: input.cguId } : {}),
  ...
});
```

Packages fixed: `deferred-tax`, `government-grants`, `impairment-of-assets`, `lease-accounting`, `provisions`, `treasury`, `withholding-tax`, `financial-close`.

### B5. Sync vs Async Service Functions

If a service function only builds intents from input (no `await` expressions), it **must** be synchronous. ESLint `require-await` enforces this.

```ts
// WRONG — async with no await triggers require-await
export async function createAndMirrorIc(
  _db: DbSession, _ctx: DomainContext, input: { ... },
): Promise<DomainResult> { ... }

// CORRECT — sync when no DB reads needed
export function createAndMirrorIc(
  _db: DbSession, _ctx: DomainContext, input: { ... },
): DomainResult { ... }
```

Callers that previously `await`ed the function must be updated to call it synchronously. Test files must also drop `async`/`await`.

### B6. Bidirectional IC Mirroring (M-04b)

`createAndMirrorIc` emits **two** `ic.mirror` intents (sender + receiver) with distinct idempotency keys. The `IcMirrorPayload` type is in canon. When adding new bidirectional intent patterns, follow this model:

```ts
return {
  kind: 'intent',
  intents: [
    buildIcMirrorIntent({ ...shared, side: 'sender' }, stableCanonicalJson({ ...senderKey })),
    buildIcMirrorIntent({ ...shared, side: 'receiver' }, stableCanonicalJson({ ...receiverKey })),
  ],
};
```

### B7. Branded Types at Adapter Boundaries

Port interfaces (`LedgerControlPort`, `DocumentNumberPort`) use branded types (`OrgId`, `LedgerId`, `CompanyId`, `FiscalPeriodKey`). Adapter implementations must:

1. Accept branded types in method signatures (matching the port)
2. Use `as*()` coercion helpers from canon when converting DB strings to branded return types
3. Never use bare `string` where the port specifies a branded type

```ts
// Adapter return — coerce DB strings to branded types
return {
  ledgerId: asLedgerId(row.ledgerId),
  companyId: asCompanyId(row.companyId ?? ''),
  periodKey: asFiscalPeriodKey(`${row.fiscalYear}-${row.periodNumber}`),
};
```

---

## Part C — Database Query Rules

### C1. Always Use `db.read()` Wrapper

`DbSession` does not expose `.select()` directly. All queries must go through the `db.read()` callback:

```ts
// WRONG — TS2339: Property 'select' does not exist on type 'DbSession'
const rows = await db.select().from(table).where(...);

// CORRECT
const rows = await db.read((tx) =>
  tx.select().from(table).where(...),
);
```

Packages fixed in the sweep: `financial-instruments`, `hedge-accounting`, `intangible-assets`, `provisions`.

### C2. Read Model Types Must Match DB Schema

Read model interfaces must match the actual Drizzle column types. Common mismatch: DB has `text('period_number')` but read model declares `periodNumber: number`.

**Rule:** When defining a read model, check the Drizzle schema column type. `text()` → `string`, `integer()` → `number`, `boolean()` → `boolean`.

### C3. Drizzle Comparison Operators — Column First

```ts
eq(column, value); // not eq(value, column)
lte(column, value); // not lte(value, column)
```

### C4. Unused Parameters — Prefix with `_`

```ts
export async function myService(
  _db: DbSession,    // unused until table exists
  _ctx: DomainContext,
  input: { ... },
): Promise<DomainResult> { ... }
```

### C5. Elimination Journals — Unified Routing (M-09)

All elimination entries route to `elimination_journals` (not `journal_lines`). The `source_type` discriminator distinguishes origin:

| `source_type`              | Origin                                  |
| -------------------------- | --------------------------------------- |
| `ic_elimination`           | IC matching/netting                     |
| `consolidation_adjustment` | Group consolidation runs                |
| `translation`              | FX translation of subsidiary financials |
| `ownership_change`         | `updateGroupOwnership`                  |

Unique constraint `(org_id, period_key, source_type, source_ref_id)` prevents duplicates (AD-12).

In the domain-intent-registry, `ic.eliminate` now targets `consolidation.elimination_journals` (not `accounting.journal_lines`).

---

## Part D — tsconfig & Build Rules

### D1. Domain Packages Are Library Packages

Every domain package must have `composite: true` in `tsconfig.json` and a `tsconfig.build.json` escape hatch for tsup. See root `AGENT.md` user rules for the full template.

### D2. Non-Existent Exports

Never export a type that doesn't exist in the source module:

```ts
// WRONG — TaxAdjustIntent was never defined
export type { TaxAdjustIntent, TaxAdjustPayload } from './commands/tax-intent';

// CORRECT
export type { TaxAdjustPayload } from './commands/tax-intent';
```

---

## Part E — New Domain Package Checklist

When creating a new domain package at `business-domain/<family>/<name>`:

- [ ] `package.json` — name `afenda-<name>`, deps use `afenda-` prefix, use catalog versions
- [ ] `tsconfig.json` — `composite: true`, extends `afenda-typescript-config/react-library.json`
- [ ] `tsconfig.build.json` — `composite: false` escape hatch for tsup
- [ ] `tsup.config.ts` — `tsconfig: './tsconfig.build.json'`
- [ ] `eslint.config.js` — ignores `dist/**` and `*.config.*` first
- [ ] `vitest.config.ts` — use `createFinanceConfig()` from shared base
- [ ] `src/index.ts` — barrel exports only (no logic)
- [ ] Root `tsconfig.json` — add to `references` array
- [ ] `DOMAIN_PACKAGE_COUNT` in canon taxonomy — increment by 1
- [ ] New intent types — add to `domain-intent.ts` union in canon **before** using in domain code
- [ ] **Type-check** — run `pnpm --filter afenda-<name> exec tsc --noEmit` before committing
- [ ] **All canon payload fields supplied** — grep the payload type and verify every required field
- [ ] **No `exactOptionalPropertyTypes` violations** — use conditional spread for all optional fields
- [ ] **`db.read()` wrapper** — never call `db.select()` directly

---

## Part F — Integration Tests

### F1. Pattern

```ts
import {
  describeIntegration,
  mockDbSession,
  testCtx,
} from '../../../test-utils/integration-helper';

describeIntegration('MyPackage', () => {
  const db = mockDbSession();
  const ctx = testCtx();

  it('returns expected kind', async () => {
    const result = await myService(db, ctx, input);
    expect(result.kind).toBe('read');
    if (result.kind === 'read') expect(result.data).toBeDefined();
  });
});
```

### F2. Rules

- Integration test files: `*.integration.test.ts`
- Always use `mockDbSession()` — neon-http has no transaction support
- `DomainResult` is a discriminated union — narrow `kind` before accessing `.data` or `.intents`
- IDE "Cannot find module" errors for `afenda-canon`/`afenda-database` are known noise — they resolve at runtime via vitest aliases

---

## Part G — Common Type-Check Error Patterns

Quick reference for the most frequent errors found across the 37-package sweep:

| Error                                                   | Root Cause                                     | Fix                                                  |
| ------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `TS2741: Property 'X' is missing`                       | Canon payload added a required field           | Add the field to the service call                    |
| `TS2379: exactOptionalPropertyTypes`                    | Passing `undefined` to optional prop           | Use conditional spread `...(v != null ? {k:v} : {})` |
| `TS2322: Type 'string' not assignable to union`         | Service input is `string`, canon expects union | Narrow the input type to match canon                 |
| `TS2339: Property 'select' does not exist on DbSession` | Calling `db.select()` directly                 | Wrap in `db.read((tx) => tx.select()...)`            |
| `TS2551: Did you mean 'X'?`                             | Property name mismatch vs canon                | Rename to match the canon payload field              |
| `TS6133: 'X' is declared but never read`                | Unused variable/parameter                      | Prefix with `_` or use `void expr`                   |
| `TS2724: has no exported member`                        | Exporting a non-existent type                  | Remove the phantom export                            |
| `TS2345: not assignable to branded type`                | Plain `string` where branded type expected     | Use `as*()` coercion at adapter boundary             |
| `require-await`                                         | `async` function with no `await`               | Remove `async` + `Promise<>` wrapper; update callers |
| `not found by the project service`                      | Test file excluded from tsconfig               | Already handled by `disableTypeChecked` in domain.js |
| `no-non-null-assertion`                                 | Using `rows[0]!` after length check            | Extract to `const row = rows[0]; if (!row) throw`    |
