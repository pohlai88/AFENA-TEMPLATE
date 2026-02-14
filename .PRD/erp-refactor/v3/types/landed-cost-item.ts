import { z } from 'zod';

export const LandedCostItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  description: z.string().optional(),
  receipt_document_type: z.enum(['Purchase Invoice', 'Purchase Receipt', 'Stock Entry', 'Subcontracting Receipt']).optional(),
  receipt_document: z.string().optional(),
  qty: z.number().optional(),
  rate: z.number().optional(),
  amount: z.number(),
  is_fixed_asset: z.boolean().optional().default(false),
  applicable_charges: z.number().optional(),
  purchase_receipt_item: z.string().optional(),
  stock_entry_item: z.string().optional(),
  cost_center: z.string().optional(),
});

export type LandedCostItem = z.infer<typeof LandedCostItemSchema>;

export const LandedCostItemInsertSchema = LandedCostItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostItemInsert = z.infer<typeof LandedCostItemInsertSchema>;
