import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { ActionStatus, CorrectiveAction } from '../types/common.js';

/**
 * Create a corrective action plan
 */
export async function createAction(
  db: NeonHttpDatabase,
  data: Omit<CorrectiveAction, 'id' | 'createdAt' | 'status'>,
): Promise<CorrectiveAction> {
  // TODO: Insert into database with OPEN status
  // INSERT INTO corrective_actions (finding_id, description, assigned_to, target_date, ...)
  throw new Error('Database integration pending');
}

/**
 * Get corrective actions with optional status filter
 */
export async function getActions(
  db: NeonHttpDatabase,
  findingId?: string,
  status?: ActionStatus,
): Promise<CorrectiveAction[]> {
  // TODO: Query database with optional filters
  throw new Error('Database integration pending');
}

/**
 * Assign action to a responsible party
 */
export async function assignAction(
  db: NeonHttpDatabase,
  actionId: string,
  assignedTo: string,
  targetDate: Date,
): Promise<CorrectiveAction> {
  // TODO: Update action assignment
  // UPDATE corrective_actions SET assigned_to = $1, target_date = $2 WHERE id = $3
  throw new Error('Database integration pending');
}

/**
 * Update action status
 */
export async function updateActionStatus(
  db: NeonHttpDatabase,
  actionId: string,
  status: ActionStatus,
  notes?: string,
): Promise<CorrectiveAction> {
  // TODO: Update action status with timestamp
  throw new Error('Database integration pending');
}

/**
 * Complete a corrective action
 */
export async function completeAction(
  db: NeonHttpDatabase,
  actionId: string,
  completionNotes: string,
  completedBy: string,
): Promise<CorrectiveAction> {
  // TODO: Update action to COMPLETED status
  // UPDATE corrective_actions SET status = 'COMPLETED', completed_at = NOW(), ...
  throw new Error('Database integration pending');
}

/**
 * Verify a completed action
 */
export async function verifyAction(
  db: NeonHttpDatabase,
  actionId: string,
  verifiedBy: string,
  verificationNotes: string,
): Promise<CorrectiveAction> {
  // TODO: Update action to VERIFIED status
  // UPDATE corrective_actions SET status = 'VERIFIED', verified_at = NOW(), verified_by = $1
  throw new Error('Database integration pending');
}

/**
 * Get overdue actions
 */
export async function getOverdueActions(
  db: NeonHttpDatabase,
  outletId?: string,
): Promise<CorrectiveAction[]> {
  // TODO: Query actions where target_date < NOW() AND status NOT IN ('COMPLETED', 'VERIFIED')
  throw new Error('Database integration pending');
}

/**
 * Escalate overdue action
 */
export async function escalateAction(
  db: NeonHttpDatabase,
  actionId: string,
  escalatedTo: string,
  reason: string,
): Promise<CorrectiveAction> {
  // TODO: Update action with escalation info
  throw new Error('Database integration pending');
}

/**
 * Calculate action completion rate
 */
export function calculateCompletionRate(actions: CorrectiveAction[]): {
  total: number;
  completed: number;
  verified: number;
  completionRate: number;
  verificationRate: number;
} {
  const total = actions.length;
  const completed = actions.filter(
    (a) => a.status === 'COMPLETED' || a.status === 'VERIFIED',
  ).length;
  const verified = actions.filter((a) => a.status === 'VERIFIED').length;

  return {
    total,
    completed,
    verified,
    completionRate: total > 0 ? (completed / total) * 100 : 0,
    verificationRate: completed > 0 ? (verified / completed) * 100 : 0,
  };
}

/**
 * Determine action priority based on finding severity and due date
 */
export function determineActionPriority(
  targetDate: Date,
  findingSeverity: string,
): 'IMMEDIATE' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const daysUntilDue = Math.ceil(
    (targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  // Critical findings or overdue
  if (findingSeverity === 'CRITICAL' || daysUntilDue < 0) {
    return 'IMMEDIATE';
  }

  // Major findings or due within 3 days
  if (findingSeverity === 'MAJOR' || daysUntilDue <= 3) {
    return 'HIGH';
  }

  // Minor findings or due within 7 days
  if (findingSeverity === 'MINOR' || daysUntilDue <= 7) {
    return 'MEDIUM';
  }

  return 'LOW';
}

/**
 * Generate action plan summary
 */
export function generateActionPlanSummary(
  actions: CorrectiveAction[],
): {
  byStatus: Record<ActionStatus, number>;
  overdue: number;
  dueThisWeek: number;
  avgDaysToComplete: number;
} {
  const summary = {
    byStatus: {
      OPEN: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      VERIFIED: 0,
      OVERDUE: 0,
    } as Record<ActionStatus, number>,
    overdue: 0,
    dueThisWeek: 0,
    avgDaysToComplete: 0,
  };

  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  let totalDaysToComplete = 0;
  let completedCount = 0;

  for (const action of actions) {
    summary.byStatus[action.status]++;

    // Check if overdue
    if (
      action.targetDate &&
      new Date(action.targetDate).getTime() < now &&
      action.status !== 'COMPLETED' &&
      action.status !== 'VERIFIED'
    ) {
      summary.overdue++;
    }

    // Check if due this week
    if (
      action.targetDate &&
      new Date(action.targetDate).getTime() <= now + oneWeek &&
      action.status !== 'COMPLETED' &&
      action.status !== 'VERIFIED'
    ) {
      summary.dueThisWeek++;
    }

    // Calculate days to complete
    if (action.status === 'COMPLETED' && action.completedAt && action.createdAt) {
      const daysToComplete = Math.ceil(
        (new Date(action.completedAt).getTime() -
          new Date(action.createdAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      totalDaysToComplete += daysToComplete;
      completedCount++;
    }
  }

  summary.avgDaysToComplete =
    completedCount > 0 ? totalDaysToComplete / completedCount : 0;

  return summary;
}

/**
 * Track action effectiveness (prevent recurrence)
 */
export function trackActionEffectiveness(
  action: CorrectiveAction,
  reoccurred: boolean,
): {
  effective: boolean;
  effectiveness: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE';
  recommendation: string;
} {
  let effectiveness: 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' = 'EFFECTIVE';
  let recommendation = '';

  if (reoccurred) {
    effectiveness = 'INEFFECTIVE';
    recommendation = 'Root cause analysis needed. Consider systemic changes.';
  } else if (action.status === 'VERIFIED') {
    effectiveness = 'EFFECTIVE';
    recommendation = 'Continue monitoring to ensure sustained compliance.';
  } else if (action.status === 'COMPLETED') {
    effectiveness = 'PARTIALLY_EFFECTIVE';
    recommendation = 'Verification pending. Follow up required.';
  } else {
    effectiveness = 'INEFFECTIVE';
    recommendation = 'Action incomplete. Escalation may be required.';
  }

  return {
    effective: effectiveness === 'EFFECTIVE',
    effectiveness,
    recommendation,
  };
}

/**
 * Generate corrective action report for stakeholders
 */
export function generateActionReport(
  actions: CorrectiveAction[],
): {
  summary: ReturnType<typeof generateActionPlanSummary>;
  criticalActions: CorrectiveAction[];
  overdueActions: CorrectiveAction[];
  recentCompletions: CorrectiveAction[];
} {
  const summary = generateActionPlanSummary(actions);

  const criticalActions = actions.filter(
    (a) => a.priority === 'IMMEDIATE' && a.status !== 'VERIFIED',
  );

  const now = Date.now();
  const overdueActions = actions.filter(
    (a) =>
      a.targetDate &&
      new Date(a.targetDate).getTime() < now &&
      a.status !== 'COMPLETED' &&
      a.status !== 'VERIFIED',
  );

  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recentCompletions = actions.filter(
    (a) =>
      a.status === 'VERIFIED' &&
      a.verifiedAt &&
      new Date(a.verifiedAt).getTime() > thirtyDaysAgo,
  );

  return {
    summary,
    criticalActions,
    overdueActions,
    recentCompletions,
  };
}

