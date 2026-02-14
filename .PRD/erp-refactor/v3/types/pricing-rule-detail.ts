import { z } from 'zod';

export const PricingRuleDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  pricing_rule: z.string().optional(),
  item_code: z.string().optional(),
  margin_type: z.string().optional(),
  rate_or_discount: z.string().optional(),
  child_docname: z.string().optional(),
  rule_applied: z.boolean().optional().default(true),
});

export type PricingRuleDetail = z.infer<typeof PricingRuleDetailSchema>;

export const PricingRuleDetailInsertSchema = PricingRuleDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PricingRuleDetailInsert = z.infer<typeof PricingRuleDetailInsertSchema>;
