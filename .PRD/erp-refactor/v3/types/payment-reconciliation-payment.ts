import { z } from 'zod';

export const PaymentReconciliationPaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  reference_type: z.string().optional(),
  reference_name: z.string().optional(),
  posting_date: z.string().optional(),
  is_advance: z.string().optional(),
  reference_row: z.string().optional(),
  amount: z.number().optional(),
  difference_amount: z.number().optional(),
  remarks: z.string().optional(),
  currency: z.string().optional(),
  exchange_rate: z.number().optional(),
  cost_center: z.string().optional(),
});

export type PaymentReconciliationPayment = z.infer<typeof PaymentReconciliationPaymentSchema>;

export const PaymentReconciliationPaymentInsertSchema = PaymentReconciliationPaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentReconciliationPaymentInsert = z.infer<typeof PaymentReconciliationPaymentInsertSchema>;
