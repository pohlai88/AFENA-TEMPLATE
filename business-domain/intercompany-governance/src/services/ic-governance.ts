/**
 * Intercompany Governance Service
 * Manages IC approval workflows, policy enforcement, compliance controls, and audit trails
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface ICPolicy {
  policyId: string;
  policyName: string;
  policyType: 'TRANSACTION_APPROVAL' | 'PRICING' | 'CASH_POOLING' | 'NETTING' | 'RECONCILIATION';
  applicableEntities: string[]; // Entity IDs or 'ALL'
  effectiveDate: Date;
  expirationDate?: Date;
  rules: ICPolicyRule[];
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  createdBy: string;
  approvedBy?: string;
  approvedDate?: Date;
}

export interface ICPolicyRule {
  ruleId: string;
  sequence: number;
  condition: string; // e.g., "amount > 100000 AND transactionType == 'LOAN'"
  action: 'REQUIRE_APPROVAL' | 'AUTO_APPROVE' | 'REJECT' | 'FLAG_FOR_REVIEW';
  approverLevel?: number; // 1, 2, 3 for multi-level approval
  parameters?: Record<string, unknown>;
}

export interface ICApprovalWorkflow {
  workflowId: string;
  transactionId: string;
  transactionType: string;
  initiatingEntityId: string;
  counterpartyEntityId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  currentLevel: number;
  requiredApprovals: ICApprovalLevel[];
  submittedBy: string;
  submittedDate: Date;
  completedDate?: Date;
  rejectionReason?: string;
}

export interface ICApprovalLevel {
  level: number;
  approverRole: string;
  approverUserId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalDate?: Date;
  comments?: string;
  delegatedTo?: string;
}

export interface ICComplianceCheck {
  checkId: string;
  checkType: 'ARM_LENGTH' | 'POLICY_ADHERENCE' | 'DOCUMENTATION' | 'RECONCILIATION' | 'TAX_COMPLIANCE';
  entityId: string;
  checkDate: Date;
  periodStart: Date;
  periodEnd: Date;
  status: 'PASSED' | 'FAILED' | 'WARNING' | 'IN_REVIEW';
  findings: ICComplianceFinding[];
  overallScore: number; // 0-100
  performedBy: string;
}

export interface ICComplianceFinding {
  findingId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  description: string;
  transactionIds: string[];
  recommendation: string;
  status: 'OPEN' | 'REMEDIATED' | 'ACCEPTED_RISK';
  remediationPlan?: string;
  dueDate?: Date;
}

export interface ICAuditTrail {
  auditId: string;
  entityId: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'RECONCILE' | 'ELIMINATE';
  objectType: 'TRANSACTION' | 'RECONCILIATION' | 'NETTING' | 'ELIMINATION' | 'POLICY';
  objectId: string;
  timestamp: Date;
  changes?: Array<{ field: string; oldValue: unknown; newValue: unknown }>;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export interface ICRiskAssessment {
  assessmentId: string;
  entityId: string;
  assessmentDate: Date;
  riskCategories: ICRiskCategory[];
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigationActions: string[];
  nextReviewDate: Date;
}

export interface ICRiskCategory {
  category: 'VOLUME' | 'COMPLEXITY' | 'GEOGRAPHY' | 'TAX' | 'OPERATIONAL' | 'REGULATORY';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number; // 0-100
  indicators: Array<{ indicator: string; value: number; threshold: number }>;
  trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createICPolicy(
  policy: Omit<ICPolicy, 'policyId'>
): Promise<ICPolicy> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function submitForApproval(
  workflow: Omit<ICApprovalWorkflow, 'workflowId'>
): Promise<ICApprovalWorkflow> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function approveWorkflow(
  workflowId: string,
  level: number,
  userId: string,
  comments?: string
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function performComplianceCheck(
  check: Omit<ICComplianceCheck, 'checkId'>
): Promise<ICComplianceCheck> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function logAuditTrail(
  trail: Omit<ICAuditTrail, 'auditId'>
): Promise<ICAuditTrail> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function assessICRisk(
  assessment: Omit<ICRiskAssessment, 'assessmentId'>
): Promise<ICRiskAssessment> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getPendingApprovals(
  userId: string,
  role: string
): Promise<ICApprovalWorkflow[]> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generatePolicyId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `POL-${dateStr}-${sequence}`;
}

export function evaluatePolicyRule(
  rule: ICPolicyRule,
  transaction: Record<string, unknown>
): boolean {
  // Simple condition evaluator
  // In production, use expression parser library (e.g., expr-eval)
  const condition = rule.condition;

  try {
    // Parse condition: "amount > 100000 AND transactionType == 'LOAN'"
    const parts = condition.split(/\s+(AND|OR)\s+/);
    
    const evaluatePart = (part: string): boolean => {
      // Extract field, operator, value
      const operators = ['==', '!=', '>=', '<=', '>', '<', 'IN', 'NOT IN'];
      let operator = '';
      let field = '';
      let value = '';

      for (const op of operators) {
        if (part.includes(op)) {
          [field, value] = part.split(op).map(s => s.trim());
          operator = op;
          break;
        }
      }

      if (!operator) return false;

      const fieldValue = transaction[field];
      const compareValue = value.replace(/'/g, '');

      switch (operator) {
        case '==':
          return String(fieldValue) === compareValue;
        case '!=':
          return String(fieldValue) !== compareValue;
        case '>':
          return Number(fieldValue) > Number(compareValue);
        case '<':
          return Number(fieldValue) < Number(compareValue);
        case '>=':
          return Number(fieldValue) >= Number(compareValue);
        case '<=':
          return Number(fieldValue) <= Number(compareValue);
        case 'IN':
          return compareValue.split(',').includes(String(fieldValue));
        case 'NOT IN':
          return !compareValue.split(',').includes(String(fieldValue));
        default:
          return false;
      }
    };

    // Evaluate all parts
    let result = evaluatePart(parts[0]);
    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];
      const nextResult = evaluatePart(parts[i + 1]);
      if (operator === 'AND') {
        result = result && nextResult;
      } else if (operator === 'OR') {
        result = result || nextResult;
      }
    }

    return result;
  } catch (error) {
    console.error('Error evaluating policy rule:', error);
    return false;
  }
}

export function determineRequiredApprovals(
  transaction: Record<string, unknown>,
  policies: ICPolicy[]
): ICApprovalLevel[] {
  const approvalLevels: ICApprovalLevel[] = [];
  const requiredLevels = new Set<number>();

  // Find applicable policies
  const applicablePolicies = policies.filter(policy => 
    policy.status === 'ACTIVE' &&
    new Date() >= policy.effectiveDate &&
    (!policy.expirationDate || new Date() <= policy.expirationDate) &&
    (policy.applicableEntities.includes('ALL') || 
     policy.applicableEntities.includes(String(transaction.initiatingEntityId)))
  );

  // Evaluate rules
  applicablePolicies.forEach(policy => {
    policy.rules.forEach(rule => {
      if (evaluatePolicyRule(rule, transaction)) {
        if (rule.action === 'REQUIRE_APPROVAL' && rule.approverLevel) {
          requiredLevels.add(rule.approverLevel);
        }
      }
    });
  });

  // Create approval levels
  Array.from(requiredLevels).sort().forEach(level => {
    approvalLevels.push({
      level,
      approverRole: getApproverRole(level),
      status: 'PENDING',
    });
  });

  return approvalLevels;
}

function getApproverRole(level: number): string {
  switch (level) {
    case 1:
      return 'IC_MANAGER';
    case 2:
      return 'IC_CONTROLLER';
    case 3:
      return 'CFO';
    default:
      return 'IC_APPROVER';
  }
}

export function advanceWorkflow(workflow: ICApprovalWorkflow): {
  canAdvance: boolean;
  nextLevel?: number;
  isComplete: boolean;
} {
  const currentLevelApprovals = workflow.requiredApprovals.filter(
    app => app.level === workflow.currentLevel
  );

  const allCurrentApproved = currentLevelApprovals.every(
    app => app.status === 'APPROVED'
  );

  if (!allCurrentApproved) {
    return { canAdvance: false, isComplete: false };
  }

  const nextLevel = workflow.currentLevel + 1;
  const hasNextLevel = workflow.requiredApprovals.some(app => app.level === nextLevel);

  if (hasNextLevel) {
    return { canAdvance: true, nextLevel, isComplete: false };
  } else {
    return { canAdvance: true, isComplete: true };
  }
}

export function validateArmLengthPricing(
  transaction: { amount: number; transactionType: string },
  benchmarkData: { median: number; min: number; max: number; interquartileMin: number; interquartileMax: number }
): {
  isCompliant: boolean;
  deviation: number;
  deviationPercentage: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
} {
  const { amount } = transaction;
  const { median, interquartileMin, interquartileMax } = benchmarkData;

  // Check if within interquartile range (most conservative)
  const isWithinIQR = amount >= interquartileMin && amount <= interquartileMax;
  
  // Calculate deviation from median
  const deviation = amount - median;
  const deviationPercentage = (deviation / median) * 100;

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (isWithinIQR) {
    riskLevel = 'LOW';
  } else if (Math.abs(deviationPercentage) <= 10) {
    riskLevel = 'MEDIUM';
  } else if (Math.abs(deviationPercentage) <= 25) {
    riskLevel = 'HIGH';
  } else {
    riskLevel = 'CRITICAL';
  }

  return {
    isCompliant: isWithinIQR,
    deviation,
    deviationPercentage,
    riskLevel,
  };
}

export function generateComplianceScore(
  findings: ICComplianceFinding[]
): number {
  if (findings.length === 0) return 100;

  const severityWeights = {
    CRITICAL: 25,
    HIGH: 10,
    MEDIUM: 5,
    LOW: 2,
  };

  const totalDeductions = findings.reduce((sum, finding) => {
    return sum + severityWeights[finding.severity];
  }, 0);

  // Cap at 0
  return Math.max(0, 100 - totalDeductions);
}

export function assessICRiskLevel(
  categories: ICRiskCategory[]
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const criticalCount = categories.filter(c => c.riskLevel === 'CRITICAL').length;
  const highCount = categories.filter(c => c.riskLevel === 'HIGH').length;
  const mediumCount = categories.filter(c => c.riskLevel === 'MEDIUM').length;

  // Any critical risk → overall critical
  if (criticalCount > 0) return 'CRITICAL';
  
  // 2+ high risks → overall high
  if (highCount >= 2) return 'HIGH';
  
  // 1 high or 3+ medium → overall medium
  if (highCount === 1 || mediumCount >= 3) return 'MEDIUM';

  return 'LOW';
}

export function calculateRiskScore(
  category: ICRiskCategory['category'],
  metrics: Record<string, number>
): { score: number; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' } {
  let score = 0;

  switch (category) {
    case 'VOLUME':
      // High volume = higher risk
      const transactionCount = metrics.transactionCount || 0;
      const totalValue = metrics.totalValue || 0;
      score = Math.min(100, (transactionCount / 1000) * 30 + (totalValue / 10000000) * 70);
      break;

    case 'COMPLEXITY':
      // Complex structures = higher risk
      const entityCount = metrics.entityCount || 0;
      const transactionTypes = metrics.transactionTypes || 0;
      const multiCurrency = metrics.multiCurrency || 0;
      score = Math.min(100, 
        (entityCount / 50) * 30 + 
        (transactionTypes / 10) * 40 + 
        multiCurrency * 30
      );
      break;

    case 'GEOGRAPHY':
      // High-risk jurisdictions = higher risk
      const highRiskJurisdictions = metrics.highRiskJurisdictions || 0;
      const taxHavens = metrics.taxHavens || 0;
      score = Math.min(100, highRiskJurisdictions * 40 + taxHavens * 60);
      break;

    case 'TAX':
      // TP Documentation, BEPS compliance
      const missingDocumentation = metrics.missingDocumentation || 0;
      const armLengthDeviations = metrics.armLengthDeviations || 0;
      score = Math.min(100, missingDocumentation * 50 + armLengthDeviations * 50);
      break;

    case 'OPERATIONAL':
      // Reconciliation issues, variances
      const unmatchedRate = metrics.unmatchedRate || 0; // %
      const avgVariance = metrics.avgVariance || 0; // %
      score = Math.min(100, unmatchedRate * 2 + avgVariance * 2);
      break;

    case 'REGULATORY':
      // Compliance violations, audit findings
      const violations = metrics.violations || 0;
      const auditFindings = metrics.auditFindings || 0;
      score = Math.min(100, violations * 30 + auditFindings * 20);
      break;
  }

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (score >= 75) riskLevel = 'CRITICAL';
  else if (score >= 50) riskLevel = 'HIGH';
  else if (score >= 25) riskLevel = 'MEDIUM';
  else riskLevel = 'LOW';

  return { score: Math.round(score), riskLevel };
}

export function identifyControlWeaknesses(
  complianceChecks: ICComplianceCheck[]
): Array<{
  weakness: string;
  occurrences: number;
  affectedEntities: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}> {
  const weaknessMap = new Map<string, { 
    count: number; 
    entities: Set<string>; 
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
  }>();

  complianceChecks.forEach(check => {
    check.findings.forEach(finding => {
      if (!weaknessMap.has(finding.category)) {
        weaknessMap.set(finding.category, {
          count: 0,
          entities: new Set(),
          severity: finding.severity,
          recommendation: finding.recommendation,
        });
      }

      const weakness = weaknessMap.get(finding.category)!;
      weakness.count++;
      weakness.entities.add(check.entityId);
      
      // Escalate severity if needed
      const severityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
      if (severityOrder[finding.severity] > severityOrder[weakness.severity]) {
        weakness.severity = finding.severity;
      }
    });
  });

  return Array.from(weaknessMap.entries())
    .map(([weakness, data]) => ({
      weakness,
      occurrences: data.count,
      affectedEntities: Array.from(data.entities),
      severity: data.severity,
      recommendation: data.recommendation,
    }))
    .sort((a, b) => b.occurrences - a.occurrences);
}

export function analyzeApprovalPerformance(
  workflows: ICApprovalWorkflow[]
): {
  avgApprovalTime: number; // days
  approvalRate: number; // %
  bottleneckLevel: number | null;
  avgTimeByLevel: Array<{ level: number; avgDays: number }>;
  topRejectionReasons: Array<{ reason: string; count: number }>;
} {
  let totalTime = 0;
  let completedCount = 0;
  const approvedCount = workflows.filter(w => w.status === 'APPROVED').length;
  const rejectedCount = workflows.filter(w => w.status === 'REJECTED').length;
  
  const timeByLevel = new Map<number, number[]>();
  const rejectionReasons = new Map<string, number>();

  workflows.forEach(workflow => {
    if (workflow.completedDate) {
      const days = Math.floor(
        (workflow.completedDate.getTime() - workflow.submittedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      totalTime += days;
      completedCount++;

      // Time by level
      workflow.requiredApprovals.forEach(approval => {
        if (approval.approvalDate) {
          const levelDays = Math.floor(
            (approval.approvalDate.getTime() - workflow.submittedDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (!timeByLevel.has(approval.level)) {
            timeByLevel.set(approval.level, []);
          }
          timeByLevel.get(approval.level)!.push(levelDays);
        }
      });
    }

    if (workflow.status === 'REJECTED' && workflow.rejectionReason) {
      rejectionReasons.set(
        workflow.rejectionReason,
        (rejectionReasons.get(workflow.rejectionReason) || 0) + 1
      );
    }
  });

  const avgApprovalTime = completedCount > 0 ? totalTime / completedCount : 0;
  const approvalRate = (approvedCount + rejectedCount) > 0 
    ? (approvedCount / (approvedCount + rejectedCount)) * 100 
    : 0;

  // Find bottleneck level (longest avg time)
  const avgTimeByLevel = Array.from(timeByLevel.entries()).map(([level, times]) => ({
    level,
    avgDays: times.reduce((sum, t) => sum + t, 0) / times.length,
  }));

  const bottleneckLevel = avgTimeByLevel.length > 0
    ? avgTimeByLevel.reduce((max, curr) => curr.avgDays > max.avgDays ? curr : max).level
    : null;

  const topRejectionReasons = Array.from(rejectionReasons.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    avgApprovalTime,
    approvalRate,
    bottleneckLevel,
    avgTimeByLevel,
    topRejectionReasons,
  };
}

export function generateAuditReport(
  auditTrails: ICAuditTrail[],
  startDate: Date,
  endDate: Date
): {
  totalActions: number;
  actionsByType: Array<{ action: string; count: number }>;
  actionsByUser: Array<{ userId: string; count: number }>;
  actionsOverTime: Array<{ date: string; count: number }>;
  suspiciousActivities: Array<{ userId: string; reason: string; count: number }>;
} {
  const filtered = auditTrails.filter(
    trail => trail.timestamp >= startDate && trail.timestamp <= endDate
  );

  const actionCounts = new Map<string, number>();
  const userCounts = new Map<string, number>();
  const dailyCounts = new Map<string, number>();
  const userActivityByHour = new Map<string, Map<number, number>>();

  filtered.forEach(trail => {
    // Action counts
    actionCounts.set(trail.action, (actionCounts.get(trail.action) || 0) + 1);

    // User counts
    userCounts.set(trail.userId, (userCounts.get(trail.userId) || 0) + 1);

    // Daily counts
    const dateStr = trail.timestamp.toISOString().slice(0, 10);
    dailyCounts.set(dateStr, (dailyCounts.get(dateStr) || 0) + 1);

    // User activity by hour (for anomaly detection)
    const hour = trail.timestamp.getHours();
    if (!userActivityByHour.has(trail.userId)) {
      userActivityByHour.set(trail.userId, new Map());
    }
    const userHours = userActivityByHour.get(trail.userId)!;
    userHours.set(hour, (userHours.get(hour) || 0) + 1);
  });

  const actionsByType = Array.from(actionCounts.entries())
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count);

  const actionsByUser = Array.from(userCounts.entries())
    .map(([userId, count]) => ({ userId, count }))
    .sort((a, b) => b.count - a.count);

  const actionsOverTime = Array.from(dailyCounts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Detect suspicious activities
  const suspiciousActivities: Array<{ userId: string; reason: string; count: number }> = [];

  // Off-hours activity (10 PM - 6 AM)
  userActivityByHour.forEach((hours, userId) => {
    let offHoursCount = 0;
    for (let h = 0; h < 6; h++) offHoursCount += hours.get(h) || 0;
    for (let h = 22; h < 24; h++) offHoursCount += hours.get(h) || 0;

    if (offHoursCount > 10) {
      suspiciousActivities.push({
        userId,
        reason: 'High off-hours activity',
        count: offHoursCount,
      });
    }
  });

  // Excessive deletions
  const deletions = filtered.filter(t => t.action === 'DELETE');
  const deletionsByUser = new Map<string, number>();
  deletions.forEach(d => {
    deletionsByUser.set(d.userId, (deletionsByUser.get(d.userId) || 0) + 1);
  });
  deletionsByUser.forEach((count, userId) => {
    if (count > 20) {
      suspiciousActivities.push({
        userId,
        reason: 'Excessive deletions',
        count,
      });
    }
  });

  return {
    totalActions: filtered.length,
    actionsByType,
    actionsByUser,
    actionsOverTime,
    suspiciousActivities,
  };
}
