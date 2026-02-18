import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface FeedConversionData {
  animalId: string;
  period: { start: Date; end: Date };
  feedConsumed: number; // kg
  weightGain: number; // kg
  fcr: number; // Feed Conversion Ratio
}

export async function calculateFCR(
  db: NeonHttpDatabase,
  animalId: string,
  feedConsumed: number,
  weightGain: number,
): Promise<FeedConversionData> {
  // TODO: Insert FCR data into database
  const fcr = weightGain > 0 ? feedConsumed / weightGain : 0;
  throw new Error('Database integration pending');
}

export function analyzeFeedEfficiency(
  fcrData: FeedConversionData[],
): {
  avgFCR: number;
  topPerformers: string[];
  inefficientAnimals: string[];
  benchmark: number;
} {
  const avgFCR = fcrData.reduce((sum, d) => sum + d.fcr, 0) / fcrData.length || 0;
  const sorted = [...fcrData].sort((a, b) => a.fcr - b.fcr); // Lower FCR is better

  const topPerformers = sorted.slice(0, Math.ceil(fcrData.length * 0.1)).map((d) => d.animalId);
  const inefficientAnimals = sorted
    .slice(-Math.ceil(fcrData.length * 0.1))
    .map((d) => d.animalId);

  return {
    avgFCR,
    topPerformers,
    inefficientAnimals,
    benchmark: sorted[Math.floor(sorted.length * 0.25)]?.fcr || avgFCR, // 25th percentile
  };
}

export function projectGrowth(
  currentWeight: number,
  avgDailyGain: number,
  targetWeight: number,
): {
  daysToTarget: number;
  estimatedFeed: number;
  estimatedCost: number;
} {
  const weightGainNeeded = targetWeight - currentWeight;
  const daysToTarget = avgDailyGain > 0 ? weightGainNeeded / avgDailyGain : 0;

  const fcr = 2.5; // Typical FCR estimate
  const feedPricePerKg = 0.30;
  const estimatedFeed = weightGainNeeded * fcr;
  const estimatedCost = estimatedFeed * feedPricePerKg;

  return {
    daysToTarget: Math.ceil(daysToTarget),
    estimatedFeed,
    estimatedCost,
  };
}
