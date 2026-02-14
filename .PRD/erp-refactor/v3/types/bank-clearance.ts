import { z } from 'zod';

export const BankClearanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  account_currency: z.string().optional(),
  from_date: z.string(),
  to_date: z.string(),
  bank_account: z.string().optional(),
  include_reconciled_entries: z.boolean().optional().default(false),
  include_pos_transactions: z.boolean().optional().default(false),
  payment_entries: z.array(z.unknown()).optional(),
});

export type BankClearance = z.infer<typeof BankClearanceSchema>;

export const BankClearanceInsertSchema = BankClearanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankClearanceInsert = z.infer<typeof BankClearanceInsertSchema>;
