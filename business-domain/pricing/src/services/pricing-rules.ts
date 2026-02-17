import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreatePriceListParams = z.object({
  name: z.string(),
  currency: z.string(),
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),
  customerSegment: z.string().optional(),
  channel: z.enum(['wholesale', 'retail', 'online', 'partner']).optional(),
});

export interface PriceList {
  priceListId: string;
  name: string;
  currency: string;
  effectiveDate: Date;
  expirationDate?: Date;
  customerSegment?: string;
  channel?: string;
  status: 'draft' | 'active' | 'expired';
  itemCount: number;
  createdAt: Date;
}

export async function createPriceList(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreatePriceListParams>,
): Promise<Result<PriceList>> {
  const validated = CreatePriceListParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create price list
  return ok({
    priceListId: `pl-${Date.now()}`,
    name: validated.data.name,
    currency: validated.data.currency,
    effectiveDate: validated.data.effectiveDate,
    expirationDate: validated.data.expirationDate,
    customerSegment: validated.data.customerSegment,
    channel: validated.data.channel,
    status: 'draft',
    itemCount: 0,
    createdAt: new Date(),
  });
}

const AddPriceRuleParams = z.object({
  priceListId: z.string(),
  itemId: z.string(),
  basePrice: z.number(),
  minPrice: z.number().optional(),
  maxDiscount: z.number().optional(),
  tierBreaks: z
    .array(
      z.object({
        quantity: z.number(),
        price: z.number(),
      }),
    )
    .optional(),
});

export interface PriceRule {
  ruleId: string;
  priceListId: string;
  itemId: string;
  basePrice: number;
  minPrice?: number;
  maxDiscount?: number;
  tierBreaks?: { quantity: number; price: number }[];
  effectiveDate: Date;
}

export async function addPriceRule(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AddPriceRuleParams>,
): Promise<Result<PriceRule>> {
  const validated = AddPriceRuleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Add price rule to price list
  return ok({
    ruleId: `rule-${Date.now()}`,
    priceListId: validated.data.priceListId,
    itemId: validated.data.itemId,
    basePrice: validated.data.basePrice,
    minPrice: validated.data.minPrice,
    maxDiscount: validated.data.maxDiscount,
    tierBreaks: validated.data.tierBreaks,
    effectiveDate: new Date(),
  });
}

const CalculatePriceParams = z.object({
  itemId: z.string(),
  customerId: z.string(),
  quantity: z.number(),
  requestDate: z.date(),
});

export interface CalculatedPrice {
  itemId: string;
  customerId: string;
  quantity: number;
  listPrice: number;
  discountPercent: number;
  discountAmount: number;
  netPrice: number;
  appliedRules: string[];
  marginPercent: number;
}

export async function calculatePrice(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CalculatePriceParams>,
): Promise<Result<CalculatedPrice>> {
  const validated = CalculatePriceParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Apply pricing waterfall and calculate final price
  const listPrice = 100; // TODO: Get from active price list
  const discountPercent = 10;
  const discountAmount = listPrice * (discountPercent / 100);
  const netPrice = listPrice - discountAmount;

  return ok({
    itemId: validated.data.itemId,
    customerId: validated.data.customerId,
    quantity: validated.data.quantity,
    listPrice,
    discountPercent,
    discountAmount,
    netPrice,
    appliedRules: [],
    marginPercent: 0,
  });
}

const GetPriceHistoryParams = z.object({
  itemId: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
});

export interface PriceHistory {
  itemId: string;
  history: {
    date: Date;
    priceListId: string;
    price: number;
    changeReason: string;
  }[];
  averagePrice: number;
  priceVolatility: number;
}

export async function getPriceHistory(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetPriceHistoryParams>,
): Promise<Result<PriceHistory>> {
  const validated = GetPriceHistoryParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query price history
  return ok({
    itemId: validated.data.itemId,
    history: [],
    averagePrice: 0,
    priceVolatility: 0,
  });
}
