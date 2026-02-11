import type { SesResult } from '../types';

/**
 * SES — Simple Exponential Smoothing forecaster.
 * Best for stationary series with no trend or seasonality.
 *
 * @param series - Historical values (chronologically ordered)
 * @param alpha - Smoothing factor (0 < alpha < 1)
 * @param horizon - Number of future periods to forecast
 */
export function forecastSes(
  series: number[],
  alpha: number,
  horizon: number,
): SesResult {
  if (series.length === 0) {
    return { forecast: [], fitted: [], alpha, mape: 0, mase: 0 };
  }

  // Initialize level with first observation
  let level = series[0]!;
  const fitted: number[] = [level];

  // Fit the model
  for (let i = 1; i < series.length; i++) {
    level = alpha * series[i]! + (1 - alpha) * level;
    fitted.push(level);
  }

  // Forecast: SES produces flat forecasts (last level repeated)
  const forecast = Array.from({ length: horizon }, () => level);

  // Error metrics
  const mape = computeMape(series, fitted);
  const mase = computeMase(series, fitted);

  return { forecast, fitted, alpha, mape, mase };
}

/** Mean Absolute Percentage Error. */
function computeMape(actual: number[], fitted: number[]): number {
  let sum = 0;
  let count = 0;
  for (let i = 1; i < actual.length; i++) {
    if (actual[i] !== 0) {
      sum += Math.abs((actual[i]! - fitted[i]!) / actual[i]!);
      count++;
    }
  }
  return count > 0 ? (sum / count) * 100 : 0;
}

/** Mean Absolute Scaled Error (scaled by naive forecast MAE). */
function computeMase(actual: number[], fitted: number[]): number {
  if (actual.length < 3) return 0;

  // Naive forecast error: |y_t - y_{t-1}|
  let naiveSum = 0;
  for (let i = 1; i < actual.length; i++) {
    naiveSum += Math.abs(actual[i]! - actual[i - 1]!);
  }
  const naiveMae = naiveSum / (actual.length - 1);
  if (naiveMae === 0) return 0;

  // Model forecast error
  let modelSum = 0;
  for (let i = 1; i < actual.length; i++) {
    modelSum += Math.abs(actual[i]! - fitted[i]!);
  }
  const modelMae = modelSum / (actual.length - 1);

  return modelMae / naiveMae;
}
