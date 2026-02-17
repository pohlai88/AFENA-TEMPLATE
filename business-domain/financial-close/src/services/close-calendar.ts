import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateCloseCalendarParams = z.object({
  periodType: z.enum(['month', 'quarter', 'year']),
  fiscalYear: z.number(),
  fiscalPeriod: z.number(),
  startDate: z.date(),
  targetCloseDate: z.date(),
  hardCloseDate: z.date(),
  taskTemplates: z.array(z.string()).optional(),
});

export interface CloseCalendar {
  calendarId: string;
  periodType: string;
  fiscalYear: number;
  fiscalPeriod: number;
  startDate: Date;
  targetCloseDate: Date;
  hardCloseDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  totalTasks: number;
  completedTasks: number;
  createdAt: Date;
}

export async function createCloseCalendar(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateCloseCalendarParams>,
): Promise<Result<CloseCalendar>> {
  const validated = CreateCloseCalendarParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create close calendar with task templates
  return ok({
    calendarId: `close-${Date.now()}`,
    periodType: validated.data.periodType,
    fiscalYear: validated.data.fiscalYear,
    fiscalPeriod: validated.data.fiscalPeriod,
    startDate: validated.data.startDate,
    targetCloseDate: validated.data.targetCloseDate,
    hardCloseDate: validated.data.hardCloseDate,
    status: 'scheduled',
    totalTasks: validated.data.taskTemplates?.length ?? 0,
    completedTasks: 0,
    createdAt: new Date(),
  });
}

const GetCloseCalendarParams = z.object({
  fiscalYear: z.number().optional(),
  fiscalPeriod: z.number().optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
});

export interface CloseCalendarList {
  calendars: CloseCalendar[];
  totalCount: number;
  currentPeriod?: CloseCalendar;
}

export async function getCloseCalendars(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetCloseCalendarParams>,
): Promise<Result<CloseCalendarList>> {
  const validated = GetCloseCalendarParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get close calendars with filters
  return ok({
    calendars: [],
    totalCount: 0,
  });
}

const UpdateCloseStatusParams = z.object({
  calendarId: z.string(),
  status: z.enum(['in_progress', 'completed', 'cancelled']),
  comments: z.string().optional(),
});

export interface CloseStatusUpdate {
  calendarId: string;
  previousStatus: string;
  newStatus: string;
  updatedBy: string;
  updatedAt: Date;
}

export async function updateCloseStatus(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof UpdateCloseStatusParams>,
): Promise<Result<CloseStatusUpdate>> {
  const validated = UpdateCloseStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Update close calendar status
  return ok({
    calendarId: validated.data.calendarId,
    previousStatus: 'scheduled',
    newStatus: validated.data.status,
    updatedBy: userId,
    updatedAt: new Date(),
  });
}

const CreateTaskTemplateParams = z.object({
  templateName: z.string(),
  description: z.string(),
  taskType: z.enum(['reconciliation', 'journal_entry', 'approval', 'report', 'other']),
  defaultOwnerRole: z.string(),
  dueDaysBeforeClose: z.number(),
  dependencies: z.array(z.string()).optional(),
});

export interface TaskTemplate {
  templateId: string;
  templateName: string;
  description: string;
  taskType: string;
  defaultOwnerRole: string;
  dueDaysBeforeClose: number;
  dependencies: string[];
  active: boolean;
}

export async function createTaskTemplate(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateTaskTemplateParams>,
): Promise<Result<TaskTemplate>> {
  const validated = CreateTaskTemplateParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create task template
  return ok({
    templateId: `tmpl-${Date.now()}`,
    templateName: validated.data.templateName,
    description: validated.data.description,
    taskType: validated.data.taskType,
    defaultOwnerRole: validated.data.defaultOwnerRole,
    dueDaysBeforeClose: validated.data.dueDaysBeforeClose,
    dependencies: validated.data.dependencies ?? [],
    active: true,
  });
}
