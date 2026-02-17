import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const DefineKPIParams = z.object({ kpiName: z.string(), target: z.number(), unit: z.string() });
export interface KPI { kpiId: string; kpiName: string; target: number; currentValue: number }
export async function defineKPI(db: DbInstance, orgId: string, params: z.infer<typeof DefineKPIParams>): Promise<Result<KPI>> {
  const validated = DefineKPIParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ kpiId: 'kpi-1', kpiName: validated.data.kpiName, target: validated.data.target, currentValue: 0 });
}

const TrackKPIPerformanceParams = z.object({ kpiId: z.string(), periodEnd: z.date() });
export interface KPIPerformance { kpiId: string; currentValue: number; target: number; achievement: number; trend: string }
export async function trackKPIPerformance(db: DbInstance, orgId: string, params: z.infer<typeof TrackKPIPerformanceParams>): Promise<Result<KPIPerformance>> {
  const validated = TrackKPIPerformanceParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ kpiId: validated.data.kpiId, currentValue: 95, target: 100, achievement: 0.95, trend: 'improving' });
}
