/**
 * Production Analytics
 * 
 * OEE, cycle time, and throughput analysis.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const OEESchema = z.object({
  workCenterId: z.string(),
  period: z.string(),
  availability: z.number(),
  performance: z.number(),
  quality: z.number(),
  oee: z.number(),
  plannedProductionTime: z.number(),
  actualProductionTime: z.number(),
  downtime: z.number(),
  idealCycleTime: z.number(),
  totalPieces: z.number(),
  goodPieces: z.number(),
});

export type OEE = z.infer<typeof OEESchema>;

export const ThroughputAnalysisSchema = z.object({
  workCenterId: z.string(),
  period: z.string(),
  totalUnitsProduced: z.number(),
  averageCycleTime: z.number(),
  throughputRate: z.number(),
  bottleneckOperations: z.array(z.object({
    operationId: z.string(),
    averageDuration: z.number(),
    utilizationPercent: z.number(),
  })),
  wipInventory: z.number(),
});

export type ThroughputAnalysis = z.infer<typeof ThroughputAnalysisSchema>;

/**
 * Calculate Overall Equipment Effectiveness (OEE)
 */
export async function calculateOEE(
  db: Database,
  orgId: string,
  params: {
    workCenterId: string;
    period: string;
    plannedProductionMinutes: number;
    downtimeMinutes: number;
    idealCycleTimePerUnit: number;
    totalPieces: number;
    goodPieces: number;
  },
): Promise<Result<OEE>> {
  const validation = z.object({
    workCenterId: z.string().min(1),
    period: z.string(),
    plannedProductionMinutes: z.number().positive(),
    downtimeMinutes: z.number().nonnegative(),
    idealCycleTimePerUnit: z.number().positive(),
    totalPieces: z.number().nonnegative(),
    goodPieces: z.number().nonnegative(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  if (params.goodPieces > params.totalPieces) {
    return err({
      code: 'VALIDATION_ERROR',
      message: 'Good pieces cannot exceed total pieces',
    });
  }

  // OEE = Availability × Performance × Quality
  const actualProductionTime = params.plannedProductionMinutes - params.downtimeMinutes;
  const availability = actualProductionTime / params.plannedProductionMinutes;

  const idealProduction = actualProductionTime / params.idealCycleTimePerUnit;
  const performance = params.totalPieces > 0 ? Math.min(params.totalPieces / idealProduction, 1.0) : 0;

  const quality = params.totalPieces > 0 ? params.goodPieces / params.totalPieces : 0;

  const oee = availability * performance * quality;

  return ok({
    workCenterId: params.workCenterId,
    period: params.period,
    availability: Math.round(availability * 10000) / 100,
    performance: Math.round(performance * 10000) / 100,
    quality: Math.round(quality * 10000) / 100,
    oee: Math.round(oee * 10000) / 100,
    plannedProductionTime: params.plannedProductionMinutes,
    actualProductionTime,
    downtime: params.downtimeMinutes,
    idealCycleTime: params.idealCycleTimePerUnit,
    totalPieces: params.totalPieces,
    goodPieces: params.goodPieces,
  });
}

/**
 * Analyze throughput and identify bottlenecks
 */
export async function analyzeThroughput(
  db: Database,
  orgId: String,
  params: {
    workCenterId: string;
    period: string;
    completedJobs: Array<{
      workOrderId: string;
      operationId: string;
      quantity: number;
      cycleTimeMinutes: number;
    }>;
    wipInventory: number;
  },
): Promise<Result<ThroughputAnalysis>> {
  const validation = z.object({
    workCenterId: z.string().min(1),
    period: z.string(),
    completedJobs: z.array(z.object({
      workOrderId: z.string(),
      operationId: z.string(),
      quantity: z.number().positive(),
      cycleTimeMinutes: z.number().positive(),
    })).min(1),
    wipInventory: z.number().nonnegative(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Calculate total units and average cycle time
  const totalUnits = params.completedJobs.reduce((sum, job) => sum + job.quantity, 0);
  const totalCycleTime = params.completedJobs.reduce((sum, job) => sum + job.cycleTimeMinutes, 0);
  const averageCycleTime = totalCycleTime / params.completedJobs.length;

  // Throughput rate (units per hour)
  const throughputRate = averageCycleTime > 0 ? (60 / averageCycleTime) * totalUnits : 0;

  // Identify bottlenecks (operations with longest average duration)
  const operationStats = new Map<
    string,
    { totalDuration: number; count: number; totalQuantity: number }
  >();

  for (const job of params.completedJobs) {
    const stats = operationStats.get(job.operationId) || {
      totalDuration: 0,
      count: 0,
      totalQuantity: 0,
    };
    stats.totalDuration += job.cycleTimeMinutes;
    stats.count += 1;
    stats.totalQuantity += job.quantity;
    operationStats.set(job.operationId, stats);
  }

  const bottleneckOperations = Array.from(operationStats.entries())
    .map(([operationId, stats]) => ({
      operationId,
      averageDuration: stats.totalDuration / stats.count,
      utilizationPercent: Math.round(((stats.totalDuration / totalCycleTime) * 100 * 100)) / 100,
    }))
    .sort((a, b) => b.averageDuration - a.averageDuration)
    .slice(0, 3); // Top 3 bottlenecks

  return ok({
    workCenterId: params.workCenterId,
    period: params.period,
    totalUnitsProduced: totalUnits,
    averageCycleTime: Math.round(averageCycleTime * 100) / 100,
    throughputRate: Math.round(throughputRate * 100) / 100,
    bottleneckOperations,
    wipInventory: params.wipInventory,
  });
}
