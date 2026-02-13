import { z } from 'zod';

export const TransactionDeletionRecordSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  status: z.enum(['Queued', 'Running', 'Failed', 'Completed', 'Cancelled']).optional(),
  error_log: z.string().optional(),
  delete_bin_data_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  delete_leads_and_addresses_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  reset_company_default_values_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  clear_notifications_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  initialize_doctypes_table_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  delete_transactions_status: z.enum(['Pending', 'Completed', 'Skipped']).optional().default('Pending'),
  doctypes: z.array(z.unknown()).optional(),
  doctypes_to_delete: z.array(z.unknown()).optional(),
  doctypes_to_be_ignored: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
  process_in_single_transaction: z.boolean().optional().default(false),
});

export type TransactionDeletionRecord = z.infer<typeof TransactionDeletionRecordSchema>;

export const TransactionDeletionRecordInsertSchema = TransactionDeletionRecordSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TransactionDeletionRecordInsert = z.infer<typeof TransactionDeletionRecordInsertSchema>;
