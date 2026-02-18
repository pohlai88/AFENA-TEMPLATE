import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface AllergenControl {
  id: string;
  facilityId: string;
  allergenType: 'MILK' | 'EGGS' | 'FISH' | 'SHELLFISH' | 'TREE_NUTS' | 'PEANUTS' | 'WHEAT' | 'SOYBEANS';
  controlMeasures: Array<{
    measure: string;
    effectiveness: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  segregationPlan: string;
  cleaningProcedure: string;
  lastReview: Date;
}

export async function createAllergenControl(
  db: NeonHttpDatabase,
  data: Omit<AllergenControl, 'id'>,
): Promise<AllergenControl> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getAllergenControls(
  db: NeonHttpDatabase,
  facilityId: string,
): Promise<AllergenControl[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function validateAllergenDeclaration(
  ingredients: Array<{ name: string; contains: string[] }>,
  declaredAllergens: string[],
): {
  valid: boolean;
  missing: string[];
  undeclared: string[];
} {
  const allergenKeywords = {
    MILK: ['milk', 'cream', 'butter', 'cheese', 'whey', 'casein', 'lactose'],
    EGGS: ['egg', 'albumin', 'lysozyme'],
    FISH: ['fish', 'anchovy', 'bass', 'cod', 'tilapia', 'tuna'],
    WHEAT: ['wheat', 'flour', 'gluten'],
    SOYBEANS: ['soy', 'tofu', 'lecithin'],
    PEANUTS: ['peanut', 'groundnut'],
    TREE_NUTS: ['almond', 'walnut', 'cashew', 'pecan', 'pistachio'],
    SHELLFISH: ['shrimp', 'crab', 'lobster', 'clam', 'oyster'],
  };

  const foundAllergens = new Set<string>();

  for (const ingredient of ingredients) {
    for (const contains of ingredient.contains) {
      for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
        if (keywords.some((kw) => contains.toLowerCase().includes(kw))) {
          foundAllergens.add(allergen);
        }
      }
    }
  }

  const missing = Array.from(foundAllergens).filter((a) => !declaredAllergens.includes(a));
  const undeclared = declaredAllergens.filter((a) => !foundAllergens.has(a));

  return {
    valid: missing.length === 0 && undeclared.length === 0,
    missing,
    undeclared,
  };
}
