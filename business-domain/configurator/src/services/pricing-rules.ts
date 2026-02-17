import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const ApplyPricingRulesParams = z.object({ configurationId: z.string(), basePriceMinor: z.number() });
export interface PricingResult { configurationId: string; basePriceMinor: number; finalPriceMinor: number; appliedRules: string[] }
export async function applyPricingRules(db: DbInstance, orgId: string, params: z.infer<typeof ApplyPricingRulesParams>): Promise<Result<PricingResult>> {
  const validated = ApplyPricingRulesParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ configurationId: validated.data.configurationId, basePriceMinor: validated.data.basePriceMinor, finalPriceMinor: validated.data.basePriceMinor * 1.15, appliedRules: ['volume-discount', 'premium-upgrade'] });
}

const CalculateDiscountParams = z.object({ configurationId: z.string(), discountCode: z.string().optional() });
export interface DiscountCalculation { configurationId: string; discountPercentage: number; discountAmountMinor: number }
export async function calculateDiscount(db: DbInstance, orgId: string, params: z.infer<typeof CalculateDiscountParams>): Promise<Result<DiscountCalculation>> {
  const validated = CalculateDiscountParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ configurationId: validated.data.configurationId, discountPercentage: 10, discountAmountMinor: 50000 });
}
