import { z } from 'zod';

export const BankAccountTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_type: z.string().optional(),
});

export type BankAccountType = z.infer<typeof BankAccountTypeSchema>;

export const BankAccountTypeInsertSchema = BankAccountTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankAccountTypeInsert = z.infer<typeof BankAccountTypeInsertSchema>;
