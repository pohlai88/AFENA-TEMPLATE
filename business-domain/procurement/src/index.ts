/**
 * @afenda-procurement
 * 
 * Enterprise procurement and sourcing management.
 * Handles requisitions, RFQ/RFP, vendor qualification, and spend analytics.
 */

// Requisition management
export {
  createRequisition,
  routeForApproval,
  consolidateRequisitions,
  type RequisitionParams,
  type RequisitionResult,
  type ApprovalChainResult,
} from './services/requisition-management.js';

// Sourcing & RFQ
export {
  createRFQ,
  evaluateBids,
  awardRFQ,
  type RFQParams,
  type BidEvaluation,
  type RFQAward,
} from './services/sourcing-rfq.js';

// Vendor management
export {
  qualifyVendor,
  rankVendors,
  assessVendorPerformance,
  type VendorQualification,
  type VendorRanking,
  type VendorPerformance,
} from './services/vendor-management.js';

// Contract management
export {
  createPurchaseContract,
  releaseFromContract,
  trackContractCompliance,
  type ContractParams,
  type ContractRelease,
  type ComplianceTracking,
} from './services/contract-management.js';

// Spend analytics
export {
  analyzeSpendByCategory,
  identifySavingsOpportunities,
  trackMaverickSpend,
  type SpendAnalysis,
  type SavingsOpportunity,
  type MaverickSpend,
} from './services/spend-analytics.js';
