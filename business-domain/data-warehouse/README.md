# @afenda-data-warehouse

<!-- afenda:badges -->
![I - Analytics, Data & Integration](https://img.shields.io/badge/I-Analytics%2C+Data+%26+Integration-00C7E6?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--data--warehouse-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-I%20·%20of%2010-lightgrey?style=flat-square)


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
import { createETLJob } from 'afenda-data-warehouse';

const result = await createETLJob(db, orgId, {
  jobName: 'Daily Sales ETL',
  source: 'oltp-sales',
  target: 'dw-fact-sales',
  schedule: 'daily',
});
```

## Business Value

- Centralized data repository
- Dimensional modeling for analytics
- Data quality assurance
- ETL automation and monitoring
- Performance optimization
