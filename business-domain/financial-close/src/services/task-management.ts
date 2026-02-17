import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const AssignCloseTaskParams = z.object({
  calendarId: z.string(),
  taskName: z.string(),
  description: z.string(),
  ownerId: z.string(),
  dueDate: z.date(),
  priority: z.enum(['low', 'normal', 'high', 'critical']).optional(),
  dependencies: z.array(z.string()).optional(),
});

export interface CloseTask {
  taskId: string;
  calendarId: string;
  taskName: string;
  description: string;
  ownerId: string;
  dueDate: Date;
  priority: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  dependencies: string[];
  assignedAt: Date;
  completedAt?: Date;
}

export async function assignCloseTask(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof AssignCloseTaskParams>,
): Promise<Result<CloseTask>> {
  const validated = AssignCloseTaskParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Assign close task to owner
  return ok({
    taskId: `task-${Date.now()}`,
    calendarId: validated.data.calendarId,
    taskName: validated.data.taskName,
    description: validated.data.description,
    ownerId: validated.data.ownerId,
    dueDate: validated.data.dueDate,
    priority: validated.data.priority ?? 'normal',
    status: 'not_started',
    dependencies: validated.data.dependencies ?? [],
    assignedAt: new Date(),
  });
}

const UpdateTaskStatusParams = z.object({
  taskId: z.string(),
  status: z.enum(['in_progress', 'completed', 'blocked']),
  comments: z.string().optional(),
  blockedReason: z.string().optional(),
});

export interface TaskStatusUpdate {
  taskId: string;
  previousStatus: string;
  newStatus: string;
  updatedBy: string;
  updatedAt: Date;
  comments?: string;
}

export async function updateTaskStatus(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof UpdateTaskStatusParams>,
): Promise<Result<TaskStatusUpdate>> {
  const validated = UpdateTaskStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Update task status and check dependencies
  return ok({
    taskId: validated.data.taskId,
    previousStatus: 'not_started',
    newStatus: validated.data.status,
    updatedBy: userId,
    updatedAt: new Date(),
    comments: validated.data.comments,
  });
}

const GetMyTasksParams = z.object({
  ownerId: z.string(),
  calendarId: z.string().optional(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'blocked']).optional(),
});

export interface MyTasks {
  tasks: CloseTask[];
  totalTasks: number;
  overdueTasks: number;
  dueTodayTasks: number;
}

export async function getMyTasks(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetMyTasksParams>,
): Promise<Result<MyTasks>> {
  const validated = GetMyTasksParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get tasks assigned to user
  return ok({
    tasks: [],
    totalTasks: 0,
    overdueTasks: 0,
    dueTodayTasks: 0,
  });
}

const GetCalendarTasksParams = z.object({
  calendarId: z.string(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'blocked']).optional(),
});

export interface CalendarTasks {
  calendarId: string;
  tasks: CloseTask[];
  totalTasks: number;
  completedTasks: number;
  blockedTasks: number;
  criticalPath: Array<{ taskId: string; taskName: string; dueDate: Date }>;
}

export async function getCalendarTasks(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetCalendarTasksParams>,
): Promise<Result<CalendarTasks>> {
  const validated = GetCalendarTasksParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get all tasks for close calendar with critical path
  return ok({
    calendarId: validated.data.calendarId,
    tasks: [],
    totalTasks: 0,
    completedTasks: 0,
    blockedTasks: 0,
    criticalPath: [],
  });
}
