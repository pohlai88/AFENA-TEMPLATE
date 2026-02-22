# afenda-inventory-valuation

> **Domain:** Finance · **Standard:** IAS 2 — Inventories  
> **Layer:** 2 (Business Domain)  
> **Gate:** FIN-INV-VAL-01 — Inventory valuation events post to GL and reconcile

---

## Purpose

Inventory costing, NRV (Net Realisable Value) testing, and period-end
valuation aligned with IAS 2. Provides calculators for cost computation,
commands for intent creation, queries against the `inventory_valuation_items`
schema table, and service orchestration for valuation runs.

## Exports

| Category    | Functions                                               |
| ----------- | ------------------------------------------------------- |
| Queries     | `getInventoryValuation`, `listByItem`, `listByPeriod`   |
| Calculators | `computeInventoryCost`, `testNrv`                       |
| Commands    | `buildInventoryCostingIntent`, `buildNrvAdjustIntent`   |
| Services    | `valueInventory`, `adjustNrv`, `postValuationBatchToGl` |

## Schema

Database table: **`inventory_valuation_items`** (defined in `packages/database`)

Key columns: `item_id`, `period_key` (YYYY-MM), `cost_method`
(WEIGHTED_AVG | FIFO | SPECIFIC), `unit_cost`, `total_cost`, `nrv`,
`nrv_write_down`, `carrying_amount`.

RLS-enabled with `auth.org_id()::uuid` policy.

## Scripts

```bash
pnpm test          # run unit tests (vitest)
pnpm test:watch    # watch mode
pnpm type-check    # tsc --noEmit
pnpm lint          # eslint
```

## Directory Structure

```
src/
├── calculators/   inventory-calc.ts
├── commands/      inventory-intent.ts
├── queries/       inventory-query.ts
├── services/      inventory-service.ts
├── __tests__/     inventory-query.test.ts
└── index.ts       barrel
```

## Dependencies

- `afenda-canon` — shared types (Result, ERP entity columns)
- `afenda-database` — Drizzle schema + DbSession
- `afenda-logger` — structured logging
