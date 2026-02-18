# Lease Accounting Package

ASC 842 / IFRS 16 lease accounting compliance for afenda NEXUS.

## Purpose

Comprehensive lease lifecycle management from contract creation through ROU
asset depreciation, lease liability amortization, modifications, and automated
journal entries.

## Features

- **Lease Contracts**: Lease contract management, classification
  (finance/operating)
- **Amortization**: Lease liability amortization schedules, ROU asset
  depreciation
- **Modifications**: Lease modifications, reassessments, terminations
- **Journal Entries**: Automated GL entries for lease transactions
- **Analytics**: Lease portfolio metrics, compliance dashboards

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  createLeaseContract,
  generateAmortizationSchedule,
  generateLeaseEntries,
  getLeaseMetrics,
  recordModification,
} from 'afenda-lease-accounting';
```

## Services

1. **Lease Contracts**: Lease identification, terms capture, classification
2. **Amortization**: ROU asset and lease liability calculations
3. **Modifications**: Lease modifications and remeasurement
4. **Journal Entries**: Automated accounting entries
5. **Analytics**: Portfolio tracking and compliance reporting

## Business Value

- ASC 842 / IFRS 16 compliance
- Automated lease accounting calculations
- Audit-ready lease documentation
- Real-time lease portfolio visibility
