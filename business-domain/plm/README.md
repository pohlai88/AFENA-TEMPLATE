# PLM Package

<!-- afenda:badges -->
![D - Manufacturing & Quality](https://img.shields.io/badge/D-Manufacturing+%26+Quality-6554C0?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--plm-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-D%20·%20of%2010-lightgrey?style=flat-square)


Product lifecycle and engineering change management with ECO/ECN workflows,
BOM versioning, impact analysis, specifications, and PLM analytics.

## Features

- **Engineering Change**: ECO/ECN creation, approval, and implementation
- **BOM Versioning**: Version control and effectivity for BOMs
- **Impact Analysis**: Cost, inventory, and order impact analysis
- **Specifications**: Product specs, tolerances, and compliance
- **PLM Analytics**: Change metrics, cycle time, and volume analysis

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  createECO,
  versionBOM,
  analyzeCostImpact,
  defineSpecification,
  getChangeMetrics,
} from 'afenda-plm';
```

## Services

1. **Engineering Change**: Engineering change order (ECO/ECN) management
2. **BOM Versioning**: Bill of materials version control and comparison
3. **Impact Analysis**: Multi-dimensional impact analysis for changes
4. **Specifications**: Product and component specification management
5. **PLM Analytics**: Product lifecycle metrics and dashboards
