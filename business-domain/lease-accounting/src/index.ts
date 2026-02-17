/**
 * @afenda-lease-accounting
 *
 * ASC 842 / IFRS 16 lease accounting compliance.
 */

// Lease Contracts
export type {
  LeaseContract,
  LeaseClassification,
  LeasePortfolio,
  LeaseTermsUpdate,
} from './services/lease-contracts.js';

export {
  createLeaseContract,
  classifyLease,
  getLeasePortfolio,
  updateLeaseTerms,
} from './services/lease-contracts.js';

// Amortization
export type {
  AmortizationSchedule,
  RightOfUseAsset,
  RecalculatedSchedule,
  AmortizationSummary,
} from './services/amortization.js';

export {
  generateAmortizationSchedule,
  calculateRightOfUse,
  recalculateSchedule,
  getAmortizationSummary,
} from './services/amortization.js';

// Modifications
export type {
  LeaseModification,
  LeaseReassessment,
  TerminationEvaluation,
  ModificationHistory,
} from './services/modifications.js';

export {
  recordModification,
  reassessLease,
  evaluateTermination,
  getModificationHistory,
} from './services/modifications.js';

// Journal Entries
export type {
  LeaseJournalEntry,
  LeaseEntries,
  PostingResult,
  ReversalResult,
  LeaseJournalSummary,
} from './services/journal-entries.js';

export {
  generateLeaseEntries,
  postLeaseJournals,
  reverseLeaseEntry,
  getLeaseJournals,
} from './services/journal-entries.js';

// Analytics
export type {
  LeaseMetrics,
  ComplianceReport,
  PortfolioAnalysis,
  LeaseDashboard,
} from './services/lease-analytics.js';

export {
  getLeaseMetrics,
  getComplianceReport,
  getPortfolioAnalysis,
  getLeaseDashboard,
} from './services/lease-analytics.js';
