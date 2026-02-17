/**
 * @afenda-regulatory-reporting
 * 
 * Enterprise regulatory compliance and reporting.
 */

export {
  performSOXControl,
  certifySOXCompliance,
  type SOXControlTest,
  type SOXCertification,
} from './services/sox-compliance.js';

export {
  logAuditEvent,
  queryAuditTrail,
  type AuditEvent,
  type AuditQuery,
} from './services/audit-trails.js';

export {
  createComplianceTask,
  trackComplianceStatus,
  type ComplianceTask,
  type ComplianceStatus,
} from './services/compliance-management.js';

export {
  generateRegulatoryFiling,
  submitFiling,
  type RegulatoryFiling,
  type FilingSubmission,
} from './services/regulatory-filings.js';

export {
  analyzeComplianceRisk,
  generateComplianceScore,
  type ComplianceRisk,
  type ComplianceScore,
} from './services/compliance-analytics.js';
