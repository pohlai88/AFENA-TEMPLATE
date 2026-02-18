/**
 * Recipe Management Types
 * 
 * Type definitions for recipe and formula management
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum RecipeStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  SUPERSEDED = 'SUPERSEDED',
}

export enum UnitOfMeasure {
  // Weight
  GRAM = 'g',
  KILOGRAM = 'kg',
  OUNCE = 'oz',
  POUND = 'lb',
  // Volume
  MILLILITER = 'ml',
  LITER = 'l',
  FLUID_OUNCE = 'fl_oz',
  CUP = 'cup',
  TABLESPOON = 'tbsp',
  TEASPOON = 'tsp',
  // Count
  EACH = 'each',
}

export enum AllergenType {
  MILK = 'MILK',
  EGGS = 'EGGS',
  FISH = 'FISH',
  SHELLFISH = 'SHELLFISH',
  TREE_NUTS = 'TREE_NUTS',
  PEANUTS = 'PEANUTS',
  WHEAT = 'WHEAT',
  SOYBEANS = 'SOYBEANS',
  SESAME = 'SESAME',
}

// ── Zod Schemas ────────────────────────────────────────────────────

export const recipeIngredientSchema = z.object({
  ingredientId: z.string().uuid(),
  ingredientName: z.string(),
  quantity: z.number().positive(),
  unit: z.nativeEnum(UnitOfMeasure),
  costPerUnit: z.number().nonnegative().optional(),
  allergens: z.array(z.nativeEnum(AllergenType)).optional(),
  isOptional: z.boolean().default(false),
});

export const nutritionFactsSchema = z.object({
  servingSize: z.string(),
  servingsPerContainer: z.number().positive(),
  calories: z.number().nonnegative(),
  totalFat: z.number().nonnegative(),
  saturatedFat: z.number().nonnegative(),
  transFat: z.number().nonnegative(),
  cholesterol: z.number().nonnegative(),
  sodium: z.number().nonnegative(),
  totalCarbohydrate: z.number().nonnegative(),
  dietaryFiber: z.number().nonnegative(),
  totalSugars: z.number().nonnegative(),
  addedSugars: z.number().nonnegative(),
  protein: z.number().nonnegative(),
});

export const recipeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  version: z.number().int().positive(),
  status: z.nativeEnum(RecipeStatus),
  batchSize: z.number().positive(),
  batchUnit: z.nativeEnum(UnitOfMeasure),
  ingredients: z.array(recipeIngredientSchema),
  instructions: z.string().optional(),
  yieldQuantity: z.number().positive(),
  yieldUnit: z.nativeEnum(UnitOfMeasure),
  effectiveDate: z.coerce.date(),
  expiryDate: z.coerce.date().optional(),
  createdBy: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ingredientSubstitutionSchema = z.object({
  originalIngredientId: z.string().uuid(),
  substituteIngredientId: z.string().uuid(),
  conversionRatio: z.number().positive(),
  maxSubstitutionPercent: z.number().min(0).max(100),
  notes: z.string().optional(),
});

// ── TypeScript Types ───────────────────────────────────────────────

export type RecipeIngredient = z.infer<typeof recipeIngredientSchema>;
export type NutritionFacts = z.infer<typeof nutritionFactsSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type IngredientSubstitution = z.infer<typeof ingredientSubstitutionSchema>;

export interface RecipeCost {
  recipeId: string;
  recipeName: string;
  totalCost: number;
  costPerServing: number;
  costPerUnit: number;
  ingredients: Array<{
    ingredientId: string;
    ingredientName: string;
    quantity: number;
    unit: UnitOfMeasure;
    unitCost: number;
    totalCost: number;
  }>;
  calculatedAt: Date;
}

export interface ScaledRecipe {
  originalRecipeId: string;
  targetBatchSize: number;
  targetUnit: UnitOfMeasure;
  scalingFactor: number;
  scaledIngredients: Array<{
    ingredientId: string;
    ingredientName: string;
    originalQuantity: number;
    scaledQuantity: number;
    unit: UnitOfMeasure;
  }>;
}
