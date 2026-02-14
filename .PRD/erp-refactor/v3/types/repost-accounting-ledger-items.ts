import { z } from 'zod';

export const RepostAccountingLedgerItemsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
});

export type RepostAccountingLedgerItems = z.infer<typeof RepostAccountingLedgerItemsSchema>;

export const RepostAccountingLedgerItemsInsertSchema = RepostAccountingLedgerItemsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAccountingLedgerItemsInsert = z.infer<typeof RepostAccountingLedgerItemsInsertSchema>;
