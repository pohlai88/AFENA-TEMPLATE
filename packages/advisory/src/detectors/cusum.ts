import type { CusumResult, TimeSeriesPoint } from '../types';

/**
 * CUSUM — Cumulative Sum change-point detector.
 * Detects gradual drift (up or down) from a target mean.
 *
 * @param series - Time series data points
 * @param targetMean - Expected mean value (baseline)
 * @param k - Allowance (slack) parameter. Typically 0.5 * expected shift magnitude.
 * @param h - Decision threshold. Alarm when cumulative sum exceeds h.
 */
export function detectCusum(
  series: TimeSeriesPoint[],
  targetMean: number,
  k: number,
  h: number,
): CusumResult {
  if (series.length === 0) {
    return {
      driftDetected: false,
      changePoint: null,
      cumulativeSumPos: 0,
      cumulativeSumNeg: 0,
      direction: 'none',
    };
  }

  let sPos = 0; // Cumulative sum for upward shift
  let sNeg = 0; // Cumulative sum for downward shift
  let changePoint: number | null = null;
  let direction: 'up' | 'down' | 'none' = 'none';

  for (let i = 0; i < series.length; i++) {
    const xi = series[i]!.value;

    // Update cumulative sums
    sPos = Math.max(0, sPos + (xi - targetMean - k));
    sNeg = Math.max(0, sNeg + (targetMean - xi - k));

    // Check for alarm
    if (sPos > h && changePoint === null) {
      changePoint = i;
      direction = 'up';
    }
    if (sNeg > h && changePoint === null) {
      changePoint = i;
      direction = 'down';
    }
  }

  return {
    driftDetected: changePoint !== null,
    changePoint,
    cumulativeSumPos: sPos,
    cumulativeSumNeg: sNeg,
    direction,
  };
}
