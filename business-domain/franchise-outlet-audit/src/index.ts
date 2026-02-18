/**
 * @fileoverview Franchise Outlet Audit Package
 * 
 * Provides comprehensive audit management for franchise outlets including:
 * - Multi-type audits (Quality, Health/Safety, Brand Standards, Operational, Financial, Mystery Shopper)
 * - Finding tracking and evidence management
 * - Corrective action plans with verification workflow
 * - Continuous improvement initiatives
 * - Audit scheduling and compliance monitoring
 * - Performance analytics and benchmarking
 * 
 * @module @afenda/franchise-outlet-audit
 */

// Types
export type {
    ActionPlanTracking, AuditCategory,
    AuditFinding, AuditSchedule,
    AuditSummary, AuditTrend,
    BenchmarkData, CategoryPerformance, ContinuousImprovement, CorrectiveAction, OutletAudit, OutletPerformance
} from './types/common.js';

export {
    ActionStatus, AuditResult, AuditStatus, AuditType, CIPriority, FindingSeverity, auditCategorySchema,
    auditFindingSchema, auditScheduleSchema, continuousImprovementSchema, correctiveActionSchema, outletAuditSchema
} from './types/common.js';

// Audit Execution Services
export {
    addCategoryScore,
    calculateOverallScore, compareWithPreviousAudit, completeAudit, createAudit, determineAuditResult,
    generateAuditChecklist, getOutletAudits,
    startAudit, validateAuditCompletion
} from './services/audit-execution';

// Findings Management Services
export {
    calculateOutletRiskScore, categorizeSeverity, createFinding, exportFindings, generateFindingsSummary, getAuditFindings,
    getRecurringFindings, identifyFindingPatterns, prioritizeFindings
} from './services/findings-management';

// Corrective Actions Services
export {
    assignAction, calculateCompletionRate, completeAction, createAction, determineActionPriority, escalateAction, generateActionPlanSummary, generateActionReport, getActions, getOverdueActions, trackActionEffectiveness, updateActionStatus, verifyAction
} from './services/corrective-actions';

// Continuous Improvement Services
export {
    calculateImprovement, calculateInitiativeROI, completeInitiative, createInitiative, generateImprovementDashboard, generatePDCAReport, getActiveInitiatives, identifyImprovementOpportunities, prioritizeInitiatives, updateProgress
} from './services/continuous-improvement';

// Audit Scheduling Services
export {
    adjustFrequency, createSchedule, determineAuditFrequency,
    generateAuditCalendar, generateScheduleComplianceReport, getOutletSchedules,
    getUpcomingAudits, identifyOverdueAudits, identifySchedulingConflicts,
    optimizeSchedule, updateScheduleAfterAudit
} from './services/audit-scheduling';

// Audit Analytics Services
export {
    benchmarkOutlets, calculateAuditCoverage, calculatePerformanceScore, generateCategoryHeatmap, generateExecutiveDashboard, getAuditSummary, getCategoryPerformance, getOutletPerformance, identifyAtRiskOutlets, identifyTopPerformers, trackAuditTrends
} from './services/audit-analytics';


