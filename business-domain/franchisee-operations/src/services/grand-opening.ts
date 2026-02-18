import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { GrandOpening } from '../types/common.js';

export async function createGrandOpeningPlan(
  db: NeonHttpDatabase,
  orgId: string,
  unitId: string,
  openingDate: Date,
): Promise<GrandOpening> {
  throw new Error('Database integration pending');
}

export function calculateRampUp(opening: GrandOpening): {
  weeksComplete: number;
  percentToTarget: number;
  onTrack: boolean;
} {
  const completedWeeks = opening.weeklyTargets.filter(w => w.actualSales).length;
  const totalWeeks = opening.weeklyTargets.length;
  const avgPerformance = completedWeeks > 0
    ? opening.weeklyTargets.slice(0, completedWeeks).reduce((sum, w) => 
        sum + (w.actualSales! / w.targetSales) * 100, 0) / completedWeeks
    : 0;
  return {
    weeksComplete: completedWeeks,
    percentToTarget: avgPerformance,
    onTrack: avgPerformance >= 80,
  };
}

