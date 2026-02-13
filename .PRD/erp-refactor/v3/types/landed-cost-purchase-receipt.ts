import { z } from 'zod';

export const LandedCostPurchaseReceiptSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  receipt_document_type: z.enum(['Purchase Invoice', 'Purchase Receipt', 'Stock Entry', 'Subcontracting Receipt']),
  receipt_document: z.string(),
  supplier: z.string().optional(),
  posting_date: z.string().optional(),
  grand_total: z.number().optional(),
});

export type LandedCostPurchaseReceipt = z.infer<typeof LandedCostPurchaseReceiptSchema>;

export const LandedCostPurchaseReceiptInsertSchema = LandedCostPurchaseReceiptSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LandedCostPurchaseReceiptInsert = z.infer<typeof LandedCostPurchaseReceiptInsertSchema>;
