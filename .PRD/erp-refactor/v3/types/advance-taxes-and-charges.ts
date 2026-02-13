import { z } from 'zod';

export const AdvanceTaxesAndChargesSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  add_deduct_tax: z.enum(['Add', 'Deduct']),
  charge_type: z.enum(['Actual', 'On Paid Amount', 'On Previous Row Amount', 'On Previous Row Total']),
  row_id: z.string().optional(),
  account_head: z.string(),
  description: z.string(),
  included_in_paid_amount: z.boolean().optional().default(false),
  set_by_item_tax_template: z.boolean().optional().default(false),
  is_tax_withholding_account: z.boolean().optional().default(false),
  cost_center: z.string().optional().default(':Company'),
  project: z.string().optional(),
  rate: z.number().optional(),
  currency: z.string().optional(),
  net_amount: z.number().optional(),
  tax_amount: z.number().optional(),
  total: z.number().optional(),
  base_tax_amount: z.number().optional(),
  base_net_amount: z.number().optional(),
  base_total: z.number().optional(),
});

export type AdvanceTaxesAndCharges = z.infer<typeof AdvanceTaxesAndChargesSchema>;

export const AdvanceTaxesAndChargesInsertSchema = AdvanceTaxesAndChargesSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AdvanceTaxesAndChargesInsert = z.infer<typeof AdvanceTaxesAndChargesInsertSchema>;
