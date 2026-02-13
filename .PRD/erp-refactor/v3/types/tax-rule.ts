import { z } from 'zod';

export const TaxRuleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  tax_type: z.enum(['Sales', 'Purchase']).optional().default('Sales'),
  use_for_shopping_cart: z.boolean().optional().default(true),
  sales_tax_template: z.string().optional(),
  purchase_tax_template: z.string().optional(),
  customer: z.string().optional(),
  supplier: z.string().optional(),
  item: z.string().optional(),
  billing_city: z.string().optional(),
  billing_county: z.string().optional(),
  billing_state: z.string().optional(),
  billing_zipcode: z.string().optional(),
  billing_country: z.string().optional(),
  tax_category: z.string().optional(),
  customer_group: z.string().optional(),
  supplier_group: z.string().optional(),
  item_group: z.string().optional(),
  shipping_city: z.string().optional(),
  shipping_county: z.string().optional(),
  shipping_state: z.string().optional(),
  shipping_zipcode: z.string().optional(),
  shipping_country: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  priority: z.number().int().optional().default(1),
  company: z.string().optional(),
});

export type TaxRule = z.infer<typeof TaxRuleSchema>;

export const TaxRuleInsertSchema = TaxRuleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxRuleInsert = z.infer<typeof TaxRuleInsertSchema>;
