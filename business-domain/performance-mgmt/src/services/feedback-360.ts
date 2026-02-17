import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const Initiate360FeedbackParams = z.object({
  employeeId: z.string(),
  feedbackProviders: z.array(z.object({ providerId: z.string(), relationship: z.enum(['manager', 'peer', 'direct-report', 'customer']) })),
  deadline: z.date(),
  anonymous: z.boolean().optional(),
});

export interface Feedback360 {
  feedbackCycleId: string;
  employeeId: string;
  totalProviders: number;
  status: 'initiated' | 'in-progress' | 'completed';
  deadline: Date;
}

export async function initiate360Feedback(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof Initiate360FeedbackParams>,
): Promise<Result<Feedback360>> {
  const validated = Initiate360FeedbackParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ feedbackCycleId: '360-1', employeeId: validated.data.employeeId, totalProviders: validated.data.feedbackProviders.length, status: 'initiated', deadline: validated.data.deadline });
}

export const Aggregate360ResultsParams = z.object({
  feedbackCycleId: z.string(),
});

export interface FeedbackResults {
  feedbackCycleId: string;
  overallScore: number;
  responseRate: number;
  strengthsTop3: string[];
  improvementsTop3: string[];
  ratingsByCategory: Array<{ category: string; score: number }>;
}

export async function aggregate360Results(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof Aggregate360ResultsParams>,
): Promise<Result<FeedbackResults>> {
  const validated = Aggregate360ResultsParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ feedbackCycleId: validated.data.feedbackCycleId, overallScore: 4.2, responseRate: 0.95, strengthsTop3: ['Communication', 'Leadership', 'Problem Solving'], improvementsTop3: ['Delegation', 'Time Management'], ratingsByCategory: [{ category: 'Leadership', score: 4.5 }] });
}
