import { z } from 'zod';

export const RepostPaymentLedgerItemsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
});

export type RepostPaymentLedgerItems = z.infer<typeof RepostPaymentLedgerItemsSchema>;

export const RepostPaymentLedgerItemsInsertSchema = RepostPaymentLedgerItemsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostPaymentLedgerItemsInsert = z.infer<typeof RepostPaymentLedgerItemsInsertSchema>;
