/**
 * Product Configurator Service
 * Manages configurable products, configuration rules, pricing, and quotation
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface ConfigurableProduct {
  productId: string;
  productCode: string;
  productName: string;
  description: string;
  basePrice: number;
  currency: string;
  
  // Configuration structure
  features: ProductFeature[];
  optionGroups: OptionGroup[];
  validationRules: ValidationRule[];
  pricingRules: PricingRule[];
  
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  version: number;
}

export interface ProductFeature {
  featureId: string;
  featureName: string;
  featureType: 'SINGLE_SELECT' | 'MULTI_SELECT' | 'NUMERIC' | 'TEXT' | 'BOOLEAN';
  isRequired: boolean;
  displayOrder: number;
  defaultValue?: unknown;
  minValue?: number;
  maxValue?: number;
  options?: FeatureOption[];
}

export interface FeatureOption {
  optionId: string;
  optionName: string;
  optionValue: string | number | boolean;
  priceModifier: number; // Delta to base price
  isDefault: boolean;
  availabilityConditions?: string[]; // Feature dependencies
}

export interface OptionGroup {
  groupId: string;
  groupName: string;
  groupType: 'XOR' | 'OR' | 'AND'; // XOR = exactly one, OR = at least one, AND = all required
  options: string[]; // Feature IDs
  minSelections?: number;
  maxSelections?: number;
}

export interface ValidationRule {
  ruleId: string;
  ruleType: 'DEPENDENCY' | 'EXCLUSION' | 'QUANTITY' | 'COMPATIBILITY';
  condition: string; // Expression to evaluate
  errorMessage: string;
  severity: 'ERROR' | 'WARNING';
}

export interface PricingRule {
  ruleId: string;
  condition: string;
  priceAdjustment: number;
  adjustmentType: 'FIXED' | 'PERCENTAGE' | 'FORMULA';
  priority: number;
  description: string;
}

export interface ProductConfiguration {
  configurationId: string;
  productId: string;
  customerId?: string;
  quotationId?: string;
  
  // Selected options
  selections: ConfigurationSelection[];
  
  // Pricing
  basePrice: number;
  totalModifiers: number;
  totalPrice: number;
  currency: string;
  priceBreakdown: PriceComponent[];
  
  // Validation
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
  
  // Status
  status: 'DRAFT' | 'VALIDATED' | 'QUOTED' | 'ORDERED';
  createdDate: Date;
  lastModifiedDate: Date;
  createdBy: string;
}

export interface ConfigurationSelection {
  featureId: string;
  featureName: string;
  selectedValue: unknown;
  selectedOptionId?: string;
  priceImpact: number;
}

export interface PriceComponent {
  componentName: string;
  componentType: 'BASE' | 'FEATURE' | 'RULE' | 'DISCOUNT' | 'SURCHARGE';
  amount: number;
  description?: string;
}

export interface ConfigurationQuote {
  quoteId: string;
  configurationId: string;
  customerId: string;
  
  // Pricing
  listPrice: number;
  discountPercentage: number;
  discountAmount: number;
  netPrice: number;
  taxAmount: number;
  totalPrice: number;
  currency: string;
  
  // Terms
  validUntil: Date;
  leadTime: number; // days
  paymentTerms: string;
  deliveryTerms?: string;
  
  // Status
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED' | 'WITHDRAWN';
  sentDate?: Date;
  acceptedDate?: Date;
  
  notes?: string;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createConfigurableProduct(
  product: Omit<ConfigurableProduct, 'productId'>
): Promise<ConfigurableProduct> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createConfiguration(
  config: Omit<ProductConfiguration, 'configurationId' | 'createdDate' | 'lastModifiedDate'>
): Promise<ProductConfiguration> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function updateConfiguration(
  configurationId: string,
  selections: ConfigurationSelection[]
): Promise<ProductConfiguration> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function generateQuote(
  quote: Omit<ConfigurationQuote, 'quoteId'>
): Promise<ConfigurationQuote> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getProductByCode(productCode: string): Promise<ConfigurableProduct | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateConfigurationId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `CFG-${dateStr}-${sequence}`;
}

export function validateConfiguration(
  product: ConfigurableProduct,
  selections: ConfigurationSelection[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required features
  product.features.filter(f => f.isRequired).forEach(feature => {
    const selection = selections.find(s => s.featureId === feature.featureId);
    if (!selection || selection.selectedValue === null || selection.selectedValue === undefined) {
      errors.push(`Required feature "${feature.featureName}" must be selected`);
    }
  });

  // Check option groups
  product.optionGroups.forEach(group => {
    const groupSelections = selections.filter(s => group.options.includes(s.featureId));

    switch (group.groupType) {
      case 'XOR':
        if (groupSelections.length !== 1) {
          errors.push(`Group "${group.groupName}" requires exactly one selection`);
        }
        break;

      case 'OR':
        if (groupSelections.length === 0) {
          errors.push(`Group "${group.groupName}" requires at least one selection`);
        }
        break;

      case 'AND':
        if (groupSelections.length !== group.options.length) {
          errors.push(`Group "${group.groupName}" requires all options`);
        }
        break;
    }

    // Min/max selections
    if (group.minSelections !== undefined && groupSelections.length < group.minSelections) {
      errors.push(`Group "${group.groupName}" requires at least ${group.minSelections} selections`);
    }
    if (group.maxSelections !== undefined && groupSelections.length > group.maxSelections) {
      errors.push(`Group "${group.groupName}" allows at most ${group.maxSelections} selections`);
    }
  });

  // Validate numeric ranges
  selections.forEach(selection => {
    const feature = product.features.find(f => f.featureId === selection.featureId);
    if (feature && feature.featureType === 'NUMERIC') {
      const value = Number(selection.selectedValue);
      if (feature.minValue !== undefined && value < feature.minValue) {
        errors.push(`${feature.featureName} must be at least ${feature.minValue}`);
      }
      if (feature.maxValue !== undefined && value > feature.maxValue) {
        errors.push(`${feature.featureName} must not exceed ${feature.maxValue}`);
      }
    }
  });

  // Apply validation rules
  product.validationRules.forEach(rule => {
    const ruleResult = evaluateRule(rule.condition, selections);
    if (!ruleResult) {
      if (rule.severity === 'ERROR') {
        errors.push(rule.errorMessage);
      } else {
        warnings.push(rule.errorMessage);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function evaluateRule(condition: string, selections: ConfigurationSelection[]): boolean {
  // Simple rule evaluator
  // In production, use expression parser (e.g., expr-eval)
  try {
    // Build context
    const context: Record<string, unknown> = {};
    selections.forEach(sel => {
      context[sel.featureId] = sel.selectedValue;
    });

    // Very basic evaluation - production would use proper parser
    // Example condition: "FEATURE_COLOR === 'red' AND FEATURE_SIZE > 10"
    const evaluatePart = (part: string): boolean => {
      const parts = part.trim().split(/\s+(===|!==|>=|<=|>|<)\s+/);
      if (parts.length !== 3) return true;

      const [featureId, operator, value] = parts;
      const featureValue = context[featureId];
      const compareValue = value.replace(/'/g, '');

      switch (operator) {
        case '===':
          return String(featureValue) === compareValue;
        case '!==':
          return String(featureValue) !== compareValue;
        case '>':
          return Number(featureValue) > Number(compareValue);
        case '<':
          return Number(featureValue) < Number(compareValue);
        case '>=':
          return Number(featureValue) >= Number(compareValue);
        case '<=':
          return Number(featureValue) <= Number(compareValue);
        default:
          return true;
      }
    };

    // Split by AND/OR
    const andParts = condition.split(/\s+AND\s+/i);
    return andParts.every(andPart => {
      const orParts = andPart.split(/\s+OR\s+/i);
      return orParts.some(orPart => evaluatePart(orPart));
    });
  } catch {
    return true; // Don't fail validation on rule evaluation errors
  }
}

export function calculateConfigurationPrice(
  product: ConfigurableProduct,
  selections: ConfigurationSelection[]
): {
  basePrice: number;
  totalModifiers: number;
  totalPrice: number;
  breakdown: PriceComponent[];
} {
  const breakdown: PriceComponent[] = [];

  // Base price
  breakdown.push({
    componentName: 'Base Price',
    componentType: 'BASE',
    amount: product.basePrice,
  });

  let totalModifiers = 0;

  // Feature options pricing
  selections.forEach(selection => {
    if (selection.selectedOptionId) {
      const feature = product.features.find(f => f.featureId === selection.featureId);
      const option = feature?.options?.find(o => o.optionId === selection.selectedOptionId);
      
      if (option && option.priceModifier !== 0) {
        breakdown.push({
          componentName: `${selection.featureName}: ${option.optionName}`,
          componentType: 'FEATURE',
          amount: option.priceModifier,
        });
        totalModifiers += option.priceModifier;
      }
    }
  });

  // Apply pricing rules
  const applicableRules = product.pricingRules
    .filter(rule => evaluateRule(rule.condition, selections))
    .sort((a, b) => a.priority - b.priority);

  applicableRules.forEach(rule => {
    let adjustment = 0;

    switch (rule.adjustmentType) {
      case 'FIXED':
        adjustment = rule.priceAdjustment;
        break;

      case 'PERCENTAGE':
        adjustment = (product.basePrice + totalModifiers) * (rule.priceAdjustment / 100);
        break;

      case 'FORMULA':
        // Would evaluate formula in production
        adjustment = rule.priceAdjustment;
        break;
    }

    breakdown.push({
      componentName: rule.description,
      componentType: rule.priceAdjustment >= 0 ? 'SURCHARGE' : 'DISCOUNT',
      amount: adjustment,
    });
    totalModifiers += adjustment;
  });

  const totalPrice = product.basePrice + totalModifiers;

  return {
    basePrice: product.basePrice,
    totalModifiers: Math.round(totalModifiers * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    breakdown,
  };
}

export function recommendOptions(
  product: ConfigurableProduct,
  currentSelections: ConfigurationSelection[],
  featureId: string
): FeatureOption[] {
  const feature = product.features.find(f => f.featureId === featureId);
  if (!feature || !feature.options) return [];

  // Filter options by availability conditions
  const availableOptions = feature.options.filter(option => {
    if (!option.availabilityConditions || option.availabilityConditions.length === 0) {
      return true;
    }

    // Check if all conditions are met
    return option.availabilityConditions.every(condition => {
      return evaluateRule(condition, currentSelections);
    });
  });

  // Sort by: default first, then by price
  return availableOptions.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return a.priceModifier - b.priceModifier;
  });
}

export function generateQuoteSummary(
  quote: ConfigurationQuote,
  configuration: ProductConfiguration
): {
  productDescription: string;
  keyFeatures: string[];
  pricingSummary: {
    listPrice: number;
    discount: string;
    netPrice: number;
    tax: number;
    total: number;
  };
} {
  const keyFeatures = configuration.selections
    .filter(s => s.priceImpact !== 0 || s.selectedValue !== null)
    .slice(0, 10)
    .map(s => `${s.featureName}: ${s.selectedValue}`);

  return {
    productDescription: configuration.selections
      .slice(0, 3)
      .map(s => s.selectedValue)
      .join(', '),
    keyFeatures,
    pricingSummary: {
      listPrice: quote.listPrice,
      discount: `${quote.discountPercentage}% (${quote.currency} ${quote.discountAmount})`,
      netPrice: quote.netPrice,
      tax: quote.taxAmount,
      total: quote.totalPrice,
    },
  };
}

export function calculateLeadTime(
  configuration: ProductConfiguration,
  product: ConfigurableProduct
): number {
  // Base lead time
  let leadTime = 14; // days

  // Add time for complex configurations
  const complexityFactor = configuration.selections.length / 10;
  leadTime += Math.round(complexityFactor * 7);

  // Specific features may add time
  configuration.selections.forEach(selection => {
    const feature = product.features.find(f => f.featureId === selection.featureId);
    if (feature?.featureName.toLowerCase().includes('custom')) {
      leadTime += 7; // Custom features add a week
    }
  });

  return Math.min(leadTime, 90); // Cap at 90 days
}

export function analyzeConfigurationTrends(
  configurations: ProductConfiguration[]
): {
  popularFeatures: Array<{ featureName: string; selectionCount: number; avgPriceImpact: number }>;
  avgConfigurationPrice: number;
  avgComplexity: number;
  conversionRate: number; // % that become orders
} {
  const featureMap = new Map<string, { count: number; totalPriceImpact: number }>();
  let totalPrice = 0;
  let totalComplexity = 0;
  const orderedCount = configurations.filter(c => c.status === 'ORDERED').length;

  configurations.forEach(config => {
    totalPrice += config.totalPrice;
    totalComplexity += config.selections.length;

    config.selections.forEach(selection => {
      if (!featureMap.has(selection.featureName)) {
        featureMap.set(selection.featureName, { count: 0, totalPriceImpact: 0 });
      }
      const data = featureMap.get(selection.featureName)!;
      data.count++;
      data.totalPriceImpact += selection.priceImpact;
    });
  });

  const popularFeatures = Array.from(featureMap.entries())
    .map(([featureName, data]) => ({
      featureName,
      selectionCount: data.count,
      avgPriceImpact: Math.round((data.totalPriceImpact / data.count) * 100) / 100,
    }))
    .sort((a, b) => b.selectionCount - a.selectionCount)
    .slice(0, 10);

  return {
    popularFeatures,
    avgConfigurationPrice: configurations.length > 0 ? totalPrice / configurations.length : 0,
    avgComplexity: configurations.length > 0 ? totalComplexity / configurations.length : 0,
    conversionRate: configurations.length > 0 ? (orderedCount / configurations.length) * 100 : 0,
  };
}
