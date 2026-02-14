import { z } from 'zod';

export const TransactionDeletionRecordItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  doctype_name: z.string(),
});

export type TransactionDeletionRecordItem = z.infer<typeof TransactionDeletionRecordItemSchema>;

export const TransactionDeletionRecordItemInsertSchema = TransactionDeletionRecordItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordItemInsert = z.infer<typeof TransactionDeletionRecordItemInsertSchema>;
