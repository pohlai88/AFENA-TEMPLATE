import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface PricingRule {
  id: string;
  orgId: string;
  ruleName: string;
  productCategory?: string;
  customerSegment?: string;
  pricingStrategy: 'COST_PLUS' | 'COMPETITIVE' | 'VALUE_BASED' | 'DYNAMIC';
  basePrice?: number;
  markup?: number; // percentage
  minPrice?: number;
  maxPrice?: number;
  effectiveDate: Date;
  expiryDate?: Date;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PriceAdjustment {
  id: string;
  ruleId: string;
  adjustmentType: 'DISCOUNT' | 'SURCHARGE' | 'VOLUME' | 'SEASONAL';
  condition: Record<string, unknown>;
  adjustmentValue: number; // percentage or fixed amount
  adjustmentBasis: 'PERCENTAGE' | 'FIXED';
}

export async function createPricingRule(
  db: NeonHttpDatabase,
  data: Omit<PricingRule, 'id' | 'status'>,
): Promise<PricingRule> {
  // TODO: Insert pricing rule with ACTIVE status
  throw new Error('Database integration pending');
}

export async function addPriceAdjustment(
  db: NeonHttpDatabase,
  data: Omit<PriceAdjustment, 'id'>,
): Promise<PriceAdjustment> {
  // TODO: Insert price adjustment
  throw new Error('Database integration pending');
}

export async function calculatePrice(
  db: NeonHttpDatabase,
  productId: string,
  customerId: string,
  quantity: number,
): Promise<{ basePrice: number; adjustments: number; finalPrice: number }> {
  // TODO: Calculate price with all applicable rules and adjustments
  throw new Error('Database integration pending');
}

export function applyCostPlusPricing(
  cost: number,
  markupPercentage: number,
  minPrice?: number,
  maxPrice?: number,
): number {
  let price = cost * (1 + markupPercentage / 100);

  if (minPrice && price < minPrice) price = minPrice;
  if (maxPrice && price > maxPrice) price = maxPrice;

  return Math.round(price * 100) / 100;
}

export function applyVolumeDiscount(
  basePrice: number,
  quantity: number,
  tiers: Array<{ minQuantity: number; discountPercentage: number }>,
): { discountedPrice: number; discountApplied: number } {
  // Find applicable tier
  const sortedTiers = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);
  
  let discountPercentage = 0;
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQuantity) {
      discountPercentage = tier.discountPercentage;
      break;
    }
  }

  const discountedPrice = basePrice * (1 - discountPercentage / 100);
  
  return {
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    discountApplied: discountPercentage,
  };
}

export function calculateCompetitivePrice(
  ownCost: number,
  competitorPrices: number[],
  strategy: 'MATCH' | 'UNDERCUT' | 'PREMIUM',
  margin: number = 0, // percentage
): number {
  if (competitorPrices.length === 0) {
    return applyCostPlusPricing(ownCost, 20); // Default 20% markup
  }

  const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
  const minCompetitorPrice = Math.min(...competitorPrices);

  let targetPrice: number;

  if (strategy === 'MATCH') {
    targetPrice = avgCompetitorPrice;
  } else if (strategy === 'UNDERCUT') {
    targetPrice = minCompetitorPrice * (1 - margin / 100);
  } else {
    // PREMIUM
    targetPrice = avgCompetitorPrice * (1 + margin / 100);
  }

  // Ensure we're above cost
  return Math.max(targetPrice, ownCost * 1.1); // Minimum 10% margin
}

export function optimizePricing(
  currentPrice: number,
  demand: number,
  cost: number,
  priceElasticity: number, // % change in demand per % change in price
): { optimalPrice: number; projectedRevenue: number; projectedProfit: number } {
  // Simple optimization: find price that maximizes profit
  const prices = [];
  for (let price = cost * 1.1; price <= currentPrice * 1.5; price += cost * 0.05) {
    const priceChange = ((price - currentPrice) / currentPrice) * 100;
    const demandChange = priceChange * priceElasticity;
    const projectedDemand = demand * (1 + demandChange / 100);
    
    const revenue = price * projectedDemand;
    const profit = (price - cost) * projectedDemand;

    prices.push({ price, demand: projectedDemand, revenue, profit });
  }

  // Find price with maximum profit
  const optimal = prices.reduce((max, current) => 
    current.profit > max.profit ? current : max
  );

  return {
    optimalPrice: Math.round(optimal.price * 100) / 100,
    projectedRevenue: Math.round(optimal.revenue * 100) / 100,
    projectedProfit: Math.round(optimal.profit * 100) / 100,
  };
}
