import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const GarnishmentSchema = z.object({ garnishmentId: z.string(), employeeId: z.string(), type: z.enum(['child_support', 'tax_levy', 'bankruptcy', 'student_loan']), amount: z.number(), status: z.enum(['active', 'suspended', 'satisfied']) });
export type Garnishment = z.infer<typeof GarnishmentSchema>;

export const GarnishmentCalculationSchema = z.object({ empoyeeId: z.string(), disposableIncome: z.number(), garnishmentAmount: z.number(), remainingIncome: z.number() });
export type GarnishmentCalculation = z.infer<typeof GarnishmentCalculationSchema>;

export async function applyGarnishment(db: Database, orgId: string, params: { garnishmentId: string; employeeId: string; type: 'child_support' | 'tax_levy' | 'bankruptcy' | 'student_loan'; amount: number }): Promise<Result<Garnishment>> {
  const validation = z.object({ garnishmentId: z.string().min(1), employeeId: z.string().min(1), type: z.enum(['child_support', 'tax_levy', 'bankruptcy', 'student_loan']), amount: z.number().positive() }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  return ok({ garnishmentId: params.garnishmentId, employeeId: params.employeeId, type: params.type, amount: params.amount, status: 'active' });
}

export async function calculateGarnishment(db: Database, orgId: string, params: { employeeId: string; grossPay: number; garnishmentType: string; garnishmentPercent: number }): Promise<Result<GarnishmentCalculation>> {
  const validation = z.object({ employeeId: z.string().min(1), grossPay: z.number().positive(), garnishmentType: z.string(), garnishmentPercent: z.number().min(0).max(100) }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  const disposableIncome = params.grossPay * 0.75;
  const garnishmentAmount = Math.min(disposableIncome * (params.garnishmentPercent / 100), disposableIncome * 0.5);
  return ok({ empoyeeId: params.employeeId, disposableIncome, garnishmentAmount, remainingIncome: disposableIncome - garnishmentAmount });
}
