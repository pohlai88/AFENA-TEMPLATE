import { z } from 'zod';

export const LedgerMergeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  root_type: z.enum(['Asset', 'Liability', 'Income', 'Expense', 'Equity']),
  account: z.string(),
  account_name: z.string(),
  company: z.string(),
  status: z.enum(['Pending', 'Success', 'Partial Success', 'Error']).optional(),
  is_group: z.boolean().optional().default(false),
  merge_accounts: z.array(z.unknown()),
});

export type LedgerMerge = z.infer<typeof LedgerMergeSchema>;

export const LedgerMergeInsertSchema = LedgerMergeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type LedgerMergeInsert = z.infer<typeof LedgerMergeInsertSchema>;
