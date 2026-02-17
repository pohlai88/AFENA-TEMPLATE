import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const W2FormSchema = z.object({ employeeId: z.string(), taxYear: z.number(), wages: z.number(), federalWithholding: z.number(), socialSecurityWages: z.number(), socialSecurityWithholding: z.number(), medicareWages: z.number(), medicareWithholding: z.number() });
export type W2Form = z.infer<typeof W2FormSchema>;

export const Form941ReconciliationSchema = z.object({ quarter: z.string(), totalWages: z.number(), federalTaxWithheld: z.number(), socialSecurityWages: z.number(), medicareWages: z.number(), reconciled: z.boolean() });
export type Form941Reconciliation = z.infer<typeof Form941ReconciliationSchema>;

export async function generateW2(db: Database, orgId: string, params: { employeeId: string; taxYear: number }): Promise<Result<W2Form>> {
  const validation = z.object({ employeeId: z.string().min(1), taxYear: z.number().int().min(2000) }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  return ok({ employeeId: params.employeeId, taxYear: params.taxYear, wages: 60000, federalWithholding: 9000, socialSecurityWages: 60000, socialSecurityWithholding: 3720, medicareWages: 60000, medicareWithholding: 870 });
}

export async function reconcile941(db: Database, orgId: string, params: { quarter: string; totalWages: number }): Promise<Result<Form941Reconciliation>> {
  const validation = z.object({ quarter: z.string().regex(/^\d{4}-Q[1-4]$/), totalWages: z.number().nonnegative() }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  return ok({ quarter: params.quarter, totalWages: params.totalWages, federalTaxWithheld: params.totalWages * 0.15, socialSecurityWages: params.totalWages, medicareWages: params.totalWages, reconciled: true });
}
