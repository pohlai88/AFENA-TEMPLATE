/**
 * Planning Analytics
 * 
 * Forecast accuracy measurement and service level analysis.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const ForecastAccuracySchema = z.object({
  itemId: z.string(),
  period: z.string(),
  forecastQty: z.number(),
  actualQty: z.number(),
  error: z.number(),
  absoluteError: z.number(),
  percentError: z.number(),
  mape: z.number(), // Mean Absolute Percentage Error
  bias: z.number(),
});

export type ForecastAccuracy = z.infer<typeof ForecastAccuracySchema>;

export const ServiceLevelSchema = z.object({
  itemId: z.string(),
  period: z.string(),
  totalDemand: z.number(),
  demandMet: z.number(),
  stockouts: z.number(),
  fillRate: z.number(),
  targetFillRate: z.number(),
  performanceGap: z.number(),
});

export type ServiceLevel = z.infer<typeof ServiceLevelSchema>;

/**
 * Analyze forecast accuracy
 */
export async function analyzeForecastAccuracy(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    period: string;
    forecastData: Array<{ period: string; forecast: number; actual: number }>;
  },
): Promise<Result<ForecastAccuracy>> {
  const validation = z.object({
    itemId: z.string().min(1),
    period: z.string(),
    forecastData: z.array(z.object({
      period: z.string(),
      forecast: z.number().nonnegative(),
      actual: z.number().nonnegative(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Calculate accuracy metrics
  let sumAbsoluteError = 0;
  let sumError = 0;
  let sumPercentError = 0;
  let count = 0;

  for (const data of params.forecastData) {
    const error = data.forecast - data.actual;
    const absoluteError = Math.abs(error);
    const percentError = data.actual !== 0 ? (absoluteError / data.actual) * 100 : 0;

    sumError += error;
    sumAbsoluteError += absoluteError;
    sumPercentError += percentError;
    count++;
  }

  const mape = count > 0 ? sumPercentError / count : 0;
  const bias = count > 0 ? sumError / count : 0;

  // Get current period data
  const currentPeriod = params.forecastData.find((d) => d.period === params.period);
  if (!currentPeriod) {
    return err({
      code: 'NOT_FOUND',
      message: `Period ${params.period} not found in forecast data`,
    });
  }

  const error = currentPeriod.forecast - currentPeriod.actual;
  const absoluteError = Math.abs(error);
  const percentError =
    currentPeriod.actual !== 0 ? (absoluteError / currentPeriod.actual) * 100 : 0;

  return ok({
    itemId: params.itemId,
    period: params.period,
    forecastQty: currentPeriod.forecast,
    actualQty: currentPeriod.actual,
    error,
    absoluteError,
    percentError,
    mape,
    bias,
  });
}

/**
 * Measure service level performance
 */
export async function measureServiceLevel(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    period: string;
    demandLines: Array<{
      lineId: string;
      requestedQty: number;
      fulfilledQty: number;
    }>;
    targetFillRate: number;
  },
): Promise<Result<ServiceLevel>> {
  const validation = z.object({
    itemId: z.string().min(1),
    period: z.string(),
    demandLines: z.array(z.object({
      lineId: z.string(),
      requestedQty: z.number().nonnegative(),
      fulfilledQty: z.number().nonnegative(),
    })).min(1),
    targetFillRate: z.number().min(0).max(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Calculate service level metrics
  let totalDemand = 0;
  let demandMet = 0;
  let stockouts = 0;

  for (const line of params.demandLines) {
    totalDemand += line.requestedQty;
    demandMet += line.fulfilledQty;
    if (line.fulfilledQty < line.requestedQty) {
      stockouts++;
    }
  }

  const fillRate = totalDemand > 0 ? demandMet / totalDemand : 1;
  const performanceGap = params.targetFillRate - fillRate;

  return ok({
    itemId: params.itemId,
    period: params.period,
    totalDemand,
    demandMet,
    stockouts,
    fillRate,
    targetFillRate: params.targetFillRate,
    performanceGap,
  });
}
