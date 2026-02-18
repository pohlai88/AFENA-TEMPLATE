# Trade Compliance Package

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--trade--compliance-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


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
