# Returns Package

Returns and reverse logistics management with RMA processing, inspection,
warranty claims, refurbishment, and returns analytics.

## Features

- **Return Authorization (RMA)**: Create and track return authorizations
- **Inspection**: Inspect returned items and set disposition
- **Warranty**: Check warranty coverage and process claims
- **Refurbishment**: Refurbishment and repair order management
- **Returns Analytics**: Return rates, reasons, and recovery value analysis

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
    createRMA,
    inspectReturn,
    checkWarranty,
    createRefurbOrder,
    getReturnRates,
} from "afenda-returns";
```

## Services

1. **Return Authorization**: RMA creation and tracking
2. **Inspection**: Return inspection and disposition management
3. **Warranty**: Warranty validation and claims processing
4. **Refurbishment**: Refurbishment and repair workflows
5. **Returns Analytics**: Returns performance metrics and dashboards
