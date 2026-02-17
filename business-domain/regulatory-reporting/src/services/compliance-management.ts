import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CreateComplianceTaskParams = z.object({
  taskName: z.string(),
  regulatoryBody: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'annually']),
  dueDate: z.date(),
  assignedTo: z.string(),
});

export interface ComplianceTask {
  taskId: string;
  taskName: string;
  regulatoryBody: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: Date;
}

export async function createComplianceTask(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateComplianceTaskParams>,
): Promise<Result<ComplianceTask>> {
  const validated = CreateComplianceTaskParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ taskId: 'comp-task-1', taskName: validated.data.taskName, regulatoryBody: validated.data.regulatoryBody, status: 'pending', dueDate: validated.data.dueDate });
}

export const TrackComplianceStatusParams = z.object({
  regulatoryBody: z.string().optional(),
  includeCompleted: z.boolean().default(false),
});

export interface ComplianceStatus {
  totalTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completedTasks: number;
  complianceRate: number;
  upcomingDeadlines: Array<{ taskId: string; taskName: string; dueDate: Date }>;
}

export async function trackComplianceStatus(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof TrackComplianceStatusParams>,
): Promise<Result<ComplianceStatus>> {
  const validated = TrackComplianceStatusParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);
  
  return ok({ totalTasks: 42, pendingTasks: 12, overdueTasks: 2, completedTasks: 28, complianceRate: 0.95, upcomingDeadlines: [{ taskId: 'task-1', taskName: 'Quarterly Filing', dueDate }] });
}
