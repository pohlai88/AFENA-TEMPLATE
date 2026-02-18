/**
 * Recipe Costing Service
 * 
 * Standard cost rollup with ingredient costs
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { RecipeCost } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const calculateRecipeCostSchema = z.object({
  recipeId: z.string().uuid(),
  includeOverhead: z.boolean().default(false),
  overheadRate: z.number().nonnegative().optional(),
});

export const bulkCalculateCostsSchema = z.object({
  recipeIds: z.array(z.string().uuid()),
  includeOverhead: z.boolean().default(false),
});

// ── Types ──────────────────────────────────────────────────────────

export type CalculateRecipeCostInput = z.infer<typeof calculateRecipeCostSchema>;
export type BulkCalculateCostsInput = z.infer<typeof bulkCalculateCostsSchema>;

export interface CostBreakdown {
  materialCost: number;
  overheadCost: number;
  totalCost: number;
  costPerServing: number;
  costPerUnit: number;
}

// ── Functions ──────────────────────────────────────────────────────

/**
 * Calculate total cost for a recipe
 */
export async function calculateRecipeCost(
  db: NeonHttpDatabase,
  orgId: string,
  input: CalculateRecipeCostInput,
): Promise<RecipeCost> {
  const validated = calculateRecipeCostSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get recipe with ingredients
  // 2. Get current cost for each ingredient
  // 3. Calculate total ingredient cost
  // 4. Apply overhead if requested
  // 5. Calculate cost per serving and per unit
  // 6. Return cost breakdown

  throw new Error('Not implemented');
}

/**
 * Calculate costs for multiple recipes in bulk
 */
export async function bulkCalculateRecipeCosts(
  db: NeonHttpDatabase,
  orgId: string,
  input: BulkCalculateCostsInput,
): Promise<RecipeCost[]> {
  const validated = bulkCalculateCostsSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get all recipes with ingredients
  // 2. Get ingredient costs in bulk
  // 3. Calculate costs for each recipe
  // 4. Return all costs

  throw new Error('Not implemented');
}

/**
 * Get cost history for a recipe
 */
export async function getRecipeCostHistory(
  db: NeonHttpDatabase,
  orgId: string,
  recipeId: string,
  startDate: Date,
  endDate: Date,
): Promise<Array<{
  calculatedAt: Date;
  totalCost: number;
  costPerServing: number;
  ingredients: Array<{
    ingredientId: string;
    ingredientName: string;
    unitCost: number;
    totalCost: number;
  }>;
}>> {
  // TODO: Implement database query
  // 1. Query historical cost calculations
  // 2. Filter by date range
  // 3. Return cost history

  throw new Error('Not implemented');
}

/**
 * Compare recipe cost against target
 */
export function compareToTarget(
  actualCost: RecipeCost,
  targetCost: number,
): {
  variance: number;
  variancePercent: number;
  overTarget: boolean;
} {
  const variance = actualCost.totalCost - targetCost;
  const variancePercent = (variance / targetCost) * 100;

  return {
    variance,
    variancePercent,
    overTarget: variance > 0,
  };
}

/**
 * Find cost drivers (most expensive ingredients)
 */
export function findCostDrivers(
  recipeCost: RecipeCost,
  topN: number = 5,
): Array<{
  ingredientId: string;
  ingredientName: string;
  totalCost: number;
  percentOfTotal: number;
}> {
  const sorted = [...recipeCost.ingredients]
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, topN);

  return sorted.map(ingredient => ({
    ingredientId: ingredient.ingredientId,
    ingredientName: ingredient.ingredientName,
    totalCost: ingredient.totalCost,
    percentOfTotal: (ingredient.totalCost / recipeCost.totalCost) * 100,
  }));
}

/**
 * Simulate cost impact of ingredient price changes
 */
export function simulatePriceChange(
  recipeCost: RecipeCost,
  priceChanges: Array<{
    ingredientId: string;
    newUnitCost: number;
  }>,
): {
  originalCost: number;
  newCost: number;
  costDelta: number;
  costDeltaPercent: number;
  impactedIngredients: Array<{
    ingredientId: string;
    ingredientName: string;
    originalCost: number;
    newCost: number;
    delta: number;
  }>;
} {
  let newTotalCost = recipeCost.totalCost;
  const impactedIngredients: Array<{
    ingredientId: string;
    ingredientName: string;
    originalCost: number;
    newCost: number;
    delta: number;
  }> = [];

  for (const change of priceChanges) {
    const ingredient = recipeCost.ingredients.find(
      ing => ing.ingredientId === change.ingredientId,
    );

    if (!ingredient) continue;

    const originalCost = ingredient.totalCost;
    const newCost = change.newUnitCost * ingredient.quantity;
    const delta = newCost - originalCost;

    newTotalCost += delta;

    impactedIngredients.push({
      ingredientId: ingredient.ingredientId,
      ingredientName: ingredient.ingredientName,
      originalCost,
      newCost,
      delta,
    });
  }

  const costDelta = newTotalCost - recipeCost.totalCost;
  const costDeltaPercent = (costDelta / recipeCost.totalCost) * 100;

  return {
    originalCost: recipeCost.totalCost,
    newCost: newTotalCost,
    costDelta,
    costDeltaPercent,
    impactedIngredients,
  };
}

/**
 * Calculate recipe profitability
 */
export function calculateProfitability(
  recipeCost: RecipeCost,
  sellingPrice: number,
): {
  revenue: number;
  cost: number;
  grossProfit: number;
  grossMarginPercent: number;
} {
  const grossProfit = sellingPrice - recipeCost.totalCost;
  const grossMarginPercent = (grossProfit / sellingPrice) * 100;

  return {
    revenue: sellingPrice,
    cost: recipeCost.totalCost,
    grossProfit,
    grossMarginPercent,
  };
}

