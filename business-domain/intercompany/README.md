# @afenda/intercompany

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--intercompany-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Intercompany transaction management for multi-entity organizations.

## Purpose

Manages transactions between companies within the same organization, enabling
proper tracking, matching, and elimination for consolidated financial reporting.

## When to Use This Package

- Recording transactions between related companies (invoices, payments,
  transfers)
- Matching intercompany receivables and payables
- Generating elimination entries for consolidated reporting
- Cross-entity reconciliation workflows
- Managing intercompany pricing and settlements

## Key Concepts

### Intercompany Transactions

Transactions between two companies in the same organization that require:

- Dual-sided recording (source and target)
- Matching validation
- Elimination for consolidation
- Audit trail maintenance

### Transaction Types

- **Invoice**: Sales/purchases between companies
- **Payment**: Cash transfers between companies
- **Transfer**: Asset/inventory transfers
- **Allocation**: Cost/revenue allocations
- **Elimination**: Consolidation adjustments

### Status Tracking

- `pending`: Transaction recorded, awaiting matching
- `matched`: Both sides reconciled
- `eliminated`: Consolidated in group reporting
- `disputed`: Mismatch requiring resolution

## Dependencies

- `afenda-canon`: Entity types and schemas
- `afenda-database`: Schema definitions
- `afenda-logger`: Logging

## Public API

```typescript
import {
  createIntercompanyTransaction,
  type EliminationEntry,
  generateEliminationEntries,
  type IntercompanyPairResult,
  matchIntercompanyTransactions,
} from 'afenda-intercompany';
```

## Usage Examples

### Create Intercompany Invoice

```typescript
const result = await createIntercompanyTransaction(tx, orgId, {
  sourceCompanyId: 'company-a',
  targetCompanyId: 'company-b',
  transactionType: 'invoice',
  amountMinor: 100000,
  baseAmountMinor: 100000,
  currencyCode: 'USD',
  memo: 'Intercompany sale of goods',
});
```

### Match Transactions

```typescript
const matched = await matchIntercompanyTransactions(db, orgId, {
  companyIds: ['company-a', 'company-b'],
  fiscalPeriodId: 'period-2024-q1',
});
```

### Generate Eliminations

```typescript
const eliminations = await generateEliminationEntries(db, orgId, {
  fiscalPeriodId: 'period-2024-q1',
  consolidationLevel: 'group',
});
```
