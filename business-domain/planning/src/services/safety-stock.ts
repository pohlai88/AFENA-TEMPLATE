/**
 * Safety Stock Optimization
 * 
 * Reorder point calculation and safety stock optimization.
 */

import type { Result } from 'afenda-canon';
import { err, ok } from 'afenda-canon';
import type { Database } from 'afenda-database';
import { z } from 'zod';

export const ReorderPointSchema = z.object({
  itemId: z.string(),
  reorderPoint: z.number(),
  safetyStock: z.number(),
  averageDemand: z.number(),
  leadTimeDays: z.number(),
  serviceLevel: z.number(),
});

export type ReorderPoint = z.infer<typeof ReorderPointSchema>;

export const SafetyStockOptimizationSchema = z.object({
  itemId: z.string(),
  currentSafetyStock: z.number(),
  recommendedSafetyStock: z.number(),
  demandVariability: z.number(),
  leadTimeVariability: z.number(),
  targetServiceLevel: z.number(),
  potentialSavings: z.number(),
});

export type SafetyStockOptimization = z.infer<typeof SafetyStockOptimizationSchema>;

/**
 * Calculate reorder point
 */
export async function calculateReorderPoint(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    averageDemandPerDay: number;
    demandStdDev: number;
    leadTimeDays: number;
    leadTimeStdDev: number;
    serviceLevel: number; // e.g. 0.95 for 95%
  },
): Promise<Result<ReorderPoint>> {
  const validation = z.object({
    itemId: z.string().min(1),
    averageDemandPerDay: z.number().positive(),
    demandStdDev: z.number().nonnegative(),
    leadTimeDays: z.number().positive(),
    leadTimeStdDev: z.number().nonnegative(),
    serviceLevel: z.number().min(0).max(1),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Z-score for service level (simplified lookup)
  const zScoreMap: Record<string, number> = {
    '0.90': 1.28,
    '0.95': 1.65,
    '0.97': 1.88,
    '0.99': 2.33,
  };
  const zScore = zScoreMap[params.serviceLevel.toFixed(2)] || 1.65;

  // Safety stock = Z × √(LT × σ²demand + D²avg × σ²LT)
  const variance =
    params.leadTimeDays * Math.pow(params.demandStdDev, 2) +
    Math.pow(params.averageDemandPerDay, 2) * Math.pow(params.leadTimeStdDev, 2);
  const safetyStock = Math.ceil(zScore * Math.sqrt(variance));

  // ROP = (Average demand × Lead time) + Safety stock
  const reorderPoint = Math.ceil(params.averageDemandPerDay * params.leadTimeDays) + safetyStock;

  return ok({
    itemId: params.itemId,
    reorderPoint,
    safetyStock,
    averageDemand: params.averageDemandPerDay,
    leadTimeDays: params.leadTimeDays,
    serviceLevel: params.serviceLevel,
  });
}

/**
 * Optimize safety stock levels
 */
export async function optimizeSafetyStock(
  db: Database,
  orgId: string,
  params: {
    itemId: string;
    currentSafetyStock: number;
    historicalDemand: number[];
    leadTimeDays: number;
    targetServiceLevel: number;
    holdingCostPerUnit: number;
  },
): Promise<Result<SafetyStockOptimization>> {
  const validation = z.object({
    itemId: z.string().min(1),
    currentSafetyStock: z.number().nonnegative(),
    historicalDemand: z.array(z.number().nonnegative()).min(2),
    leadTimeDays: z.number().positive(),
    targetServiceLevel: z.number().min(0).max(1),
    holdingCostPerUnit: z.number().nonnegative(),
  }).safeParse(params);

  if (!validation.success) {
    return err({
      code: 'VALIDATION_ERROR',
      message: validation.error.message,
    });
  }

  // Calculate demand statistics
  const n = params.historicalDemand.length;
  const avgDemand = params.historicalDemand.reduce((sum, d) => sum + d, 0) / n;
  const variance =
    params.historicalDemand.reduce((sum, d) => sum + Math.pow(d - avgDemand, 2), 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avgDemand;

  // Simplified recommended safety stock using standard formula
  const zScoreMap: Record<string, number> = {
    '0.90': 1.28,
    '0.95': 1.65,
    '0.97': 1.88,
    '0.99': 2.33,
  };
  const zScore = zScoreMap[params.targetServiceLevel.toFixed(2)] || 1.65;
  const recommendedSafetyStock = Math.ceil(zScore * stdDev * Math.sqrt(params.leadTimeDays));

  // Potential savings (holding cost reduction)
  const potentialSavings =
    (params.currentSafetyStock - recommendedSafetyStock) * params.holdingCostPerUnit;

  return ok({
    itemId: params.itemId,
    currentSafetyStock: params.currentSafetyStock,
    recommendedSafetyStock,
    demandVariability: coefficientOfVariation,
    leadTimeVariability: 0, // Placeholder: would need lead time history
    targetServiceLevel: params.targetServiceLevel,
    potentialSavings: Math.max(0, potentialSavings),
  });
}
