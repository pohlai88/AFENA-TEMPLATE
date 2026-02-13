import { z } from 'zod';

export const DiscountedInvoiceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string(),
  customer: z.string().optional(),
  posting_date: z.string().optional(),
  outstanding_amount: z.number().optional(),
  debit_to: z.string().optional(),
});

export type DiscountedInvoice = z.infer<typeof DiscountedInvoiceSchema>;

export const DiscountedInvoiceInsertSchema = DiscountedInvoiceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DiscountedInvoiceInsert = z.infer<typeof DiscountedInvoiceInsertSchema>;
