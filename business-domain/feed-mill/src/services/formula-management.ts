import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface FeedFormula {
  id: string;
  name: string;
  targetSpecies: string;
  targetStage: 'STARTER' | 'GROWER' | 'FINISHER' | 'LAYER' | 'MAINTENANCE';
  ingredients: Array<{
    item: string;
    percentage: number;
    costPerUnit: number;
  }>;
  nutritionProfile: {
    protein: number;
    energy: number; // kcal/kg
    fiber: number;
  };
}

export async function createFormula(
  db: NeonHttpDatabase,
  data: Omit<FeedFormula, 'id'>,
): Promise<FeedFormula> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getFormulas(
  db: NeonHttpDatabase,
  species?: string,
): Promise<FeedFormula[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function calculateFeedCost(formula: FeedFormula, quantity: number): {
  totalCost: number;
  costPerUnit: number;
  breakdown: Array<{ ingredient: string; cost: number }>;
} {
  const breakdown = formula.ingredients.map((ing) => ({
    ingredient: ing.item,
    cost: (quantity * (ing.percentage / 100)) * ing.costPerUnit,
  }));

  const totalCost = breakdown.reduce((sum, b) => sum + b.cost, 0);

  return {
    totalCost,
    costPerUnit: totalCost / quantity,
    breakdown,
  };
}

export function validateFormula(formula: FeedFormula): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check percentages sum to 100
  const totalPercentage = formula.ingredients.reduce((sum, ing) => sum + ing.percentage, 0);
  if (Math.abs(totalPercentage - 100) > 0.1) {
    errors.push(`Ingredients must sum to 100% (current: ${totalPercentage}%)`);
  }

  // Check minimum protein for species
  const minProtein: Record<string, number> = {
    POULTRY: 16,
    SWINE: 14,
    CATTLE: 12,
  };

  if (
    minProtein[formula.targetSpecies] &&
    formula.nutritionProfile.protein < minProtein[formula.targetSpecies]
  ) {
    errors.push(
      `Protein too low for ${formula.targetSpecies} (min: ${minProtein[formula.targetSpecies]}%)`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
