import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface AuditPlan {
  id: string;
  orgId: string;
  auditName: string;
  auditType: 'INTERNAL' | 'EXTERNAL' | 'COMPLIANCE' | 'OPERATIONAL' | 'FINANCIAL';
  scope: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  leadAuditor: string;
  team?: string[];
}

export interface AuditFinding {
  id: string;
  auditPlanId: string;
  findingNumber: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  status: 'OPEN' | 'IN_REMEDIATION' | 'CLOSED';
  identifiedDate: Date;
  dueDate?: Date;
  assignedTo?: string;
}

export async function createAuditPlan(
  db: NeonHttpDatabase,
  data: Omit<AuditPlan, 'id' | 'status'>,
): Promise<AuditPlan> {
  // TODO: Insert audit plan with PLANNED status
  throw new Error('Database integration pending');
}

export async function recordFinding(
  db: NeonHttpDatabase,
  data: Omit<AuditFinding, 'id' | 'findingNumber' | 'status'>,
): Promise<AuditFinding> {
  // TODO: Generate finding number and insert with OPEN status
  throw new Error('Database integration pending');
}

export async function updateFindingStatus(
  db: NeonHttpDatabase,
  findingId: string,
  status: AuditFinding['status'],
  resolution?: string,
): Promise<AuditFinding> {
  // TODO: Update finding status
  throw new Error('Database integration pending');
}

export async function getOpenFindings(
  db: NeonHttpDatabase,
  orgId: string,
  severity?: AuditFinding['severity'],
): Promise<AuditFinding[]> {
  // TODO: Query open findings
  throw new Error('Database integration pending');
}

export function generateFindingNumber(
  auditPlanId: string,
  sequence: number,
): string {
  return `F-${auditPlanId.substring(0, 8)}-${String(sequence).padStart(4, '0')}`;
}

export function prioritizeFindings(
  findings: AuditFinding[],
): AuditFinding[] {
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  
  return [...findings].sort((a, b) => {
    // Sort by severity first
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;

    // Then by due date
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }

    return 0;
  });
}

export function calculateAuditCoverage(
  auditPlans: AuditPlan[],
  totalProcesses: number,
): { auditedProcesses: number; coverageRate: number; unauditedCount: number } {
  const auditedProcesses = auditPlans.filter((p) => p.status === 'COMPLETED').length;
  const coverageRate = totalProcesses > 0 ? (auditedProcesses / totalProcesses) * 100 : 0;
  const unauditedCount = totalProcesses - auditedProcesses;

  return { auditedProcesses, coverageRate, unauditedCount };
}

export function analyzeRemediationProgress(
  findings: AuditFinding[],
): {
  total: number;
  open: number;
  inRemediation: number;
  closed: number;
  avgDaysToClose: number;
  overdueCount: number;
} {
  const total = findings.length;
  const open = findings.filter((f) => f.status === 'OPEN').length;
  const inRemediation = findings.filter((f) => f.status === 'IN_REMEDIATION').length;
  const closed = findings.filter((f) => f.status === 'CLOSED').length;

  // TODO: Calculate actual avgDaysToClose from closed findings
  const avgDaysToClose = 0;

  const now = Date.now();
  const overdueCount = findings.filter(
    (f) => f.dueDate && f.status !== 'CLOSED' && f.dueDate.getTime() < now,
  ).length;

  return { total, open, inRemediation, closed, avgDaysToClose, overdueCount };
}
