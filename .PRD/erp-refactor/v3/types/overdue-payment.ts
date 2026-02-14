import { z } from 'zod';

export const OverduePaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sales_invoice: z.string(),
  payment_schedule: z.string().optional(),
  dunning_level: z.number().int().optional().default(1),
  payment_term: z.string().optional(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  overdue_days: z.string().optional(),
  mode_of_payment: z.string().optional(),
  invoice_portion: z.number().optional(),
  payment_amount: z.number().optional(),
  outstanding: z.number().optional(),
  paid_amount: z.number().optional(),
  discounted_amount: z.number().optional().default(0),
  interest: z.number().optional(),
});

export type OverduePayment = z.infer<typeof OverduePaymentSchema>;

export const OverduePaymentInsertSchema = OverduePaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type OverduePaymentInsert = z.infer<typeof OverduePaymentInsertSchema>;
