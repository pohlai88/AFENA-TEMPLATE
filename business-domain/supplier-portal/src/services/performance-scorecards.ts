/**
 * Performance Scorecards
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const SupplierScorecardSchema = z.object({
  scorecardId: z.string(),
  supplierId: z.string(),
  period: z.string(),
  onTimeDelivery: z.number(),
  qualityRating: z.number(),
  costPerformance: z.number(),
  responsiveness: z.number(),
  overallScore: z.number(),
  ranking: z.string(),
});

export type SupplierScorecard = z.infer<typeof SupplierScorecardSchema>;

export const SupplierRatingSchema = z.object({
  ratingId: z.string(),
  supplierId: z.string(),
  category: z.enum(['quality', 'delivery', 'service', 'cost']),
  score: z.number(),
  ratedBy: z.string(),
  ratedAt: z.string(),
  comments: z.string().optional(),
});

export type SupplierRating = z.infer<typeof SupplierRatingSchema>;

export async function generateScorecard(
  db: Database,
  orgId: string,
  params: {
    scorecardId: string;
    supplierId: string;
    period: string;
    metrics: {
      onTimeDelivery: number;
      qualityRating: number;
      costPerformance: number;
      responsiveness: number;
    };
  },
): Promise<Result<SupplierScorecard>> {
  const validation = z.object({
    scorecardId: z.string().min(1),
    supplierId: z.string().min(1),
    period: z.string(),
    metrics: z.object({
      onTimeDelivery: z.number().min(0).max(100),
      qualityRating: z.number().min(0).max(100),
      costPerformance: z.number().min(0).max(100),
      responsiveness: z.number().min(0).max(100),
    }),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const overallScore =
    (params.metrics.onTimeDelivery * 0.3 +
      params.metrics.qualityRating * 0.3 +
      params.metrics.costPerformance * 0.2 +
      params.metrics.responsiveness * 0.2);

  const ranking = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : 'D';

  return ok({
    scorecardId: params.scorecardId,
    supplierId: params.supplierId,
    period: params.period,
    ...params.metrics,
    overallScore: Math.round(overallScore * 100) / 100,
    ranking,
  });
}

export async function rateSupplier(
  db: Database,
  orgId: string,
  params: {
    ratingId: string;
    supplierId: string;
    category: 'quality' | 'delivery' | 'service' | 'cost';
    score: number;
    ratedBy: string;
    comments?: string;
  },
): Promise<Result<SupplierRating>> {
  const validation = z.object({
    ratingId: z.string().min(1),
    supplierId: z.string().min(1),
    category: z.enum(['quality', 'delivery', 'service', 'cost']),
    score: z.number().min(0).max(100),
    ratedBy: z.string().min(1),
    comments: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  return ok({ ...params, ratedAt: new Date().toISOString() });
}
