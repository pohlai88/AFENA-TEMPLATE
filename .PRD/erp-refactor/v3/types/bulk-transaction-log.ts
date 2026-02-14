import { z } from 'zod';

export const BulkTransactionLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  date: z.string().optional(),
  log_entries: z.number().int().optional(),
  succeeded: z.number().int().optional(),
  failed: z.number().int().optional(),
});

export type BulkTransactionLog = z.infer<typeof BulkTransactionLogSchema>;

export const BulkTransactionLogInsertSchema = BulkTransactionLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BulkTransactionLogInsert = z.infer<typeof BulkTransactionLogInsertSchema>;
