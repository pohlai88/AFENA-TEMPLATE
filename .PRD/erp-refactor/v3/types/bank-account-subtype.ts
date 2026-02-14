import { z } from 'zod';

export const BankAccountSubtypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account_subtype: z.string().optional(),
});

export type BankAccountSubtype = z.infer<typeof BankAccountSubtypeSchema>;

export const BankAccountSubtypeInsertSchema = BankAccountSubtypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankAccountSubtypeInsert = z.infer<typeof BankAccountSubtypeInsertSchema>;
