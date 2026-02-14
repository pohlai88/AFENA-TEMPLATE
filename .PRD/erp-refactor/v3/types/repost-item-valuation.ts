import { z } from 'zod';

export const RepostItemValuationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  based_on: z.enum(['Transaction', 'Item and Warehouse']).default('Transaction'),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  item_code: z.string().optional(),
  warehouse: z.string().optional(),
  posting_date: z.string(),
  posting_time: z.string().optional(),
  status: z.enum(['Queued', 'In Progress', 'Completed', 'Skipped', 'Failed', 'Cancelled']).optional().default('Queued'),
  company: z.string().optional(),
  reposting_reference: z.string().optional(),
  repost_only_accounting_ledgers: z.boolean().optional().default(false),
  allow_negative_stock: z.boolean().optional().default(true),
  via_landed_cost_voucher: z.boolean().optional().default(false),
  allow_zero_rate: z.boolean().optional().default(false),
  recreate_stock_ledgers: z.boolean().optional().default(false),
  amended_from: z.string().optional(),
  error_log: z.string().optional(),
  reposting_data_file: z.string().optional(),
  items_to_be_repost: z.string().optional(),
  distinct_item_and_warehouse: z.string().optional(),
  total_reposting_count: z.number().int().optional(),
  current_index: z.number().int().optional(),
  gl_reposting_index: z.number().int().optional().default(0),
  affected_transactions: z.string().optional(),
});

export type RepostItemValuation = z.infer<typeof RepostItemValuationSchema>;

export const RepostItemValuationInsertSchema = RepostItemValuationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostItemValuationInsert = z.infer<typeof RepostItemValuationInsertSchema>;
