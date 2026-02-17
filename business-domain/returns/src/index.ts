/**
 * Returns Package
 * Returns and reverse logistics management with RMA processing, inspection, and analytics
 */

// Return Authorization
export type {
  RMA,
  RMAApproval,
  ReturnTracking,
  RMAStatus,
} from './services/return-authorization.js';
export {
  createRMA,
  approveRMA,
  trackReturn,
  getRMAStatus,
} from './services/return-authorization.js';

// Inspection
export type {
  InspectionResult,
  Disposition,
  DefectRecord,
  InspectionSummary,
} from './services/inspection.js';
export {
  inspectReturn,
  setDisposition,
  recordDefect,
  getInspectionResults,
} from './services/inspection.js';

// Warranty
export type {
  WarrantyStatus,
  WarrantyClaim,
  CoverageCalculation,
  WarrantyHistory,
} from './services/warranty.js';
export {
  checkWarranty,
  processClaim,
  calculateCoverage,
  getWarrantyHistory,
} from './services/warranty.js';

// Refurbishment
export type {
  RefurbOrder,
  RepairTracking,
  RepairPartsConsumption,
  RefurbishmentCompletion,
} from './services/refurbishment.js';
export {
  createRefurbOrder,
  trackRepair,
  consumeRepairParts,
  completeRefurbishment,
} from './services/refurbishment.js';

// Returns Analytics
export type {
  ReturnRates,
  ReturnReasonsAnalysis,
  RecoveryValueAnalysis,
  ReturnsDashboard,
} from './services/returns-analytics.js';
export {
  getReturnRates,
  analyzeReturnReasons,
  calculateRecoveryValue,
  getReturnsDashboard,
} from './services/returns-analytics.js';
