/**
 * Ingredient Scaling Service
 * 
 * Batch size adjustments with unit conversions
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { Recipe, ScaledRecipe } from '../types/common.js';
import { UnitOfMeasure } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const scaleRecipeSchema = z.object({
  recipeId: z.string().uuid(),
  targetBatchSize: z.number().positive(),
  targetUnit: z.nativeEnum(UnitOfMeasure),
});

// ── Types ──────────────────────────────────────────────────────────

export type ScaleRecipeInput = z.infer<typeof scaleRecipeSchema>;

// Unit conversion factors (to grams for weight, to ml for volume)
const WEIGHT_TO_GRAMS: Record<string, number> = {
  [UnitOfMeasure.GRAM]: 1,
  [UnitOfMeasure.KILOGRAM]: 1000,
  [UnitOfMeasure.OUNCE]: 28.3495,
  [UnitOfMeasure.POUND]: 453.592,
};

const VOLUME_TO_ML: Record<string, number> = {
  [UnitOfMeasure.MILLILITER]: 1,
  [UnitOfMeasure.LITER]: 1000,
  [UnitOfMeasure.FLUID_OUNCE]: 29.5735,
  [UnitOfMeasure.CUP]: 236.588,
  [UnitOfMeasure.TABLESPOON]: 14.7868,
  [UnitOfMeasure.TEASPOON]: 4.92892,
};

// ── Functions ──────────────────────────────────────────────────────

/**
 * Scale a recipe to a different batch size
 */
export async function scaleRecipe(
  db: NeonHttpDatabase,
  orgId: string,
  input: ScaleRecipeInput,
): Promise<ScaledRecipe> {
  const validated = scaleRecipeSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get the recipe
  // 2. Convert original batch size to target unit
  // 3. Calculate scaling factor
  // 4. Scale all ingredients
  // 5. Return scaled recipe

  throw new Error('Not implemented');
}

/**
 * Convert quantity from one unit to another
 */
export function convertUnit(
  quantity: number,
  fromUnit: UnitOfMeasure,
  toUnit: UnitOfMeasure,
): number {
  // If same unit, no conversion needed
  if (fromUnit === toUnit) {
    return quantity;
  }

  // Weight conversions
  if (WEIGHT_TO_GRAMS[fromUnit] && WEIGHT_TO_GRAMS[toUnit]) {
    const grams = quantity * WEIGHT_TO_GRAMS[fromUnit];
    return grams / WEIGHT_TO_GRAMS[toUnit];
  }

  // Volume conversions
  if (VOLUME_TO_ML[fromUnit] && VOLUME_TO_ML[toUnit]) {
    const ml = quantity * VOLUME_TO_ML[fromUnit];
    return ml / VOLUME_TO_ML[toUnit];
  }

  // Cannot convert between weight and volume
  throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
}

/**
 * Scale ingredient quantities by a factor
 */
export function scaleIngredients(
  recipe: Recipe,
  scalingFactor: number,
): ScaledRecipe['scaledIngredients'] {
  return recipe.ingredients.map(ingredient => ({
    ingredientId: ingredient.ingredientId,
    ingredientName: ingredient.ingredientName,
    originalQuantity: ingredient.quantity,
    scaledQuantity: ingredient.quantity * scalingFactor,
    unit: ingredient.unit,
  }));
}

/**
 * Calculate scaling factor between two batch sizes
 */
export function calculateScalingFactor(
  originalSize: number,
  originalUnit: UnitOfMeasure,
  targetSize: number,
  targetUnit: UnitOfMeasure,
): number {
  // Convert target to original unit for comparison
  const targetInOriginalUnit = convertUnit(targetSize, targetUnit, originalUnit);
  
  return targetInOriginalUnit / originalSize;
}

/**
 * Validate that scaling is within acceptable limits
 */
export function validateScaling(
  scalingFactor: number,
  minFactor: number = 0.1,
  maxFactor: number = 100,
): { valid: boolean; error?: string } {
  if (scalingFactor < minFactor) {
    return {
      valid: false,
      error: `Scaling factor ${scalingFactor} is below minimum ${minFactor}`,
    };
  }

  if (scalingFactor > maxFactor) {
    return {
      valid: false,
      error: `Scaling factor ${scalingFactor} exceeds maximum ${maxFactor}`,
    };
  }

  return { valid: true };
}

/**
 * Round quantity to appropriate precision based on unit
 */
export function roundQuantity(quantity: number, unit: UnitOfMeasure): number {
  // Small volume units (tsp, tbsp) - round to 2 decimals
  if (unit === UnitOfMeasure.TEASPOON || unit === UnitOfMeasure.TABLESPOON) {
    return Math.round(quantity * 100) / 100;
  }

  // Weight units - round to 1 decimal
  if (WEIGHT_TO_GRAMS[unit]) {
    return Math.round(quantity * 10) / 10;
  }

  // Volume units - round to 1 decimal
  if (VOLUME_TO_ML[unit]) {
    return Math.round(quantity * 10) / 10;
  }

  // Count units - round to nearest whole number
  if (unit === UnitOfMeasure.EACH) {
    return Math.round(quantity);
  }

  return quantity;
}

