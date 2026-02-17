/**
 * Demand Sensing
 * 
 * Real-time demand signal capture and short-term adjustments.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const DemandSignalSchema = z.object({
  signalId: z.string(),
  itemId: z.string(),
  signalType: z.enum(['pos_data', 'social_media', 'weather', 'promotions', 'events']),
  value: z.number(),
  timestamp: z.string(),
  impact: z.enum(['increase', 'decrease', 'neutral']),
  magnitude: z.number(),
});

export type DemandSignal = z.infer<typeof DemandSignalSchema>;

export const ForecastAdjustmentSchema = z.object({
  itemId: z.string(),
  period: z.string(),
  originalForecast: z.number(),
  adjustedForecast: z.number(),
  adjustmentPercent: z.number(),
  signalsApplied: z.array(z.string()),
});

export type ForecastAdjustment = z.infer<typeof ForecastAdjustmentSchema>;

export async function senseDemand(
  db: Database,
  orgId: string,
  params: {
    signalId: string;
    itemId: string;
    signalType: 'pos_data' | 'social_media' | 'weather' | 'promotions' | 'events';
    value: number;
  },
): Promise<Result<DemandSignal>> {
  const validation = z.object({
    signalId: z.string().min(1),
    itemId: z.string().min(1),
    signalType: z.enum(['pos_data', 'social_media', 'weather', 'promotions', 'events']),
    value: z.number(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const impact = params.value > 0 ? 'increase' : params.value < 0 ? 'decrease' : 'neutral';
  const magnitude = Math.abs(params.value);

  return ok({
    signalId: params.signalId,
    itemId: params.itemId,
    signalType: params.signalType,
    value: params.value,
    timestamp: new Date().toISOString(),
    impact,
    magnitude,
  });
}

export async function adjustForecast(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    period: string;
    originalForecast: number;
    signals: Array<{ signalId: string; adjustmentPercent: number }>;
  },
): Promise<Result<ForecastAdjustment>> {
  const validation = z.object({
    itemId: z.string().min(1),
    period: z.string(),
    originalForecast: z.number().nonnegative(),
    signals: z.array(z.object({
      signalId: z.string(),
      adjustmentPercent: z.number(),
    })),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const totalAdjustment = params.signals.reduce((sum, s) => sum + s.adjustmentPercent, 0);
  const adjustedForecast = Math.round(params.originalForecast * (1 + totalAdjustment / 100));

  return ok({
    itemId: params.itemId,
    period: params.period,
    originalForecast: params.originalForecast,
    adjustedForecast,
    adjustmentPercent: Math.round(totalAdjustment * 100) / 100,
    signalsApplied: params.signals.map((s) => s.signalId),
  });
}
