import { z } from 'zod';

export const StockReconciliationItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  barcode: z.string().optional(),
  has_item_scanned: z.string().optional(),
  item_code: z.string(),
  item_name: z.string().optional(),
  item_group: z.string().optional(),
  warehouse: z.string(),
  qty: z.number().optional(),
  stock_uom: z.string().optional(),
  valuation_rate: z.number().optional(),
  amount: z.number().optional(),
  allow_zero_valuation_rate: z.boolean().optional().default(false),
  use_serial_batch_fields: z.boolean().optional().default(false),
  reconcile_all_serial_batch: z.boolean().optional().default(false),
  serial_and_batch_bundle: z.string().optional(),
  current_serial_and_batch_bundle: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  current_qty: z.number().optional().default(0),
  current_amount: z.number().optional(),
  current_valuation_rate: z.number().optional(),
  current_serial_no: z.string().optional(),
  quantity_difference: z.string().optional(),
  amount_difference: z.number().optional(),
});

export type StockReconciliationItem = z.infer<typeof StockReconciliationItemSchema>;

export const StockReconciliationItemInsertSchema = StockReconciliationItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockReconciliationItemInsert = z.infer<typeof StockReconciliationItemInsertSchema>;
