/**
 * Contract Management Package
 * Sales contract lifecycle management with obligation tracking, renewals, and compliance
 */

// Contract Repository
export type {
  Contract,
  ContractSearchResult,
  ContractDetails,
} from './services/contract-repository.js';
export {
  createContract,
  updateContract,
  searchContracts,
  getContractDetails,
} from './services/contract-repository.js';

// Obligation Tracking
export type {
  Obligation,
  DeliverableTracking,
  MilestoneUpdate,
  ObligationStatus,
} from './services/obligation-tracking.js';
export {
  addObligation,
  trackDeliverables,
  updateMilestone,
  getObligationStatus,
} from './services/obligation-tracking.js';

// Renewals
export type {
  RenewalCandidate,
  RenewalOpportunity,
  RenewalProcessing,
  RenewalPipeline,
} from './services/renewals.js';
export {
  identifyRenewals,
  createRenewalOpportunity,
  processRenewal,
  getRenewalPipeline,
} from './services/renewals.js';

// Contract Analytics
export type {
  ContractMetrics,
  ContractValueAnalysis,
  RenewalForecast,
  ContractDashboard,
} from './services/contract-analytics.js';
export {
  getContractMetrics,
  analyzeContractValue,
  getRenewalForecast,
  getContractDashboard,
} from './services/contract-analytics.js';

// Compliance Monitoring
export type {
  ComplianceCheck,
  ComplianceViolation,
  ComplianceReport,
  ComplianceAlert,
} from './services/compliance-monitoring.js';
export {
  checkCompliance,
  recordViolation,
  generateComplianceReport,
  getComplianceAlerts,
} from './services/compliance-monitoring.js';
