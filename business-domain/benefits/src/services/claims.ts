import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const SubmitClaimParams = z.object({
  employeeId: z.string(),
  planId: z.string(),
  claimType: z.enum(['medical', 'dental', 'vision', 'prescription']),
  amountMinor: z.number(),
  serviceDate: z.date(),
  providerId: z.string().optional(),
});

export interface BenefitsClaim {
  claimId: string;
  employeeId: string;
  claimType: string;
  amountMinor: number;
  status: 'submitted' | 'processing' | 'approved' | 'denied';
}

export async function submitClaim(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof SubmitClaimParams>,
): Promise<Result<BenefitsClaim>> {
  const validated = SubmitClaimParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ claimId: 'clm-1', employeeId: validated.data.employeeId, claimType: validated.data.claimType, amountMinor: validated.data.amountMinor, status: 'submitted' });
}

export const AdjudicateClaimParams = z.object({
  claimId: z.string(),
  decision: z.enum(['approve', 'deny', 'partial']),
  approvedAmountMinor: z.number().optional(),
  denialReason: z.string().optional(),
});

export interface ClaimAdjudication {
  claimId: string;
  decision: string;
  approvedAmountMinor: number;
  processedAt: Date;
}

export async function adjudicateClaim(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AdjudicateClaimParams>,
): Promise<Result<ClaimAdjudication>> {
  const validated = AdjudicateClaimParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ claimId: validated.data.claimId, decision: validated.data.decision, approvedAmountMinor: validated.data.approvedAmountMinor || 0, processedAt: new Date() });
}
