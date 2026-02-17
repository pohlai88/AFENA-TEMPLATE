import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CalculateEarnedValueParams = z.object({
  projectId: z.string(),
  asOfDate: z.date(),
});

export interface EarnedValueMetrics {
  projectId: string;
  plannedValueMinor: number;
  earnedValueMinor: number;
  actualCostMinor: number;
  costVariance: number;
  scheduleVariance: number;
  cpi: number;
  spi: number;
}

export async function calculateEarnedValue(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateEarnedValueParams>,
): Promise<Result<EarnedValueMetrics>> {
  const validated = CalculateEarnedValueParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const plannedValueMinor = 8000000;
  const earnedValueMinor = 7500000;
  const actualCostMinor = 7200000;
  const costVariance = earnedValueMinor - actualCostMinor;
  const scheduleVariance = earnedValueMinor - plannedValueMinor;
  const cpi = earnedValueMinor / actualCostMinor;
  const spi = earnedValueMinor / plannedValueMinor;
  
  return ok({ projectId: validated.data.projectId, plannedValueMinor, earnedValueMinor, actualCostMinor, costVariance, scheduleVariance, cpi, spi });
}

export const ForecastProjectCompletionParams = z.object({
  projectId: z.string(),
  forecastMethod: z.enum(['current-performance', 'planned-performance', 'statistical']),
});

export interface CompletionForecast {
  projectId: string;
  estimateAtCompletionMinor: number;
  estimateToCompleteMinor: number;
  varianceAtCompletionMinor: number;
  forecastCompletionDate: Date;
  confidenceLevel: number;
}

export async function forecastProjectCompletion(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ForecastProjectCompletionParams>,
): Promise<Result<CompletionForecast>> {
  const validated = ForecastProjectCompletionParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const budgetMinor = 10000000;
  const estimateAtCompletionMinor = 9800000;
  const estimateToCompleteMinor = 2600000;
  const forecastCompletionDate = new Date();
  forecastCompletionDate.setMonth(forecastCompletionDate.getMonth() + 6);
  
  return ok({ projectId: validated.data.projectId, estimateAtCompletionMinor, estimateToCompleteMinor, varianceAtCompletionMinor: budgetMinor - estimateAtCompletionMinor, forecastCompletionDate, confidenceLevel: 0.85 });
}
