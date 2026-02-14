import { z } from 'zod';

export const SalesInvoiceAdvanceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string().optional(),
  reference_name: z.string().optional(),
  remarks: z.string().optional(),
  reference_row: z.string().optional(),
  advance_amount: z.number().optional(),
  allocated_amount: z.number().optional(),
  exchange_gain_loss: z.number().optional(),
  ref_exchange_rate: z.number().optional(),
  difference_posting_date: z.string().optional(),
});

export type SalesInvoiceAdvance = z.infer<typeof SalesInvoiceAdvanceSchema>;

export const SalesInvoiceAdvanceInsertSchema = SalesInvoiceAdvanceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SalesInvoiceAdvanceInsert = z.infer<typeof SalesInvoiceAdvanceInsertSchema>;
