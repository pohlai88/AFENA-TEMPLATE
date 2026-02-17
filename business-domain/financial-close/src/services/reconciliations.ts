import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const SubmitReconciliationParams = z.object({
  calendarId: z.string(),
  accountId: z.string(),
  glBalance: z.number(),
  subledgerBalance: z.number(),
  variance: z.number(),
  varianceExplanation: z.string().optional(),
  supportingDocuments: z.array(z.string()).optional(),
});

export interface Reconciliation {
  reconciliationId: string;
  calendarId: string;
  accountId: string;
  glBalance: number;
  subledgerBalance: number;
  variance: number;
  varianceExplanation?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: Date;
  supportingDocuments: string[];
}

export async function submitReconciliation(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof SubmitReconciliationParams>,
): Promise<Result<Reconciliation>> {
  const validated = SubmitReconciliationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Submit reconciliation for review
  return ok({
    reconciliationId: `recon-${Date.now()}`,
    calendarId: validated.data.calendarId,
    accountId: validated.data.accountId,
    glBalance: validated.data.glBalance,
    subledgerBalance: validated.data.subledgerBalance,
    variance: validated.data.variance,
    varianceExplanation: validated.data.varianceExplanation,
    status: 'submitted',
    submittedBy: userId,
    submittedAt: new Date(),
    supportingDocuments: validated.data.supportingDocuments ?? [],
  });
}

const ReviewReconciliationParams = z.object({
  reconciliationId: z.string(),
  decision: z.enum(['approve', 'reject']),
  reviewComments: z.string(),
});

export interface ReconciliationReview {
  reconciliationId: string;
  decision: string;
  reviewedBy: string;
  reviewedAt: Date;
  comments: string;
}

export async function reviewReconciliation(
  db: DbInstance,
  orgId: string,
  reviewerId: string,
  params: z.infer<typeof ReviewReconciliationParams>,
): Promise<Result<ReconciliationReview>> {
  const validated = ReviewReconciliationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Review and approve/reject reconciliation
  return ok({
    reconciliationId: validated.data.reconciliationId,
    decision: validated.data.decision,
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    comments: validated.data.reviewComments,
  });
}

const GetReconciliationStatusParams = z.object({
  calendarId: z.string(),
  status: z.enum(['submitted', 'under_review', 'approved', 'rejected']).optional(),
});

export interface ReconciliationStatus {
  calendarId: string;
  totalAccounts: number;
  reconciledAccounts: number;
  approvedReconciliations: number;
  rejectedReconciliations: number;
  pendingReconciliations: number;
  totalVariance: number;
  varianceByAccount: Array<{
    accountId: string;
    variance: number;
    status: string;
  }>;
}

export async function getReconciliationStatus(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetReconciliationStatusParams>,
): Promise<Result<ReconciliationStatus>> {
  const validated = GetReconciliationStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get reconciliation status for close period
  return ok({
    calendarId: validated.data.calendarId,
    totalAccounts: 250,
    reconciledAccounts: 187,
    approvedReconciliations: 165,
    rejectedReconciliations: 8,
    pendingReconciliations: 14,
    totalVariance: 12450.75,
    varianceByAccount: [],
  });
}

const GetMyReconciliationsParams = z.object({
  userId: z.string(),
  calendarId: z.string().optional(),
  status: z.enum(['submitted', 'under_review', 'approved', 'rejected']).optional(),
});

export interface MyReconciliations {
  reconciliations: Reconciliation[];
  totalCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export async function getMyReconciliations(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetMyReconciliationsParams>,
): Promise<Result<MyReconciliations>> {
  const validated = GetMyReconciliationsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get reconciliations submitted by user
  return ok({
    reconciliations: [],
    totalCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });
}
