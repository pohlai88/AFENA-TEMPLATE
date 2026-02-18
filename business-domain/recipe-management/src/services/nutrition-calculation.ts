/**
 * Nutrition Calculation Service
 * 
 * Automated nutrition facts calculation from ingredient data
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { NutritionFacts } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const calculateNutritionSchema = z.object({
  recipeId: z.string().uuid(),
  servingSize: z.string(),
  servingsPerContainer: z.number().positive(),
});

// ── Types ──────────────────────────────────────────────────────────

export type CalculateNutritionInput = z.infer<typeof calculateNutritionSchema>;

export interface IngredientNutrition {
  ingredientId: string;
  ingredientName: string;
  per100g: {
    calories: number;
    totalFat: number;
    saturatedFat: number;
    transFat: number;
    cholesterol: number;
    sodium: number;
    totalCarbohydrate: number;
    dietaryFiber: number;
    totalSugars: number;
    addedSugars: number;
    protein: number;
  };
}

// ── Functions ──────────────────────────────────────────────────────

/**
 * Calculate nutrition facts for a recipe
 */
export async function calculateNutritionFacts(
  db: NeonHttpDatabase,
  orgId: string,
  input: CalculateNutritionInput,
): Promise<NutritionFacts> {
  const validated = calculateNutritionSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get recipe with ingredients
  // 2. Get nutrition data for each ingredient
  // 3. Calculate total nutrients based on ingredient quantities
  // 4. Divide by servings per container
  // 5. Return nutrition facts

  throw new Error('Not implemented');
}

/**
 * Aggregate nutrition data from multiple ingredients
 */
export function aggregateNutrition(
  ingredients: Array<{
    ingredient: IngredientNutrition;
    quantityInGrams: number;
  }>,
): Omit<NutritionFacts, 'servingSize' | 'servingsPerContainer'> {
  const totals = {
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbohydrate: 0,
    dietaryFiber: 0,
    totalSugars: 0,
    addedSugars: 0,
    protein: 0,
  };

  for (const { ingredient, quantityInGrams } of ingredients) {
    const scaleFactor = quantityInGrams / 100; // per100g to actual quantity

    totals.calories += ingredient.per100g.calories * scaleFactor;
    totals.totalFat += ingredient.per100g.totalFat * scaleFactor;
    totals.saturatedFat += ingredient.per100g.saturatedFat * scaleFactor;
    totals.transFat += ingredient.per100g.transFat * scaleFactor;
    totals.cholesterol += ingredient.per100g.cholesterol * scaleFactor;
    totals.sodium += ingredient.per100g.sodium * scaleFactor;
    totals.totalCarbohydrate += ingredient.per100g.totalCarbohydrate * scaleFactor;
    totals.dietaryFiber += ingredient.per100g.dietaryFiber * scaleFactor;
    totals.totalSugars += ingredient.per100g.totalSugars * scaleFactor;
    totals.addedSugars += ingredient.per100g.addedSugars * scaleFactor;
    totals.protein += ingredient.per100g.protein * scaleFactor;
  }

  return totals;
}

/**
 * Calculate nutrition per serving
 */
export function calculatePerServing(
  totalNutrition: Omit<NutritionFacts, 'servingSize' | 'servingsPerContainer'>,
  servingsPerContainer: number,
): Omit<NutritionFacts, 'servingSize' | 'servingsPerContainer'> {
  return {
    calories: Math.round(totalNutrition.calories / servingsPerContainer),
    totalFat: roundToDecimal(totalNutrition.totalFat / servingsPerContainer, 1),
    saturatedFat: roundToDecimal(totalNutrition.saturatedFat / servingsPerContainer, 1),
    transFat: roundToDecimal(totalNutrition.transFat / servingsPerContainer, 1),
    cholesterol: Math.round(totalNutrition.cholesterol / servingsPerContainer),
    sodium: Math.round(totalNutrition.sodium / servingsPerContainer),
    totalCarbohydrate: roundToDecimal(totalNutrition.totalCarbohydrate / servingsPerContainer, 1),
    dietaryFiber: roundToDecimal(totalNutrition.dietaryFiber / servingsPerContainer, 1),
    totalSugars: roundToDecimal(totalNutrition.totalSugars / servingsPerContainer, 1),
    addedSugars: roundToDecimal(totalNutrition.addedSugars / servingsPerContainer, 1),
    protein: roundToDecimal(totalNutrition.protein / servingsPerContainer, 1),
  };
}

/**
 * Validate nutrition facts comply with FDA rounding rules
 */
export function validateFDACompliance(nutrition: NutritionFacts): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Calories should be rounded to nearest 5 or 10
  if (nutrition.calories >= 50 && nutrition.calories % 10 !== 0) {
    errors.push('Calories >= 50 should be rounded to nearest 10');
  }

  // Saturated fat + trans fat should not exceed total fat
  if (nutrition.saturatedFat + nutrition.transFat > nutrition.totalFat) {
    errors.push('Saturated fat + trans fat exceeds total fat');
  }

  // Added sugars cannot exceed total sugars
  if (nutrition.addedSugars > nutrition.totalSugars) {
    errors.push('Added sugars exceeds total sugars');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format nutrition facts for FDA label
 */
export function formatForFDALabel(nutrition: NutritionFacts): string {
  return `
Nutrition Facts
Serving Size: ${nutrition.servingSize}
Servings Per Container: ${nutrition.servingsPerContainer}

Amount Per Serving
Calories ${nutrition.calories}

                                    % Daily Value*
Total Fat ${nutrition.totalFat}g
  Saturated Fat ${nutrition.saturatedFat}g
  Trans Fat ${nutrition.transFat}g
Cholesterol ${nutrition.cholesterol}mg
Sodium ${nutrition.sodium}mg
Total Carbohydrate ${nutrition.totalCarbohydrate}g
  Dietary Fiber ${nutrition.dietaryFiber}g
  Total Sugars ${nutrition.totalSugars}g
    Includes ${nutrition.addedSugars}g Added Sugars
Protein ${nutrition.protein}g
`.trim();
}

// ── Helper Functions ───────────────────────────────────────────────

function roundToDecimal(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

