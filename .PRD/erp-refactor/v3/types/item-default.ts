import { z } from 'zod';

export const ItemDefaultSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  default_warehouse: z.string().optional(),
  default_price_list: z.string().optional(),
  default_discount_account: z.string().optional(),
  default_inventory_account: z.string().optional(),
  inventory_account_currency: z.string().optional(),
  buying_cost_center: z.string().optional(),
  default_supplier: z.string().optional(),
  expense_account: z.string().optional(),
  default_provisional_account: z.string().optional(),
  purchase_expense_account: z.string().optional(),
  purchase_expense_contra_account: z.string().optional(),
  selling_cost_center: z.string().optional(),
  income_account: z.string().optional(),
  default_cogs_account: z.string().optional(),
  deferred_expense_account: z.string().optional(),
  deferred_revenue_account: z.string().optional(),
});

export type ItemDefault = z.infer<typeof ItemDefaultSchema>;

export const ItemDefaultInsertSchema = ItemDefaultSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemDefaultInsert = z.infer<typeof ItemDefaultInsertSchema>;
