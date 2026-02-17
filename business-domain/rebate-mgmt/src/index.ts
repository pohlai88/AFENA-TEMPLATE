/**
 * Rebate Management Package
 * Customer rebates, volume incentives, and accrual management
 */

// Rebate Programs
export type {
  RebateProgram,
  ProgramStatusUpdate,
  ProgramList,
  TierCalculation,
} from './services/rebate-programs.js';
export {
  createRebateProgram,
  updateProgramStatus,
  getPrograms,
  calculateTier,
} from './services/rebate-programs.js';

// Accrual Calculation
export type {
  RebateAccrual,
  BatchAccrualResult,
  AccrualSummary,
  RebateForecast,
} from './services/accrual-calculation.js';
export {
  calculateRebateAccrual,
  batchCalculateAccruals,
  getAccrualSummary,
  forecastRebate,
} from './services/accrual-calculation.js';

// Claims Processing
export type {
  RebateClaim,
  ClaimReview,
  ClaimPayment,
  ClaimsList,
} from './services/claims-processing.js';
export {
  submitRebateClaim,
  reviewClaim,
  processPayment,
  getClaims,
} from './services/claims-processing.js';

// Compliance
export type {
  ComplianceCheck,
  AuditTrail,
  Chargeback,
  ComplianceReport,
} from './services/compliance.js';
export {
  verifyRebateCompliance,
  getAuditTrail,
  recordChargeback,
  generateComplianceReport,
} from './services/compliance.js';

// Rebate Analytics
export type {
  RebateMetrics,
  ProgramPerformance,
  LiabilityAnalysis,
  RebateDashboard,
} from './services/rebate-analytics.js';
export {
  getRebateMetrics,
  getProgramPerformance,
  getLiabilityAnalysis,
  getRebateDashboard,
} from './services/rebate-analytics.js';
