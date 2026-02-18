/**
 * Allergen Tracking Service
 * 
 * Recipe-level allergen declaration and tracking
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import { AllergenType } from '../types/common.js';
import type { Recipe } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const getAllergensSchema = z.object({
  recipeId: z.string().uuid(),
});

export const updateRecipeAllergensSchema = z.object({
  recipeId: z.string().uuid(),
  allergens: z.array(z.nativeEnum(AllergenType)),
  mayContain: z.array(z.nativeEnum(AllergenType)).optional(),
});

// ── Types ──────────────────────────────────────────────────────────

export type GetAllergensInput = z.infer<typeof getAllergensSchema>;
export type UpdateRecipeAllergensInput = z.infer<typeof updateRecipeAllergensSchema>;

export interface RecipeAllergenInfo {
  recipeId: string;
  recipeName: string;
  contains: AllergenType[];
  mayContain: AllergenType[];
  ingredientAllergens: Array<{
    ingredientId: string;
    ingredientName: string;
    allergens: AllergenType[];
  }>;
  allergenStatement: string;
}

// ── Functions ──────────────────────────────────────────────────────

/**
 * Get all allergens in a recipe (aggregated from ingredients)
 */
export async function getRecipeAllergens(
  db: NeonHttpDatabase,
  orgId: string,
  input: GetAllergensInput,
): Promise<RecipeAllergenInfo> {
  const validated = getAllergensSchema.parse(input);

  // TODO: Implement database logic
  // 1. Get recipe with ingredients
  // 2. Get allergen data for each ingredient
  // 3. Aggregate all allergens
  // 4. Generate allergen statement
  // 5. Return allergen info

  throw new Error('Not implemented');
}

/**
 * Update allergen declaration for a recipe
 */
export async function updateRecipeAllergens(
  db: NeonHttpDatabase,
  orgId: string,
  input: UpdateRecipeAllergensInput,
): Promise<RecipeAllergenInfo> {
  const validated = updateRecipeAllergensSchema.parse(input);

  // TODO: Implement database logic
  // 1. Validate allergens match ingredient allergens
  // 2. Update recipe allergen declaration
  // 3. Log allergen changes
  // 4. Return updated allergen info

  throw new Error('Not implemented');
}

/**
 * Generate FDA-compliant allergen statement
 */
export function generateAllergenStatement(
  contains: AllergenType[],
  mayContain: AllergenType[] = [],
): string {
  const parts: string[] = [];

  if (contains.length > 0) {
    const allergenNames = contains.map(formatAllergenName);
    parts.push(`Contains: ${allergenNames.join(', ')}`);
  }

  if (mayContain.length > 0) {
    const allergenNames = mayContain.map(formatAllergenName);
    parts.push(`May contain: ${allergenNames.join(', ')}`);
  }

  if (parts.length === 0) {
    return 'No allergens declared';
  }

  return parts.join('. ') + '.';
}

/**
 * Check if recipe contains specific allergen
 */
export function containsAllergen(
  allergenInfo: RecipeAllergenInfo,
  allergen: AllergenType,
): boolean {
  return allergenInfo.contains.includes(allergen);
}

/**
 * Find all recipes containing a specific allergen
 */
export async function findRecipesWithAllergen(
  db: NeonHttpDatabase,
  orgId: string,
  allergen: AllergenType,
): Promise<Array<{ recipeId: string; recipeName: string }>> {
  // TODO: Implement database query
  // 1. Query recipes where allergen is in contains array
  // 2. Return recipe list

  throw new Error('Not implemented');
}

/**
 * Validate allergen declaration matches ingredients
 */
export function validateAllergenDeclaration(
  declaredAllergens: AllergenType[],
  ingredientAllergens: Array<{ ingredientName: string; allergens: AllergenType[] }>,
): {
  valid: boolean;
  missingAllergens: Array<{ allergen: AllergenType; source: string }>;
  extraAllergens: AllergenType[];
} {
  // Collect all allergens from ingredients
  const allIngredientAllergens = new Set<AllergenType>();
  const allergenSources = new Map<AllergenType, string[]>();

  for (const { ingredientName, allergens } of ingredientAllergens) {
    for (const allergen of allergens) {
      allIngredientAllergens.add(allergen);
      
      if (!allergenSources.has(allergen)) {
        allergenSources.set(allergen, []);
      }
      allergenSources.get(allergen)!.push(ingredientName);
    }
  }

  // Find missing allergens (in ingredients but not declared)
  const missingAllergens: Array<{ allergen: AllergenType; source: string }> = [];
  for (const allergen of allIngredientAllergens) {
    if (!declaredAllergens.includes(allergen)) {
      missingAllergens.push({
        allergen,
        source: allergenSources.get(allergen)!.join(', '),
      });
    }
  }

  // Find extra allergens (declared but not in ingredients)
  const extraAllergens = declaredAllergens.filter(
    allergen => !allIngredientAllergens.has(allergen),
  );

  return {
    valid: missingAllergens.length === 0 && extraAllergens.length === 0,
    missingAllergens,
    extraAllergens,
  };
}

/**
 * Get allergen matrix for multiple recipes
 */
export async function getAllergenMatrixFor async function getAllergenMatrix(
  db: NeonHttpDatabase,
  orgId: string,
  recipeIds: string[],
): Promise<Array<{
  recipeId: string;
  recipeName: string;
  allergenFlags: Record<AllergenType, boolean>;
}>> {
  // TODO: Implement database query
  // 1. Get allergens for all specified recipes
  // 2. Create matrix with boolean flags for each allergen
  // 3. Return matrix

  throw new Error('Not implemented');
}

// ── Helper Functions ───────────────────────────────────────────────

function formatAllergenName(allergen: AllergenType): string {
  const names: Record<AllergenType, string> = {
    [AllergenType.MILK]: 'Milk',
    [AllergenType.EGGS]: 'Eggs',
    [AllergenType.FISH]: 'Fish',
    [AllergenType.SHELLFISH]: 'Shellfish (Crustacean)',
    [AllergenType.TREE_NUTS]: 'Tree Nuts',
    [AllergenType.PEANUTS]: 'Peanuts',
    [AllergenType.WHEAT]: 'Wheat',
    [AllergenType.SOYBEANS]: 'Soy',
    [AllergenType.SESAME]: 'Sesame',
  };

  return names[allergen] || allergen;
}

