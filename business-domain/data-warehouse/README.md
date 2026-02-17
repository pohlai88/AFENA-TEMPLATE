# @afenda-data-warehouse

Enterprise data warehouse and ETL management.

## Purpose

Layer 2 domain package providing ETL pipeline management, dimensional modeling,
data quality monitoring, metadata management, and warehouse analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** Analytics and BI layers
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### etl.ts

- `createETLJob` - Create ETL job definition
- `executeETL` - Execute ETL job

### dimensional-modeling.ts

- `createDimension` - Create dimension table
- `createFactTable` - Create fact table

### data-quality.ts

- `validateDataQuality` - Run data quality checks
- `monitorDataFreshness` - Monitor data freshness

### metadata-management.ts

- `registerDataAsset` - Register data asset
- `trackDataLineage` - Track data lineage

### warehouse-analytics.ts

- `analyzeWarehouseUsage` - Analyze warehouse usage
- `optimizePerformance` - Optimize query performance

## Usage

```typescript
import { createETLJob } from "afenda-data-warehouse";

const result = await createETLJob(db, orgId, {
  jobName: "Daily Sales ETL",
  source: "oltp-sales",
  target: "dw-fact-sales",
  schedule: "daily",
});
```

## Business Value

- Centralized data repository
- Dimensional modeling for analytics
- Data quality assurance
- ETL automation and monitoring
- Performance optimization
