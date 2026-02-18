# @afenda/consolidation

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--consolidation-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Multi-level consolidation, intercompany elimination, and group reporting for multinational enterprises.

## Purpose

Provides financial consolidation capabilities for public companies and multinational enterprises, supporting IFRS 10 and ASC 810 compliance. Manages complex ownership structures, automatic intercompany eliminations, currency translation with CTA tracking, and multi-level consolidation hierarchies.

## When to Use This Package

Use `afenda-consolidation` when you need to:

- Produce consolidated financial statements for group entities
- Eliminate intercompany transactions (sales, purchases, balances)
- Calculate non-controlling interest (NCI) for partial ownership
- Apply equity method accounting for associates
- Perform currency translation with CTA (Cumulative Translation Adjustment)
- Handle multi-level consolidation hierarchies
- Generate purchase price allocation and goodwill tracking
- Support IFRS 10, IAS 28, ASC 810, ASC 323 compliance

**Do NOT use directly** - Import through `afenda-crud` which provides authorization and audit logging.

## Key Concepts

### Consolidation Hierarchy

Multi-level entity ownership structures:
- **Parent**: Ultimate controlling entity
- **Subsidiary**: >50% owned, full consolidation
- **Associate**: 20-50% owned, equity method
- **JV**: Joint venture, proportionate consolidation
- **NCI**: Non-controlling interest calculation

### Elimination Rules

Automatic intercompany elimination:
- **Intercompany Revenue/COGS**: Eliminate sales between group companies
- **Intercompany Balances**: Eliminate AR/AP between group companies
- **Unrealized Profit**: Eliminate profit on inventory not sold externally
- **Dividends**: Eliminate dividends paid within group

### Currency Translation

Multi-currency consolidation:
- **Current Rate Method**: Assets/liabilities at closing rate, equity at historical
- **Temporal Method**: Monetary items at closing rate, non-monetary at historical
- **CTA Tracking**: Cumulative translation adjustment in equity

### Equity Method

For associates (20-50% ownership):
- Track investment at cost + share of earnings
- Adjust for dividends received
- Recognize share of other comprehensive income (OCI)

## Quick Start

```typescript
import { db } from 'afenda-database';
import {
  buildConsolidationHierarchy,
  generateEliminationEntries,
  calculateNCI,
  applyEquityMethod,
  translateCurrency,
} from 'afenda-consolidation';

// Build consolidation hierarchy
const hierarchy = await buildConsolidationHierarchy(db, 'org-123', {
  parentEntityId: 'parent-inc',
  asOfDate: '2026-12-31',
});

// Generate elimination entries
const eliminations = await generateEliminationEntries(db, 'org-123', {
  consolidationSetId: 'cset-2026-q4',
  fiscalPeriodId: 'period-2026-12',
  eliminationTypes: ['revenue_cogs', 'balances', 'unrealized_profit'],
});

// Calculate non-controlling interest
const nci = await calculateNCI(db, 'org-123', {
  subsidiaryId: 'sub-xyz',
  fiscalPeriodId: 'period-2026-12',
  ownershipPercent: '75.00',
});

// Apply equity method for associate
const equityAdjustment = await applyEquityMethod(db, 'org-123', {
  associateId: 'assoc-abc',
  fiscalPeriodId: 'period-2026-12',
  ownershipPercent: '35.00',
  shareOfEarnings: 250000,
  dividendsReceived: 50000,
});

// Translate foreign subsidiary to group currency
const translated = await translateCurrency(db, 'org-123', {
  entityId: 'foreign-sub',
  fromCurrency: 'EUR',
  toCurrency: 'USD',
  asOfDate: '2026-12-31',
  translationMethod: 'current_rate',
});
```

## Architecture

**Layer**: 2 (Domain Service)

**Dependencies**:
- `afenda-canon` - Entity types and schemas
- `afenda-database` - Database schema and ORM
- `afenda-logger` - Structured logging
- `drizzle-orm` - SQL query builder

**Depends on**:
- `legal-entity-management` - Entity hierarchy and ownership
- `intercompany` - Intercompany transaction data
- `accounting` - Base financial data
- `fx-management` - Foreign exchange rates

## Services

### `consolidation-hierarchy.ts`

Build multi-level entity hierarchies for consolidation:
- Entity ownership percentages
- Consolidation method determination (full, equity, proportionate)
- Control vs. significant influence classification
- Effective dating for ownership changes

### `elimination-engine.ts`

Generate automatic elimination entries:
- Intercompany revenue/expense elimination
- Intercompany balance elimination
- Unrealized profit elimination
- Dividend elimination
- Investment elimination (for equity method)

### `nci-calculator.ts`

Calculate non-controlling interest:
- NCI share of subsidiary earnings
- NCI share of other comprehensive income
- NCI balance sheet presentation
- Changes in NCI (transactions with non-controlling shareholders)

### `equity-method.ts`

Apply equity method accounting for associates:
- Investment at cost + share of earnings
- Dividend adjustments
- Share of OCI
- Impairment testing

### `currency-translator.ts`

Translate foreign subsidiaries to group currency:
- Current rate method (CTA to equity)
- Temporal method (translation gains/losses to P&L)
- Hyperinflationary economies (IAS 29)
- Rate sourcing from fx-management

### `consolidation-workbench.ts`

Orchestrate full consolidation process:
1. Build hierarchy
2. Gather financial data from entities
3. Apply currency translation
4. Generate eliminations
5. Calculate NCI
6. Apply equity method
7. Aggregate consolidated financials

## Compliance

- **IFRS 10**: Consolidated Financial Statements
- **IAS 27**: Separate Financial Statements
- **IAS 28**: Investments in Associates and Joint Ventures
- **IAS 21**: Effects of Changes in Foreign Exchange Rates
- **IFRS 3**: Business Combinations
- **ASC 810**: Consolidation
- **ASC 323**: Investments - Equity Method and Joint Ventures
- **ASC 830**: Foreign Currency Matters

## Related Packages

- [`afenda-legal-entity-management`](../legal-entity-management/README.md) - Entity ownership structures
- [`afenda-intercompany`](../intercompany/README.md) - Intercompany transactions
- [`afenda-accounting`](../accounting/README.md) - Base accounting data
- [`afenda-fx-management`](../fx-management/README.md) - Foreign exchange rates
- [`afenda-statutory-reporting`](../statutory-reporting/README.md) - Local GAAP reporting

## Why This Wins Deals

Public companies and multinational enterprises **cannot** file consolidated financial statements (10-K, 10-Q, IFRS annual reports) without proper consolidation capabilities. This is a **hard blocker** for:

- Public companies (SEC, stock exchanges)
- Companies with subsidiaries in multiple countries
- Private equity / holding companies
- Companies preparing for IPO

SAP S/4HANA and Oracle ERP Cloud win enterprise deals because they have robust consolidation modules. This package provides **parity** with those capabilities.
