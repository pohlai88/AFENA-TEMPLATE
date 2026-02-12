import type { ConfidenceBand } from '../types';

/**
 * Compute quantile bands (P10/P50/P90) from an array of values.
 * Uses linear interpolation between sorted values.
 */
export function confidenceBands(values: number[]): ConfidenceBand {
  if (values.length === 0) return { p10: 0, p50: 0, p90: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  return {
    p10: quantile(sorted, 0.1),
    p50: quantile(sorted, 0.5),
    p90: quantile(sorted, 0.9),
  };
}

/**
 * Compute prediction interval around a point forecast.
 *
 * @param forecast - Point forecast value
 * @param residuals - Historical residuals (actual - fitted)
 * @param width - Interval width (default 0.8 = 80% interval → P10/P90)
 */
export function predictionInterval(
  forecast: number,
  residuals: number[],
  width = 0.8,
): { lower: number; upper: number; forecast: number } {
  if (residuals.length === 0) return { lower: forecast, upper: forecast, forecast };

  const sorted = [...residuals].sort((a, b) => a - b);
  const lowerQ = (1 - width) / 2;
  const upperQ = 1 - lowerQ;

  return {
    lower: forecast + quantile(sorted, lowerQ),
    upper: forecast + quantile(sorted, upperQ),
    forecast,
  };
}

/** Compute quantile from a sorted array using linear interpolation. */
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = q * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (pos - lo) * (sorted[hi] - sorted[lo]);
}
