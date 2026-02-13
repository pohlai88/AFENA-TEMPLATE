import { z } from 'zod';

export const BankTransactionMappingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  bank_transaction_field: z.string(),
  file_field: z.string(),
});

export type BankTransactionMapping = z.infer<typeof BankTransactionMappingSchema>;

export const BankTransactionMappingInsertSchema = BankTransactionMappingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BankTransactionMappingInsert = z.infer<typeof BankTransactionMappingInsertSchema>;
