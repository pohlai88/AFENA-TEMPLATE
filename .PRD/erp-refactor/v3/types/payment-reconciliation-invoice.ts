import { z } from 'zod';

export const PaymentReconciliationInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  invoice_type: z.enum(['Sales Invoice', 'Purchase Invoice', 'Journal Entry']).optional(),
  invoice_number: z.string().optional(),
  invoice_date: z.string().optional(),
  amount: z.number().optional(),
  outstanding_amount: z.number().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional(),
});

export type PaymentReconciliationInvoice = z.infer<typeof PaymentReconciliationInvoiceSchema>;

export const PaymentReconciliationInvoiceInsertSchema = PaymentReconciliationInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationInvoiceInsert = z.infer<typeof PaymentReconciliationInvoiceInsertSchema>;
