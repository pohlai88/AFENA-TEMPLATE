import { z } from 'zod';

export const SerialAndBatchBundleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['SABB-.########']).optional().default('SABB-.########'),
  company: z.string(),
  item_name: z.string().optional(),
  has_serial_no: z.boolean().optional().default(false),
  has_batch_no: z.boolean().optional().default(false),
  item_code: z.string(),
  warehouse: z.string().optional(),
  type_of_transaction: z.enum(['Inward', 'Outward', 'Maintenance', 'Asset Repair']),
  entries: z.array(z.unknown()),
  total_qty: z.number().optional(),
  item_group: z.string().optional(),
  avg_rate: z.number().optional(),
  total_amount: z.number().optional(),
  voucher_type: z.string(),
  voucher_no: z.string().optional(),
  voucher_detail_no: z.string().optional(),
  posting_datetime: z.string().optional(),
  returned_against: z.string().optional(),
  is_cancelled: z.boolean().optional().default(false),
  is_packed: z.boolean().optional().default(false),
  is_rejected: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
});

export type SerialAndBatchBundle = z.infer<typeof SerialAndBatchBundleSchema>;

export const SerialAndBatchBundleInsertSchema = SerialAndBatchBundleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SerialAndBatchBundleInsert = z.infer<typeof SerialAndBatchBundleInsertSchema>;
