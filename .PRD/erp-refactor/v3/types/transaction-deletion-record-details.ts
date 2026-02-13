import { z } from 'zod';

export const TransactionDeletionRecordDetailsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  doctype_name: z.string(),
  docfield_name: z.string().optional(),
  no_of_docs: z.number().int().optional(),
  done: z.boolean().optional().default(false),
});

export type TransactionDeletionRecordDetails = z.infer<typeof TransactionDeletionRecordDetailsSchema>;

export const TransactionDeletionRecordDetailsInsertSchema = TransactionDeletionRecordDetailsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordDetailsInsert = z.infer<typeof TransactionDeletionRecordDetailsInsertSchema>;
