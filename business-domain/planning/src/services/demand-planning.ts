/**
 * Demand Planning
 * 
 * Statistical forecasting and demand aggregation.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const DemandPlanSchema = z.object({
  itemId: z.string(),
  planningHorizon: z.number(),
  demandByPeriod: z.array(z.object({
    period: z.string(),
    quantity: z.number(),
    confidence: z.number(),
  })),
  method: z.enum(['moving_average', 'exponential_smoothing', 'linear_regression']),
});

export type DemandPlan = z.infer<typeof DemandPlanSchema>;

export const ConsensusPlanSchema = z.object({
  planId: z.string(),
  itemId: z.string(),
  periods: z.array(z.object({
    period: z.string(),
    statistical: z.number(),
    salesInput: z.number().optional(),
    marketingInput: z.number().optional(),
    financeInput: z.number().optional(),
    consensus: z.number(),
  })),
  approvedBy: z.string().optional(),
});

export type ConsensusPlan = z.infer<typeof ConsensusPlanSchema>;

/**
 * Generate demand plan using statistical methods
 */
export async function generateDemandPlan(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    horizonMonths: number;
    method: 'moving_average' | 'exponential_smoothing' | 'linear_regression';
    alpha?: number;
  },
): Promise<Result<DemandPlan>> {
  const validation = z.object({
    itemId: z.string().min(1),
    horizonMonths: z.number().int().positive(),
    method: z.enum(['moving_average', 'exponential_smoothing', 'linear_regression']),
    alpha: z.number().min(0).max(1).optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Placeholder: In production, fetch historical demand and apply statistical forecasting
  const demandByPeriod = Array.from({ length: params.horizonMonths }, (_, i) => ({
    period: `${new Date().getFullYear()}-${String((new Date().getMonth() + i + 1) % 12 || 12).padStart(2, '0')}`,
    quantity: 100 + Math.floor(Math.random() * 50), // Placeholder forecast
    confidence: 0.85,
  }));

  return ok({
    itemId: params.itemId,
    planningHorizon: params.horizonMonths,
    demandByPeriod,
    method: params.method,
  });
}

/**
 * Consensus planning - combine statistical forecast with stakeholder input
 */
export async function consensusPlanning(
  db: Database,
  orgId: string,
  params: {
    planId: string;
    itemId: string;
    statisticalForecast: Array<{ period: string; quantity: number }>;
    stakeholderInputs: Array<{
      period: string;
      source: 'sales' | 'marketing' | 'finance';
      quantity: number;
    }>;
    approvedBy?: string;
  },
): Promise<Result<ConsensusPlan>> {
  const validation = z.object({
    planId: z.string().min(1),
    itemId: z.string().min(1),
    statisticalForecast: z.array(z.object({
      period: z.string(),
      quantity: z.number().nonnegative(),
    })),
    stakeholderInputs: z.array(z.object({
      period: z.string(),
      source: z.enum(['sales', 'marketing', 'finance']),
      quantity: z.number().nonnegative(),
    })),
    approvedBy: z.string().optional(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Aggregate stakeholder inputs by period
  const inputsByPeriod = new Map<string, { sales?: number; marketing?: number; finance?: number }>();
  for (const input of params.stakeholderInputs) {
    if (!inputsByPeriod.has(input.period)) {
      inputsByPeriod.set(input.period, {});
    }
    inputsByPeriod.get(input.period)![input.source] = input.quantity;
  }

  // Calculate consensus (simple average of available inputs)
  const periods = params.statisticalForecast.map((stat) => {
    const inputs = inputsByPeriod.get(stat.period) || {};
    const values = [
      stat.quantity,
      inputs.sales,
      inputs.marketing,
      inputs.finance,
    ].filter((v): v is number => v !== undefined);

    const consensus = values.reduce((sum, v) => sum + v, 0) / values.length;

    return {
      period: stat.period,
      statistical: stat.quantity,
      salesInput: inputs.sales,
      marketingInput: inputs.marketing,
      financeInput: inputs.finance,
      consensus: Math.round(consensus),
    };
  });

  return ok({
    planId: params.planId,
    itemId: params.itemId,
    periods,
    approvedBy: params.approvedBy,
  });
}
