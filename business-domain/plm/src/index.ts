/**
 * PLM Package
 * Product lifecycle and engineering change management with ECO/ECN, BOM versioning, and analytics
 */

// Engineering Change
export type {
  ECO,
  ECOApproval,
  ECOImplementation,
  ECOStatus,
} from './services/engineering-change.js';
export {
  createECO,
  approveECO,
  implementECO,
  getECOStatus,
} from './services/engineering-change.js';

// BOM Versioning
export type {
  BOMVersion,
  BOMEffectivity,
  BOMComparison,
  BOMHistory,
} from './services/bom-versioning.js';
export {
  versionBOM,
  setEffectivity,
  compareBOMVersions,
  getBOMHistory,
} from './services/bom-versioning.js';

// Impact Analysis
export type {
  CostImpact,
  InventoryImpact,
  OrderImpact,
  ImpactReport,
} from './services/impact-analysis.js';
export {
  analyzeCostImpact,
  analyzeInventoryImpact,
  analyzeOrderImpact,
  getImpactReport,
} from './services/impact-analysis.js';

// Specifications
export type {
  Specification,
  Tolerance,
  SpecificationLink,
  ComplianceValidation,
} from './services/specifications.js';
export {
  defineSpecification,
  addTolerance,
  linkToItem,
  validateCompliance,
} from './services/specifications.js';

// PLM Analytics
export type {
  ChangeMetrics,
  CycleTimeAnalysis,
  ChangeVolume,
  PLMDashboard,
} from './services/plm-analytics.js';
export {
  getChangeMetrics,
  analyzeCycleTime,
  getChangeVolume,
  getPLMDashboard,
} from './services/plm-analytics.js';
