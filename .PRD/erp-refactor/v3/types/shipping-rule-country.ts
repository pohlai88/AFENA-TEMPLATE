import { z } from 'zod';

export const ShippingRuleCountrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  country: z.string(),
});

export type ShippingRuleCountry = z.infer<typeof ShippingRuleCountrySchema>;

export const ShippingRuleCountryInsertSchema = ShippingRuleCountrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShippingRuleCountryInsert = z.infer<typeof ShippingRuleCountryInsertSchema>;
