import { z } from 'zod';

export const SerialAndBatchEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  serial_no: z.string().optional(),
  batch_no: z.string().optional(),
  item_code: z.string().optional(),
  qty: z.number().optional().default(1),
  warehouse: z.string().optional(),
  delivered_qty: z.number().optional().default(0),
  incoming_rate: z.number().optional(),
  outgoing_rate: z.number().optional(),
  stock_value_difference: z.number().optional(),
  is_outward: z.boolean().optional().default(false),
  stock_queue: z.string().optional(),
  reference_for_reservation: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  is_cancelled: z.boolean().optional().default(false),
  posting_datetime: z.string().optional(),
  type_of_transaction: z.string().optional(),
  voucher_detail_no: z.string().optional(),
});

export type SerialAndBatchEntry = z.infer<typeof SerialAndBatchEntrySchema>;

export const SerialAndBatchEntryInsertSchema = SerialAndBatchEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SerialAndBatchEntryInsert = z.infer<typeof SerialAndBatchEntryInsertSchema>;
