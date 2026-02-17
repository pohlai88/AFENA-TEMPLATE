/**
 * @afenda-forecasting
 * 
 * Enterprise statistical forecasting and demand sensing.
 */

export {
  forecastTimeSeries,
  applyExponentialSmoothing,
  type TimeSeriesForecast,
  type ExponentialSmoothingResult,
} from './services/statistical-models.js';

export {
  detectSeasonality,
  decomposeTimeSeries,
  type SeasonalityDetection,
  type TimeSeriesDecomposition,
} from './services/seasonal-adjustment.js';

export {
  senseDemand,
  adjustForecast,
  type DemandSignal,
  type ForecastAdjustment,
} from './services/demand-sensing.js';

export {
  createConsensusForecast,
  reconcileForecast,
  type ConsensusForecast,
  type ForecastReconciliation,
} from './services/consensus-planning.js';

export {
  measureAccuracy,
  calculateTrackingSignal,
  type ForecastAccuracyMetrics,
  type TrackingSignal,
} from './services/forecast-accuracy.js';
