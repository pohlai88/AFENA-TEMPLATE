import { z } from 'zod';

export const PaymentOrderSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['PMO-']).default('PMO-'),
  company: z.string(),
  payment_order_type: z.enum(['Payment Request', 'Payment Entry']),
  party: z.string().optional(),
  posting_date: z.string().optional().default('Today'),
  company_bank: z.string().optional(),
  company_bank_account: z.string(),
  account: z.string().optional(),
  references: z.array(z.unknown()),
  amended_from: z.string().optional(),
});

export type PaymentOrder = z.infer<typeof PaymentOrderSchema>;

export const PaymentOrderInsertSchema = PaymentOrderSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentOrderInsert = z.infer<typeof PaymentOrderInsertSchema>;
