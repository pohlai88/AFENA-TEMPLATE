import { z } from 'zod';

export const ProcessPaymentReconciliationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  company: z.string(),
  party_type: z.string(),
  party: z.string(),
  receivable_payable_account: z.string(),
  default_advance_account: z.string().optional(),
  from_invoice_date: z.string().optional(),
  to_invoice_date: z.string().optional(),
  from_payment_date: z.string().optional(),
  to_payment_date: z.string().optional(),
  cost_center: z.string().optional(),
  bank_cash_account: z.string().optional(),
  status: z.enum(['Queued', 'Running', 'Paused', 'Completed', 'Partially Reconciled', 'Failed', 'Cancelled']).optional(),
  error_log: z.string().optional(),
  amended_from: z.string().optional(),
});

export type ProcessPaymentReconciliation = z.infer<typeof ProcessPaymentReconciliationSchema>;

export const ProcessPaymentReconciliationInsertSchema = ProcessPaymentReconciliationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProcessPaymentReconciliationInsert = z.infer<typeof ProcessPaymentReconciliationInsertSchema>;
