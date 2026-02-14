import { z } from 'zod';

export const PricingRuleItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string().optional(),
  uom: z.string().optional(),
});

export type PricingRuleItemGroup = z.infer<typeof PricingRuleItemGroupSchema>;

export const PricingRuleItemGroupInsertSchema = PricingRuleItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleItemGroupInsert = z.infer<typeof PricingRuleItemGroupInsertSchema>;
