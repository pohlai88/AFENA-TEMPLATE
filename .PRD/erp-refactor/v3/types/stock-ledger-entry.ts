import { z } from 'zod';

export const StockLedgerEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  posting_date: z.string().optional(),
  posting_time: z.string().optional(),
  posting_datetime: z.string().optional(),
  is_adjustment_entry: z.boolean().optional().default(false),
  auto_created_serial_and_batch_bundle: z.boolean().optional().default(false),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  serial_and_batch_bundle: z.string().optional(),
  dependant_sle_voucher_detail_no: z.string().optional(),
  recalculate_rate: z.boolean().optional().default(false),
  actual_qty: z.number().optional(),
  qty_after_transaction: z.number().optional(),
  incoming_rate: z.number().optional(),
  outgoing_rate: z.number().optional(),
  valuation_rate: z.number().optional(),
  stock_value: z.number().optional(),
  stock_value_difference: z.number().optional(),
  stock_queue: z.string().optional(),
  company: z.string().optional(),
  stock_uom: z.string().optional(),
  project: z.string().optional(),
  fiscal_year: z.string().optional(),
  has_batch_no: z.boolean().optional().default(false),
  has_serial_no: z.boolean().optional().default(false),
  is_cancelled: z.boolean().optional().default(false),
  to_rename: z.boolean().optional().default(true),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
});

export type StockLedgerEntry = z.infer<typeof StockLedgerEntrySchema>;

export const StockLedgerEntryInsertSchema = StockLedgerEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockLedgerEntryInsert = z.infer<typeof StockLedgerEntryInsertSchema>;
