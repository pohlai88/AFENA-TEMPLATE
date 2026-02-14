import { z } from 'zod';

export const LedgerMergeAccountsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  account_name: z.string(),
  merged: z.boolean().optional().default(false),
});

export type LedgerMergeAccounts = z.infer<typeof LedgerMergeAccountsSchema>;

export const LedgerMergeAccountsInsertSchema = LedgerMergeAccountsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerMergeAccountsInsert = z.infer<typeof LedgerMergeAccountsInsertSchema>;
