import { z } from 'zod';

export const LedgerHealthSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  voucher_type: z.string().optional(),
  voucher_no: z.string().optional(),
  checked_on: z.string().optional(),
  debit_credit_mismatch: z.boolean().optional().default(false),
  general_and_payment_ledger_mismatch: z.boolean().optional().default(false),
});

export type LedgerHealth = z.infer<typeof LedgerHealthSchema>;

export const LedgerHealthInsertSchema = LedgerHealthSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerHealthInsert = z.infer<typeof LedgerHealthInsertSchema>;
