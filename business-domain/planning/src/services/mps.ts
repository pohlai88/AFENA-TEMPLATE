/**
 * Master Production Schedule (MPS)
 * 
 * Master schedule generation and rough-cut capacity planning.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const MasterProductionScheduleSchema = z.object({
  scheduleId: z.string(),
  itemId: z.string(),
  periods: z.array(z.object({
    period: z.string(),
    plannedProduction: z.number(),
    availableToPromise: z.number(),
    projectedOnHand: z.number(),
  })),
  startDate: z.string(),
  endDate: z.string(),
});

export type MasterProductionSchedule = z.infer<typeof MasterProductionScheduleSchema>;

export const CapacityCheckSchema = z.object({
  workCenterId: z.string(),
  periods: z.array(z.object({
    period: z.string(),
    requiredHours: z.number(),
    availableHours: z.number(),
    utilization: z.number(),
    overload: z.boolean(),
  })),
  overallUtilization: z.number(),
  bottlenecks: z.array(z.string()),
});

export type CapacityCheck = z.infer<typeof CapacityCheckSchema>;

/**
 * Generate master production schedule
 */
export async function generateMPS(
  db: Database,
  orgId: string,
  params: {
    scheduleId: string;
    itemId: string;
    demandForecast: Array<{ period: string; quantity: number }>;
    currentInventory: number;
    safetyStock: number;
    productionLotSize?: number;
    startDate: string;
    endDate: string;
  },
): Promise<Result<MasterProductionSchedule>> {
  const validation = z.object({
    scheduleId: z.string().min(1),
    itemId: z.string().min(1),
    demandForecast: z.array(z.object({
      period: z.string(),
      quantity: z.number().nonnegative(),
    })),
    currentInventory: z.number().nonnegative(),
    safetyStock: z.number().nonnegative(),
    productionLotSize: z.number().positive().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Simple MPS logic: produce to cover demand + safety stock
  const periods: Array<{
    period: string;
    plannedProduction: number;
    availableToPromise: number;
    projectedOnHand: number;
  }> = [];

  let onHand = params.currentInventory;

  for (const forecast of params.demandForecast) {
    const demand = forecast.quantity;
    onHand = onHand - demand;

    let production = 0;
    if (onHand < params.safetyStock) {
      const netReq = params.safetyStock - onHand + demand;
      production = params.productionLotSize
        ? Math.ceil(netReq / params.productionLotSize) * params.productionLotSize
        : netReq;

      onHand += production;
    }

    const atp = production; // Simplified: ATP = production for the period

    periods.push({
      period: forecast.period,
      plannedProduction: production,
      availableToPromise: atp,
      projectedOnHand: onHand,
    });
  }

  return ok({
    scheduleId: params.scheduleId,
    itemId: params.itemId,
    periods,
    startDate: params.startDate,
    endDate: params.endDate,
  });
}

/**
 * rough-cut capacity planning check
 */
export async function checkCapacity(
  db: Database,
  orgId: string,
  params: {
    workCenterId: string;
    mpsSchedule: Array<{
      period: string;
      itemId: string;
      quantity: number;
      standardHoursPerUnit: number;
    }>;
    availableHoursPerPeriod: number;
  },
): Promise<Result<CapacityCheck>> {
  const validation = z.object({
    workCenterId: z.string().min(1),
    mpsSchedule: z.array(z.object({
      period: z.string(),
      itemId: z.string(),
      quantity: z.number().nonnegative(),
      standardHoursPerUnit: z.number().positive(),
    })),
    availableHoursPerPeriod: z.number().positive(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Aggregate required hours by period
  const periodMap = new Map<string, number>();
  for (const schedule of params.mpsSchedule) {
    const requiredHours = schedule.quantity * schedule.standardHoursPerUnit;
    periodMap.set(schedule.period, (periodMap.get(schedule.period) || 0) + requiredHours);
  }

  const periods = Array.from(periodMap.entries()).map(([period, requiredHours]) => {
    const utilization = requiredHours / params.availableHoursPerPeriod;
    return {
      period,
      requiredHours,
      availableHours: params.availableHoursPerPeriod,
      utilization,
      overload: utilization > 1.0,
    };
  });

  const totalRequired = periods.reduce((sum, p) => sum + p.requiredHours, 0);
  const totalAvailable = periods.length * params.availableHoursPerPeriod;
  const overallUtilization = totalRequired / totalAvailable;

  const bottlenecks = periods.filter((p) => p.overload).map((p) => p.period);

  return ok({
    workCenterId: params.workCenterId,
    periods,
    overallUtilization,
    bottlenecks,
  });
}
