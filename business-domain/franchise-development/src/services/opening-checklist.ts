import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { DevelopmentStage, OpeningChecklist } from '../types/common.js';

/**
 * Create opening checklist for a new site
 */
export async function createOpeningChecklist(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<OpeningChecklist, 'id'>,
): Promise<OpeningChecklist> {
  // TODO: Insert into database
  // INSERT INTO opening_checklists (org_id, site_id, stage, milestones, ...)
  throw new Error('Database integration pending');
}

/**
 * Get opening checklist for a site
 */
export async function getOpeningChecklist(
  db: NeonHttpDatabase,
  siteId: string,
): Promise<OpeningChecklist | null> {
  // TODO: Query database
  // SELECT * FROM opening_checklists WHERE site_id = $1
  throw new Error('Database integration pending');
}

/**
 * Update milestone completion status
 */
export async function completeMilestone(
  db: NeonHttpDatabase,
  checklistId: string,
  milestoneName: string,
): Promise<OpeningChecklist> {
  // TODO: Update milestone in database
  // Mark milestone as completed and set completion date
  throw new Error('Database integration pending');
}

/**
 * Advance to next development stage
 */
export async function advanceStage(
  db: NeonHttpDatabase,
  checklistId: string,
  newStage: DevelopmentStage,
): Promise<OpeningChecklist> {
  // TODO: Update stage in database
  // UPDATE opening_checklists SET stage = $1 WHERE id = $2
  throw new Error('Database integration pending');
}

/**
 * Generate standard opening checklist template
 */
export function generateChecklistTemplate(
  stage: DevelopmentStage,
): Array<{ name: string; completed: boolean }> {
  const templates: Record<DevelopmentStage, string[]> = {
    SITE_SELECTION: [
      'Site survey completed',
      'Traffic study completed',
      'Zoning approval obtained',
      'Lease LOI signed',
    ],
    LEASE_NEGOTIATION: [
      'Lease agreement executed',
      'Security deposit paid',
      'Insurance certificates obtained',
      'Utilities transfer completed',
    ],
    CONSTRUCTION: [
      'Building permits obtained',
      'Construction契约 signed',
      'Inspections scheduled',
      'Equipment ordered',
      'Signage approved',
    ],
    PRE_OPENING: [
      'Staff hiring completed',
      'Training completed',
      'Health permits obtained',
      'POS system installed',
      'Inventory stocked',
      'Soft opening scheduled',
    ],
    OPEN: [
      'Grand opening completed',
      'Initial reviews collected',
      '30-day performance review',
    ],
  };

  const milestones = templates[stage] || [];
  return milestones.map((name) => ({ name, completed: false }));
}

/**
 * Calculate checklist completion percentage
 */
export function calculateChecklistCompletion(checklist: OpeningChecklist): {
  completedCount: number;
  totalCount: number;
  percentage: number;
  daysUntilOpen: number;
  onSchedule: boolean;
} {
  const completedCount = checklist.milestones.filter((m) => m.completed).length;
  const totalCount = checklist.milestones.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const now = new Date();
  const daysUntilOpen = Math.ceil(
    (checklist.scheduledOpenDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Simple on-schedule logic: should be >60% complete if <30 days to open
  const onSchedule = daysUntilOpen > 30 || percentage >= 60;

  return {
    completedCount,
    totalCount,
    percentage,
    daysUntilOpen,
    onSchedule,
  };
}

/**
 * Identify overdue milestones
 */
export function identifyOverdueMilestones(
  checklist: OpeningChecklist,
  milestoneDueDates: Map<string, Date>,
): Array<{ name: string; daysPastDue: number }> {
  const now = new Date();
  const overdue: Array<{ name: string; daysPastDue: number }> = [];

  for (const milestone of checklist.milestones) {
    if (!milestone.completed) {
      const dueDate = milestoneDueDates.get(milestone.name);
      if (dueDate && dueDate < now) {
        const daysPastDue = Math.ceil(
          (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        overdue.push({ name: milestone.name, daysPastDue });
      }
    }
  }

  return overdue.sort((a, b) => b.daysPastDue - a.daysPastDue);
}

/**
 * Generate pre-opening readiness report
 */
export function generateReadinessReport(checklist: OpeningChecklist): {
  readyToOpen: boolean;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
} {
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  const completionStats = calculateChecklistCompletion(checklist);

  // Critical blockers
  if (checklist.stage !== 'PRE_OPENING' && checklist.stage !== 'OPEN') {
    criticalIssues.push('Not in pre-opening or open stage');
  }

  if (completionStats.percentage < 90) {
    criticalIssues.push(`Checklist only ${completionStats.percentage.toFixed(0)}% complete`);
  }

  // Warnings
  if (completionStats.daysUntilOpen < 7) {
    warnings.push('Less than 7 days until scheduled opening');
  }

  if (!completionStats.onSchedule) {
    warnings.push('Opening timeline at risk');
  }

  // Recommendations
  if (completionStats.daysUntilOpen < 14 && completionStats.percentage < 95) {
    recommendations.push('Consider postponing opening date');
  }

  if (completionStats.percentage >= 95 && completionStats.daysUntilOpen > 7) {
    recommendations.push('Schedule soft opening to test operations');
  }

  return {
    readyToOpen: criticalIssues.length === 0,
    criticalIssues,
    warnings,
    recommendations,
  };
}

/**
 * Track time to open metrics
 */
export function calculateTimeToOpen(
  signedDate: Date,
  scheduledOpenDate: Date,
  actualOpenDate?: Date,
): {
  plannedDays: number;
  actualDays: number | null;
  variance: number | null;
  status: 'ON_TIME' | 'DELAYED' | 'EARLY' | 'PENDING';
} {
  const plannedDays = Math.ceil(
    (scheduledOpenDate.getTime() - signedDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (!actualOpenDate) {
    return {
      plannedDays,
      actualDays: null,
      variance: null,
      status: 'PENDING',
    };
  }

  const actualDays = Math.ceil(
    (actualOpenDate.getTime() - signedDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const variance = actualDays - plannedDays;

  let status: 'ON_TIME' | 'DELAYED' | 'EARLY';
  if (variance > 14) status = 'DELAYED';
  else if (variance < -14) status = 'EARLY';
  else status = 'ON_TIME';

  return {
    plannedDays,
    actualDays,
    variance,
    status,
  };
}

