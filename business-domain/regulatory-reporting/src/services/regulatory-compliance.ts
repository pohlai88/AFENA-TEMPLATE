/**
 * Regulatory Compliance Service
 * Handles regulatory reporting, compliance tracking, audit trails, and violation management
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface RegulatoryReport {
  reportId: string;
  regulatorId: string;
  regulatorName: string;
  reportType: 'PERIODIC' | 'AD_HOC' | 'INCIDENT' | 'THEMATIC';
  category: 'FINANCIAL' | 'OPERATIONAL' | 'RISK' | 'CAPITAL' | 'LIQUIDITY' | 'ESG' | 'CONSUMER_PROTECTION';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  periodEnd: Date;
  dueDate: Date;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  submittedDate?: Date;
  confirmationNumber?: string;
  preparedBy: string;
  reviewedBy?: string;
  dataPoints: RegulatoryDataPoint[];
}

export interface RegulatoryDataPoint {
  dataPointId: string;
  code: string;
  description: string;
  value: string | number;
  unit?: string;
  validationRule?: string;
  isValid: boolean;
  validationErrors?: string[];
}

export interface ComplianceObligation {
  obligationId: string;
  regulation: string;
  jurisdiction: string;
  category: 'LICENSING' | 'REPORTING' | 'DISCLOSURE' | 'CAPITAL_REQUIREMENT' | 
            'OPERATIONAL' | 'CONDUCT' | 'DATA_PROTECTION';
  description: string;
  frequency?: RegulatoryReport['frequency'];
  nextDueDate?: Date;
  responsibleParty: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'IN_PROGRESS' | 'NOT_APPLICABLE';
  lastReviewDate?: Date;
}

export interface ComplianceViolation {
  violationId: string;
  obligationId: string;
  violationType: 'BREACH' | 'LATE_FILING' | 'INCOMPLETE_DATA' | 'THRESHOLD_EXCEEDANCE' | 'OTHER';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detectedDate: Date;
  description: string;
  rootCause?: string;
  correctiveActions: CorrectiveAction[];
  status: 'OPEN' | 'IN_REMEDIATION' | 'RESOLVED' | 'REPORTED_TO_REGULATOR';
  regulatorNotified: boolean;
  fineAmount?: number;
}

export interface CorrectiveAction {
  actionId: string;
  description: string;
  assignedTo: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  effectiveness?: 'EFFECTIVE' | 'INEFFECTIVE' | 'TO_BE_DETERMINED';
}

export interface AuditTrail {
  auditId: string;
  entityType: 'REPORT' | 'OBLIGATION' | 'VIOLATION' | 'DATA_POINT';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'SUBMIT' | 'APPROVE' | 'REJECT' | 'DELETE';
  performedBy: string;
  performedAt: Date;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  reason?: string;
}

export interface RegulatoryChange {
  changeId: string;
  regulatorId: string;
  effectiveDate: Date;
  changeType: 'NEW_REGULATION' | 'AMENDMENT' | 'REPEAL' | 'GUIDANCE';
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedObligations: string[];
  implementationStatus: 'PENDING' | 'IN_PROGRESS' | 'IMPLEMENTED';
  dueDate?: Date;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createRegulatoryReport(
  report: Omit<RegulatoryReport, 'reportId'>
): Promise<RegulatoryReport> {
  // TODO: Implement with Drizzle ORM
  // const reportId = generateRegReportId();
  // return await db.insert(regulatoryReports).values({ ...report, reportId }).returning();
  throw new Error('Not implemented');
}

export async function submitReport(reportId: string, submittedBy: string): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function recordViolation(
  violation: Omit<ComplianceViolation, 'violationId'>
): Promise<ComplianceViolation> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createCorrectiveAction(
  violationId: string,
  action: Omit<CorrectiveAction, 'actionId'>
): Promise<CorrectiveAction> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function logAuditTrail(trail: Omit<AuditTrail, 'auditId'>): Promise<AuditTrail> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function trackRegulatoryChange(
  change: Omit<RegulatoryChange, 'changeId'>
): Promise<RegulatoryChange> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getObligationsByRegulator(regulatorId: string): Promise<ComplianceObligation[]> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateRegReportId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `REG-${dateStr}-${sequence}`;
}

export function validateDataPoints(dataPoints: RegulatoryDataPoint[]): {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  errors: Array<{ dataPointId: string; code: string; errors: string[] }>;
} {
  let errorCount = 0;
  let warningCount = 0;
  const errors: Array<{ dataPointId: string; code: string; errors: string[] }> = [];

  dataPoints.forEach(dp => {
    const pointErrors: string[] = [];

    // Validate presence
    if (dp.value === null || dp.value === undefined || dp.value === '') {
      pointErrors.push('Value is required');
      errorCount++;
    }

    // Validate numeric values
    if (dp.validationRule?.includes('numeric') && typeof dp.value !== 'number') {
      pointErrors.push('Value must be numeric');
      errorCount++;
    }

    // Validate range
    const rangeMatch = dp.validationRule?.match(/range\((-?\d+),(-?\d+)\)/);
    if (rangeMatch && typeof dp.value === 'number') {
      const [, min, max] = rangeMatch;
      if (dp.value < Number(min) || dp.value > Number(max)) {
        pointErrors.push(`Value must be between ${min} and ${max}`);
        errorCount++;
      }
    }

    // Validate format
    if (dp.validationRule?.includes('date') && typeof dp.value === 'string') {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(dp.value)) {
        pointErrors.push('Invalid date format (YYYY-MM-DD required)');
        errorCount++;
      }
    }

    if (pointErrors.length > 0) {
      errors.push({
        dataPointId: dp.dataPointId,
        code: dp.code,
        errors: pointErrors,
      });
    }
  });

  return {
    isValid: errorCount === 0,
    errorCount,
    warningCount,
    errors,
  };
}

export function calculateComplianceScore(obligations: ComplianceObligation[]): {
  overallScore: number;
  compliantCount: number;
  nonCompliantCount: number;
  inProgressCount: number;
  scoreByCategory: Array<{ category: string; score: number }>;
} {
  const total = obligations.length;
  const compliantCount = obligations.filter(o => o.status === 'COMPLIANT').length;
  const nonCompliantCount = obligations.filter(o => o.status === 'NON_COMPLIANT').length;
  const inProgressCount = obligations.filter(o => o.status === 'IN_PROGRESS').length;

  const overallScore = total > 0 ? (compliantCount / total) * 100 : 0;

  // Score by category
  const categoryMap = new Map<string, { total: number; compliant: number }>();
  obligations.forEach(o => {
    if (!categoryMap.has(o.category)) {
      categoryMap.set(o.category, { total: 0, compliant: 0 });
    }
    const data = categoryMap.get(o.category)!;
    data.total++;
    if (o.status === 'COMPLIANT') data.compliant++;
  });

  const scoreByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    score: data.total > 0 ? (data.compliant / data.total) * 100 : 0,
  }));

  return {
    overallScore,
    compliantCount,
    nonCompliantCount,
    inProgressCount,
    scoreByCategory,
  };
}

export function assessViolationSeverity(
  violation: Omit<ComplianceViolation, 'violationId' | 'severity'>,
  regulatoryContext: {
    isHighRiskJurisdiction: boolean;
    historicalViolations: number;
    potentialFineMultiplier: number;
  }
): {
  severity: ComplianceViolation['severity'];
  riskScore: number;
  estimatedFine: number;
  rationale: string[];
} {
  let riskScore = 0;
  const rationale: string[] = [];

  // Base severity by violation type
  const typeSeverity: Record<ComplianceViolation['violationType'], number> = {
    'BREACH': 40,
    'LATE_FILING': 20,
    'INCOMPLETE_DATA': 15,
    'THRESHOLD_EXCEEDANCE': 30,
    'OTHER': 10,
  };

  riskScore += typeSeverity[violation.violationType];
  rationale.push(`Base severity for ${violation.violationType}`);

  // Adjust for jurisdiction risk
  if (regulatoryContext.isHighRiskJurisdiction) {
    riskScore += 20;
    rationale.push('High-risk jurisdiction');
  }

  // Adjust for recidivism
  if (regulatoryContext.historicalViolations > 3) {
    riskScore += 15;
    rationale.push(`Repeat offender (${regulatoryContext.historicalViolations} prior violations)`);
  }

  // Determine severity level
  let severity: ComplianceViolation['severity'] = 'LOW';
  if (riskScore >= 70) severity = 'CRITICAL';
  else if (riskScore >= 50) severity = 'HIGH';
  else if (riskScore >= 30) severity = 'MEDIUM';

  // Estimate fine
  const baseFine = typeSeverity[violation.violationType] * 1000;
  const estimatedFine = baseFine * regulatoryContext.potentialFineMultiplier;

  return {
    severity,
    riskScore,
    estimatedFine,
    rationale,
  };
}

export function prioritizeCorrectiveActions(actions: CorrectiveAction[]): CorrectiveAction[] {
  return [...actions].sort((a, b) => {
    // Overdue first
    const now = new Date();
    const aOverdue = a.targetDate < now && a.status !== 'COMPLETED';
    const bOverdue = b.targetDate < now && b.status !== 'COMPLETED';
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Then by target date
    return a.targetDate.getTime() - b.targetDate.getTime();
  });
}

export function trackObligationDeadlines(obligations: ComplianceObligation[]): {
  upcoming: Array<{ obligationId: string; daysUntilDue: number }>;
  overdue: Array<{ obligationId: string; daysOverdue: number }>;
  compliant: number;
} {
  const now = new Date();
  const upcoming: Array<{ obligationId: string; daysUntilDue: number }> = [];
  const overdue: Array<{ obligationId: string; daysOverdue: number }> = [];
  let compliant = 0;

  obligations.forEach(obligation => {
    if (!obligation.nextDueDate) return;

    const daysDiff = Math.floor(
      (obligation.nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < 0) {
      // Overdue
      overdue.push({
        obligationId: obligation.obligationId,
        daysOverdue: Math.abs(daysDiff),
      });
    } else if (daysDiff <= 30) {
      // Upcoming within 30 days
      upcoming.push({
        obligationId: obligation.obligationId,
        daysUntilDue: daysDiff,
      });
    }

    if (obligation.status === 'COMPLIANT') compliant++;
  });

  return {
    upcoming: upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue),
    overdue: overdue.sort((a, b) => b.daysOverdue - a.daysOverdue),
    compliant,
  };
}

export function analyzeReportingTrends(reports: RegulatoryReport[]): {
  totalReports: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  avgDaysToSubmit: number;
  rejectionRate: number;
  reportsByCategory: Array<{ category: string; count: number }>;
  monthlyVolume: Array<{ month: string; count: number }>;
} {
  const totalReports = reports.length;
  const onTimeSubmissions = reports.filter(r => 
    r.submittedDate && r.submittedDate <= r.dueDate
  ).length;
  const lateSubmissions = reports.filter(r => 
    r.submittedDate && r.submittedDate > r.dueDate
  ).length;

  // Average days to submit
  let totalDays = 0;
  let submittedCount = 0;
  reports.forEach(r => {
    if (r.submittedDate) {
      const days = Math.floor(
        (r.submittedDate.getTime() - r.periodEnd.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalDays += days;
      submittedCount++;
    }
  });
  const avgDaysToSubmit = submittedCount > 0 ? totalDays / submittedCount : 0;

  // Rejection rate
  const rejectedReports = reports.filter(r => r.status === 'REJECTED').length;
  const rejectionRate = totalReports > 0 ? (rejectedReports / totalReports) * 100 : 0;

  // By category
  const categoryMap = new Map<string, number>();
  reports.forEach(r => {
    categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + 1);
  });
  const reportsByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
  }));

  // Monthly volume (last 12 months)
  const monthlyMap = new Map<string, number>();
  reports.forEach(r => {
    const month = r.periodEnd.toISOString().slice(0, 7); // YYYY-MM
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
  });
  const monthlyVolume = Array.from(monthlyMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12);

  return {
    totalReports,
    onTimeSubmissions,
    lateSubmissions,
    avgDaysToSubmit,
    rejectionRate,
    reportsByCategory,
    monthlyVolume,
  };
}

export function assessRegulatoryChangeImpact(
  change: RegulatoryChange,
  currentObligations: ComplianceObligation[]
): {
  affectedObligations: number;
  newObligationsRequired: number;
  changedObligations: number;
  removedObligations: number;
  implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  priorityActions: string[];
} {
  const affectedObligations = change.affectedObligations.length;
  
  // Simplified impact assessment
  let newObligationsRequired = 0;
  let changedObligations = 0;
  let removedObligations = 0;

  if (change.changeType === 'NEW_REGULATION') {
    newObligationsRequired = Math.ceil(affectedObligations * 0.8);
    changedObligations = affectedObligations - newObligationsRequired;
  } else if (change.changeType === 'AMENDMENT') {
    changedObligations = affectedObligations;
  } else if (change.changeType === 'REPEAL') {
    removedObligations = affectedObligations;
  }

  // Determine implementation effort
  let implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (change.impactLevel === 'HIGH') implementationEffort = 'HIGH';
  else if (change.impactLevel === 'MEDIUM' || newObligationsRequired > 5) implementationEffort = 'MEDIUM';

  // Priority actions
  const priorityActions: string[] = [];
  if (newObligationsRequired > 0) {
    priorityActions.push(`Create ${newObligationsRequired} new compliance obligations`);
  }
  if (changedObligations > 0) {
    priorityActions.push(`Update ${changedObligations} existing obligations`);
  }
  if (change.dueDate) {
    const daysUntilDue = Math.floor(
      (change.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDue < 90) {
      priorityActions.push(`URGENT: Implementation due in ${daysUntilDue} days`);
    }
  }

  return {
    affectedObligations,
    newObligationsRequired,
    changedObligations,
    removedObligations,
    implementationEffort,
    priorityActions,
  };
}
