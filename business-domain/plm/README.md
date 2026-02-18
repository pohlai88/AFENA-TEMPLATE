# PLM Package

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
