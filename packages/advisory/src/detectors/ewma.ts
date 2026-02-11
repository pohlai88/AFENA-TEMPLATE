import type { EwmaResult, TimeSeriesPoint } from '../types';

/**
 * EWMA — Exponentially Weighted Moving Average detector.
 * Detects anomalies by comparing the latest value against the EWMA baseline.
 *
 * @param series - Time series data points (must be chronologically ordered)
 * @param alpha - Smoothing factor (0 < alpha < 1). Higher = more weight on recent values.
 * @param threshold - Z-score threshold for anomaly detection (default 3.0σ)
 */
export function detectEwma(
  series: TimeSeriesPoint[],
  alpha: number,
  threshold = 3.0,
): EwmaResult {
  if (series.length < 2) {
    return {
      isAnomaly: false,
      residual: 0,
      ewmaValue: series[0]?.value ?? 0,
      sigma: 0,
      zScore: 0,
      series: series.map((p) => ({ t: p.t, value: p.value, ewma: p.value })),
    };
  }

  // Initialize EWMA with first value
  let ewma = series[0]!.value;
  const tracked: { t: number; value: number; ewma: number }[] = [
    { t: series[0]!.t, value: series[0]!.value, ewma },
  ];

  // Compute EWMA for all points
  for (let i = 1; i < series.length; i++) {
    const point = series[i]!;
    ewma = alpha * point.value + (1 - alpha) * ewma;
    tracked.push({ t: point.t, value: point.value, ewma });
  }

  // Compute residuals and standard deviation
  const residuals = tracked.map((p) => p.value - p.ewma);
  const mean = residuals.reduce((sum, r) => sum + r, 0) / residuals.length;
  const variance = residuals.reduce((sum, r) => sum + (r - mean) ** 2, 0) / residuals.length;
  const sigma = Math.sqrt(variance);

  // Evaluate last point
  const lastResidual = residuals[residuals.length - 1]!;
  const zScore = sigma > 0 ? Math.abs(lastResidual) / sigma : 0;

  return {
    isAnomaly: zScore >= threshold,
    residual: lastResidual,
    ewmaValue: ewma,
    sigma,
    zScore,
    series: tracked,
  };
}
