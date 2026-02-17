import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const PayrollRunSchema = z.object({
  runId: z.string(),
  periodStart: z.string(),
  periodEnd: z.string(),
  employeeCount: z.number(),
  totalGross: z.number(),
  totalNet: z.number(),
  status: z.enum(['draft', 'processed', 'approved', 'paid']),
});

export type PayrollRun = z.infer<typeof PayrollRunSchema>;

export const GrossToNetSchema = z.object({
  employeeId: z.string(),
  grossPay: z.number(),
  federalTax: z.number(),
  stateTax: z.number(),
  fica: z.number(),
  medicare: z.number(),
  deductions: z.number(),
  netPay: z.number(),
});

export type GrossToNet = z.infer<typeof GrossToNetSchema>;

export async function processPayroll(db: Database, orgId: string, params: { runId: string; periodStart: string; periodEnd: string; employeeIds: string[] }): Promise<Result<PayrollRun>> {
  const validation = z.object({ runId: z.string().min(1), periodStart: z.string().datetime(), periodEnd: z.string().datetime(), employeeIds: z.array(z.string()).min(1) }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  return ok({ runId: params.runId, periodStart: params.periodStart, periodEnd: params.periodEnd, employeeCount: params.employeeIds.length, totalGross: params.employeeIds.length * 5000, totalNet: params.employeeIds.length * 3750, status: 'draft' });
}

export async function calculateGrossToNet(db: Database, orgId: string, params: { employeeId: string; grossPay: number; filingStatus: string; allowances: number }): Promise<Result<GrossToNet>> {
  const validation = z.object({ employeeId: z.string().min(1), grossPay: z.number().positive(), filingStatus: z.string(), allowances: z.number().int().nonnegative() }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  const federalTax = params.grossPay * 0.15;
  const stateTax = params.grossPay * 0.05;
  const fica = params.grossPay * 0.062;
  const medicare = params.grossPay * 0.0145;
  const deductions = 250;
  const netPay = params.grossPay - federalTax - stateTax - fica - medicare - deductions;
  return ok({ employeeId: params.employeeId, grossPay: params.grossPay, federalTax, stateTax, fica, medicare, deductions, netPay });
}
