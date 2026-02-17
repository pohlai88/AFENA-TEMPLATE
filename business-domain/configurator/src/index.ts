/**
 * @afenda-configurator
 */

export { configureProduct, validateConfiguration, type ProductConfiguration, type ConfigurationValidation } from './services/product-configuration.js';
export { applyPricingRules, calculateDiscount, type PricingResult, type DiscountCalculation } from './services/pricing-rules.js';
export { generateBOM, estimateCost, type BillOfMaterials, type CostEstimate } from './services/bom-generation.js';
export { validateCompatibility, checkConstraints, type CompatibilityCheck, type ConstraintCheck } from './services/validation.js';
export { analyzeConfigurations, recommendOptions, type ConfigurationAnalysis, type OptionRecommendation } from './services/configurator-analytics.js';
