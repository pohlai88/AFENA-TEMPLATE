/**
 * @afenda-predictive-analytics
 */

export { trainModel, evaluateModel, type MLModel, type ModelEvaluation } from './services/ml-models.js';
export { forecastRevenue, predictDemand, type RevenueForecast, type DemandPrediction } from './services/forecasting.js';
export { optimizeInventory, optimizePricing, type InventoryOptimization, type PricingOptimization } from './services/optimization.js';
export { createScenario, compareScenarios, type Scenario, type ScenarioComparison } from './services/scenario-planning.js';
export { identifyPatterns, detectAnomalies, type Pattern, type Anomaly } from './services/predictive-insights.js';
