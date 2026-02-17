/**
 * Forecast Accuracy
 * 
 * Accuracy measurement and tracking signals.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const ForecastAccuracyMetricsSchema = z.object({
  itemId: z.string(),
  period: z.string(),
  mad: z.number(),
  mse: z.number(),
  rmse: z.number(),
  mape: z.number(),
  bias: z.number(),
  forecastVsActual: z.array(z.object({
    period: z.string(),
    forecast: z.number(),
    actual: z.number(),
    error: z.number(),
    percentError: z.number(),
  })),
});

export type ForecastAccuracyMetrics = z.infer<typeof ForecastAccuracyMetricsSchema>;

export const TrackingSignalSchema = z.object({
  itemId: z.string(),
  period: z.string(),
  trackingSignal: z.number(),
  mad: z.number(),
  cumulativeBias: z.number(),
  outOfControl: z.boolean(),
  status: z.enum(['good', 'warning', 'alarm']),
});

export type TrackingSignal = z.infer<typeof TrackingSignalSchema>;

export async function measureAccuracy(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    period: string;
    data: Array<{ period: string; forecast: number; actual: number }>;
  },
): Promise<Result<ForecastAccuracyMetrics>> {
  const validation = z.object({
    itemId: z.string().min(1),
    period: z.string(),
    data: z.array(z.object({
      period: z.string(),
      forecast: z.number().nonnegative(),
      actual: z.number().nonnegative(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const forecastVsActual = params.data.map((d) => {
    const error = d.forecast - d.actual;
    const percentError = d.actual !== 0 ? Math.abs(error / d.actual) * 100 : 0;
    return { ...d, error, percentError };
  });

  const n = forecastVsActual.length;
  const mad = forecastVsActual.reduce((sum, d) => sum + Math.abs(d.error), 0) / n;
  const mse = forecastVsActual.reduce((sum, d) => sum + Math.pow(d.error, 2), 0) / n;
  const rmse = Math.sqrt(mse);
  const mape = forecastVsActual.reduce((sum, d) => sum + d.percentError, 0) / n;
  const bias = forecastVsActual.reduce((sum, d) => sum + d.error, 0) / n;

  return ok({
    itemId: params.itemId,
    period: params.period,
    mad: Math.round(mad * 100) / 100,
    mse: Math.round(mse * 100) / 100,
    rmse: Math.round(rmse * 100) / 100,
    mape: Math.round(mape * 100) / 100,
    bias: Math.round(bias * 100) / 100,
    forecastVsActual,
  });
}

export async function calculateTrackingSignal(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    period: string;
    errors: number[];
    controlLimit?: number;
  },
): Promise<Result<TrackingSignal>> {
  const validation = z.object({
    itemId: z.string().min(1),
    period: z.string(),
    errors: z.array(z.number()).min(1),
    controlLimit: z.number().positive().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const controlLimit = params.controlLimit || 4;
  const cumulativeBias = params.errors.reduce((sum, e) => sum + e, 0);
  const mad = params.errors.reduce((sum, e) => sum + Math.abs(e), 0) / params.errors.length;
  const trackingSignal = mad !== 0 ? cumulativeBias / mad : 0;
  const outOfControl = Math.abs(trackingSignal) > controlLimit;

  let status: 'good' | 'warning' | 'alarm';
  if (Math.abs(trackingSignal) > controlLimit) {
    status = 'alarm';
  } else if (Math.abs(trackingSignal) > controlLimit * 0.75) {
    status = 'warning';
  } else {
    status = 'good';
  }

  return ok({
    itemId: params.itemId,
    period: params.period,
    trackingSignal: Math.round(trackingSignal * 100) / 100,
    mad: Math.round(mad * 100) / 100,
    cumulativeBias: Math.round(cumulativeBias * 100) / 100,
    outOfControl,
    status,
  });
}
