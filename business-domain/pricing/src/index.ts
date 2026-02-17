/**
 * @afenda-pricing
 *
 * Advanced pricing management and optimization.
 */

// Pricing Rules
export type {
  PriceList,
  PriceRule,
  CalculatedPrice,
  PriceHistory,
} from './services/pricing-rules.js';

export {
  createPriceList,
  addPriceRule,
  calculatePrice,
  getPriceHistory,
} from './services/pricing-rules.js';

// Price Optimization
export type {
  PriceOptimization,
  ElasticityAnalysis,
  PriceSimulation,
  OptimizationRecommendations,
} from './services/price-optimization.js';

export {
  optimizePrice,
  analyzeElasticity,
  simulatePriceChange,
  getOptimizationRecommendations,
} from './services/price-optimization.js';

// Competitor Pricing
export type {
  CompetitorPricing,
  CompetitorPriceRecord,
  MarketPositionAnalysis,
  CompetitorInsights,
} from './services/competitor-pricing.js';

export {
  compareCompetitorPricing,
  addCompetitorPrice,
  analyzeMarketPosition,
  getCompetitorInsights,
} from './services/competitor-pricing.js';

// Margin Analysis
export type {
  PriceRealization,
  DiscountAnalysis,
  MarginImpact,
  MarginWaterfall,
} from './services/margin-analysis.js';

export {
  analyzePriceRealization,
  analyzeDiscountPatterns,
  calculateMarginImpact,
  getMarginWaterfall,
} from './services/margin-analysis.js';

// Analytics
export type {
  PricingDashboard,
  PricingMetrics,
  PricingEffectiveness,
  PricingOpportunities,
} from './services/pricing-analytics.js';

export {
  getPricingDashboard,
  getPricingMetrics,
  analyzePricingEffectiveness,
  identifyPricingOpportunities,
} from './services/pricing-analytics.js';
