import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface ProcessingRun {
  id: string;
  facilityId: string;
  runDate: Date;
  species: string;
  headCount: number;
  avgLiveWeight: number;
  avgCarcassWeight: number;
  dressingPercentage: number;
  yieldGrades: Record<string, number>;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export async function scheduleRun(
  db: NeonHttpDatabase,
  data: Omit<ProcessingRun, 'id' | 'status' | 'dressingPercentage'>,
): Promise<ProcessingRun> {
  // TODO: Insert into database with SCHEDULED status
  throw new Error('Database integration pending');
}

export async function completeRun(
  db: NeonHttpDatabase,
  runId: string,
  results: { avgCarcassWeight: number; yieldGrades: Record<string, number> },
): Promise<ProcessingRun> {
  // TODO: Update run with results and calculate dressing percentage
  throw new Error('Database integration pending');
}

export function calculateDressingPercentage(liveWeight: number, carcassWeight: number): number {
  return liveWeight > 0 ? (carcassWeight / liveWeight) * 100 : 0;
}

export function assessYieldQuality(
  yieldGrades: Record<string, number>,
): {
  qualityScore: number;
  distribution: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
} {
  const gradeWeights: Record<string, number> = {
    'Prime': 5,
    'Choice': 4,
    'Select': 3,
    'Standard': 2,
    'Utility': 1,
  };

  const totalHead = Object.values(yieldGrades).reduce((sum, count) => sum + count, 0);
  const weightedScore = Object.entries(yieldGrades).reduce((sum, [grade, count]) => {
    return sum + (gradeWeights[grade] || 0) * count;
  }, 0);

  const qualityScore = totalHead > 0 ? (weightedScore / totalHead) : 0;

  let distribution: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' = 'AVERAGE';
  if (qualityScore >= 4.5) distribution = 'EXCELLENT';
  else if (qualityScore >= 3.5) distribution = 'GOOD';
  else if (qualityScore >= 2.5) distribution = 'AVERAGE';
  else distribution = 'POOR';

  return { qualityScore, distribution };
}
