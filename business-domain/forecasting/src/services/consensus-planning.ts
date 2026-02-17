/**
 * Consensus Planning
 * 
 * Collaborative forecasting and stakeholder reconciliation.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const ConsensusForecastSchema = z.object({
  forecastId: z.string(),
  itemId: z.string(),
  period: z.string(),
  statistical: z.number(),
  salesInput: z.number().optional(),
  marketingInput: z.number().optional(),
  executiveInput: z.number().optional(),
  consensus: z.number(),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
});

export type ConsensusForecast = z.infer<typeof ConsensusForecastSchema>;

export const ForecastReconciliationSchema = z.object({
  itemId: z.string(),
  period: z.string(),
  sources: z.array(z.object({
    source: z.string(),
    value: z.number(),
    weight: z.number(),
  })),
  reconciledValue: z.number(),
  variance: z.number(),
});

export type ForecastReconciliation = z.infer<typeof ForecastReconciliationSchema>;

export async function createConsensusForecast(
  db: Database,
  orgId: string,
  params: {
    forecastId: string;
    itemId: string;
    period: string;
    statistical: number;
    salesInput?: number;
    marketingInput?: number;
    executiveInput?: number;
    approvedBy?: string;
  },
): Promise<Result<ConsensusForecast>> {
  const validation = z.object({
    forecastId: z.string().min(1),
    itemId: z.string().min(1),
    period: z.string(),
    statistical: z.number().nonnegative(),
    salesInput: z.number().nonnegative().optional(),
    marketingInput: z.number().nonnegative().optional(),
    executiveInput: z.number().nonnegative().optional(),
    approvedBy: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const inputs = [params.statistical, params.salesInput, params.marketingInput, params.executiveInput].filter(
    (v): v is number => v !== undefined,
  );
  const consensus = Math.round(inputs.reduce((sum, v) => sum + v, 0) / inputs.length);

  return ok({
    forecastId: params.forecastId,
    itemId: params.itemId,
    period: params.period,
    statistical: params.statistical,
    salesInput: params.salesInput,
    marketingInput: params.marketingInput,
    executiveInput: params.executiveInput,
    consensus,
    approvedBy: params.approvedBy,
    approvedAt: params.approvedBy ? new Date().toISOString() : undefined,
  });
}

export async function reconcileForecast(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    period: string;
    sources: Array<{ source: string; value: number; weight?: number }>;
  },
): Promise<Result<ForecastReconciliation>> {
  const validation = z.object({
    itemId: z.string().min(1),
    period: z.string(),
    sources: z.array(z.object({
      source: z.string(),
      value: z.number().nonnegative(),
      weight: z.number().min(0).max(1).optional(),
    })).min(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  }

  const defaultWeight = 1 / params.sources.length;
  const sources = params.sources.map((s) => ({ ...s, weight: s.weight || defaultWeight }));
  const totalWeight = sources.reduce((sum, s) => sum + s.weight, 0);
  const reconciledValue = Math.round(
    sources.reduce((sum, s) => sum + s.value * s.weight, 0) / totalWeight,
  );
  const variance = Math.max(...sources.map((s) => s.value)) - Math.min(...sources.map((s) => s.value));

  return ok({ itemId: params.itemId, period: params.period, sources, reconciledValue, variance });
}
