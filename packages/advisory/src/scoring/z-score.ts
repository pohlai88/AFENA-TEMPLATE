import type { RobustZScoreResult, ZScoreResult } from '../types';

/**
 * Standard z-score for a single value against a population.
 */
export function zScore(value: number, mean: number, stdDev: number): ZScoreResult {
  return {
    zScore: stdDev > 0 ? (value - mean) / stdDev : 0,
    mean,
    stdDev,
  };
}

/**
 * Compute mean and standard deviation of a numeric array.
 */
export function computeStats(values: number[]): { mean: number; stdDev: number } {
  if (values.length === 0) return { mean: 0, stdDev: 0 };
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return { mean, stdDev: Math.sqrt(variance) };
}

/**
 * Z-score a single value against an array of values.
 */
export function zScoreFromArray(value: number, values: number[]): ZScoreResult {
  const { mean, stdDev } = computeStats(values);
  return zScore(value, mean, stdDev);
}

/**
 * Robust z-score (modified z-score) using Median Absolute Deviation.
 * More resistant to outliers than standard z-score.
 *
 * Modified z-score = 0.6745 * (xi - median) / MAD
 */
export function robustZScore(value: number, values: number[]): RobustZScoreResult {
  if (values.length === 0) return { modifiedZScore: 0, median: 0, mad: 0 };

  const sorted = [...values].sort((a, b) => a - b);
  const median = computeMedian(sorted);

  const absDeviations = values.map((v) => Math.abs(v - median));
  const sortedDeviations = [...absDeviations].sort((a, b) => a - b);
  const mad = computeMedian(sortedDeviations);

  const K = 0.6745;
  const modifiedZScore = mad > 0 ? (K * (value - median)) / mad : 0;

  return { modifiedZScore, median, mad };
}

function computeMedian(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
