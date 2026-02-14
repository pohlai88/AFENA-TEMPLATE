import { z } from 'zod';

export const ShippingRuleConditionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_value: z.number(),
  to_value: z.number().optional(),
  shipping_amount: z.number(),
});

export type ShippingRuleCondition = z.infer<typeof ShippingRuleConditionSchema>;

export const ShippingRuleConditionInsertSchema = ShippingRuleConditionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShippingRuleConditionInsert = z.infer<typeof ShippingRuleConditionInsertSchema>;
