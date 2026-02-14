import { z } from 'zod';

export const TransactionDeletionRecordToDeleteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  doctype_name: z.string().optional(),
  company_field: z.string().optional(),
  document_count: z.number().int().optional(),
  child_doctypes: z.string().optional(),
  deleted: z.boolean().optional().default(false),
});

export type TransactionDeletionRecordToDelete = z.infer<typeof TransactionDeletionRecordToDeleteSchema>;

export const TransactionDeletionRecordToDeleteInsertSchema = TransactionDeletionRecordToDeleteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordToDeleteInsert = z.infer<typeof TransactionDeletionRecordToDeleteInsertSchema>;
