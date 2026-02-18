# Trade Compliance Package

Global trade and customs management for afenda NEXUS.

## Purpose

Comprehensive trade compliance from customs declarations through landed cost
calculation, restricted party screening, and trade documentation management.

## Features

- **Customs Declaration**: HS codes, country of origin, customs documentation
- **Landed Cost**: Duties, brokerage fees, freight allocation to inventory
- **Restricted Party**: Denied party screening, sanctions compliance
- **Trade Documentation**: Commercial invoice, packing list, certificates of origin
- **Analytics**: Duty costs, clearance time, compliance audit trail

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  createCustomsDeclaration,
  calculateLandedCost,
  screenRestrictedParty,
  generateTradeDocuments,
  getTradeMetrics,
} from 'afenda-trade-compliance';
```

## Services

1. **Customs Declaration**: HS code classification, customs forms
2. **Landed Cost**: Duty and freight cost allocation
3. **Restricted Party**: Sanctions and denied party screening
4. **Trade Documentation**: Export/import document generation
5. **Analytics**: Trade metrics and compliance reporting

## Business Value

- Ensure customs compliance and avoid penalties
- Accurate landed cost calculations for inventory valuation
- Automated restricted party screening
- Faster customs clearance with complete documentation
