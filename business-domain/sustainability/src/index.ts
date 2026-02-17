/**
 * @afenda-sustainability
 * 
 * Enterprise sustainability and ESG management.
 */

export {
  recordCarbonEmission,
  calculateCarbonFootprint,
  type CarbonEmission,
  type CarbonFootprint,
} from './services/carbon-tracking.js';

export {
  trackESGMetric,
  benchmarkESGPerformance,
  type ESGMetric,
  type ESGBenchmark,
} from './services/esg-metrics.js';

export {
  generateSustainabilityReport,
  submitGRIReport,
  type SustainabilityReport,
  type GRISubmission,
} from './services/sustainability-reporting.js';

export {
  recordWaste,
  trackRecyclingRate,
  type WasteRecord,
  type RecyclingMetrics,
} from './services/waste-management.js';

export {
  analyzeEmissionsTrend,
  forecastESGScore,
  type EmissionsTrend,
  type ESGForecast,
} from './services/sustainability-analytics.js';
