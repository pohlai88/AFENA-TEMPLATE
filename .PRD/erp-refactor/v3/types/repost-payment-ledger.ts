import { z } from 'zod';

export const RepostPaymentLedgerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  posting_date: z.string().default('Today'),
  voucher_type: z.string().optional(),
  add_manually: z.boolean().optional().default(false),
  repost_status: z.enum(['Queued', 'Failed', 'Completed']).optional(),
  repost_error_log: z.string().optional(),
  repost_vouchers: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type RepostPaymentLedger = z.infer<typeof RepostPaymentLedgerSchema>;

export const RepostPaymentLedgerInsertSchema = RepostPaymentLedgerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostPaymentLedgerInsert = z.infer<typeof RepostPaymentLedgerInsertSchema>;
