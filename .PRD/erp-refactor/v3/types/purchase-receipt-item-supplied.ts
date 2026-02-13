import { z } from 'zod';

export const PurchaseReceiptItemSuppliedSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  main_item_code: z.string().optional(),
  rm_item_code: z.string().optional(),
  item_name: z.string().optional(),
  bom_detail_no: z.string().optional(),
  description: z.string().optional(),
  stock_uom: z.string().optional(),
  conversion_factor: z.number().optional(),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  required_qty: z.number().optional(),
  consumed_qty: z.number(),
  current_stock: z.number().optional(),
  batch_no: z.string().optional(),
  serial_no: z.string().optional(),
  purchase_order: z.string().optional(),
});

export type PurchaseReceiptItemSupplied = z.infer<typeof PurchaseReceiptItemSuppliedSchema>;

export const PurchaseReceiptItemSuppliedInsertSchema = PurchaseReceiptItemSuppliedSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PurchaseReceiptItemSuppliedInsert = z.infer<typeof PurchaseReceiptItemSuppliedInsertSchema>;
