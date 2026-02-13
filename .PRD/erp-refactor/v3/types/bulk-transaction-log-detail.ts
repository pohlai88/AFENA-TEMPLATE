import { z } from 'zod';

export const BulkTransactionLogDetailSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_doctype: z.string().optional(),
  transaction_name: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  transaction_status: z.string().optional(),
  error_description: z.string().optional(),
  to_doctype: z.string().optional(),
  retried: z.number().int().optional(),
});

export type BulkTransactionLogDetail = z.infer<typeof BulkTransactionLogDetailSchema>;

export const BulkTransactionLogDetailInsertSchema = BulkTransactionLogDetailSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BulkTransactionLogDetailInsert = z.infer<typeof BulkTransactionLogDetailInsertSchema>;
