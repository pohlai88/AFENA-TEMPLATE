import { z } from 'zod';

export const InvoiceDiscountingSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  posting_date: z.string().default('Today'),
  loan_start_date: z.string().optional(),
  loan_period: z.number().int().optional(),
  loan_end_date: z.string().optional(),
  status: z.enum(['Draft', 'Sanctioned', 'Disbursed', 'Settled', 'Cancelled']).optional(),
  company: z.string(),
  invoices: z.array(z.unknown()),
  total_amount: z.number().optional(),
  bank_charges: z.number().optional(),
  short_term_loan: z.string(),
  bank_account: z.string(),
  bank_charges_account: z.string(),
  accounts_receivable_credit: z.string(),
  accounts_receivable_discounted: z.string(),
  accounts_receivable_unpaid: z.string(),
  amended_from: z.string().optional(),
});

export type InvoiceDiscounting = z.infer<typeof InvoiceDiscountingSchema>;

export const InvoiceDiscountingInsertSchema = InvoiceDiscountingSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type InvoiceDiscountingInsert = z.infer<typeof InvoiceDiscountingInsertSchema>;
