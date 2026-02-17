import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const AnalyzePriceRealizationParams = z.object({
  fromDate: z.date(),
  toDate: z.date(),
  category: z.string().optional(),
  customer: z.string().optional(),
});

export interface PriceRealization {
  period: {
    from: Date;
    to: Date;
  };
  metrics: {
    listPriceTotal: number;
    actualPriceTotal: number;
    realizationRate: number;
    totalDiscounts: number;
    discountRate: number;
    volumeWeightedPrice: number;
  };
  byCategory: {
    category: string;
    realizationRate: number;
    discountRate: number;
  }[];
  leakagePoints: {
    source: string;
    amount: number;
    percent: number;
  }[];
}

export async function analyzePriceRealization(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AnalyzePriceRealizationParams>,
): Promise<Result<PriceRealization>> {
  const validated = AnalyzePriceRealizationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Calculate price realization metrics
  return ok({
    period: {
      from: validated.data.fromDate,
      to: validated.data.toDate,
    },
    metrics: {
      listPriceTotal: 0,
      actualPriceTotal: 0,
      realizationRate: 0,
      totalDiscounts: 0,
      discountRate: 0,
      volumeWeightedPrice: 0,
    },
    byCategory: [],
    leakagePoints: [],
  });
}

const AnalyzeDiscountPatternsParams = z.object({
  timeframe: z.enum(['week', 'month', 'quarter', 'year']),
  groupBy: z.enum(['customer', 'salesperson', 'product', 'channel']),
});

export interface DiscountAnalysis {
  timeframe: string;
  averageDiscount: number;
  medianDiscount: number;
  discountDistribution: {
    bracket: string;
    count: number;
    percent: number;
  }[];
  topDiscounters: {
    entity: string;
    averageDiscount: number;
    totalDiscountAmount: number;
    impactOnMargin: number;
  }[];
  outliers: {
    transactionId: string;
    discount: number;
    reason: string;
  }[];
}

export async function analyzeDiscountPatterns(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AnalyzeDiscountPatternsParams>,
): Promise<Result<DiscountAnalysis>> {
  const validated = AnalyzeDiscountPatternsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Analyze discount patterns
  return ok({
    timeframe: validated.data.timeframe,
    averageDiscount: 0,
    medianDiscount: 0,
    discountDistribution: [],
    topDiscounters: [],
    outliers: [],
  });
}

const CalculateMarginImpactParams = z.object({
  itemId: z.string(),
  proposedPrice: z.number(),
  cost: z.number(),
  volume: z.number(),
});

export interface MarginImpact {
  itemId: string;
  currentMargin: {
    unitMargin: number;
    marginPercent: number;
    totalMargin: number;
  };
  proposedMargin: {
    unitMargin: number;
    marginPercent: number;
    totalMargin: number;
  };
  impact: {
    unitMarginChange: number;
    marginPercentChange: number;
    totalMarginChange: number;
  };
  breakEvenVolume: number;
}

export async function calculateMarginImpact(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculateMarginImpactParams>,
): Promise<Result<MarginImpact>> {
  const validated = CalculateMarginImpactParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Calculate margin impact of price change
  const currentPrice = 0; // TODO: Get from DB
  const currentUnitMargin = currentPrice - validated.data.cost;
  const proposedUnitMargin = validated.data.proposedPrice - validated.data.cost;

  return ok({
    itemId: validated.data.itemId,
    currentMargin: {
      unitMargin: currentUnitMargin,
      marginPercent: (currentUnitMargin / currentPrice) * 100,
      totalMargin: currentUnitMargin * validated.data.volume,
    },
    proposedMargin: {
      unitMargin: proposedUnitMargin,
      marginPercent: (proposedUnitMargin / validated.data.proposedPrice) * 100,
      totalMargin: proposedUnitMargin * validated.data.volume,
    },
    impact: {
      unitMarginChange: proposedUnitMargin - currentUnitMargin,
      marginPercentChange: 0,
      totalMarginChange: 0,
    },
    breakEvenVolume: 0,
  });
}

const GetMarginWaterfallParams = z.object({
  itemId: z.string(),
  transactionId: z.string(),
});

export interface MarginWaterfall {
  itemId: string;
  transactionId: string;
  listPrice: number;
  waterfall: {
    step: string;
    amount: number;
    percent: number;
    cumulative: number;
  }[];
  finalPrice: number;
  finalMargin: number;
  finalMarginPercent: number;
}

export async function getMarginWaterfall(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetMarginWaterfallParams>,
): Promise<Result<MarginWaterfall>> {
  const validated = GetMarginWaterfallParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Build pricing waterfall showing all discounts
  return ok({
    itemId: validated.data.itemId,
    transactionId: validated.data.transactionId,
    listPrice: 0,
    waterfall: [],
    finalPrice: 0,
    finalMargin: 0,
    finalMarginPercent: 0,
  });
}
