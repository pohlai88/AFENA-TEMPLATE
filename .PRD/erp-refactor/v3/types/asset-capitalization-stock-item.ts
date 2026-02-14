import { z } from 'zod';

export const AssetCapitalizationStockItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  warehouse: z.string(),
  purchase_receipt_item: z.string().optional(),
  stock_qty: z.number().optional(),
  actual_qty: z.number().optional(),
  valuation_rate: z.number().optional(),
  amount: z.number().optional().default(0),
  stock_uom: z.string(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  cost_center: z.string().optional(),
});

export type AssetCapitalizationStockItem = z.infer<typeof AssetCapitalizationStockItemSchema>;

export const AssetCapitalizationStockItemInsertSchema = AssetCapitalizationStockItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AssetCapitalizationStockItemInsert = z.infer<typeof AssetCapitalizationStockItemInsertSchema>;
