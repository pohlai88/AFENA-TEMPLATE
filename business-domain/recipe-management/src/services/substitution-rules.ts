/**
 * Substitution Rules Service
 * 
 * Approved ingredient substitutions for recipes
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { IngredientSubstitution } from '../types/common.js';
import { ingredientSubstitutionSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createSubstitutionRuleSchema = ingredientSubstitutionSchema.extend({
  orgId: z.string(),
  createdBy: z.string(),
});

export const applySubstitutionSchema = z.object({
  recipeId: z.string().uuid(),
  substitutions: z.array(z.object({
    originalIngredientId: z.string().uuid(),
    substituteIngredientId: z.string().uuid(),
  })),
});

// ── Types ──────────────────────────────────────────────────────────

export type CreateSubstitutionRuleInput = z.infer<typeof createSubstitutionRuleSchema>;
export type ApplySubstitutionInput = z.infer<typeof applySubstitutionSchema>;

export interface SubstitutionResult {
  recipeId: string;
  recipeName: string;
  originalIngredients: Array<{
    ingredientId: string;
    ingredientName: string;
    quantity: number;
  }>;
  substitutedIngredients: Array<{
    originalIngredientId: string;
    originalIngredientName: string;
    substituteIngredientId: string;
    substituteIngredientName: string;
    originalQuantity: number;
    substitutedQuantity: number;
    conversionRatio: number;
  }>;
}

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create a new ingredient substitution rule
 */
export async function createSubstitutionRule(
  db: NeonHttpDatabase,
  orgId: string,
  input: Omit<CreateSubstitutionRuleInput, 'orgId'>,
): Promise<IngredientSubstitution> {
  const validated = createSubstitutionRuleSchema.parse({ ...input, orgId });

  // TODO: Implement database logic
  // 1. Validate both ingredients exist
  // 2. Check for existing substitution rule
  // 3. Insert substitution rule
  // 4. Return created rule

  throw new Error('Not implemented');
}

/**
 * Get all substitution rules for an ingredient
 */
export async function getSubstitutionRulesForIngredient(
  db: NeonHttpDatabase,
  orgId: string,
  ingredientId: string,
): Promise<IngredientSubstitution[]> {
  // TODO: Implement database query
  // 1. Query substitution rules where originalIngredientId matches
  // 2. Return all rules

  throw new Error('Not implemented');
}

/**
 * Apply substitutions to a recipe
 */
export async function applySubstitutions(
  db: NeonHttpDatabase,
  orgId: string,
  input: ApplySubstitutionInput,
): Promise<SubstitutionResult> {
  const validated = applySubstitutionSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get recipe with ingredients
  // 2. Get substitution rules for requested substitutions
  // 3. Validate substitutions are allowed (max percentage)
  // 4. Calculate substitute quantities using conversion ratios
  // 5. Return substitution result

  throw new Error('Not implemented');
}

/**
 * Find available substitutes for an ingredient in a recipe
 */
export async function findAvailableSubstitutes(
  db: NeonHttpDatabase,
  orgId: string,
  recipeId: string,
  ingredientId: string,
): Promise<Array<{
  substituteIngredientId: string;
  substituteIngredientName: string;
  conversionRatio: number;
  maxSubstitutionPercent: number;
  notes: string | null;
}>> {
  // TODO: Implement database query
  // 1. Get substitution rules for the ingredient
  // 2. Check which substitutes are valid for this recipe
  // 3. Return available substitutes

  throw new Error('Not implemented');
}

/**
 * Validate a substitution is within allowed limits
 */
export function validateSubstitution(
  originalQuantity: number,
  substituteQuantity: number,
  maxSubstitutionPercent: number,
): {
  valid: boolean;
  error?: string;
  percentSubstituted: number;
} {
  const percentSubstituted = (substituteQuantity / originalQuantity) * 100;

  if (percentSubstituted > maxSubstitutionPercent) {
    return {
      valid: false,
      error: `Substitution ${percentSubstituted.toFixed(1)}% exceeds maximum ${maxSubstitutionPercent}%`,
      percentSubstituted,
    };
  }

  return {
    valid: true,
    percentSubstituted,
  };
}

/**
 * Calculate substitute quantity based on conversion ratio
 */
export function calculateSubstituteQuantity(
  originalQuantity: number,
  conversionRatio: number,
): number {
  return originalQuantity * conversionRatio;
}

/**
 * Delete a substitution rule
 */
export async function deleteSubstitutionRule(
  db: NeonHttpDatabase,
  orgId: string,
  originalIngredientId: string,
  substituteIngredientId: string,
): Promise<void> {
  // TODO: Implement database logic
  // 1. Find the substitution rule
  // 2. Delete it
  // 3. Log the deletion

  throw new Error('Not implemented');
}

/**
 * Get substitution impact on recipe cost
 */
export async function getSubstitutionCostImpact(
  db: NeonHttpDatabase,
  orgId: string,
  recipeId: string,
  substitutions: Array<{
    originalIngredientId: string;
    substituteIngredientId: string;
  }>,
): Promise<{
  originalCost: number;
  newCost: number;
  costDelta: number;
  costDeltaPercent: number;
}> {
  // TODO: Implement database logic
  // 1. Get recipe with current costs
  // 2. Get costs for substitute ingredients
  // 3. Calculate costs with substitutions applied
  // 4. Return cost impact

  throw new Error('Not implemented');
}

