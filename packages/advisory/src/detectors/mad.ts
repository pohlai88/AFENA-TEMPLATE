import type { MadResult } from '../types';

/**
 * MAD — Median Absolute Deviation outlier detector.
 * Uses the modified z-score (Iglewicz & Hoaglin) for robust outlier detection.
 *
 * Modified z-score = 0.6745 * (xi - median) / MAD
 * Threshold: typically 3.5 (conservative) or 2.5 (aggressive)
 *
 * @param values - Array of numeric values
 * @param threshold - Modified z-score threshold for outlier classification (default 3.5)
 */
export function detectMad(
  values: number[],
  threshold = 3.5,
): MadResult {
  if (values.length === 0) {
    return { outliers: [], median: 0, mad: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const median = computeMedian(sorted);

  // Compute MAD = median(|xi - median|)
  const absDeviations = values.map((v) => Math.abs(v - median));
  const sortedDeviations = [...absDeviations].sort((a, b) => a - b);
  const mad = computeMedian(sortedDeviations);

  if (mad === 0) {
    // All values are the same (or nearly so) — no outliers detectable via MAD
    return { outliers: [], median, mad: 0 };
  }

  // Compute modified z-scores and identify outliers
  const K = 0.6745; // consistency constant for normal distribution
  const outliers = values
    .map((value, index) => {
      const score = (K * (value - median)) / mad;
      return { index, value, score };
    })
    .filter((o) => Math.abs(o.score) >= threshold);

  return { outliers, median, mad };
}

/** Compute median of a pre-sorted array. */
function computeMedian(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
