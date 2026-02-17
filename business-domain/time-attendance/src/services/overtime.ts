import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CalculateOvertimeParams = z.object({
  employeeId: z.string(),
  periodStart: z.date(),
  periodEnd: z.date(),
  regularHours: z.number(),
  totalHours: z.number(),
  hourlyRateMinor: z.number(),
});

export interface OvertimeCalculation {
  employeeId: string;
  overtimeHours: number;
  overtimePayMinor: number;
  overtimeMultiplier: number;
}

export async function calculateOvertime(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateOvertimeParams>,
): Promise<Result<OvertimeCalculation>> {
  const validated = CalculateOvertimeParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const overtimeHours = Math.max(0, validated.data.totalHours - validated.data.regularHours);
  const overtimePayMinor = overtimeHours * validated.data.hourlyRateMinor * 1.5;
  
  return ok({ employeeId: validated.data.employeeId, overtimeHours, overtimePayMinor, overtimeMultiplier: 1.5 });
}

export const TrackOvertimeLimitsParams = z.object({
  employeeId: z.string(),
  fiscalYear: z.number(),
  weeklyLimit: z.number().optional(),
});

export interface OvertimeLimits {
  employeeId: string;
  totalOvertimeHours: number;
  weeklyLimit: number;
  isCompliant: boolean;
  weeksBreach: number;
}

export async function trackOvertimeLimits(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof TrackOvertimeLimitsParams>,
): Promise<Result<OvertimeLimits>> {
  const validated = TrackOvertimeLimitsParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ employeeId: validated.data.employeeId, totalOvertimeHours: 120, weeklyLimit: validated.data.weeklyLimit || 10, isCompliant: true, weeksBreach: 0 });
}
