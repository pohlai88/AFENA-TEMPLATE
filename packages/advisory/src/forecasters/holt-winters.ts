import type { HoltWintersResult } from '../types';

/**
 * Holt-Winters — triple exponential smoothing with seasonality.
 * Supports additive and multiplicative seasonal patterns.
 *
 * @param series - Historical values (must have at least 2 full seasons)
 * @param alpha - Level smoothing (0 < alpha < 1)
 * @param beta - Trend smoothing (0 < beta < 1)
 * @param gamma - Seasonal smoothing (0 < gamma < 1)
 * @param seasonLength - Number of periods per season (e.g. 7 for weekly, 12 for monthly)
 * @param horizon - Number of future periods to forecast
 * @param type - 'additive' or 'multiplicative'
 */
export function forecastHoltWinters(
  series: number[],
  alpha: number,
  beta: number,
  gamma: number,
  seasonLength: number,
  horizon: number,
  type: 'additive' | 'multiplicative' = 'additive',
): HoltWintersResult {
  const n = series.length;

  if (n < seasonLength * 2) {
    return {
      forecast: Array.from({ length: horizon }, () => series[n - 1] ?? 0),
      level: series[n - 1] ?? 0,
      trend: 0,
      seasonal: [],
      quantiles: { p10: [], p50: [], p90: [] },
      alpha, beta, gamma,
      mape: 0,
    };
  }

  // Initialize seasonal components from first season
  const seasonal = new Array<number>(seasonLength);
  const firstSeasonAvg = series.slice(0, seasonLength).reduce((a, b) => a + b, 0) / seasonLength;

  for (let i = 0; i < seasonLength; i++) {
    seasonal[i] = type === 'additive'
      ? series[i]! - firstSeasonAvg
      : series[i]! / firstSeasonAvg;
  }

  // Initialize level and trend
  let level = firstSeasonAvg;
  let trend = (series.slice(seasonLength, seasonLength * 2).reduce((a, b) => a + b, 0) / seasonLength - firstSeasonAvg) / seasonLength;

  const fitted: number[] = [];
  const residuals: number[] = [];

  // Fit
  for (let i = 0; i < n; i++) {
    const si = i % seasonLength;
    const yi = series[i]!;
    const prevLevel = level;

    if (type === 'additive') {
      level = alpha * (yi - seasonal[si]!) + (1 - alpha) * (prevLevel + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
      seasonal[si] = gamma * (yi - level) + (1 - gamma) * seasonal[si]!;
      fitted.push(level + trend + seasonal[si]!);
    } else {
      level = alpha * (yi / (seasonal[si]! || 1)) + (1 - alpha) * (prevLevel + trend);
      trend = beta * (level - prevLevel) + (1 - beta) * trend;
      seasonal[si] = gamma * (yi / (level || 1)) + (1 - gamma) * seasonal[si]!;
      fitted.push((level + trend) * seasonal[si]!);
    }

    residuals.push(yi - fitted[i]!);
  }

  // Forecast
  const forecast: number[] = [];
  for (let h = 1; h <= horizon; h++) {
    const si = (n + h - 1) % seasonLength;
    if (type === 'additive') {
      forecast.push(level + h * trend + seasonal[si]!);
    } else {
      forecast.push((level + h * trend) * seasonal[si]!);
    }
  }

  // Quantile bands from residual distribution
  const sortedResiduals = [...residuals].sort((a, b) => a - b);
  const residualP10 = quantile(sortedResiduals, 0.1);
  const residualP90 = quantile(sortedResiduals, 0.9);

  const p10 = forecast.map((f) => f + residualP10);
  const p50 = [...forecast];
  const p90 = forecast.map((f) => f + residualP90);

  // MAPE
  let mapeSum = 0;
  let mapeCount = 0;
  for (let i = seasonLength; i < n; i++) {
    if (series[i] !== 0) {
      mapeSum += Math.abs((series[i]! - fitted[i]!) / series[i]!);
      mapeCount++;
    }
  }
  const mape = mapeCount > 0 ? (mapeSum / mapeCount) * 100 : 0;

  return {
    forecast,
    level,
    trend,
    seasonal: [...seasonal],
    quantiles: { p10, p50, p90 },
    alpha, beta, gamma,
    mape,
  };
}

/** Compute quantile from a sorted array using linear interpolation. */
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = q * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (pos - lo) * (sorted[hi]! - sorted[lo]!);
}
