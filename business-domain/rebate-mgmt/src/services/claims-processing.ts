import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const SubmitRebateClaimParams = z.object({
  programId: z.string(),
  customerId: z.string(),
  claimPeriodStart: z.date(),
  claimPeriodEnd: z.date(),
  claimedAmount: z.number(),
  supportingDocuments: z.array(z.string()).optional(),
  comments: z.string().optional(),
});

export interface RebateClaim {
  claimId: string;
  programId: string;
  customerId: string;
  claimPeriodStart: Date;
  claimPeriodEnd: Date;
  claimedAmount: number;
  accrualAmount: number;
  variance: number;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  submittedBy: string;
  submittedAt: Date;
  supportingDocuments: string[];
}

export async function submitRebateClaim(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof SubmitRebateClaimParams>,
): Promise<Result<RebateClaim>> {
  const validated = SubmitRebateClaimParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Submit rebate claim for review
  return ok({
    claimId: `claim-${Date.now()}`,
    programId: validated.data.programId,
    customerId: validated.data.customerId,
    claimPeriodStart: validated.data.claimPeriodStart,
    claimPeriodEnd: validated.data.claimPeriodEnd,
    claimedAmount: validated.data.claimedAmount,
    accrualAmount: 4375,
    variance: validated.data.claimedAmount - 4375,
    status: 'submitted',
    submittedBy: userId,
    submittedAt: new Date(),
    supportingDocuments: validated.data.supportingDocuments ?? [],
  });
}

const ReviewClaimParams = z.object({
  claimId: z.string(),
  decision: z.enum(['approve', 'reject']),
  approvedAmount: z.number().optional(),
  reviewComments: z.string(),
});

export interface ClaimReview {
  claimId: string;
  decision: string;
  approvedAmount: number;
  reviewedBy: string;
  reviewedAt: Date;
  comments: string;
}

export async function reviewClaim(
  db: DbInstance,
  orgId: string,
  reviewerId: string,
  params: z.infer<typeof ReviewClaimParams>,
): Promise<Result<ClaimReview>> {
  const validated = ReviewClaimParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Review and approve/reject claim
  return ok({
    claimId: validated.data.claimId,
    decision: validated.data.decision,
    approvedAmount: validated.data.approvedAmount ?? 0,
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    comments: validated.data.reviewComments,
  });
}

const ProcessPaymentParams = z.object({
  claimId: z.string(),
  paymentMethod: z.enum(['credit_memo', 'check', 'ach', 'wire']),
  paymentReference: z.string(),
});

export interface ClaimPayment {
  claimId: string;
  paymentId: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentReference: string;
  processedBy: string;
  processedAt: Date;
}

export async function processPayment(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof ProcessPaymentParams>,
): Promise<Result<ClaimPayment>> {
  const validated = ProcessPaymentParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Process rebate payment
  return ok({
    claimId: validated.data.claimId,
    paymentId: `pay-${Date.now()}`,
    paymentAmount: 4375,
    paymentMethod: validated.data.paymentMethod,
    paymentReference: validated.data.paymentReference,
    processedBy: userId,
    processedAt: new Date(),
  });
}

const GetClaimsParams = z.object({
  programId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.enum(['submitted', 'under_review', 'approved', 'rejected', 'paid']).optional(),
});

export interface ClaimsList {
  claims: RebateClaim[];
  totalClaims: number;
  totalClaimedAmount: number;
  totalApprovedAmount: number;
  pendingReview: number;
}

export async function getClaims(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetClaimsParams>,
): Promise<Result<ClaimsList>> {
  const validated = GetClaimsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get rebate claims with filters
  return ok({
    claims: [],
    totalClaims: 0,
    totalClaimedAmount: 0,
    totalApprovedAmount: 0,
    pendingReview: 0,
  });
}
