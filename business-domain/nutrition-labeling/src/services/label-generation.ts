import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface NutritionLabel {
  id: string;
  productId: string;
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  caloriesFromFat: number;
  totalFat: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  totalCarbohydrate: number;
  dietaryFiber: number;
  sugars: number;
  protein: number;
  allergens: string[];
}

export async function generateLabel(
  db: NeonHttpDatabase,
  productId: string,
  nutritionData: Omit<NutritionLabel, 'id' | 'productId'>,
): Promise<NutritionLabel> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getLabel(
  db: NeonHttpDatabase,
  productId: string,
): Promise<NutritionLabel | null> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function calculateDailyValues(nutrition: NutritionLabel): Record<string, number> {
  const dailyValues = {
    totalFat: 78, // grams
    saturatedFat: 20,
    cholesterol: 300, // mg
    sodium: 2300, // mg
    totalCarbohydrate: 275, // grams
    dietaryFiber: 28,
  };

  return {
    totalFat: (nutrition.totalFat / dailyValues.totalFat) * 100,
    saturatedFat: (nutrition.saturatedFat / dailyValues.saturatedFat) * 100,
    cholesterol: (nutrition.cholesterol / dailyValues.cholesterol) * 100,
    sodium: (nutrition.sodium / dailyValues.sodium) * 100,
    totalCarbohydrate: (nutrition.totalCarbohydrate / dailyValues.totalCarbohydrate) * 100,
    dietaryFiber: (nutrition.dietaryFiber / dailyValues.dietaryFiber) * 100,
  };
}

export function validateLabelCompliance(
  label: NutritionLabel,
  market: 'US' | 'EU' | 'CA',
): {
  compliant: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // US FDA requirements
  if (market === 'US') {
    if (!label.servingSize) violations.push('Serving size required');
    if (label.calories === undefined) violations.push('Calories required');
    if (label.totalFat === undefined) violations.push('Total fat required');
    if (label.sodium === undefined) violations.push('Sodium required');
  }

  // Allergen declaration
  if (label.allergens.length === 0) {
    violations.push('Allergen declaration required (or state "Contains: None")');
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}

export function formatLabelText(label: NutritionLabel): string {
  const dv = calculateDailyValues(label);

  return `Nutrition Facts
Serving Size: ${label.servingSize}
Servings Per Container: ${label.servingsPerContainer}

Amount Per Serving
Calories ${label.calories}     Calories from Fat ${label.caloriesFromFat}
                                   % Daily Value*
Total Fat ${label.totalFat}g                    ${dv.totalFat.toFixed(0)}%
  Saturated Fat ${label.saturatedFat}g          ${dv.saturatedFat.toFixed(0)}%
  Trans Fat ${label.transFat}g
Cholesterol ${label.cholesterol}mg              ${dv.cholesterol.toFixed(0)}%
Sodium ${label.sodium}mg                        ${dv.sodium.toFixed(0)}%
Total Carbohydrate ${label.totalCarbohydrate}g  ${dv.totalCarbohydrate.toFixed(0)}%
  Dietary Fiber ${label.dietaryFiber}g          ${dv.dietaryFiber.toFixed(0)}%
  Sugars ${label.sugars}g
Protein ${label.protein}g

CONTAINS: ${label.allergens.join(', ') || 'None'}`;
}
