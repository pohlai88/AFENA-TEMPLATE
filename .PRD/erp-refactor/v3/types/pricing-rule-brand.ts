import { z } from 'zod';

export const PricingRuleBrandSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  brand: z.string().optional(),
  uom: z.string().optional(),
});

export type PricingRuleBrand = z.infer<typeof PricingRuleBrandSchema>;

export const PricingRuleBrandInsertSchema = PricingRuleBrandSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleBrandInsert = z.infer<typeof PricingRuleBrandInsertSchema>;
