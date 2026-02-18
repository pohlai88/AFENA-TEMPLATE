import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface CropPlan {
  id: string;
  fieldId: string;
  season: string;
  cropType: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  acreage: number;
  projectedYield: number; // units per acre
  status: 'PLANNED' | 'PLANTED' | 'GROWING' | 'HARVESTED';
}

export async function createCropPlan(
  db: NeonHttpDatabase,
  data: Omit<CropPlan, 'id' | 'status'>,
): Promise<CropPlan> {
  // TODO: Insert into database with PLANNED status
  throw new Error('Database integration pending');
}

export async function getCropPlans(
  db: NeonHttpDatabase,
  season: string,
): Promise<CropPlan[]> {
  // TODO: Query database
  throw new Error('Database integration pending');
}

export function optimizeCropRotation(
  fields: Array<{ fieldId: string; previousCrop: string; soilType: string }>,
  availableCrops: string[],
): Array<{  fieldId: string;
  recommendedCrop: string;
  reason: string;
  benefitScore: number;
}> {
  const rotationBenefits: Record<string, string[]> = {
    corn: ['soybeans', 'wheat'],
    soybeans: ['corn', 'wheat'],
    wheat: ['soybeans', 'corn'],
  };

  return fields.map((field) => {
    const beneficialCrops = rotationBenefits[field.previousCrop] || availableCrops;
    const recommendedCrop = beneficialCrops.find((c) => availableCrops.includes(c)) || availableCrops[0];

    let benefitScore = 50;
    let reason = 'Standard rotation';

    if (beneficialCrops.includes(recommendedCrop)) {
      benefitScore = 85;
      reason = 'Optimal rotation for nitrogen fixation and pest management';
    }

    return {
      fieldId: field.fieldId,
      recommendedCrop,
      reason,
      benefitScore,
    };
  });
}

export function calculatePlantingSchedule(
  cropType: string,
  targetHarvestDate: Date,
  growingDaysDegrees: number,
): {
  plantingDate: Date;
  milestones: Array<{ stage: string; date: Date }>;
} {
  const growingDays = growingDaysDegrees / 15; // Simplified calculation
  const plantingDate = new Date(targetHarvestDate);
  plantingDate.setDate(plantingDate.getDate() - growingDays);

  const milestones = [
    {
      stage: 'Emergence',
      date: new Date(plantingDate.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      stage: 'Vegetative',
      date: new Date(plantingDate.getTime() + (growingDays / 3) * 24 * 60 * 60 * 1000),
    },
    {
      stage: 'Flowering',
      date: new Date(plantingDate.getTime() + ((2 * growingDays) / 3) * 24 * 60 * 60 * 1000),
    },
    {
      stage: 'Harvest',
      date: targetHarvestDate,
    },
  ];

  return { plantingDate, milestones };
}
