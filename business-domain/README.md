# Business Domain Packages

**116 domain-specific packages · 10 business classes · Layer 2**

---

## Domain Class Legend

Each domain belongs to exactly one **Business Class** — a stable grouping that drives code organisation, team ownership, and roadmap planning.

| Badge | Class | Color |
|-------|-------|-------|
| ![A](https://img.shields.io/badge/A-Financial%20Management-0052CC?style=flat-square) | **A — Financial Management** | `#0052CC` |
| ![B](https://img.shields.io/badge/B-Procurement%20%26%20Supply%20Chain-36B37E?style=flat-square) | **B — Procurement & Supply Chain** | `#36B37E` |
| ![C](https://img.shields.io/badge/C-Sales%2C%20Marketing%20%26%20CX-FF5630?style=flat-square) | **C — Sales, Marketing & CX** | `#FF5630` |
| ![D](https://img.shields.io/badge/D-Manufacturing%20%26%20Quality-6554C0?style=flat-square) | **D — Manufacturing & Quality** | `#6554C0` |
| ![E](https://img.shields.io/badge/E-Human%20Capital%20Management-00B8D9?style=flat-square) | **E — Human Capital Management** | `#00B8D9` |
| ![F](https://img.shields.io/badge/F-Agriculture%20%26%20AgriTech-2ECC71?style=flat-square) | **F — Agriculture & AgriTech** | `#2ECC71` |
| ![G](https://img.shields.io/badge/G-Franchise%20%26%20Retail-FF8B00?style=flat-square) | **G — Franchise & Retail** | `#FF8B00` |
| ![H](https://img.shields.io/badge/H-Governance%2C%20Risk%20%26%20Compliance-403294?style=flat-square) | **H — Governance, Risk & Compliance** | `#403294` |
| ![I](https://img.shields.io/badge/I-Analytics%2C%20Data%20%26%20Integration-00C7E6?style=flat-square) | **I — Analytics, Data & Integration** | `#00C7E6` |
| ![J](https://img.shields.io/badge/J-Corporate%20%26%20Strategy-8777D9?style=flat-square) | **J — Corporate & Strategy** | `#8777D9` |

> **Rule:** When adding a new domain, assign exactly one class before creating the package folder. If no class fits, propose a new class in the RFC before merging.

---

## All 116 Domains by Business Class

### ![A](https://img.shields.io/badge/A-Financial%20Management-0052CC?style=flat-square) — Financial Management (25)

Core accounting, treasury, tax, closing, and financial reporting.

| Domain | Package | Description |
|--------|---------|-------------|
| `accounting` | `afenda-accounting` | Tax calculation, FX, journal entries |
| `budgeting` | `afenda-budgeting` | Budget planning and control |
| `cash-pooling` | `afenda-cash-pooling` | Notional and physical cash pooling |
| `consolidation` | `afenda-consolidation` | Multi-level consolidation, eliminations |
| `e-invoicing-ctc` | `afenda-e-invoicing-ctc` | E-invoicing & continuous transaction controls |
| `expense-management` | `afenda-expense-management` | Expense reports, approvals, reimbursement |
| `financial-close` | `afenda-financial-close` | Period-end close orchestration |
| `fixed-assets` | `afenda-fixed-assets` | Asset lifecycle, depreciation |
| `forecasting` | `afenda-forecasting` | Rolling financial forecasts |
| `fx-management` | `afenda-fx-management` | FX rates, hedge accounting |
| `intercompany` | `afenda-intercompany` | IC transactions and netting |
| `intercompany-governance` | `afenda-intercompany-governance` | IC compliance and policy enforcement |
| `investment-management` | `afenda-investment-management` | Portfolio and investment tracking |
| `lease-accounting` | `afenda-lease-accounting` | IFRS 16 / ASC 842 lease accounting |
| `payables` | `afenda-payables` | AP management, invoice matching |
| `payments-orchestration` | `afenda-payments-orchestration` | Payment runs, bank integration |
| `receivables` | `afenda-receivables` | AR management, collections |
| `revenue-recognition` | `afenda-revenue-recognition` | ASC 606 / IFRS 15 recognition |
| `royalty-management` | `afenda-royalty-management` | Royalty calculation and payments |
| `statutory-reporting` | `afenda-statutory-reporting` | Multi-GAAP statutory reports |
| `stock-based-compensation` | `afenda-stock-based-compensation` | ASC 718 equity comp accounting |
| `subscription-billing` | `afenda-subscription-billing` | Recurring billing and revenue |
| `tax-engine` | `afenda-tax-engine` | VAT/GST, WHT, tax determination |
| `transfer-pricing` | `afenda-transfer-pricing` | Arm's-length pricing, TP documentation |
| `treasury` | `afenda-treasury` | Cash forecasting, banking, investments |

---

### ![B](https://img.shields.io/badge/B-Procurement%20%26%20Supply%20Chain-36B37E?style=flat-square) — Procurement & Supply Chain (15)

Source-to-pay, inventory, logistics, and trade.

| Domain | Package | Description |
|--------|---------|-------------|
| `consignment` | `afenda-consignment` | Consignment inventory management |
| `export` | `afenda-export` | Export documentation and controls |
| `global-trade` | `afenda-global-trade` | Import/export, customs, duties |
| `group-purchasing` | `afenda-group-purchasing` | Group/co-op purchasing programs |
| `inventory` | `afenda-inventory` | Stock management and valuation |
| `procurement` | `afenda-procurement` | Requisitions, RFQ, sourcing |
| `purchasing` | `afenda-purchasing` | Purchase orders and receipts |
| `rebate-mgmt` | `afenda-rebate-mgmt` | Supplier/customer rebate processing |
| `receiving` | `afenda-receiving` | Goods receipt and inspection |
| `returns` | `afenda-returns` | Return merchandise authorisation |
| `shipping` | `afenda-shipping` | Order fulfilment and dispatch |
| `supplier-portal` | `afenda-supplier-portal` | Supplier self-service portal |
| `trade-compliance` | `afenda-trade-compliance` | Sanctions, embargo, dual-use checks |
| `transportation` | `afenda-transportation` | TMS, freight, carrier management |
| `warehouse` | `afenda-warehouse` | WMS, bin locations, picking/packing |

---

### ![C](https://img.shields.io/badge/C-Sales%2C%20Marketing%20%26%20CX-FF5630?style=flat-square) — Sales, Marketing & CX (11)

Customer-facing revenue, marketing, and brand operations.

| Domain | Package | Description |
|--------|---------|-------------|
| `advertising` | `afenda-advertising` | Ad campaign management |
| `branding` | `afenda-branding` | Brand standards and assets |
| `crm` | `afenda-crm` | Customer relationship management |
| `customer-service` | `afenda-customer-service` | Tickets, SLAs, case management |
| `marketing` | `afenda-marketing` | Campaign planning and execution |
| `marketing-fund-management` | `afenda-marketing-fund-management` | Co-op / MDF fund management |
| `pricing` | `afenda-pricing` | Price lists, rules, promotions |
| `promoter` | `afenda-promoter` | Field promoter management |
| `public-relations` | `afenda-public-relations` | PR activities and media tracking |
| `sales` | `afenda-sales` | Sales orders, quotations |
| `trade-marketing` | `afenda-trade-marketing` | Trade promotions and activations |

---

### ![D](https://img.shields.io/badge/D-Manufacturing%20%26%20Quality-6554C0?style=flat-square) — Manufacturing & Quality (11)

Production, planning, formulation, and quality assurance.

| Domain | Package | Description |
|--------|---------|-------------|
| `central-kitchen` | `afenda-central-kitchen` | Central kitchen operations |
| `cold-chain` | `afenda-cold-chain` | Cold chain monitoring and compliance |
| `configurator` | `afenda-configurator` | Product / BOM configurator |
| `feed-mill` | `afenda-feed-mill` | Animal feed mill operations |
| `food-safety` | `afenda-food-safety` | HACCP, food safety compliance |
| `nutrition-labeling` | `afenda-nutrition-labeling` | Nutrition facts and label compliance |
| `planning` | `afenda-planning` | MRP / MPS production planning |
| `plm` | `afenda-plm` | Product lifecycle management |
| `production` | `afenda-production` | Work orders, BOM, shop floor |
| `quality-mgmt` | `afenda-quality-mgmt` | QC, NCR, CAPA |
| `recipe-management` | `afenda-recipe-management` | Recipe / formula management |

---

### ![E](https://img.shields.io/badge/E-Human%20Capital%20Management-00B8D9?style=flat-square) — Human Capital Management (9)

Workforce administration, pay, and talent.

| Domain | Package | Description |
|--------|---------|-------------|
| `benefits` | `afenda-benefits` | Benefits administration, enrolment |
| `hr-core` | `afenda-hr-core` | Employee master, org structure |
| `learning-dev` | `afenda-learning-dev` | LMS, training and certifications |
| `offboarding` | `afenda-offboarding` | Exit process, asset recovery |
| `onboarding` | `afenda-onboarding` | New hire onboarding workflow |
| `payroll` | `afenda-payroll` | Payroll calculation and disbursement |
| `performance-mgmt` | `afenda-performance-mgmt` | Goals, reviews, ratings |
| `recruitment` | `afenda-recruitment` | ATS, job postings, hiring |
| `time-attendance` | `afenda-time-attendance` | Timesheets, attendance, leave |

---

### ![F](https://img.shields.io/badge/F-Agriculture%20%26%20AgriTech-2ECC71?style=flat-square) — Agriculture & AgriTech (10)

Farming, livestock, sustainability, and agricultural analytics.

| Domain | Package | Description |
|--------|---------|-------------|
| `animal-welfare` | `afenda-animal-welfare` | Animal welfare compliance |
| `crop-planning` | `afenda-crop-planning` | Season and crop planning |
| `greenhouse-management` | `afenda-greenhouse-management` | Greenhouse operations |
| `herd-management` | `afenda-herd-management` | Livestock herd records |
| `livestock-analytics` | `afenda-livestock-analytics` | Livestock performance analytics |
| `livestock-processing` | `afenda-livestock-processing` | Slaughter and processing |
| `livestock-procurement` | `afenda-livestock-procurement` | Livestock purchasing |
| `precision-agriculture` | `afenda-precision-agriculture` | Precision farming, IoT sensing |
| `predictive-analytics` | `afenda-predictive-analytics` | AI/ML yield and disease prediction |
| `sustainability` | `afenda-sustainability` | ESG tracking, carbon footprint |

---

### ![G](https://img.shields.io/badge/G-Franchise%20%26%20Retail-FF8B00?style=flat-square) — Franchise & Retail (7)

Franchise network management and retail operations.

| Domain | Package | Description |
|--------|---------|-------------|
| `franchise-compliance` | `afenda-franchise-compliance` | Franchise standards compliance |
| `franchise-development` | `afenda-franchise-development` | Franchise sales and territory |
| `franchise-outlet-audit` | `afenda-franchise-outlet-audit` | Outlet inspection and scoring |
| `franchisee-operations` | `afenda-franchisee-operations` | Franchisee self-service portal |
| `retail-management` | `afenda-retail-management` | Retail store operations |
| `retail-pos` | `afenda-retail-pos` | Point of sale |
| `visual-merchandising` | `afenda-visual-merchandising` | VM planning and planograms |

---

### ![H](https://img.shields.io/badge/H-Governance%2C%20Risk%20%26%20Compliance-403294?style=flat-square) — Governance, Risk & Compliance (15)

GRC, audit, corporate governance, and regulatory reporting.

| Domain | Package | Description |
|--------|---------|-------------|
| `access-governance` | `afenda-access-governance` | IAM, RBAC, access certification |
| `audit` | `afenda-audit` | Internal audit programme |
| `board-management` | `afenda-board-management` | Board meetings and resolutions |
| `cap-table-management` | `afenda-cap-table-management` | Equity, cap table, dilution |
| `data-governance` | `afenda-data-governance` | Data quality, lineage, stewardship |
| `dividend-management` | `afenda-dividend-management` | Dividend declaration and payment |
| `enterprise-risk-controls` | `afenda-enterprise-risk-controls` | Risk register, controls testing |
| `external-audit-management` | `afenda-external-audit-management` | External auditor liaison |
| `legal-entity-management` | `afenda-legal-entity-management` | Corporate entity registry |
| `regulatory-intelligence` | `afenda-regulatory-intelligence` | Regulatory change monitoring |
| `regulatory-reporting` | `afenda-regulatory-reporting` | Regulatory filing submissions |
| `sec-reporting` | `afenda-sec-reporting` | SEC filings (10-K, 10-Q, 8-K) |
| `secretariat` | `afenda-secretariat` | Corporate secretary functions |
| `shareholder-portal` | `afenda-shareholder-portal` | Investor self-service portal |
| `tax-compliance` | `afenda-tax-compliance` | Tax compliance, BEPS, CbCR |

---

### ![I](https://img.shields.io/badge/I-Analytics%2C%20Data%20%26%20Integration-00C7E6?style=flat-square) — Analytics, Data & Integration (10)

BI, data management, integrations, and cross-cutting services.

| Domain | Package | Description |
|--------|---------|-------------|
| `asset-mgmt` | `afenda-asset-mgmt` | IT and enterprise asset tracking |
| `bi-analytics` | `afenda-bi-analytics` | Business intelligence and dashboards |
| `contract-mgmt` | `afenda-contract-mgmt` | Contract lifecycle management |
| `data-warehouse` | `afenda-data-warehouse` | DW layer, aggregations, ETL |
| `document-mgmt` | `afenda-document-mgmt` | Document store, versioning, OCR |
| `integration-hub` | `afenda-integration-hub` | API gateway, event bus, connectors |
| `mdm` | `afenda-mdm` | Master data management |
| `notifications` | `afenda-notifications` | Email, SMS, push notifications |
| `project-accounting` | `afenda-project-accounting` | Project cost and revenue tracking |
| `workflow-bpm` | `afenda-workflow-bpm` | Business process automation |

---

### ![J](https://img.shields.io/badge/J-Corporate%20%26%20Strategy-8777D9?style=flat-square) — Corporate & Strategy (3)

Innovation, R&D, and enterprise shared services.

| Domain | Package | Description |
|--------|---------|-------------|
| `innovation-management` | `afenda-innovation-management` | Innovation pipeline, ideation |
| `rd-project-management` | `afenda-rd-project-management` | R&D project tracking and stage-gate |
| `shared-services-management` | `afenda-shared-services-management` | Shared services centre operations |

---

## Class Summary

| Class | Name | Domains |
|-------|------|---------|
| ![A](https://img.shields.io/badge/A-Financial%20Management-0052CC?style=flat-square) | Financial Management | 25 |
| ![B](https://img.shields.io/badge/B-Procurement%20%26%20Supply%20Chain-36B37E?style=flat-square) | Procurement & Supply Chain | 15 |
| ![C](https://img.shields.io/badge/C-Sales%2C%20Marketing%20%26%20CX-FF5630?style=flat-square) | Sales, Marketing & CX | 11 |
| ![D](https://img.shields.io/badge/D-Manufacturing%20%26%20Quality-6554C0?style=flat-square) | Manufacturing & Quality | 11 |
| ![E](https://img.shields.io/badge/E-Human%20Capital%20Management-00B8D9?style=flat-square) | Human Capital Management | 9 |
| ![F](https://img.shields.io/badge/F-Agriculture%20%26%20AgriTech-2ECC71?style=flat-square) | Agriculture & AgriTech | 10 |
| ![G](https://img.shields.io/badge/G-Franchise%20%26%20Retail-FF8B00?style=flat-square) | Franchise & Retail | 7 |
| ![H](https://img.shields.io/badge/H-Governance%2C%20Risk%20%26%20Compliance-403294?style=flat-square) | Governance, Risk & Compliance | 15 |
| ![I](https://img.shields.io/badge/I-Analytics%2C%20Data%20%26%20Integration-00C7E6?style=flat-square) | Analytics, Data & Integration | 10 |
| ![J](https://img.shields.io/badge/J-Corporate%20%26%20Strategy-8777D9?style=flat-square) | Corporate & Strategy | 3 |
| | **Total** | **116** |

---

## Adding a New Domain

```
1. Choose the Business Class (A–J) from the legend above.
2. Create the folder:  business-domain/<domain-name>/
3. Add the badge to the README table for that class.
4. Follow the package template below.
```

If no existing class fits, open an RFC and propose a new class letter **before** creating the package.

---

## Overview

This directory contains business domain packages that implement domain-specific business logic for the AFENDA-NEXUS ERP system. Each package focuses on a specific business domain and follows strict architectural principles.

### Location in Architecture

Business domain packages are **Layer 2** in the 4-layer architecture:

```
Layer 3: crud, observability (orchestration)
         ↓ imports from
Layer 2: business-domain/* (YOU ARE HERE)
         ↓ imports from
Layer 1: canon, database, logger, ui (foundation)
         ↓ imports from
Layer 0: eslint-config, typescript-config (configuration)
```

---

## Architectural Rules

### ✅ What Business Domains Can Do

1. **Import types from canon**
   ```typescript
   import type { TaxRate, Invoice } from 'afenda-canon';
   ```

2. **Import schemas from database**
   ```typescript
   import { invoices, taxRates } from 'afenda-database';
   import { eq, and } from 'drizzle-orm';
   ```

3. **Use logger for observability**
   ```typescript
   import { logger } from 'afenda-logger';
   logger.info({ customerId }, 'Processing customer');
   ```

4. **Implement pure business logic**
   ```typescript
   export function calculateTax(amount: number, rate: number): number {
     return Math.round(amount * rate);
   }
   ```

### ❌ What Business Domains Cannot Do

1. **❌ Import from other business domains**
   ```typescript
   // ❌ WRONG - circular dependency
   import { checkCreditLimit } from 'afenda-crm';
   ```

2. **❌ Import from crud (Layer 3)**
   ```typescript
   // ❌ WRONG - importing from upper layer
   import { createInvoice } from 'afenda-crud';
   ```

3. **❌ Define types locally**
   ```typescript
   // ❌ WRONG - types must be in canon
   // src/types/common.ts
   export interface TaxRate { ... }
   
   // ✅ CORRECT - import from canon
   import type { TaxRate } from 'afenda-canon';
   ```

4. **❌ Use console.log**
   ```typescript
   // ❌ WRONG
   console.log('Processing...');
   
   // ✅ CORRECT
   import { logger } from 'afenda-logger';
   logger.info('Processing...');
   ```

---

## Package Structure

Every business domain package follows this structure:

```
business-domain/my-domain/
├── src/
│   ├── index.ts              # ✅ Public API - only this exports
│   ├── services/             # Business logic functions
│   │   ├── service-a.ts
│   │   └── service-b.ts
│   └── utils/                # Internal utilities (optional)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── eslint.config.js          # ESLint config
├── README.md                 # Documentation
└── vitest.config.ts          # Tests (if applicable)
```

---

## Example Implementation

### 1. Types in Canon (Layer 1)

```typescript
// packages/canon/src/types/accounting.ts
export interface TaxRate {
  taxCode: string;
  rate: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

// packages/canon/src/index.ts
export type { TaxRate } from './types/accounting';
```

### 2. Schema in Database (Layer 1)

```typescript
// packages/database/src/schema/tax-rates.ts
import { pgTable, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { baseEntity } from './helpers/base-entity';

export const taxRates = pgTable('tax_rates', {
  ...baseEntity,
  taxCode: text('tax_code').notNull(),
  rate: numeric('rate', { precision: 10, scale: 6 }).notNull(),
  effectiveFrom: timestamp('effective_from').notNull(),
});

// packages/database/src/index.ts
export { taxRates } from './schema/tax-rates';
```

### 3. Business Logic in Domain (Layer 2)

```typescript
// business-domain/accounting/src/services/tax-calculation.ts
import type { TaxRate } from 'afenda-canon';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { taxRates } from 'afenda-database';
import { eq, and, lte, sql } from 'drizzle-orm';
import { logger } from 'afenda-logger';

/**
 * Calculate tax amount with deterministic rounding
 */
export function calculateTax(
  amountMinor: number,
  rate: number
): number {
  if (amountMinor < 0) {
    throw new Error('Amount must be non-negative');
  }
  if (rate < 0 || rate > 1) {
    throw new Error('Rate must be between 0 and 1');
  }
  
  return Math.round(amountMinor * rate);
}

/**
 * Lookup tax rate from database
 */
export async function lookupTaxRate(
  db: NeonHttpDatabase,
  orgId: string,
  taxCode: string,
  effectiveDate: Date
): Promise<TaxRate | null> {
  const [rate] = await db
    .select()
    .from(taxRates)
    .where(and(
      eq(taxRates.orgId, orgId),
      eq(taxRates.taxCode, taxCode),
      lte(taxRates.effectiveFrom, effectiveDate)
    ))
    .orderBy(sql`${taxRates.effectiveFrom} DESC`)
    .limit(1);
  
  if (!rate) {
    logger.warn({ taxCode, effectiveDate }, 'Tax rate not found');
    return null;
  }
  
  return rate;
}

// business-domain/accounting/src/index.ts
export { calculateTax, lookupTaxRate } from './services/tax-calculation';
export type { TaxRate } from 'afenda-canon';
```

### 4. Usage in CRUD (Layer 3)

```typescript
// packages/crud/src/handlers/invoices.ts
import { calculateTax, lookupTaxRate } from 'afenda-accounting';
import { invoices } from 'afenda-database';
import { logger } from 'afenda-logger';

export async function createInvoice(db, orgId, data) {
  // 1. Lookup tax rate (domain logic)
  const taxRate = await lookupTaxRate(db, orgId, data.taxCode, data.invoiceDate);
  if (!taxRate) {
    throw new Error('Tax rate not found');
  }
  
  // 2. Calculate tax (domain logic)
  const taxMinor = calculateTax(data.subtotalMinor, taxRate.rate);
  
  // 3. Save to database (orchestration)
  const [invoice] = await db.insert(invoices).values({
    orgId,
    subtotalMinor: data.subtotalMinor,
    taxMinor,
    totalMinor: data.subtotalMinor + taxMinor,
  }).returning();
  
  logger.info({ invoiceId: invoice.id }, 'Invoice created');
  
  return invoice;
}
```

---

## package.json Template

```json
{
  "name": "afenda-my-domain",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
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
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

---

## Development Commands

```bash
# Lint specific domain
pnpm --filter "afenda-accounting" lint

# Type-check specific domain
pnpm --filter "afenda-accounting" type-check

# Run tests
pnpm --filter "afenda-accounting" test

# Lint all business-domain packages
pnpm --filter "./business-domain/**" lint

# Type-check all business-domain packages
pnpm --filter "./business-domain/**" type-check
```

---

## Related Documentation

- [Main Architecture](../ARCHITECTURE.md) - Complete architecture overview
- [Canon Package](../packages/canon/README.md) - Type system
- [Database Package](../packages/database/README.md) - Database schemas
- [CRUD Package](../packages/crud/README.md) - Orchestration layer

---

## Quick Reference

### Import Patterns

```typescript
// ✅ CORRECT
import type { TaxRate, Invoice } from 'afenda-canon';
import { invoices, taxRates } from 'afenda-database';
import { logger } from 'afenda-logger';
import { eq, and, lte } from 'drizzle-orm';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ❌ WRONG
import type { TaxRate } from './types/common';  // Use canon
import { calculateTax } from 'afenda-crm';      // No cross-domain
import { createInvoice } from 'afenda-crud';    // No upper layer
```

### Dependency Rules

**Allowed:**
- ✅ `afenda-canon` (types)
- ✅ `afenda-database` (schemas)
- ✅ `afenda-logger` (logging)
- ✅ `drizzle-orm` (query builder)
- ✅ `zod` (validation)
- ✅ External npm (lodash, date-fns, decimal.js, etc.)

**Forbidden:**
- ❌ Other business-domain packages
- ❌ `afenda-crud` (Layer 3)
- ❌ `afenda-workflow` (same layer)
- ❌ `afenda-advisory` (same layer)

### Function Patterns

**Pure Calculation (no database):**
```typescript
export function calculateTax(amount: number, rate: number): number {
  return Math.round(amount * rate);
}
```

**Data Lookup (with database):**
```typescript
export async function lookupTaxRate(
  db: NeonHttpDatabase,
  orgId: string,
  taxCode: string
): Promise<TaxRate | null> {
  const [rate] = await db.select().from(taxRates).where(...).limit(1);
  return rate ?? null;
}
```

**Error Handling:**
```typescript
// Throw error for validation
if (amount < 0) {
  throw new Error('Amount must be non-negative');
}

// Return null for not found
const rate = await lookupRate(...);
if (!rate) {
  return null;
}
```

---

**Last Updated:** February 18, 2026  
**Total Packages:** 116  
**Business Classes:** 10 (A–J)  
**Architecture Layer:** Layer 2 (Domain Services)
