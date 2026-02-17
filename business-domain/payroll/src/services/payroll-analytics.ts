import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const LaborCostAnalysisSchema = z.object({ period: z.string(), totalLaborCost: z.number(), regularHoursCost: z.number(), overtimeCost: z.number(), benefitsCost: z.number(), taxesCost: z.number() });
export type LaborCostAnalysis = z.infer<typeof LaborCostAnalysisSchema>;

export const CostDistributionSchema = z.object({ period: z.string(), departments: z.array(z.object({ departmentId: z.string(), cost: z.number(), percentage: z.number() })) });
export type CostDistribution = z.infer<typeof CostDistributionSchema>;

export async function analyzeLaborCost(db: Database, orgId: string, params: { period: string; regularHoursCost: number; overtimeCost: number; benefitsCost: number; taxesCost: number }): Promise<Result<LaborCostAnalysis>> {
  const validation = z.object({ period: z.string(), regularHoursCost: z.number().nonnegative(), overtimeCost: z.number().nonnegative(), benefitsCost: z.number().nonnegative(), taxesCost: z.number().nonnegative() }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  const totalLaborCost = params.regularHoursCost + params.overtimeCost + params.benefitsCost + params.taxesCost;
  return ok({ period: params.period, totalLaborCost, ...params });
}

export async function distributeCost(db: Database, orgId: string, params: { period: string; departments: Array<{ departmentId: string; cost: number }> }): Promise<Result<CostDistribution>> {
  const validation = z.object({ period: z.string(), departments: z.array(z.object({ departmentId: z.string(), cost: z.number().nonnegative() })).min(1) }).safeParse(params);
  if (!validation.success) return err({ code: 'VALIDATION_ERROR', message: validation.error.message });
  const totalCost = params.departments.reduce((sum, d) => sum + d.cost, 0);
  const departments = params.departments.map(d => ({ ...d, percentage: Math.round((d.cost / totalCost) * 10000) / 100 }));
  return ok({ period: params.period, departments });
}
