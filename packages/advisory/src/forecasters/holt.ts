import type { HoltResult } from '../types';

/**
 * Holt's Linear Trend — double exponential smoothing.
 * Best for series with a linear trend but no seasonality.
 *
 * @param series - Historical values (chronologically ordered)
 * @param alpha - Level smoothing factor (0 < alpha < 1)
 * @param beta - Trend smoothing factor (0 < beta < 1)
 * @param horizon - Number of future periods to forecast
 */
export function forecastHolt(
  series: number[],
  alpha: number,
  beta: number,
  horizon: number,
): HoltResult {
  if (series.length < 2) {
    const val = series[0] ?? 0;
    return {
      forecast: Array.from({ length: horizon }, () => val),
      level: val,
      trend: 0,
      alpha,
      beta,
      mape: 0,
    };
  }

  // Initialize
  let level = series[0];
  let trend = series[1] - series[0];
  const fitted: number[] = [level];

  // Fit
  for (let i = 1; i < series.length; i++) {
    const prevLevel = level;
    level = alpha * series[i] + (1 - alpha) * (prevLevel + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    fitted.push(level + trend);
  }

  // Forecast
  const forecast = Array.from({ length: horizon }, (_, h) => level + (h + 1) * trend);

  // MAPE
  let mapeSum = 0;
  let mapeCount = 0;
  for (let i = 1; i < series.length; i++) {
    if (series[i] !== 0) {
      mapeSum += Math.abs((series[i] - fitted[i]) / series[i]);
      mapeCount++;
    }
  }
  const mape = mapeCount > 0 ? (mapeSum / mapeCount) * 100 : 0;

  return { forecast, level, trend, alpha, beta, mape };
}
