import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface CloseCycle {
  id: string;
  orgId: string;
  fiscalYear: number;
  period: string; // YYYY-MM
  closeType: 'SOFT' | 'HARD';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  scheduledStartDate: Date;
  targetCloseDate: Date;
  actualCloseDate?: Date;
  closedBy?: string;
}

export interface CloseTask {
  id: string;
  closeCycleId: string;
  taskName: string;
  taskCategory: 'RECONCILIATION' | 'JOURNAL_ENTRY' | 'REVIEW' | 'REPORTING';
  assignedTo: string;
  dueDate: Date;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dependencies?: string[]; // Task IDs
  completedDate?: Date;
  notes?: string;
}

export async function initiateCloseCycle(
  db: NeonHttpDatabase,
  orgId: string,
  fiscalYear: number,
  period: string,
  targetCloseDate: Date,
): Promise<CloseCycle> {
  // TODO: Create close cycle and auto-generate standard tasks
  throw new Error('Database integration pending');
}

export async function completeTask(
  db: NeonHttpDatabase,
  taskId: string,
  completedBy: string,
): Promise<CloseTask> {
  // TODO: Update task status to COMPLETED
  throw new Error('Database integration pending');
}

export async function finalizePeriod(
  db: NeonHttpDatabase,
  closeCycleId: string,
  closedBy: string,
): Promise<CloseCycle> {
  // TODO: Validate all tasks complete and update status
  throw new Error('Database integration pending');
}

export function generateStandardTasks(
  closeCycle: CloseCycle,
  targetCloseDate: Date,
): Omit<CloseTask, 'id' | 'closeCycleId' | 'status'>[] {
  const tasks: Omit<CloseTask, 'id' | 'closeCycleId' | 'status'>[] = [];

  // Day 1-2: Reconciliations
  tasks.push({
    taskName: 'Reconcile bank accounts',
    taskCategory: 'RECONCILIATION',
    assignedTo: 'treasury',
    dueDate: new Date(targetCloseDate.getTime() - 8 * 24 * 60 * 60 * 1000),
  });

  tasks.push({
    taskName: 'Reconcile AR/AP subledgers',
    taskCategory: 'RECONCILIATION',
    assignedTo: 'accounting',
    dueDate: new Date(targetCloseDate.getTime() - 7 * 24 * 60 * 60 * 1000),
  });

  // Day 3-4: Adjusting entries
  tasks.push({
    taskName: 'Post accrual entries',
    taskCategory: 'JOURNAL_ENTRY',
    assignedTo: 'accounting',
    dueDate: new Date(targetCloseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
  });

  tasks.push({
    taskName: 'Post depreciation',
    taskCategory: 'JOURNAL_ENTRY',
    assignedTo: 'fixed-assets',
    dueDate: new Date(targetCloseDate.getTime() - 5 * 24 * 60 * 60 * 1000),
  });

  // Day 5-6: Review
  tasks.push({
    taskName: 'Review trial balance',
    taskCategory: 'REVIEW',
    assignedTo: 'controller',
    dueDate: new Date(targetCloseDate.getTime() - 3 * 24 * 60 * 60 * 1000),
  });

  // Day 7: Reporting
  tasks.push({
    taskName: 'Generate financial statements',
    taskCategory: 'REPORTING',
    assignedTo: 'accounting',
    dueDate: new Date(targetCloseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
  });

  return tasks;
}

export function calculateCloseMetrics(
  closeCycles: CloseCycle[],
): {
  avgDaysToClose: number;
  onTimeCloseRate: number;
  avgDelayDays: number;
} {
  const completed = closeCycles.filter((c) => c.status === 'COMPLETED' && c.actualCloseDate);

  let totalDays = 0;
  let onTimeCount = 0;
  let totalDelay = 0;

  for (const cycle of completed) {
    if (!cycle.actualCloseDate) continue;

    const daysToClose = Math.floor(
      (cycle.actualCloseDate.getTime() - cycle.scheduledStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    totalDays += daysToClose;

    if (cycle.actualCloseDate <= cycle.targetCloseDate) {
      onTimeCount++;
    } else {
      const delay = Math.floor(
        (cycle.actualCloseDate.getTime() - cycle.targetCloseDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      totalDelay += delay;
    }
  }

  return {
    avgDaysToClose: completed.length > 0 ? totalDays / completed.length : 0,
    onTimeCloseRate: completed.length > 0 ? (onTimeCount / completed.length) * 100 : 0,
    avgDelayDays: (completed.length - onTimeCount) > 0 ? totalDelay / (completed.length - onTimeCount) : 0,
  };
}

export function identifyBottleneckTasks(
  tasks: CloseTask[],
): Array<{ taskName: string; avgCompletionHours: number; blockingCount: number }> {
  const taskStats = new Map<string, { totalHours: number; count: number; blocking: number }>();

  for (const task of tasks) {
    if (!taskStats.has(task.taskName)) {
      taskStats.set(task.taskName, { totalHours: 0, count: 0, blocking: 0 });
    }

    const stats = taskStats.get(task.taskName)!;

    if (task.completedDate && task.dueDate) {
      const hours = (task.completedDate.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60);
      stats.totalHours += Math.max(0, hours);
      stats.count++;
    }

    if (task.status === 'BLOCKED') {
      stats.blocking++;
    }
  }

  return Array.from(taskStats.entries())
    .map(([taskName, stats]) => ({
      taskName,
      avgCompletionHours: stats.count > 0 ? stats.totalHours / stats.count : 0,
      blockingCount: stats.blocking,
    }))
    .filter((item) => item.avgCompletionHours > 24 || item.blockingCount > 2);
}
