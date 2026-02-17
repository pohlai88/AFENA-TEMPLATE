/**
 * Seasonal Adjustment
 * 
 * Seasonality detection and time series decomposition.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const SeasonalityDetectionSchema = z.object({
  itemId: z.string(),
  hasSeasonality: z.boolean(),
  seasonalPeriod: z.number().optional(),
  seasonalityStrength: z.number(),
  peakPeriods: z.array(z.string()),
  troughPeriods: z.array(z.string()),
});

export type SeasonalityDetection = z.infer<typeof SeasonalityDetectionSchema>;

export const TimeSeriesDecompositionSchema = z.object({
  itemId: z.string(),
  method: z.enum(['additive', 'multiplicative']),
  components: z.array(z.object({
    period: z.string(),
    actual: z.number(),
    trend: z.number(),
    seasonal: z.number(),
    random: z.number(),
  })),
});

export type TimeSeriesDecomposition = z.infer<typeof TimeSeriesDecompositionSchema>;

export async function detectSeasonality(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    data: Array<{ period: string; value: number }>;
  },
): Promise<Result<SeasonalityDetection>> {
  const validation = z.object({
    itemId: z.string().min(1),
    data: z.array(z.object({ period: z.string(), value: z.number().nonnegative() })).min(12),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  // Placeholder logic
  const values = params.data.map((d) => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const cv = Math.sqrt(variance) / mean;

  return ok({
    itemId: params.itemId,
    hasSeasonality: cv > 0.2,
    seasonalPeriod: 12,
    seasonalityStrength: Math.round(cv * 100) / 100,
    peakPeriods: ['2024-06', '2024-12'],
    troughPeriods: ['2024-02', '2024-08'],
  });
}

export async function decomposeTimeSeries(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    data: Array<{ period: string; value: number }>;
    method: 'additive' | 'multiplicative';
  },
): Promise<Result<TimeSeriesDecomposition>> {
  const validation = z.object({
    itemId: z.string().min(1),
    data: z.array(z.object({ period: z.string(), value: z.number().nonnegative() })).min(12),
    method: z.enum(['additive', 'multiplicative']),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  // Simplified decomposition
  const components = params.data.map((d) => ({
    period: d.period,
    actual: d.value,
    trend: d.value * 0.95,
    seasonal: params.method === 'additive' ? d.value * 0.05 : 1.05,
    random: params.method === 'additive' ? 0 : 1.0,
  }));

  return ok({ itemId: params.itemId, method: params.method, components });
}
