import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const EnrollEmployeeParams = z.object({
  employeeId: z.string(),
  planIds: z.array(z.string()),
  effectiveDate: z.date(),
  dependents: z.array(z.object({ id: z.string(), relationship: z.string() })).optional(),
});

export interface EmployeeEnrollment {
  enrollmentId: string;
  employeeId: string;
  planIds: string[];
  effectiveDate: Date;
  status: 'pending' | 'active';
}

export async function enrollEmployee(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof EnrollEmployeeParams>,
): Promise<Result<EmployeeEnrollment>> {
  const validated = EnrollEmployeeParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ enrollmentId: 'enr-1', employeeId: validated.data.employeeId, planIds: validated.data.planIds, effectiveDate: validated.data.effectiveDate, status: 'active' });
}

export const ProcessOpenEnrollmentParams = z.object({
  enrollmentYear: z.number(),
  startDate: z.date(),
  endDate: z.date(),
});

export interface OpenEnrollmentResult {
  periodId: string;
  enrollmentYear: number;
  employeesNotified: number;
  status: 'open' | 'closed';
}

export async function processOpenEnrollment(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ProcessOpenEnrollmentParams>,
): Promise<Result<OpenEnrollmentResult>> {
  const validated = ProcessOpenEnrollmentParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ periodId: 'oe-2026', enrollmentYear: validated.data.enrollmentYear, employeesNotified: 150, status: 'open' });
}
