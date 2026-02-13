import { z } from 'zod';

export const PromotionalSchemeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  apply_on: z.enum(['Item Code', 'Item Group', 'Brand', 'Transaction']).default('Item Code'),
  disable: z.boolean().optional().default(false),
  items: z.array(z.unknown()).optional(),
  item_groups: z.array(z.unknown()).optional(),
  brands: z.array(z.unknown()).optional(),
  mixed_conditions: z.boolean().optional().default(false),
  is_cumulative: z.boolean().optional().default(false),
  apply_rule_on_other: z.enum(['Item Code', 'Item Group', 'Brand']).optional(),
  other_item_code: z.string().optional(),
  other_item_group: z.string().optional(),
  other_brand: z.string().optional(),
  selling: z.boolean().optional().default(false),
  buying: z.boolean().optional().default(false),
  applicable_for: z.enum(['Customer', 'Customer Group', 'Territory', 'Sales Partner', 'Campaign', 'Supplier', 'Supplier Group']).optional(),
  customer: z.array(z.unknown()).optional(),
  customer_group: z.array(z.unknown()).optional(),
  territory: z.array(z.unknown()).optional(),
  sales_partner: z.array(z.unknown()).optional(),
  campaign: z.array(z.unknown()).optional(),
  supplier: z.array(z.unknown()).optional(),
  supplier_group: z.array(z.unknown()).optional(),
  valid_from: z.string().optional().default('Today'),
  valid_upto: z.string().optional(),
  company: z.string(),
  currency: z.string().optional(),
  price_discount_slabs: z.array(z.unknown()).optional(),
  product_discount_slabs: z.array(z.unknown()).optional(),
});

export type PromotionalScheme = z.infer<typeof PromotionalSchemeSchema>;

export const PromotionalSchemeInsertSchema = PromotionalSchemeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PromotionalSchemeInsert = z.infer<typeof PromotionalSchemeInsertSchema>;
