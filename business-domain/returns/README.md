# Returns Package

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--returns-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


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
} from 'afenda-returns';
```

## Services

1. **Return Authorization**: RMA creation and tracking
2. **Inspection**: Return inspection and disposition management
3. **Warranty**: Warranty validation and claims processing
4. **Refurbishment**: Refurbishment and repair workflows
5. **Returns Analytics**: Returns performance metrics and dashboards
