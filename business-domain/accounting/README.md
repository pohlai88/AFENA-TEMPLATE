# afenda-accounting

Financial accounting domain services for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-accounting` provides domain-specific business logic for financial
accounting operations including tax calculation, foreign exchange, depreciation,
revenue recognition, payment allocation, and fiscal period management.

## When to Use This Package

Use `afenda-accounting` when you need to:

- Calculate taxes with deterministic rounding
- Look up foreign exchange rates for multi-currency transactions
- Generate depreciation schedules for fixed assets
- Recognize revenue over time (subscription/deferred revenue)
- Allocate payments to invoices and credit notes
- Validate fiscal period status before posting

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Tax Calculation

- **Deterministic rounding**: Same inputs always produce same tax amount
- **Effective dating**: Tax rates change over time; system picks correct rate
  for document date
- **Multiple rounding methods**: half_up, half_down, banker's, ceil, floor

### Foreign Exchange

- **Rate lookup**: Latest FX rate on or before document date
- **Source tracking**: Rates include source (manual, API, bank feed)

### Depreciation

- **Methods**: Straight-line and declining-balance supported
- **Minor units**: All amounts in integer cents (no floating-point drift)
- **Last period absorption**: Rounding remainders absorbed in final period

### Revenue Recognition

- **Straight-line**: Evenly distributed over periods
- **Deferred tracking**: Tracks recognized vs. deferred amounts
- **Period-based**: Recognition scheduled by period date

### Payment Allocation

- **Partial payments**: Support allocating portions of payment
- **Unique constraint**: Database prevents double-allocation
- **Multi-type targets**: Invoices, credit notes, debit notes

### Fiscal Periods

- **Open/closed/closing states**: Controls when posting is allowed
- **Period validation**: Ensures documents post to open periods only
- **Fiscal year calculation**: Handles companies with non-calendar fiscal years

## Quick Start

```typescript
import { db } from "afenda-database";
import {
  assertPeriodOpen,
  calculateTaxForLine,
  lookupFxRate,
} from "afenda-accounting";

// Calculate tax for a line item
const taxResult = await calculateTaxForLine(
  db,
  "org-123",
  "GST-6",
  100000, // $1000.00 in minor units
  "2026-02-17",
);
// => { taxCode: 'GST-6', rate: '6.000000', taxAmount: 6000, roundingMethod: 'half_up' }

// Look up FX rate
const fxRate = await lookupFxRate(
  db,
  "org-123",
  "USD",
  "MYR",
  "2026-02-17",
);
// => { rate: '4.725000', effectiveDate: '2026-02-17', source: 'manual' }

// Validate fiscal period
await assertPeriodOpen(db, "org-123", "company-456", "2026-02-28");
// Throws if period is closed or doesn't exist
```

## Dependencies

- `afenda-canon` - Entity types and schemas
- `afenda-database` - Database schema and ORM
- `drizzle-orm` - SQL query builder

## Related Packages

- [`afenda-crud`](../crud/README.md) - Orchestrates accounting services with
  auth
- [`afenda-workflow`](../workflow/README.md) - Triggers rules based on
  accounting events
- [`afenda-database`](../database/README.md) - Provides database schema

## Architecture

**Layer**: Domain Services (Layer 2)

This package implements pure business logic with no knowledge of HTTP, auth, or
UI. All services accept database handles and return typed results.

See: [ARCHITECTURE.md](../../ARCHITECTURE.md)

---

**Last Updated**: February 17, 2026
