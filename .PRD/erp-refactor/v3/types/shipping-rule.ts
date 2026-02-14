import { z } from 'zod';

export const ShippingRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  label: z.string(),
  disabled: z.boolean().optional().default(false),
  shipping_rule_type: z.enum(['Selling', 'Buying']).optional(),
  company: z.string(),
  account: z.string(),
  cost_center: z.string(),
  project: z.string().optional(),
  calculate_based_on: z.enum(['Fixed', 'Net Total', 'Net Weight']).optional().default('Fixed'),
  shipping_amount: z.number().optional(),
  conditions: z.array(z.unknown()).optional(),
  countries: z.array(z.unknown()).optional(),
});

export type ShippingRule = z.infer<typeof ShippingRuleSchema>;

export const ShippingRuleInsertSchema = ShippingRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShippingRuleInsert = z.infer<typeof ShippingRuleInsertSchema>;
