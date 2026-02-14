import { z } from 'zod';

export const PosInvoiceMergeLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  posting_date: z.string(),
  posting_time: z.string(),
  merge_invoices_based_on: z.enum(['Customer', 'Customer Group']),
  pos_closing_entry: z.string().optional(),
  customer: z.string(),
  customer_group: z.string().optional(),
  pos_invoices: z.array(z.unknown()),
  consolidated_invoice: z.string().optional(),
  consolidated_credit_note: z.string().optional(),
  amended_from: z.string().optional(),
});

export type PosInvoiceMergeLog = z.infer<typeof PosInvoiceMergeLogSchema>;

export const PosInvoiceMergeLogInsertSchema = PosInvoiceMergeLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosInvoiceMergeLogInsert = z.infer<typeof PosInvoiceMergeLogInsertSchema>;
