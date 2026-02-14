import { z } from 'zod';

export const SubcontractingReceiptSuppliedItemSchema = z.object({
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
  conversion_factor: z.number().optional().default(1),
  reference_name: z.string().optional(),
  rate: z.number().optional(),
  amount: z.number().optional(),
  available_qty_for_consumption: z.number().optional().default(0),
  required_qty: z.number().optional(),
  consumed_qty: z.number(),
  current_stock: z.number().optional(),
  serial_and_batch_bundle: z.string().optional(),
  use_serial_batch_fields: z.boolean().optional().default(false),
  subcontracting_order: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  expense_account: z.string().optional(),
  cost_center: z.string().optional(),
});

export type SubcontractingReceiptSuppliedItem = z.infer<typeof SubcontractingReceiptSuppliedItemSchema>;

export const SubcontractingReceiptSuppliedItemInsertSchema = SubcontractingReceiptSuppliedItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SubcontractingReceiptSuppliedItemInsert = z.infer<typeof SubcontractingReceiptSuppliedItemInsertSchema>;
