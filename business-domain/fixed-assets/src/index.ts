/**
 * @afenda-fixed-assets
 * 
 * Enterprise fixed asset and depreciation management.
 */

export {
  acquireAsset,
  transferAsset,
  disposeAsset,
  type AssetAcquisition,
  type AssetTransfer,
  type AssetDisposal,
} from './services/asset-lifecycle.js';

export {
  calculateDepreciation,
  postDepreciation,
  type DepreciationCalculation,
  type DepreciationPosting,
} from './services/depreciation.js';

export {
  scheduleMaintenance,
  recordRepair,
  type MaintenanceSchedule,
  type RepairRecord,
} from './services/asset-maintenance.js';

export {
  conductPhysicalCount,
  reconcileAssets,
  type PhysicalCount,
  type AssetReconciliation,
} from './services/physical-inventory.js';

export {
  calculateAssetROI,
  analyzeUtilization,
  type AssetROI,
  type UtilizationAnalysis,
} from './services/asset-analytics.js';
