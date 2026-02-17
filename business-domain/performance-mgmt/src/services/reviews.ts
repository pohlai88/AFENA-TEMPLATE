import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CreatePerformanceReviewParams = z.object({
  employeeId: z.string(),
  reviewPeriodStart: z.date(),
  reviewPeriodEnd: z.date(),
  reviewType: z.enum(['annual', 'mid-year', 'probation', 'project']),
  reviewerId: z.string(),
});

export interface PerformanceReview {
  reviewId: string;
  employeeId: string;
  reviewType: string;
  status: 'draft' | 'submitted' | 'completed';
  dueDate: Date;
}

export async function createPerformanceReview(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreatePerformanceReviewParams>,
): Promise<Result<PerformanceReview>> {
  const validated = CreatePerformanceReviewParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const dueDate = new Date(validated.data.reviewPeriodEnd);
  dueDate.setDate(dueDate.getDate() + 14);
  
  return ok({ reviewId: 'review-1', employeeId: validated.data.employeeId, reviewType: validated.data.reviewType, status: 'draft', dueDate });
}

export const SubmitReviewParams = z.object({
  reviewId: z.string(),
  overallRating: z.number().min(1).max(5),
  comments: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export interface ReviewSubmission {
  reviewId: string;
  overallRating: number;
  submittedAt: Date;
  status: 'submitted' | 'acknowledged';
}

export async function submitReview(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof SubmitReviewParams>,
): Promise<Result<ReviewSubmission>> {
  const validated = SubmitReviewParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ reviewId: validated.data.reviewId, overallRating: validated.data.overallRating, submittedAt: new Date(), status: 'submitted' });
}
