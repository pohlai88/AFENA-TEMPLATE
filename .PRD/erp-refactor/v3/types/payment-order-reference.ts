import { z } from 'zod';

export const PaymentOrderReferenceSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_doctype: z.string(),
  reference_name: z.string(),
  amount: z.number(),
  supplier: z.string().optional(),
  payment_request: z.string().optional(),
  mode_of_payment: z.string().optional(),
  bank_account: z.string(),
  account: z.string().optional(),
  payment_reference: z.string().optional(),
});

export type PaymentOrderReference = z.infer<typeof PaymentOrderReferenceSchema>;

export const PaymentOrderReferenceInsertSchema = PaymentOrderReferenceSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentOrderReferenceInsert = z.infer<typeof PaymentOrderReferenceInsertSchema>;
