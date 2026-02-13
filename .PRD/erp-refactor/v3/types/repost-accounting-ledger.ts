import { z } from 'zod';

export const RepostAccountingLedgerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string().optional(),
  delete_cancelled_entries: z.boolean().optional().default(false),
  vouchers: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type RepostAccountingLedger = z.infer<typeof RepostAccountingLedgerSchema>;

export const RepostAccountingLedgerInsertSchema = RepostAccountingLedgerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type RepostAccountingLedgerInsert = z.infer<typeof RepostAccountingLedgerInsertSchema>;
