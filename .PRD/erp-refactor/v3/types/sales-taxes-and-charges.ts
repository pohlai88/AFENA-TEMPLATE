import { z } from 'zod';

export const SalesTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  charge_type: z.enum(['Actual', 'On Net Total', 'On Previous Row Amount', 'On Previous Row Total', 'On Item Quantity']),
  row_id: z.string().optional(),
  account_head: z.string(),
  description: z.string(),
  included_in_print_rate: z.boolean().optional().default(false),
  included_in_paid_amount: z.boolean().optional().default(false),
  set_by_item_tax_template: z.boolean().optional().default(false),
  is_tax_withholding_account: z.boolean().optional().default(false),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  rate: z.number().optional(),
  account_currency: z.string().optional(),
  net_amount: z.number().optional(),
  tax_amount: z.number().optional(),
  total: z.number().optional(),
  tax_amount_after_discount_amount: z.number().optional(),
  base_net_amount: z.number().optional(),
  base_tax_amount: z.number().optional(),
  base_total: z.number().optional(),
  base_tax_amount_after_discount_amount: z.number().optional(),
  dont_recompute_tax: z.boolean().optional().default(false),
});

export type SalesTaxesAndCharges = z.infer<typeof SalesTaxesAndChargesSchema>;

export const SalesTaxesAndChargesInsertSchema = SalesTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesTaxesAndChargesInsert = z.infer<typeof SalesTaxesAndChargesInsertSchema>;
