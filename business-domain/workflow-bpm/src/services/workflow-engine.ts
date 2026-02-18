import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface WorkflowDefinition {
  id: string;
  orgId: string;
  name: string;
  description: string;
  category: 'APPROVAL' | 'REVIEW' | 'ROUTING' | 'ESCALATION';
  status: 'ACTIVE' | 'INACTIVE';
  steps: Array<{
    stepNumber: number;
    stepName: string;
    assigneeType: 'USER' | 'ROLE' | 'GROUP';
    assigneeId: string;
    approvalRequired: boolean;
    dueInHours?: number;
  }>;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  entityType: string; // expense_report, purchase_order, etc.
  entityId: string;
  currentStep: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  initiatedBy: string;
  initiatedAt: Date;
  completedAt?: Date;
}

export interface WorkflowTask {
  id: string;
  instanceId: string;
  stepNumber: number;
  assignedTo: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | 'SKIPPED';
  dueDate?: Date;
  completedAt?: Date;
  comments?: string;
}

export async function createWorkflowDefinition(
  db: NeonHttpDatabase,
  data: Omit<WorkflowDefinition, 'id' | 'status'>,
): Promise<WorkflowDefinition> {
  // TODO: Insert workflow definition with ACTIVE status
  throw new Error('Database integration pending');
}

export async function startWorkflow(
  db: NeonHttpDatabase,
  workflowId: string,
  entityType: string,
  entityId: string,
  initiatedBy: string,
): Promise<WorkflowInstance> {
  // TODO: Create workflow instance and first task
  throw new Error('Database integration pending');
}

export async function completeTask(
  db: NeonHttpDatabase,
  taskId: string,
  completedBy: string,
  action: 'APPROVE' | 'REJECT',
  comments?: string,
): Promise<WorkflowTask> {
  // TODO: Update task and advance  workflow if approved
  throw new Error('Database integration pending');
}

export async function getMyTasks(
  db: NeonHttpDatabase,
  userId: string,
  status?: WorkflowTask['status'],
): Promise<WorkflowTask[]> {
  // TODO: Query tasks assigned to user
  throw new Error('Database integration pending');
}

export function calculateSLA(
  task: WorkflowTask,
  dueDate: Date,
): { status: 'ON_TIME' | 'AT_RISK' | 'OVERDUE'; hoursRemaining: number } {
  const now = new Date();
  const hoursRemaining = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  let status: 'ON_TIME' | 'AT_RISK' | 'OVERDUE' = 'ON_TIME';
  if (hoursRemaining < 0) status = 'OVERDUE';
  else if (hoursRemaining < 24) status = 'AT_RISK';

  return { status, hoursRemaining: Math.round(hoursRemaining * 10) / 10 };
}

export function identifyBottlenecks(
  instances: WorkflowInstance[],
  tasks: WorkflowTask[],
): Array<{ stepNumber: number; avgCompletionHours: number; pendingCount: number }> {
  const stepStats = new Map<number, { totalHours: number; count: number; pending: number }>();

  for (const task of tasks) {
    if (!stepStats.has(task.stepNumber)) {
      stepStats.set(task.stepNumber, { totalHours: 0, count: 0, pending: 0 });
    }

    const stats = stepStats.get(task.stepNumber)!;

    if (task.status === 'COMPLETED' && task.completedAt && task.dueDate) {
      const hours = (task.completedAt.getTime() - task.dueDate.getTime()) / (1000 * 60 * 60);
      stats.totalHours += hours;
      stats.count++;
    }

    if (task.status === 'PENDING') {
      stats.pending++;
    }
  }

  return Array.from(stepStats.entries())
    .map(([stepNumber, stats]) => ({
      stepNumber,
      avgCompletionHours: stats.count > 0 ? stats.totalHours / stats.count : 0,
      pendingCount: stats.pending,
    }))
    .filter((item) => item.pendingCount > 5 || item.avgCompletionHours > 48);
}

export function calculateWorkflowEfficiency(
  instances: WorkflowInstance[],
): { avgCompletionHours: number; completionRate: number; onTimeRate: number } {
  const completed = instances.filter((i) => i.status === 'COMPLETED');
  
  let totalHours = 0;
  for (const instance of completed) {
    if (instance.completedAt) {
      const hours = (instance.completedAt.getTime() - instance.initiatedAt.getTime()) / (1000 * 60 * 60);
      totalHours += hours;
    }
  }

  const avgCompletionHours = completed.length > 0 ? totalHours / completed.length : 0;
  const completionRate = instances.length > 0 ? (completed.length / instances.length) * 100 : 0;
  const onTimeRate = 0; // TODO: Calculate based on SLA

  return { avgCompletionHours, completionRate, onTimeRate };
}
