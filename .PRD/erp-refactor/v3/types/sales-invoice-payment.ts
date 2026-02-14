import { z } from 'zod';

export const SalesInvoicePaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default: z.boolean().optional().default(false),
  mode_of_payment: z.string(),
  amount: z.number().default(0),
  reference_no: z.string().optional(),
  account: z.string().optional(),
  type: z.string().optional(),
  base_amount: z.number().optional(),
  clearance_date: z.string().optional(),
});

export type SalesInvoicePayment = z.infer<typeof SalesInvoicePaymentSchema>;

export const SalesInvoicePaymentInsertSchema = SalesInvoicePaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoicePaymentInsert = z.infer<typeof SalesInvoicePaymentInsertSchema>;
