import { z } from 'zod';

export const StockReservationEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  voucher_type: z.enum(['Sales Order', 'Work Order', 'Subcontracting Inward Order', 'Production Plan', 'Subcontracting Order']).optional(),
  voucher_no: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  voucher_qty: z.number().optional().default(0),
  available_qty: z.number().optional().default(0),
  reserved_qty: z.number().optional(),
  delivered_qty: z.number().optional().default(0),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  stock_uom: z.string().optional(),
  has_serial_no: z.boolean().optional().default(false),
  has_batch_no: z.boolean().optional().default(false),
  from_voucher_type: z.enum(['Pick List', 'Purchase Receipt', 'Stock Entry', 'Work Order', 'Production Plan', 'Subcontracting Inward Order']).optional(),
  from_voucher_no: z.string().optional(),
  from_voucher_detail_no: z.string().optional(),
  transferred_qty: z.number().optional(),
  consumed_qty: z.number().optional(),
  reservation_based_on: z.enum(['Qty', 'Serial and Batch']).optional().default('Qty'),
  sb_entries: z.array(z.unknown()).optional(),
  company: z.string().optional(),
  project: z.string().optional(),
  status: z.enum(['Draft', 'Partially Reserved', 'Reserved', 'Partially Delivered', 'Partially Used', 'Delivered', 'Cancelled', 'Closed']).optional().default('Draft'),
  amended_from: z.string().optional(),
});

export type StockReservationEntry = z.infer<typeof StockReservationEntrySchema>;

export const StockReservationEntryInsertSchema = StockReservationEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type StockReservationEntryInsert = z.infer<typeof StockReservationEntryInsertSchema>;
