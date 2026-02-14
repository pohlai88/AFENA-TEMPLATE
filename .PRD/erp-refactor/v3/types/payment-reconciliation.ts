import { z } from 'zod';

export const PaymentReconciliationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  party_type: z.string(),
  party: z.string(),
  receivable_payable_account: z.string(),
  default_advance_account: z.string().optional(),
  from_invoice_date: z.string().optional(),
  from_payment_date: z.string().optional(),
  minimum_invoice_amount: z.number().optional(),
  minimum_payment_amount: z.number().optional(),
  to_invoice_date: z.string().optional(),
  to_payment_date: z.string().optional(),
  maximum_invoice_amount: z.number().optional(),
  maximum_payment_amount: z.number().optional(),
  invoice_limit: z.number().int().optional().default(50),
  payment_limit: z.number().int().optional().default(50),
  bank_cash_account: z.string().optional(),
  cost_center: z.string().optional(),
  project: z.string().optional(),
  invoice_name: z.string().optional(),
  invoices: z.array(z.unknown()).optional(),
  payment_name: z.string().optional(),
  payments: z.array(z.unknown()).optional(),
  allocation: z.array(z.unknown()).optional(),
});

export type PaymentReconciliation = z.infer<typeof PaymentReconciliationSchema>;

export const PaymentReconciliationInsertSchema = PaymentReconciliationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationInsert = z.infer<typeof PaymentReconciliationInsertSchema>;
