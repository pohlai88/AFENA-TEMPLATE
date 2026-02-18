import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface AnimalRecord {
  id: string;
  tagId: string;
  species: 'CATTLE' | 'SWINE' | 'POULTRY' | 'SHEEP' | 'GOAT';
  birthDate: Date;
  gender: 'MALE' | 'FEMALE';
  breedId: string;
  sireId?: string;
  damId?: string;
  currentWeight: number;
  healthStatus: 'HEALTHY' | 'SICK' | 'QUARANTINE' | 'DECEASED';
  location: string;
}

export async function addAnimal(
  db: NeonHttpDatabase,
  data: Omit<AnimalRecord, 'id'>,
): Promise<AnimalRecord> {
  // TODO: Insert into database
  throw new Error('Database integration pending');
}

export async function getHerd(
  db: NeonHttpDatabase,
  filters: { species?: string; location?: string; healthStatus?: string },
): Promise<AnimalRecord[]> {
  // TODO: Query database with filters
  throw new Error('Database integration pending');
}

export function calculateHerdMetrics(animals: AnimalRecord[]): {
  totalCount: number;
  avgWeight: number;
  healthyPercentage: number;
  bySpecies: Record<string, number>;
} {
  return {
    totalCount: animals.length,
    avgWeight: animals.reduce((sum, a) => sum + a.currentWeight, 0) / animals.length || 0,
    healthyPercentage:
      (animals.filter((a) => a.healthStatus === 'HEALTHY').length / animals.length) * 100 || 0,
    bySpecies: animals.reduce(
      (acc, a) => {
        acc[a.species] = (acc[a.species] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  };
}

export function identifyBreedingCandidates(
  animals: AnimalRecord[],
  minAge: number, // months
): Array<{ animalId: string; tagId: string; score: number }> {
  const now = Date.now();

  return animals
    .filter((a) => {
      const ageMonths =
        (now - new Date(a.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
      return (
        a.healthStatus === 'HEALTHY' &&
        ageMonths >= minAge &&
        a.gender === 'FEMALE'
      );
    })
    .map((a) => ({
      animalId: a.id,
      tagId: a.tagId,
      score: a.currentWeight * 0.7 + (a.sireId && a.damId ? 30 : 0), // Simplified scoring
    }))
    .sort((a, b) => b.score - a.score);
}
