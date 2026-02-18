# @afenda/fx-management

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--fx--management-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Foreign exchange rate management, revaluation, hedge accounting, and CTA tracking for multinational enterprises.

## Purpose

Provides comprehensive foreign exchange (FX) management capabilities for multinational operations, supporting IFRS 21 and ASC 830 compliance. Multi-currency is not just a "rate field" - it's a full lifecycle including rate sourcing, revaluation, hedging relationships, and cumulative translation adjustments.

## When to Use This Package

Use `afenda-fx-management` when you need to:

- Source and maintain FX rates (spot, average, month-end, budget)
- Revalue monetary assets and liabilities (AR, AP, cash, loans)
- Calculate realized and unrealized FX gains/losses
- Track hedge accounting relationships (cash flow hedge, fair value hedge)
- Calculate CTA (Cumulative Translation Adjustment) for consolidation
- Support multi-currency reporting with triangulation
- Comply with IFRS 21, IAS 39, IFRS 9, ASC 830, ASC 815

**Do NOT use directly** - Import through `afenda-crud` which provides authorization and audit logging.

## Key Concepts

### Rate Types

- **Spot Rate**: Immediate transaction rate
- **Average Rate**: Period average (used for P&L translation)
- **Month-End/Quarter-End**: Period closing rate (used for B/S translation)
- **Budget Rate**: Planning rate (used for forecasts)
- **Historical Rate**: Transaction date rate (used for equity translation)

### Rate Sources

- **Manual**: Entered by users
- **API**: Bloomberg, Refinitiv, XE.com, ECB
- **Bank Feed**: Rate from banking partner
- **Central Bank**: Official rates (ECB, Federal Reserve)

### Revaluation

Process of adjusting monetary assets/liabilities to current FX rates:

- **AR/AP Revaluation**: Adjust foreign currency receivables/payables
- **Cash Revaluation**: Adjust foreign currency bank accounts
- **Loan Revaluation**: Adjust foreign currency loans
- **Realized G/L**: On payment/settlement
- **Unrealized G/L**: Mark-to-market at period end

### Hedge Accounting

Matching derivative instruments to hedged items:

- **Cash Flow Hedge**: Hedge future transactions (forward contracts)
- **Fair Value Hedge**: Hedge existing assets/liabilities (options)
- **Net Investment Hedge**: Hedge foreign subsidiary investments
- **Effectiveness Testing**: 80-125% effectiveness required

### CTA (Cumulative Translation Adjustment)

Tracks translation differences for foreign subsidiaries:

- Separate component of equity (OCI)
- Accumulates over time
- Released to P&L on disposal of foreign operation

## Quick Start

```typescript
import { db } from 'afenda-database';
import {
  upsertFxRate,
  lookupRate,
  revaluateMonetaryAssets,
  calculateRealizedGainLoss,
  trackHedgeRelationship,
  calculateCTA,
} from 'afenda-fx-management';

// Upsert FX rate
await upsertFxRate(db, 'org-123', {
  baseCurrency: 'USD',
  quoteCurrency: 'EUR',
  rateType: 'spot',
  rate: '0.920000',
  effectiveDate: '2026-02-17',
  source: 'manual',
});

// Lookup rate for transaction
const rate = await lookupRate(db, 'org-123', {
  baseCurrency: 'USD',
  quoteCurrency: 'EUR',
  rateType: 'spot',
  asOfDate: '2026-02-17',
});

// Revalue foreign currency AR
const revaluationResult = await revaluateMonetaryAssets(db, 'org-123', {
  assetType: 'accounts_receivable',
  companyId: 'company-123',
  asOfDate: '2026-02-28',
  fromCurrency: 'EUR',
  toCurrency: 'USD',
});

// Calculate realized FX gain/loss on payment
const realizedGL = await calculateRealizedGainLoss(db, 'org-123', {
  documentId: 'inv-123',
  originalAmount: 100000,
  originalRate: '0.920000',
  settlementAmount: 100000,
  settlementRate: '0.930000',
  baseCurrency: 'USD',
});

// Track hedge relationship
await trackHedgeRelationship(db, 'org-123', {
  hedgeType: 'cash_flow',
  hedgedItemId: 'future-purchase-eur-q2',
  hedgingInstrumentId: 'forward-contract-eur-123',
  notionalAmount: 1000000,
  currency: 'EUR',
  maturityDate: '2026-06-30',
});

// Calculate CTA for consolidation
const cta = await calculateCTA(db, 'org-123', {
  subsidiaryId: 'foreign-sub-eur',
  fiscalPeriodId: 'period-2026-02',
  functionalCurrency: 'EUR',
  reportingCurrency: 'USD',
});
```

## Architecture

**Layer**: 2 (Domain Service)

**Dependencies**:
- `afenda-canon` - Entity types and schemas
- `afenda-database` - Database schema and ORM
- `afenda-logger` - Structured logging
- `drizzle-orm` - SQL query builder

**Feeds into**:
- `consolidation` - CTA for group reporting
- `accounting` - FX rates for line-item calculations
- `treasury` - FX exposure management
- `reporting` - Multi-currency financial statements

## Services

### `fx-rate-manager.ts`

Manage FX rates from multiple sources:
- Rate upload (manual, bulk, API)
- Rate validation and quality checks
- Rate type management (spot, average, budget)
- Source tracking and audit trail
- Rate effective dating

### `fx-revaluation.ts`

Revalue monetary assets and liabilities:
- AR/AP revaluation at period end
- Cash account revaluation
- Loan revaluation
- Unrealized gain/loss calculation
- Revaluation journal entries

### `fx-realized-gl.ts`

Calculate realized FX gains/losses:
- Payment settlement vs. invoice booking
- Original rate vs. settlement rate comparison
- Multi-currency payment allocation
- Realized gain/loss journal entries

### `hedge-accounting.ts`

Track hedge accounting relationships:
- Hedge designation (cash flow, fair value, net investment)
- Effectiveness testing (prospective, retrospective)
- Hedge accounting entries (OCI vs. P&L)
- De-designation and rolloff

### `cta-calculator.ts`

Calculate cumulative translation adjustment:
- Opening net assets in functional currency
- Net income in functional currency
- Closing net assets in functional currency
- Translation to reporting currency
- CTA rollforward in equity

### `multi-currency-reporting.ts`

Multi-currency financial reporting:
- Currency triangulation (cross rates)
- Multi-currency trial balance
- Currency segment reporting
- Exchange rate sensitivity analysis

## Compliance

- **IFRS 21**: The Effects of Changes in Foreign Exchange Rates
- **IAS 39**: Financial Instruments - Recognition and Measurement (hedging)
- **IFRS 9**: Financial Instruments (hedge accounting)
- **ASC 830**: Foreign Currency Matters
- **ASC 815**: Derivatives and Hedging

## Related Packages

- [`afenda-consolidation`](../consolidation/README.md) - Uses CTA for group reporting
- [`afenda-accounting`](../accounting/README.md) - Uses FX rates for calculations
- [`afenda-treasury`](../treasury/README.md) - FX exposure management
- [`afenda-statutory-reporting`](../statutory-reporting/README.md) - Multi-currency reporting

## Why This Wins Deals

CFOs managing multinational operations **cannot** produce accurate financial statements without proper FX management. Manual FX processes = audit risk, IFRS/US GAAP non-compliance, and misstated earnings.

This package provides **parity** with SAP Currency Manager and Oracle Multi-Currency capabilities, which are table stakes for global enterprises.
