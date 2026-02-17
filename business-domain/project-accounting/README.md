# @afenda-project-accounting

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
import { recordProjectCost } from "afenda-project-accounting";

const result = await recordProjectCost(db, orgId, {
  projectId: "proj-123",
  wbsElementId: "wbs-456",
  costType: "labor",
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
