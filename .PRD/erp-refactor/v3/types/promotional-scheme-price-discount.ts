import { z } from 'zod';

export const PromotionalSchemePriceDiscountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  disable: z.boolean().optional().default(false),
  apply_multiple_pricing_rules: z.boolean().optional().default(false),
  rule_description: z.string(),
  min_qty: z.number().optional().default(0),
  max_qty: z.number().optional().default(0),
  min_amount: z.number().optional().default(0),
  max_amount: z.number().optional().default(0),
  rate_or_discount: z.enum(['Rate', 'Discount Percentage', 'Discount Amount']).optional().default('Discount Percentage'),
  rate: z.number().optional(),
  discount_amount: z.number().optional(),
  discount_percentage: z.number().optional(),
  for_price_list: z.string().optional(),
  warehouse: z.string().optional(),
  threshold_percentage: z.number().optional(),
  validate_applied_rule: z.boolean().optional().default(false),
  priority: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']).optional(),
  apply_discount_on_rate: z.boolean().optional().default(false),
});

export type PromotionalSchemePriceDiscount = z.infer<typeof PromotionalSchemePriceDiscountSchema>;

export const PromotionalSchemePriceDiscountInsertSchema = PromotionalSchemePriceDiscountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PromotionalSchemePriceDiscountInsert = z.infer<typeof PromotionalSchemePriceDiscountInsertSchema>;
