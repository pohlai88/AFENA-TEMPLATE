import { z } from 'zod';

export const PosClosingEntrySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  period_start_date: z.string(),
  period_end_date: z.string().default('Today'),
  posting_date: z.string().default('Today'),
  posting_time: z.string().default('Now'),
  pos_opening_entry: z.string(),
  status: z.enum(['Draft', 'Submitted', 'Queued', 'Failed', 'Cancelled']).optional().default('Draft'),
  company: z.string(),
  pos_profile: z.string(),
  user: z.string(),
  pos_invoices: z.array(z.unknown()).optional(),
  sales_invoices: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()).optional(),
  total_quantity: z.number().optional(),
  net_total: z.number().optional().default(0),
  total_taxes_and_charges: z.number().optional(),
  grand_total: z.number().optional().default(0),
  payment_reconciliation: z.array(z.unknown()).optional(),
  error_message: z.string().optional(),
  amended_from: z.string().optional(),
});

export type PosClosingEntry = z.infer<typeof PosClosingEntrySchema>;

export const PosClosingEntryInsertSchema = PosClosingEntrySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosClosingEntryInsert = z.infer<typeof PosClosingEntryInsertSchema>;
