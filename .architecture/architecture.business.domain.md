# Business Domain Packages — Architecture Reference

> **Package family:** `afenda-*` (`business-domain/*`)
> **Layer:** 2 — Domain Services
> **Purpose:** 154 domain-specific packages implementing focused business logic, consumed by the CRUD kernel (Layer 3) and never importing from each other.
> **Cross-referenced against:** ERPNext v15 canon (~320 entities), Frappe HRMS v7 canon, SAP S/4HANA modules, Oracle Fusion Cloud ERP, Microsoft Dynamics 365, ARCHITECTURE.md

---

## 1. Architecture Overview

Business-domain packages occupy **Layer 2** in the 4-layer AFENDA-NEXUS architecture. They contain all focused business logic — calculations, lookups, validations, and domain rules — and are the primary extension point for ERP functionality.

```
┌─────────────────────────────────────────────────────────────────┐
│  Layer 3: Application Orchestration                             │
│  ┌──────────┐  ┌──────────────┐                                 │
│  │  crud    │  │ observability│  Calls domain logic, enforces   │
│  └──────────┘  └──────────────┘  policies, writes to DB        │
└─────────────────────────────────────────────────────────────────┘
                           ↑ imports from
┌─────────────────────────────────────────────────────────────────┐
│  Layer 2: Domain Services  ← YOU ARE HERE (145 packages)       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │accounting│ │   crm    │ │inventory │ │  payroll │  ...      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│  Pure business logic, domain rules, calculations                │
└─────────────────────────────────────────────────────────────────┘
                           ↑ imports from
┌─────────────────────────────────────────────────────────────────┐
│  Layer 1: Foundation                                            │
│  ┌────────┐  ┌──────────┐  ┌────────┐  ┌────┐                  │
│  │ canon  │  │ database │  │ logger │  │ ui │                  │
│  └────────┘  └──────────┘  └────────┘  └────┘                  │
└─────────────────────────────────────────────────────────────────┘
                           ↑ imports from
┌─────────────────────────────────────────────────────────────────┐
│  Layer 0: Configuration                                         │
│  ┌──────────────┐  ┌──────────────────┐                         │
│  │ eslint-config│  │ typescript-config│                         │
│  └──────────────┘  └──────────────────┘                         │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

- **Single Responsibility** — each package owns one coherent domain. No "utils" packages.
- **No Cross-Domain Imports** — domains never import from each other. Shared logic belongs in `canon` (types) or `database` (schemas).
- **No Upward Imports** — domains never import from `crud`, `workflow`, or `advisory` (Layer 3).
- **Public API Boundary** — only `src/index.ts` exports are public. All internal modules are private.
- **Zero Circular Dependencies** — the dependency graph is a strict DAG.

---

## 2. Multinational ERP Data Model

AFENDA-NEXUS is designed for **multinational, multi-company, holding-company, and listed-company** scenarios. Every business-domain package must respect the following data model.

### 2.1 Legal Entity Hierarchy

```
Org (tenant root — maps to org_id in RLS)
└── Holding Company
    ├── Operating Company A (legal_entity_id)
    │   ├── Site / Branch / Plant
    │   └── Cost Centre
    ├── Operating Company B (legal_entity_id)
    │   └── Site / Branch / Plant
    └── Subsidiary C (legal_entity_id)
        └── Site / Branch / Plant
```

- **`org_id`** — mandatory on every table; enforced by RLS via `auth.org_id()`. Represents the tenant (top-level group).
- **`legal_entity_id`** — optional second scope for multi-company books. Domains that are company-specific (accounting, payroll, tax) MUST filter by `legal_entity_id`.
- **`site_id`** — optional third scope for plant/warehouse/branch-level data.

### 2.2 Multi-Currency

All monetary values are stored as **integer minor units** (e.g. cents, fils, sen) with an explicit `currency_code` column (ISO 4217). Never store floating-point money.

```typescript
// ✅ CORRECT — minor units + currency code
{ amountMinor: 10050, currencyCode: 'MYR' }  // MYR 100.50

// ❌ WRONG — floating point
{ amount: 100.50 }
```

FX rate lookup is provided by `afenda-fx-management`. All cross-currency calculations must go through it.

### 2.3 Multi-GAAP / Dual-Book

Large enterprises maintain parallel ledgers for different accounting standards (IFRS, US GAAP, local statutory). The `Finance Book` pattern (from ERPNext) is adopted:

- A `finance_book_id` column on journal entries and asset depreciation schedules allows parallel posting.
- `afenda-accounting` handles the primary IFRS book.
- `afenda-statutory-reporting` handles local GAAP adjustments.
- `afenda-consolidation` aggregates across books and eliminates intercompany.

### 2.4 Consolidation & Eliminations

```
Group Consolidation (afenda-consolidation)
├── Intercompany netting (afenda-intercompany)
├── IC compliance & policy (afenda-intercompany-governance)
├── Transfer pricing documentation (afenda-transfer-pricing)
└── Statutory reports per entity (afenda-statutory-reporting)
```

Elimination entries are generated by `afenda-intercompany` and posted via the CRUD kernel. No domain package writes directly to the GL.

### 2.5 Transfer Pricing (BEPS/OECD)

- `afenda-transfer-pricing` — arm's-length pricing, TP documentation (master file, local file, CbCR data feed).
- `afenda-tax-compliance` — Country-by-Country Reporting (CbCR), BEPS Action 13.
- `afenda-tax-engine` — WHT, VAT/GST determination per jurisdiction.

### 2.6 Listed Company / Capital Markets

Domains specific to publicly listed entities:

| Domain                     | Package                           | Requirement                       |
| -------------------------- | --------------------------------- | --------------------------------- |
| `cap-table-management`     | `afenda-cap-table-management`     | Share register, dilution, options |
| `sec-reporting`            | `afenda-sec-reporting`            | 10-K, 10-Q, 8-K filings           |
| `stock-based-compensation` | `afenda-stock-based-compensation` | ASC 718 / IFRS 2 equity comp      |
| `dividend-management`      | `afenda-dividend-management`      | Dividend declaration, payment     |
| `shareholder-portal`       | `afenda-shareholder-portal`       | Investor self-service             |
| `esg-reporting`            | `afenda-esg-reporting`            | GRI/SASB/TCFD/CSRD disclosure     |
| `strategic-planning`       | `afenda-strategic-planning`       | OKRs, balanced scorecard          |

### 2.7 Shared Services Centre (SSC) Model

The SSC model allows one entity to provide services to all group companies:

| SSC Service         | Domain Package                               |
| ------------------- | -------------------------------------------- |
| Group treasury      | `afenda-treasury` + `afenda-cash-pooling`    |
| Group procurement   | `afenda-group-purchasing`                    |
| Group payroll       | `afenda-payroll` (multi-entity payroll runs) |
| Group payments      | `afenda-payments-orchestration`              |
| Shared services ops | `afenda-shared-services-management`          |

### 2.8 Regulatory Compliance by Jurisdiction

| Requirement                               | Domain Package                   |
| ----------------------------------------- | -------------------------------- |
| E-invoicing (MyInvois, Peppol, FatturaPA) | `afenda-e-invoicing-ctc`         |
| Regulatory filings                        | `afenda-regulatory-reporting`    |
| Regulatory change monitoring              | `afenda-regulatory-intelligence` |
| GDPR/PDPA                                 | `afenda-privacy-management`      |
| FCPA/UK Bribery Act                       | `afenda-anti-bribery-corruption` |
| EDI (EDIFACT, X12, Peppol BIS)            | `afenda-edi-integration`         |

---

## 3. Dependency Rules

### 3.1 Allowed Dependencies

Every business-domain package MAY depend on:

| Dependency        | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `afenda-canon`    | Types, Zod schemas, enums, error codes                   |
| `afenda-database` | Drizzle table schemas, query helpers                     |
| `afenda-logger`   | Structured logging (Pino)                                |
| `drizzle-orm`     | Query builder (`eq`, `and`, `lte`, etc.)                 |
| `zod`             | Input validation schemas                                 |
| External npm      | `decimal.js`, `date-fns`, `lodash`, domain-specific libs |

### 3.2 Forbidden Dependencies

| Forbidden                           | Reason                                                          |
| ----------------------------------- | --------------------------------------------------------------- |
| Other `business-domain/*` packages  | Prevents circular dependencies; shared logic belongs in `canon` |
| `afenda-crud`                       | Layer 3 — upward import violation                               |
| `afenda-workflow`                   | Layer 3 — upward import violation                               |
| Local type definitions (`./types/`) | Types must live in `afenda-canon`                               |
| `console.log` / `console.error`     | Use `afenda-logger` instead                                     |

### 3.3 Import Pattern Examples

```typescript
// ✅ CORRECT imports
import type { TaxRate, Invoice } from 'afenda-canon';
import { invoices, taxRates } from 'afenda-database';
import { eq, and, lte } from 'drizzle-orm';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { logger } from 'afenda-logger';

// ❌ WRONG — cross-domain import
import { checkCreditLimit } from 'afenda-crm';

// ❌ WRONG — upward layer import
import { mutate } from 'afenda-crud';

// ❌ WRONG — local type definition
import type { TaxRate } from './types/common';

// ❌ WRONG — console logging
console.log('Processing...');
```

---

## 4. Package Standards

Every business-domain package MUST follow these conventions exactly.

### 4.1 Directory Structure

```
business-domain/<domain-name>/
├── src/
│   ├── index.ts              # Public API — ONLY this file exports
│   ├── services/             # Business logic functions
│   │   ├── <service-a>.ts
│   │   └── <service-b>.ts
│   └── utils/                # Internal utilities (optional, not exported)
├── package.json
├── tsconfig.json
├── tsconfig.build.json       # tsup escape hatch (composite: false)
├── tsup.config.ts
├── eslint.config.js
└── README.md
```

### 4.2 `package.json` Template

```json
{
  "name": "afenda-<domain>",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*",
    "drizzle-orm": "catalog:",
    "zod": "catalog:"
  },
  "devDependencies": {
    "afenda-eslint-config": "workspace:^",
    "afenda-typescript-config": "workspace:*",
    "tsup": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

### 4.3 `tsconfig.json` (Leaf Package — NOT composite)

```jsonc
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "composite": false,
    "incremental": true,
    "declaration": true,
    "declarationMap": true,
    "noEmit": false,
    "outDir": "./dist",
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*", "**/*.spec.*", "*.config.*"],
}
```

### 4.4 `tsconfig.build.json` (tsup escape hatch)

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": false,
    "incremental": false,
    "tsBuildInfoFile": null,
  },
}
```

### 4.5 `tsup.config.ts`

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.build.json',
  external: ['afenda-canon', 'afenda-database', 'afenda-logger', 'drizzle-orm'],
});
```

### 4.6 `eslint.config.js`

```js
const baseConfig = require('afenda-eslint-config');

module.exports = [
  { ignores: ['dist/**', '*.config.*'] },
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
];
```

### 4.7 `src/index.ts` Pattern

```typescript
// Export business logic functions
export { calculateTax, lookupTaxRate } from './services/tax-calculation';
export { applyDiscount } from './services/discount';

// Re-export relevant types from canon (convenience)
export type { TaxRate, DiscountRule } from 'afenda-canon';

// ❌ NEVER export internal utilities
// export { formatAmount } from './utils/format'; // WRONG
```

---

## 5. Implementation Patterns

### 5.1 Pure Calculation (no database)

```typescript
// business-domain/accounting/src/services/tax-calculation.ts
export function calculateTax(amountMinor: number, rate: number): number {
  if (amountMinor < 0) throw new Error('Amount must be non-negative');
  if (rate < 0 || rate > 1) throw new Error('Rate must be between 0 and 1');
  return Math.round(amountMinor * rate);
}
```

### 5.2 Data Lookup (with database)

```typescript
import type { TaxRate } from 'afenda-canon';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { taxRates } from 'afenda-database';
import { eq, and, lte, desc } from 'drizzle-orm';
import { logger } from 'afenda-logger';

export async function lookupTaxRate(
  db: NeonHttpDatabase,
  orgId: string,
  taxCode: string,
  effectiveDate: Date,
): Promise<TaxRate | null> {
  const [rate] = await db
    .select()
    .from(taxRates)
    .where(
      and(
        eq(taxRates.orgId, orgId),
        eq(taxRates.taxCode, taxCode),
        lte(taxRates.effectiveFrom, effectiveDate),
      ),
    )
    .orderBy(desc(taxRates.effectiveFrom))
    .limit(1);

  if (!rate) {
    logger.warn({ taxCode, effectiveDate }, 'Tax rate not found');
    return null;
  }
  return rate;
}
```

### 5.3 Multinational-Aware Signatures

For domains that operate across legal entities, always include `legalEntityId` alongside `orgId`:

```typescript
export async function calculatePayroll(
  db: NeonHttpDatabase,
  orgId: string,
  legalEntityId: string,   // payroll is per legal entity
  currencyCode: string,    // entity's functional currency
  periodId: string
): Promise<PayrollResult> { ... }
```

### 5.4 Error Handling

```typescript
// Throw for validation failures
if (amount < 0) throw new Error('Amount must be non-negative');

// Return null for "not found"
const rate = await lookupTaxRate(db, orgId, taxCode, date);
if (!rate) return null;

// Log warnings for unexpected-but-recoverable states
logger.warn({ taxCode }, 'Tax rate not found, using zero rate');
```

### 5.5 Usage in CRUD (Layer 3)

```typescript
// packages/crud/src/handlers/invoices.ts
import { calculateTax, lookupTaxRate } from 'afenda-accounting';
import { invoices } from 'afenda-database';

export async function createInvoice(db, orgId, legalEntityId, data) {
  const taxRate = await lookupTaxRate(db, orgId, data.taxCode, data.invoiceDate);
  const taxMinor = calculateTax(data.subtotalMinor, taxRate?.rate ?? 0);
  const [invoice] = await db
    .insert(invoices)
    .values({
      orgId,
      legalEntityId,
      subtotalMinor: data.subtotalMinor,
      taxMinor,
      totalMinor: data.subtotalMinor + taxMinor,
      currencyCode: data.currencyCode,
    })
    .returning();
  return invoice;
}
```

---

## 6. Domain Catalog — 154 Domains across 11 Business Classes

> **Legend:** ★ = Critical for multinational/holding/listed company ERP | ✦ = New domain added via ERPNext/HRMS cross-reference | ✦✦ = New domain added via SAP/Oracle/D365 industry benchmark

---

### Class A — Financial Management (31 domains)

Core accounting, treasury, tax, closing, and financial reporting.

| Domain                        | Package                           | Description                                                                               | MNC |
| ----------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- | --- |
| `accounting`                  | `afenda-accounting`               | Tax calculation, FX, journal entries, GL                                                  | ★   |
| `bank-reconciliation` ✦       | `afenda-bank-reconciliation`      | Automated bank statement matching, clearance, reconciliation tool                         | ★   |
| `budgeting`                   | `afenda-budgeting`                | Budget planning, control, monthly distribution                                            | ★   |
| `cash-pooling`                | `afenda-cash-pooling`             | Notional and physical cash pooling across entities                                        | ★   |
| `consolidation`               | `afenda-consolidation`            | Multi-level group consolidation, eliminations                                             | ★   |
| `cost-accounting` ✦           | `afenda-cost-accounting`          | Standard costing, cost centres, activity-based costing, variance analysis                 | ★   |
| `e-invoicing-ctc`             | `afenda-e-invoicing-ctc`          | E-invoicing & continuous transaction controls (MyInvois, Peppol, FatturaPA)               | ★   |
| `expense-management`          | `afenda-expense-management`       | Expense reports, approvals, reimbursement, policy enforcement                             |     |
| `financial-close`             | `afenda-financial-close`          | Period-end close orchestration, task checklists, sign-off                                 | ★   |
| `fixed-assets`                | `afenda-fixed-assets`             | Asset lifecycle, depreciation schedules, finance book, impairment                         | ★   |
| `forecasting`                 | `afenda-forecasting`              | Rolling financial forecasts, driver-based models                                          | ★   |
| `fx-management`               | `afenda-fx-management`            | FX rates, hedge accounting, revaluation, pegged currencies                                | ★   |
| `intercompany`                | `afenda-intercompany`             | IC transactions, netting, elimination entries                                             | ★   |
| `intercompany-governance`     | `afenda-intercompany-governance`  | IC compliance, policy enforcement, arm's-length validation                                | ★   |
| `investment-management`       | `afenda-investment-management`    | Portfolio and investment tracking, mark-to-market                                         | ★   |
| `invoice-discounting` ✦       | `afenda-invoice-discounting`      | Receivables factoring, invoice financing, discounted invoice tracking                     |     |
| `landed-cost-management` ✦    | `afenda-landed-cost-management`   | Freight/duty/insurance allocation to inventory cost                                       |     |
| `lease-accounting`            | `afenda-lease-accounting`         | IFRS 16 / ASC 842 lease accounting, ROU assets                                            | ★   |
| `payables`                    | `afenda-payables`                 | AP management, invoice matching, dunning, aging                                           | ★   |
| `payments-orchestration`      | `afenda-payments-orchestration`   | Payment runs, bank integration, payment orders                                            | ★   |
| `receivables`                 | `afenda-receivables`              | AR management, collections, credit limits, aging                                          | ★   |
| `revenue-recognition`         | `afenda-revenue-recognition`      | ASC 606 / IFRS 15 recognition schedules, deferred revenue                                 | ★   |
| `royalty-management`          | `afenda-royalty-management`       | IP/licensing royalty calculation and payments                                             |     |
| `statutory-reporting`         | `afenda-statutory-reporting`      | Multi-GAAP statutory reports, finance book adjustments                                    | ★   |
| `stock-based-compensation`    | `afenda-stock-based-compensation` | ASC 718 / IFRS 2 equity comp accounting, vesting schedules                                | ★   |
| `subscription-billing`        | `afenda-subscription-billing`     | Recurring billing, subscription plans, proration                                          |     |
| `tax-engine`                  | `afenda-tax-engine`               | VAT/GST, WHT, tax determination, tax rules by jurisdiction                                | ★   |
| `transfer-pricing`            | `afenda-transfer-pricing`         | Arm's-length pricing, TP documentation, master/local file, CbCR feed                      | ★   |
| `treasury`                    | `afenda-treasury`                 | Cash forecasting, banking, investments, bank guarantees                                   | ★   |
| `grants-management` ✦✦        | `afenda-grants-management`        | Grant lifecycle, fund allocation, budgeting, compliance reporting (SAP GM, Oracle Grants) | ★   |
| `joint-venture-accounting` ✦✦ | `afenda-joint-venture-accounting` | JV partner accounting, cost/revenue sharing, JV billing, audit (SAP JVA, Oracle JV Mgmt)  | ★   |

---

### Class B — Procurement & Supply Chain (19 domains)

Source-to-pay, inventory, logistics, and trade.

| Domain                   | Package                      | Description                                                                                      | MNC |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------ | --- |
| `consignment`            | `afenda-consignment`         | Consignment inventory management, vendor-owned stock                                             |     |
| `demand-planning` ✦      | `afenda-demand-planning`     | S&OP, demand sensing, sales forecasts, material request planning                                 | ★   |
| `export`                 | `afenda-export`              | Export documentation, controls, certificates of origin                                           | ★   |
| `global-trade`           | `afenda-global-trade`        | Import/export, customs, duties, incoterms, tariff numbers                                        | ★   |
| `group-purchasing`       | `afenda-group-purchasing`    | Group/co-op purchasing programs, volume aggregation                                              | ★   |
| `inventory`              | `afenda-inventory`           | Stock management, valuation (FIFO/AVCO/SL), reservations                                         | ★   |
| `procurement`            | `afenda-procurement`         | Requisitions, RFQ, supplier quotations, sourcing                                                 |     |
| `purchasing`             | `afenda-purchasing`          | Purchase orders, receipts, blanket orders                                                        |     |
| `rebate-mgmt`            | `afenda-rebate-mgmt`         | Supplier/customer rebate processing, accruals                                                    |     |
| `receiving`              | `afenda-receiving`           | Goods receipt, inspection, quality gate                                                          |     |
| `returns`                | `afenda-returns`             | Return merchandise authorisation (RMA), supplier returns                                         |     |
| `shipping`               | `afenda-shipping`            | Order fulfilment, dispatch, packing slips, delivery notes                                        |     |
| `subcontracting` ✦       | `afenda-subcontracting`      | Subcontracting orders, BOM, receipt of subcontracted goods                                       |     |
| `supplier-portal`        | `afenda-supplier-portal`     | Supplier self-service portal, invoice submission                                                 |     |
| `supplier-scorecard` ✦   | `afenda-supplier-scorecard`  | Vendor performance rating, scorecard periods, criteria                                           |     |
| `trade-compliance`       | `afenda-trade-compliance`    | Sanctions, embargo, dual-use checks, denied party screening                                      | ★   |
| `transportation`         | `afenda-transportation`      | TMS, freight, carrier management, delivery trips                                                 |     |
| `warehouse`              | `afenda-warehouse`           | WMS, bin locations, picking/packing, putaway rules                                               |     |
| `order-orchestration` ✦✦ | `afenda-order-orchestration` | Intelligent order routing, multi-channel fulfilment, ATP, order promising (Oracle IOM, D365 IOM) | ★   |

---

### Class C — Sales, Marketing & CX (16 domains)

Customer-facing revenue, marketing, and brand operations.

| Domain                      | Package                            | Description                                                                                             | MNC |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------- | --- |
| `advertising`               | `afenda-advertising`               | Ad campaign management, media planning                                                                  |     |
| `branding`                  | `afenda-branding`                  | Brand standards, assets, guidelines                                                                     |     |
| `channel-management` ✦      | `afenda-channel-management`        | Distributor/dealer management, sales partners, territory, channel incentives                            | ★   |
| `crm`                       | `afenda-crm`                       | Customer relationship management, leads, opportunities, prospects                                       |     |
| `customer-data-platform` ✦✦ | `afenda-customer-data-platform`    | Unified customer profiles, identity resolution, segmentation, CDP (Oracle CX, D365 Customer Insights)   | ★   |
| `customer-service`          | `afenda-customer-service`          | Tickets, SLAs, case management, support settings                                                        |     |
| `field-service` ✦✦          | `afenda-field-service`             | Field technician dispatch, work orders, scheduling, mobile execution, SLA (SAP FSM, D365 Field Service) |     |
| `loyalty-management` ✦      | `afenda-loyalty-management`        | Points programs, tiers, rewards, loyalty point entries                                                  |     |
| `marketing`                 | `afenda-marketing`                 | Campaign planning, execution, email campaigns                                                           |     |
| `marketing-fund-management` | `afenda-marketing-fund-management` | Co-op / MDF fund management, accruals, claims                                                           |     |
| `pricing`                   | `afenda-pricing`                   | Price lists, pricing rules, promotions, coupon codes                                                    |     |
| `promoter`                  | `afenda-promoter`                  | Field promoter management, activation tracking                                                          |     |
| `public-relations`          | `afenda-public-relations`          | PR activities, media tracking, press releases                                                           |     |
| `sales`                     | `afenda-sales`                     | Sales orders, quotations, delivery schedules                                                            |     |
| `trade-marketing`           | `afenda-trade-marketing`           | Trade promotions, activations, promotional schemes                                                      |     |
| `warranty-management` ✦     | `afenda-warranty-management`       | Warranty claims, installation notes, post-sale service tracking                                         |     |

---

### Class D — Manufacturing & Quality (15 domains)

Production, planning, formulation, and quality assurance.

| Domain                         | Package                             | Description                                                                                                                      | MNC |
| ------------------------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --- |
| `central-kitchen`              | `afenda-central-kitchen`            | Central kitchen operations, batch production                                                                                     |     |
| `cold-chain`                   | `afenda-cold-chain`                 | Cold chain monitoring, temperature compliance                                                                                    |     |
| `configurator`                 | `afenda-configurator`               | Product / BOM configurator, variant management                                                                                   |     |
| `ehs-management` ✦✦            | `afenda-ehs-management`             | Environment, Health & Safety — incident management, permit-to-work, GHG emissions, ergonomics (SAP EHS, Oracle EHS, D365 Safety) | ★   |
| `feed-mill`                    | `afenda-feed-mill`                  | Animal feed mill operations, formulation                                                                                         |     |
| `food-safety`                  | `afenda-food-safety`                | HACCP, food safety compliance, non-conformance                                                                                   |     |
| `maintenance-management` ✦     | `afenda-maintenance-management`     | CMMS/EAM — asset maintenance schedules, visits, teams, preventive maintenance                                                    | ★   |
| `nutrition-labeling`           | `afenda-nutrition-labeling`         | Nutrition facts, label compliance, regulatory requirements                                                                       |     |
| `planning`                     | `afenda-planning`                   | MRP / MPS production planning, material requests                                                                                 |     |
| `plm`                          | `afenda-plm`                        | Product lifecycle management, BOM versioning                                                                                     |     |
| `production`                   | `afenda-production`                 | Work orders, BOM explosion, shop floor execution                                                                                 |     |
| `quality-mgmt`                 | `afenda-quality-mgmt`               | QC inspections, NCR, CAPA, quality goals, reviews                                                                                |     |
| `recipe-management`            | `afenda-recipe-management`          | Recipe / formula management, ingredient substitution                                                                             |     |
| `serialization-traceability` ✦ | `afenda-serialization-traceability` | Lot/serial tracking, GS1, serial & batch bundles, recall management                                                              | ★   |
| `shop-floor-control` ✦         | `afenda-shop-floor-control`         | MES — job cards, workstations, plant floor, downtime, OEE, routing                                                               | ★   |

---

### Class E — Human Capital Management (14 domains)

Workforce administration, pay, and talent.

| Domain                      | Package                          | Description                                                                        | MNC |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------------------------- | --- |
| `benefits`                  | `afenda-benefits`                | Benefits administration, enrolment, gratuity, health insurance                     |     |
| `compensation-management` ✦ | `afenda-compensation-management` | Salary bands, structures, components, merit increases, retention bonus, pay equity | ★   |
| `employee-relations` ✦      | `afenda-employee-relations`      | Employee grievances, grievance types, exit interviews, disciplinary                |     |
| `hr-core`                   | `afenda-hr-core`                 | Employee master, org structure, departments, designations, employment types        | ★   |
| `learning-dev`              | `afenda-learning-dev`            | LMS, training events, programs, certifications, training feedback                  |     |
| `offboarding`               | `afenda-offboarding`             | Exit process, full & final settlement, asset recovery                              |     |
| `onboarding`                | `afenda-onboarding`              | New hire onboarding workflow, employee boarding activities                         |     |
| `payroll`                   | `afenda-payroll`                 | Payroll calculation, salary slips, payroll entry, disbursement, tax exemptions     | ★   |
| `performance-mgmt`          | `afenda-performance-mgmt`        | Goals, appraisal cycles, KRAs, reviews, ratings, feedback                          |     |
| `recruitment`               | `afenda-recruitment`             | ATS, job openings, applicants, interviews, job offers, requisitions                |     |
| `shift-management` ✦        | `afenda-shift-management`        | Shift types, assignments, schedules, shift requests, roster planning               |     |
| `time-attendance`           | `afenda-time-attendance`         | Timesheets, attendance, leave management, leave encashment, overtime               |     |
| `travel-management` ✦       | `afenda-travel-management`       | Business travel requests, itineraries, costing, purpose of travel                  |     |
| `workforce-planning` ✦      | `afenda-workforce-planning`      | Headcount planning, staffing plans, skill maps, org design, succession             | ★   |

---

### Class F — Agriculture & AgriTech (10 domains)

Farming, livestock, sustainability, and agricultural analytics.

| Domain                  | Package                        | Description                                               | MNC |
| ----------------------- | ------------------------------ | --------------------------------------------------------- | --- |
| `animal-welfare`        | `afenda-animal-welfare`        | Animal welfare compliance, welfare standards              |     |
| `crop-planning`         | `afenda-crop-planning`         | Season and crop planning, field allocation                |     |
| `greenhouse-management` | `afenda-greenhouse-management` | Greenhouse operations, climate control                    |     |
| `herd-management`       | `afenda-herd-management`       | Livestock herd records, health events                     |     |
| `livestock-analytics`   | `afenda-livestock-analytics`   | Livestock performance analytics, FCR, mortality           |     |
| `livestock-processing`  | `afenda-livestock-processing`  | Slaughter and processing operations                       |     |
| `livestock-procurement` | `afenda-livestock-procurement` | Livestock purchasing, grading, weighing                   |     |
| `precision-agriculture` | `afenda-precision-agriculture` | Precision farming, IoT sensing, variable rate application |     |
| `predictive-analytics`  | `afenda-predictive-analytics`  | AI/ML yield prediction, disease forecasting               |     |
| `sustainability`        | `afenda-sustainability`        | ESG tracking, carbon footprint, Scope 1/2/3 emissions     | ★   |

---

### Class G — Franchise & Retail (8 domains)

Franchise network management and retail operations.

| Domain                     | Package                         | Description                                                     | MNC |
| -------------------------- | ------------------------------- | --------------------------------------------------------------- | --- |
| `franchise-compliance`     | `afenda-franchise-compliance`   | Franchise standards compliance, audit checklists                |     |
| `franchise-development`    | `afenda-franchise-development`  | Franchise sales, territory management, pipeline                 |     |
| `franchise-outlet-audit`   | `afenda-franchise-outlet-audit` | Outlet inspection, scoring, corrective actions                  |     |
| `franchisee-operations`    | `afenda-franchisee-operations`  | Franchisee self-service portal, reporting                       |     |
| `omnichannel-management` ✦ | `afenda-omnichannel-management` | Unified commerce across POS, e-commerce, and wholesale channels | ★   |
| `retail-management`        | `afenda-retail-management`      | Retail store operations, cashier closing                        |     |
| `retail-pos`               | `afenda-retail-pos`             | Point of sale, POS invoices, POS profiles, payment methods      |     |
| `visual-merchandising`     | `afenda-visual-merchandising`   | VM planning, planograms, display standards                      |     |

---

### Class H — Governance, Risk & Compliance (20 domains)

GRC, audit, corporate governance, and regulatory reporting.

| Domain                      | Package                            | Description                                                                                           | MNC |
| --------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------- | --- |
| `access-governance`         | `afenda-access-governance`         | IAM, RBAC, access certification, role reviews                                                         | ★   |
| `anti-bribery-corruption` ✦ | `afenda-anti-bribery-corruption`   | FCPA/UK Bribery Act, gifts & entertainment register, third-party due diligence                        | ★   |
| `audit`                     | `afenda-audit`                     | Internal audit programme, findings, recommendations                                                   | ★   |
| `board-management`          | `afenda-board-management`          | Board meetings, resolutions, minutes                                                                  | ★   |
| `cap-table-management`      | `afenda-cap-table-management`      | Equity, cap table, share transfers, dilution, shareholders                                            | ★   |
| `data-governance`           | `afenda-data-governance`           | Data quality, lineage, stewardship, data dictionaries                                                 | ★   |
| `dividend-management`       | `afenda-dividend-management`       | Dividend declaration, payment, shareholder distributions                                              | ★   |
| `enterprise-risk-controls`  | `afenda-enterprise-risk-controls`  | Risk register, controls testing, risk appetite                                                        | ★   |
| `esg-reporting` ✦           | `afenda-esg-reporting`             | GRI/SASB/TCFD/CSRD structured ESG disclosure, distinct from sustainability tracking                   | ★   |
| `external-audit-management` | `afenda-external-audit-management` | External auditor liaison, PBC lists, audit findings                                                   | ★   |
| `legal-entity-management`   | `afenda-legal-entity-management`   | Corporate entity registry, group structure, jurisdictions                                             | ★   |
| `legal-management` ✦        | `afenda-legal-management`          | Litigation tracking, legal spend, matter management, outside counsel                                  | ★   |
| `privacy-management` ✦      | `afenda-privacy-management`        | GDPR/PDPA data subject requests, consent management, privacy impact assessments                       | ★   |
| `regulatory-intelligence`   | `afenda-regulatory-intelligence`   | Regulatory change monitoring, impact assessment                                                       | ★   |
| `regulatory-reporting`      | `afenda-regulatory-reporting`      | Regulatory filing submissions, statutory returns                                                      | ★   |
| `sec-reporting`             | `afenda-sec-reporting`             | SEC filings (10-K, 10-Q, 8-K), XBRL tagging                                                           | ★   |
| `secretariat`               | `afenda-secretariat`               | Corporate secretary functions, AGM/EGM management                                                     | ★   |
| `segregation-of-duties` ✦✦  | `afenda-segregation-of-duties`     | SoD conflict detection, role design, access risk analysis, remediation (SAP GRC AC, Oracle Risk Mgmt) | ★   |
| `shareholder-portal`        | `afenda-shareholder-portal`        | Investor self-service portal, dividend statements                                                     | ★   |
| `tax-compliance`            | `afenda-tax-compliance`            | Tax compliance, BEPS, CbCR, DAC6, Pillar Two                                                          | ★   |

---

### Class I — Analytics, Data & Integration (13 domains)

BI, data management, integrations, and cross-cutting services.

| Domain               | Package                     | Description                                                                                                            | MNC |
| -------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --- |
| `ai-ml-platform` ✦✦  | `afenda-ai-ml-platform`     | Embedded AI/ML model management, predictions, anomaly detection, copilot integration (SAP AI Core, Oracle AI, D365 AI) | ★   |
| `asset-mgmt`         | `afenda-asset-mgmt`         | IT and enterprise asset tracking, CMDB                                                                                 |     |
| `bi-analytics`       | `afenda-bi-analytics`       | Business intelligence, dashboards, KPI reporting                                                                       | ★   |
| `contract-mgmt`      | `afenda-contract-mgmt`      | Contract lifecycle management, templates, renewals                                                                     |     |
| `data-warehouse`     | `afenda-data-warehouse`     | DW layer, aggregations, ETL, data marts                                                                                | ★   |
| `document-mgmt`      | `afenda-document-mgmt`      | Document store, versioning, OCR, e-signatures                                                                          |     |
| `edi-integration` ✦  | `afenda-edi-integration`    | B2B electronic document exchange (EDIFACT, X12, Peppol BIS)                                                            | ★   |
| `integration-hub`    | `afenda-integration-hub`    | API gateway, event bus, connectors, webhooks                                                                           | ★   |
| `mdm`                | `afenda-mdm`                | Master data management, golden records, deduplication                                                                  | ★   |
| `notifications`      | `afenda-notifications`      | Email, SMS, push notifications, notification templates                                                                 |     |
| `project-accounting` | `afenda-project-accounting` | Project cost and revenue tracking, timesheets, WBS                                                                     |     |
| `telephony` ✦        | `afenda-telephony`          | CTI, call logs, voice call settings, call centre integration                                                           |     |
| `workflow-bpm`       | `afenda-workflow-bpm`       | Business process automation, BPM modelling                                                                             |     |

---

### Class J — Corporate & Strategy (5 domains)

Innovation, R&D, enterprise shared services, and corporate strategy.

| Domain                       | Package                             | Description                                                  | MNC |
| ---------------------------- | ----------------------------------- | ------------------------------------------------------------ | --- |
| `innovation-management`      | `afenda-innovation-management`      | Innovation pipeline, ideation, stage-gate                    |     |
| `mergers-acquisitions` ✦     | `afenda-mergers-acquisitions`       | M&A pipeline, due diligence tracking, integration management | ★   |
| `rd-project-management`      | `afenda-rd-project-management`      | R&D project tracking, stage-gate, IP management              |     |
| `shared-services-management` | `afenda-shared-services-management` | Shared services centre operations, SLA management            | ★   |
| `strategic-planning` ✦       | `afenda-strategic-planning`         | OKRs, balanced scorecard, strategy maps, KPI cascading       | ★   |

---

### Class K — Operations & Facilities (3 domains)

Fleet, facilities, real estate, and physical operations management.

| Domain                      | Package                         | Description                                                                                                 | MNC |
| --------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------- | --- |
| `facilities-management` ✦   | `afenda-facilities-management`  | Building operations, space management, utility management                                                   |     |
| `fleet-management` ✦        | `afenda-fleet-management`       | Vehicle master, vehicle logs, service records, driver management, delivery trips                            |     |
| `real-estate-management` ✦✦ | `afenda-real-estate-management` | Property portfolio, lease contracts, rent billing, CAM charges, space planning (SAP RE-FX, Oracle Property) | ★   |

---

## 7. Class Summary & Multinational Relevance

### 7.1 Updated Class Totals

| Class | Name                          | Domains | MNC-Critical |
| ----- | ----------------------------- | ------- | ------------ |
| A     | Financial Management          | 31      | 24           |
| B     | Procurement & Supply Chain    | 19      | 7            |
| C     | Sales, Marketing & CX         | 16      | 2            |
| D     | Manufacturing & Quality       | 15      | 4            |
| E     | Human Capital Management      | 14      | 4            |
| F     | Agriculture & AgriTech        | 10      | 1            |
| G     | Franchise & Retail            | 8       | 1            |
| H     | Governance, Risk & Compliance | 20      | 20           |
| I     | Analytics, Data & Integration | 13      | 5            |
| J     | Corporate & Strategy          | 5       | 3            |
| K     | Operations & Facilities       | 3       | 1            |
|       | **Total**                     | **154** | **72**       |

> **Legend:** ✦ = added via ERPNext/HRMS cross-reference (29 domains) | ✦✦ = added via SAP/Oracle/D365 industry benchmark (9 domains) | **38 total new domains** from baseline 116.

### 7.2 Multinational ERP Enrichment by Class

**Class A — Financial Management** is the most MNC-critical class. Key patterns:

- `consolidation` + `intercompany` + `intercompany-governance` form the group reporting spine.
- `fx-management` underpins all cross-currency flows; every monetary domain depends on it.
- `cost-accounting` (new) provides the cost centre dimension required for segment reporting.
- `bank-reconciliation` (new) is essential for treasury operations across multiple bank accounts per entity.
- `statutory-reporting` + `financial-close` support the dual-book / multi-GAAP requirement via `Finance Book`.
- `transfer-pricing` + `tax-compliance` address BEPS/OECD obligations for groups with cross-border IC transactions.
- `grants-management` (new, SAP GM / Oracle Grants) — required for public-sector entities and research subsidiaries within a holding group.
- `joint-venture-accounting` (new, SAP JVA / Oracle JV) — essential for O&G, mining, infrastructure, and holding companies with JV structures.

**Class H — Governance, Risk & Compliance** is entirely MNC-critical. Key additions:

- `esg-reporting` (new) — distinct from `sustainability` (F class). Sustainability tracks raw ESG data; `esg-reporting` produces structured GRI/SASB/TCFD/CSRD disclosures required for listed companies.
- `privacy-management` (new) — GDPR (EU), PDPA (MY/TH/SG), PIPL (CN) compliance per jurisdiction.
- `anti-bribery-corruption` (new) — FCPA (US), UK Bribery Act, ISO 37001 compliance.
- `legal-management` (new) — litigation and legal spend management for groups with in-house legal teams.
- `segregation-of-duties` (new, SAP GRC AC / Oracle Risk Mgmt) — automated SoD conflict detection is a SOX/audit requirement for listed companies.
- `legal-entity-management` — the master registry of all group entities; foundational for all MNC operations.

**Class D — Manufacturing & Quality** gains 4 domains:

- `ehs-management` (new, SAP EHS / Oracle EHS / D365 Safety) — EHS is a distinct discipline from sustainability; covers incident management, permit-to-work, and occupational health.
- `maintenance-management` (new) — CMMS/EAM is distinct from fixed-assets accounting.
- `shop-floor-control` (new) — MES layer (job cards, workstations, OEE) sits above production planning.
- `serialization-traceability` (new) — lot/serial tracking for regulatory recall and GS1 compliance.

**Class B — Procurement & Supply Chain** gains 4 domains:

- `order-orchestration` (new, Oracle IOM / D365 IOM) — intelligent order routing across channels and fulfilment nodes.
- `subcontracting` (new) — full ERPNext module with its own BOM and receipt flow.
- `demand-planning` (new) — S&OP and demand sensing are distinct from financial forecasting.
- `supplier-scorecard` (new) — vendor performance rating drives strategic sourcing decisions.

**Class C — Sales, Marketing & CX** gains 5 domains:

- `field-service` (new, SAP FSM / D365 Field Service) — field technician dispatch and mobile work order execution.
- `customer-data-platform` (new, Oracle CX / D365 Customer Insights) — unified customer profile and CDP for personalisation at scale.
- `channel-management`, `loyalty-management`, `warranty-management` (new from ERPNext).

**Class I — Analytics, Data & Integration** gains 3 domains:

- `ai-ml-platform` (new, SAP AI Core / Oracle AI / D365 AI) — embedded AI/ML model management and copilot integration is now standard in all tier-1 ERPs.
- `edi-integration`, `telephony` (new from ERPNext).

---

## 8. Cross-References

| Document                                                                        | Relationship                                                     |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [`ARCHITECTURE.md`](../ARCHITECTURE.md)                                         | System-wide layer rules, dependency matrix, package standards    |
| [`canon.architecture.md`](./canon.architecture.md)                              | Type authority — all domain types must originate here            |
| [`database.architecture.md`](./database.architecture.md)                        | Schema definitions — all domain DB schemas live here             |
| [`crud.architecture.md`](./crud.architecture.md)                                | Application kernel — consumes all domain packages via `mutate()` |
| [`workflow.architecture.md`](./workflow.architecture.md)                        | Workflow engine — orchestrates domain operations                 |
| [`advisory.architecture.md`](./advisory.architecture.md)                        | Advisory engine — analyses domain data, never writes to it       |
| [`reference-business-domain/README.md`](../reference-business-domain/README.md) | Original 116-domain catalog (read-only reference)                |

---

_Last updated: 2026-02-20 | Total domains: 154 | Business classes: 11 (A–K) | New domains: 38 (✦ ERPNext/HRMS, ✦✦ SAP/Oracle/D365 benchmark) | Architecture layer: Layer 2_
