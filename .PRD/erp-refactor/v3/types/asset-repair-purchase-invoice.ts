import { z } from 'zod';

export const AssetRepairPurchaseInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  purchase_invoice: z.string().optional(),
  expense_account: z.string(),
  repair_cost: z.number(),
});

export type AssetRepairPurchaseInvoice = z.infer<typeof AssetRepairPurchaseInvoiceSchema>;

export const AssetRepairPurchaseInvoiceInsertSchema = AssetRepairPurchaseInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetRepairPurchaseInvoiceInsert = z.infer<typeof AssetRepairPurchaseInvoiceInsertSchema>;
