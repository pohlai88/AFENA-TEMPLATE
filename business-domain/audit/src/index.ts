/**
 * @afenda-audit
 * 
 * Comprehensive audit trail, change tracking, and compliance reporting.
 */

export {
  logEntityChange,
  trackFieldChange,
  recordSystemAccess,
  queryAuditTrail,
  getEntityHistory,
  getUserActivity,
  verifyAuditIntegrity,
  type LogEntityChangeInput,
  type TrackFieldChangeInput,
  type RecordSystemAccessInput,
  type AuditLog,
  type FieldAudit,
  type AccessLog,
} from './services/audit-logging.js';

export {
  getChangeHistory,
  compareVersions,
  restoreToVersion,
  analyzeUserActivity,
  detectAnomalousActivity,
  getBulkChanges,
  trackSensitiveFieldAccess,
  getChangeFrequency,
  type AnalyzeUserActivityInput,
  type DetectAnomalousActivityInput,
  type ChangeSnapshot,
  type ChangeDiff,
  type UserActivityAnalysis,
  type AnomalousActivity,
} from './services/change-tracking.js';

export {
  generateAuditReport,
  trackRegulatoryChanges,
  reportComplianceStatus,
  getSOXComplianceReport,
  getGDPRComplianceReport,
  exportComplianceEvidence,
  type GenerateAuditReportInput,
  type TrackRegulatoryChangesInput,
  type ComplianceReport,
  type ComplianceFinding,
  type RegulatoryChange,
  type ComplianceStatus,
} from './services/compliance-reporting.js';

export {
  archiveOldRecords,
  purgeExpiredData,
  restoreArchivedData,
  createLegalHold,
  releaseLegalHold,
  getActiveLegalHolds,
  defineRetentionPolicy,
  getRetentionPolicy,
  getEligibleForArchival,
  getEligibleForPurge,
  verifyArchiveIntegrity,
  type ArchiveOldRecordsInput,
  type PurgeExpiredDataInput,
  type RestoreArchivedDataInput,
  type RetentionPolicy,
  type ArchiveRecord,
  type LegalHold,
  type PurgeResult,
} from './services/data-retention.js';

export {
  detectAnomalies,
  buildUserBehaviorProfile,
  detectOffHoursActivity,
  detectBulkOperations,
  detectPrivilegeEscalation,
  detectDataExfiltration,
  investigateAnomaly,
  getAnomalyStatistics,
  getActiveAnomalies,
  configureDetectionRules,
  getDetectionRules,
  calculateAnomalyScore,
  type DetectAnomaliesInput,
  type InvestigateAnomalyInput,
  type SecurityAnomaly,
  type AnomalyPattern,
  type UserBehaviorProfile,
} from './services/anomaly-detection.js';
