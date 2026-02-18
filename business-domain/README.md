# Business Domain Packages

**116 domain-specific packages implementing focused business logic**

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

## Package Categories

### Financial Management (17 packages)
- `accounting` - Tax, FX, depreciation, revenue recognition
- `fx-management` - Foreign exchange, hedge accounting
- `consolidation` - Multi-level consolidation, eliminations
- `tax-engine` - Tax compliance, VAT/GST
- `treasury` - Cash management, forecasting
- `fixed-assets` - Asset lifecycle
- `revenue-recognition` - ASC 606/IFRS 15
- `e-invoicing-ctc` - Electronic invoicing
- `statutory-reporting` - Multi-GAAP reporting
- `intercompany` - Intercompany transactions
- `intercompany-governance` - IC compliance
- `lease-accounting` - IFRS 16/ASC 842
- `payables` - AP management
- `receivables` - AR management
- `payments-orchestration` - Payment processing
- `expense-management` - Expense reports
- `financial-close` - Period close

### Procurement & Supply Chain (12 packages)
- `procurement` - Requisition, RFQ
- `purchasing` - Purchase orders
- `inventory` - Stock management
- `warehouse` - WMS operations
- `receiving` - Goods receipt
- `shipping` - Fulfillment
- `transportation` - TMS
- `global-trade` - Import/export
- `trade-compliance` - Compliance
- `rebate-mgmt` - Rebate processing
- `consignment` - Consignment inventory
- `returns` - Returns management

### Sales & Marketing (8 packages)
- `crm` - Customer management
- `sales` - Sales orders
- `pricing` - Price management
- `marketing` - Campaign management
- `advertising` - Ad management
- `trade-marketing` - Trade promotions
- `promoter` - Promoter management
- `customer-service` - Support

### Manufacturing (10 packages)
- `production` - Work orders, BOM
- `quality-mgmt` - QC, NCR, CAPA
- `plm` - Product lifecycle
- `planning` - MRP/MPS
- `configurator` - Product configuration
- `recipe-management` - Recipe/formula
- `central-kitchen` - Central kitchen ops
- `feed-mill` - Feed mill operations
- `cold-chain` - Cold chain tracking
- `food-safety` - Food safety compliance

### Human Resources (10 packages)
- `hr-core` - Employee master
- `payroll` - Payroll processing
- `time-attendance` - Timesheets
- `recruitment` - Hiring
- `onboarding` - Employee onboarding
- `offboarding` - Employee offboarding
- `performance-mgmt` - Performance reviews
- `learning-dev` - Training
- `benefits` - Benefits administration
- `succession-planning` - Succession planning

### Agriculture & Livestock (10 packages)
- `precision-agriculture` - Precision farming
- `crop-planning` - Crop planning
- `greenhouse-management` - Greenhouse ops
- `herd-management` - Livestock management
- `livestock-analytics` - Livestock analytics
- `livestock-processing` - Processing
- `livestock-procurement` - Procurement
- `animal-welfare` - Welfare compliance
- `sustainability` - Sustainability tracking
- `predictive-analytics` - AI predictions

### Franchise & Retail (9 packages)
- `franchise-development` - Franchise sales
- `franchise-compliance` - Franchise audits
- `franchise-outlet-audit` - Outlet audits
- `franchisee-operations` - Franchisee portal
- `retail-management` - Retail operations
- `retail-pos` - Point of sale
- `visual-merchandising` - VM planning
- `branding` - Brand management
- `marketing-fund-management` - Co-op marketing

### Governance & Compliance (14 packages)
- `access-governance` - Access control
- `audit` - Internal audit
- `external-audit-management` - External audit
- `enterprise-risk-controls` - Risk management
- `data-governance` - Data governance
- `regulatory-intelligence` - Regulatory monitoring
- `regulatory-reporting` - Compliance reporting
- `legal-entity-management` - Legal entities
- `board-management` - Board meetings
- `secretariat` - Corporate secretary
- `shareholder-portal` - Shareholder portal
- `cap-table-management` - Cap table
- `dividend-management` - Dividend processing
- `stock-based-compensation` - Equity comp

### Analytics & Integration (10 packages)
- `bi-analytics` - Business intelligence
- `data-warehouse` - Data warehouse
- `mdm` - Master data management
- `integration-hub` - Integration
- `notifications` - Notification service
- `document-mgmt` - Document management
- `workflow-bpm` - Business process
- `contract-mgmt` - Contract lifecycle
- `project-accounting` - Project accounting
- `asset-mgmt` - Asset management

### Other Domains (16 packages)
- `budgeting` - Budgeting
- `forecasting` - Financial forecasting
- `cash-pooling` - Cash pooling
- `investment-management` - Investments
- `royalty-management` - Royalty tracking
- `sec-reporting` - SEC filings
- `shared-services-management` - Shared services
- `subscription-billing` - Subscription billing
- `supplier-portal` - Supplier portal
- `export` - Export management
- `public-relations` - PR management
- `innovation-management` - Innovation tracking
- `rd-project-management` - R&D projects
- `nutrition-labeling` - Nutrition compliance
- `group-purchasing` - Group purchasing
- `tax-compliance` - Tax compliance

**Total: 116 packages**

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
**Architecture Layer:** Layer 2 (Domain Services)
