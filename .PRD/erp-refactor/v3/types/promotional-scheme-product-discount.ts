import { z } from 'zod';

export const PromotionalSchemeProductDiscountSchema = z.object({
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
  same_item: z.boolean().optional().default(false),
  free_item: z.string().optional(),
  free_qty: z.number().optional(),
  free_item_uom: z.string().optional(),
  free_item_rate: z.number().optional(),
  round_free_qty: z.boolean().optional().default(false),
  warehouse: z.string().optional(),
  threshold_percentage: z.number().optional(),
  priority: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']).optional(),
  is_recursive: z.boolean().optional().default(false),
  recurse_for: z.number().optional().default(0),
  apply_recursion_over: z.number().optional().default(0),
});

export type PromotionalSchemeProductDiscount = z.infer<typeof PromotionalSchemeProductDiscountSchema>;

export const PromotionalSchemeProductDiscountInsertSchema = PromotionalSchemeProductDiscountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PromotionalSchemeProductDiscountInsert = z.infer<typeof PromotionalSchemeProductDiscountInsertSchema>;
