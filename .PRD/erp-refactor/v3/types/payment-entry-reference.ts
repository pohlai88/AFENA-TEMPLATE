import { z } from 'zod';

export const PaymentEntryReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_doctype: z.string(),
  reference_name: z.string(),
  due_date: z.string().optional(),
  bill_no: z.string().optional(),
  payment_term: z.string().optional(),
  payment_term_outstanding: z.number().optional(),
  account_type: z.string().optional(),
  payment_type: z.string().optional(),
  reconcile_effect_on: z.string().optional(),
  total_amount: z.number().optional(),
  outstanding_amount: z.number().optional(),
  allocated_amount: z.number().optional(),
  exchange_rate: z.number().optional(),
  exchange_gain_loss: z.number().optional(),
  account: z.string().optional(),
  payment_request: z.string().optional(),
  payment_request_outstanding: z.number().optional(),
  advance_voucher_type: z.string().optional(),
  advance_voucher_no: z.string().optional(),
});

export type PaymentEntryReference = z.infer<typeof PaymentEntryReferenceSchema>;

export const PaymentEntryReferenceInsertSchema = PaymentEntryReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentEntryReferenceInsert = z.infer<typeof PaymentEntryReferenceInsertSchema>;
