# @afenda-project-accounting

<!-- afenda:badges -->
![I - Analytics, Data & Integration](https://img.shields.io/badge/I-Analytics%2C+Data+%26+Integration-00C7E6?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--project--accounting-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-I%20·%20of%2010-lightgrey?style=flat-square)


Enterprise project accounting and cost management.

## Purpose

Layer 2 domain package providing WBS management, project cost tracking, billing,
change orders, and project analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** Project management application layer
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### wbs.ts

- `createWorkBreakdownStructure` - Create project WBS
- `updateWBSElement` - Update WBS element

### cost-tracking.ts

- `recordProjectCost` - Record project cost
- `allocateCost` - Allocate cost to WBS element

### billing.ts

- `generateProjectInvoice` - Generate project invoice
- `recognizeRevenue` - Recognize project revenue

### change-orders.ts

- `createChangeOrder` - Create change order
- `approveChangeOrder` - Approve change order

### project-analytics.ts

- `calculateEarnedValue` - Calculate earned value metrics
- `forecastProjectCompletion` - Forecast completion

## Usage

```typescript
import { recordProjectCost } from 'afenda-project-accounting';

const result = await recordProjectCost(db, orgId, {
  projectId: 'proj-123',
  wbsElementId: 'wbs-456',
  costType: 'labor',
  amountMinor: 500000,
  transactionDate: new Date(),
});
```

## Business Value

- Accurate project cost tracking
- WBS-based cost allocation
- Change order management
- Earned value analysis
- Revenue recognition compliance
