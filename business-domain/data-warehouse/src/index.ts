/**
 * @afenda-data-warehouse
 * 
 * Enterprise data warehouse and ETL management.
 */

export {
  createETLJob,
  executeETL,
  type ETLJob,
  type ETLExecution,
} from './services/etl.js';

export {
  createDimension,
  createFactTable,
  type Dimension,
  type FactTable,
} from './services/dimensional-modeling.js';

export {
  validateDataQuality,
  monitorDataFreshness,
  type DataQualityReport,
  type FreshnessMetrics,
} from './services/data-quality.js';

export {
  registerDataAsset,
  trackDataLineage,
  type DataAsset,
  type DataLineage,
} from './services/metadata-management.js';

export {
  analyzeWarehouseUsage,
  optimizePerformance,
  type WarehouseUsage,
  type PerformanceOptimization,
} from './services/warehouse-analytics.js';
