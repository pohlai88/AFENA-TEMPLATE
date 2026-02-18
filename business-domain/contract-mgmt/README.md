# Contract Management Package

Sales contract lifecycle management with obligation tracking, renewal
processing, and compliance monitoring.

## Features

- **Contract Repository**: Central repository for all customer contracts
- **Obligation Tracking**: Track deliverables, milestones, and commitments
- **Renewals**: Automated renewal identification and opportunity creation
- **Contract Analytics**: Contract value analysis and renewal forecasting
- **Compliance Monitoring**: Ensure contract compliance and track violations

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  addObligation,
  checkCompliance,
  createContract,
  getContractMetrics,
  identifyRenewals,
} from 'afenda-contract-mgmt';
```

## Services

1. **Contract Repository**: Create, update, search, and manage contracts
2. **Obligation Tracking**: Track and manage contract obligations and
   deliverables
3. **Renewals**: Manage contract renewal pipeline and opportunities
4. **Contract Analytics**: Contract performance metrics and dashboards
5. **Compliance Monitoring**: Monitor compliance and generate reports
