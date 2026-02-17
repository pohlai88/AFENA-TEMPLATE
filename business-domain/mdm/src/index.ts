/**
 * Master Data Management (MDM) Package
 * Provides single source of truth for enterprise reference data
 */

// Golden Records
export type { GoldenRecord, DuplicateGroup } from './services/golden-records.js';
export {
  mergeRecords,
  identifyDuplicates,
  createGoldenRecord,
  unlinkRecords,
} from './services/golden-records.js';

// Data Stewardship
export type {
  DataSteward,
  ChangeRequest,
  ChangeApproval,
  PendingRequestsSummary,
} from './services/data-stewardship.js';
export {
  assignDataSteward,
  createChangeRequest,
  approveChangeRequest,
  getPendingRequests,
} from './services/data-stewardship.js';

// Code Generation
export type {
  GeneratedCode,
  CodeTemplate,
  CodeValidation,
  SequenceInfo,
} from './services/code-generation.js';
export {
  generateCode,
  createCodeTemplate,
  validateCode,
  getNextSequence,
} from './services/code-generation.js';

// Data Quality
export type {
  QualityRule,
  QualityCheckResult,
  QualityScore,
  QualityIssue,
} from './services/data-quality.js';
export {
  createQualityRule,
  runQualityCheck,
  getQualityScore,
  getQualityIssues,
} from './services/data-quality.js';

// MDM Analytics
export type {
  CompletenessMetrics,
  AccuracyMetrics,
  DuplicateMetrics,
  MDMDashboard,
} from './services/mdm-analytics.js';
export {
  getCompletenessMetrics,
  getAccuracyMetrics,
  getDuplicateMetrics,
  getMDMDashboard,
} from './services/mdm-analytics.js';
