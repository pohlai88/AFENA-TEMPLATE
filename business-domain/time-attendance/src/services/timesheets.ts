import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const SubmitTimesheetParams = z.object({
  employeeId: z.string(),
  periodStart: z.date(),
  periodEnd: z.date(),
  entries: z.array(z.object({ date: z.date(), hoursWorked: z.number(), projectId: z.string().optional() })),
});

export interface TimesheetSubmission {
  timesheetId: string;
  employeeId: string;
  totalHours: number;
  status: 'submitted' | 'approved' | 'rejected';
}

export async function submitTimesheet(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof SubmitTimesheetParams>,
): Promise<Result<TimesheetSubmission>> {
  const validated = SubmitTimesheetParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const totalHours = validated.data.entries.reduce((sum, e) => sum + e.hoursWorked, 0);
  return ok({ timesheetId: 'ts-1', employeeId: validated.data.employeeId, totalHours, status: 'submitted' });
}

export const ApproveTimesheetParams = z.object({
  timesheetId: z.string(),
  approvedBy: z.string(),
  adjustments: z.array(z.object({ entryId: z.string(), newHours: z.number() })).optional(),
});

export interface TimesheetApproval {
  timesheetId: string;
  approvedAt: Date;
  approvedBy: string;
  finalTotalHours: number;
}

export async function approveTimesheet(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ApproveTimesheetParams>,
): Promise<Result<TimesheetApproval>> {
  const validated = ApproveTimesheetParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ timesheetId: validated.data.timesheetId, approvedAt: new Date(), approvedBy: validated.data.approvedBy, finalTotalHours: 40 });
}
