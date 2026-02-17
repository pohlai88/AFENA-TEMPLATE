/**
 * Access Governance Package
 * Enterprise access governance, RBAC, SoD, and access certification
 */

// Role Management
export type { Role, RoleAssignment, RevokeResult, UserRoles } from './services/role-management.js';
export { createRole, assignRole, revokeRole, getUserRoles } from './services/role-management.js';

// Access Requests
export type {
  AccessRequest,
  AccessApproval,
  PendingApprovals,
  BulkProvisionResult,
} from './services/access-requests.js';
export {
  requestAccess,
  approveAccessRequest,
  getPendingApprovals,
  bulkProvision,
} from './services/access-requests.js';

// SoD Rules
export type { SoDRule, SoDEvaluation, SoDViolations, SoDMitigation } from './services/sod-rules.js';
export {
  createSoDRule,
  evaluateSoDRules,
  getSoDViolations,
  mitigateSoDViolation,
} from './services/sod-rules.js';

// Access Reviews
export type {
  AccessReview,
  AccessCertification,
  ReviewProgress,
  PendingReviewItems,
} from './services/access-reviews.js';
export {
  createAccessReview,
  certifyUserAccess,
  getReviewProgress,
  getPendingReviewItems,
} from './services/access-reviews.js';

// Governance Analytics
export type {
  GovernanceMetrics,
  RiskScore,
  ComplianceReport,
  GovernanceDashboard,
} from './services/governance-analytics.js';
export {
  getGovernanceMetrics,
  getRiskScore,
  getComplianceReport,
  getGovernanceDashboard,
} from './services/governance-analytics.js';
