import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const TaxWithholdingSchema = z.object({ employeeId: z.string(), federalWithholding: z.number(), stateWithholding: z.number(), localWithholding: z.number(), ficaWithholding: z.number(), medicareWithholding: z.number() });
export type TaxWithholding = z.infer<typeof TaxWithholdingSchema>;

export const TaxStatusSchema = z.object({ employeeId: z.string(), filingStatus: z.enum(['single', 'married', 'head_of_household']), allowances: z.number(), additionalWithholding: z.number() });
export type TaxStatus = z.infer<typeof TaxStatusSchema>;

export async function calculateWithholding(db: Database, orgId: string, params: { employeeId: string; grossPay: number; filingStatus: string; allowances: number }): Promise<Result<TaxWithholding>> {
  const validation = z.object({ employeeId: z.string().min(1), grossPay: z.number().positive(), filingStatus: z.string(), allowances: z.number().int().nonnegative() }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  return ok({ employeeId: params.employeeId, federalWithholding: params.grossPay * 0.15, stateWithholding: params.grossPay * 0.05, localWithholding: 0, ficaWithholding: params.grossPay * 0.062, medicareWithholding: params.grossPay * 0.0145 });
}

export async function determineTaxStatus(db: Database, orgId: string, params: { employeeId: string; filingStatus: 'single' | 'married' | 'head_of_household'; allowances: number; additionalWithholding?: number }): Promise<Result<TaxStatus>> {
  const validation = z.object({ employeeId: z.string().min(1), filingStatus: z.enum(['single', 'married', 'head_of_household']), allowances: z.number().int().nonnegative(), additionalWithholding: z.number().nonnegative().optional() }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  return ok({ employeeId: params.employeeId, filingStatus: params.filingStatus, allowances: params.allowances, additionalWithholding: params.additionalWithholding || 0 });
}
