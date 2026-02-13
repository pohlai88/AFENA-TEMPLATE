import { z } from 'zod';

export const CashierClosingPaymentsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  amount: z.number().optional().default(0),
});

export type CashierClosingPayments = z.infer<typeof CashierClosingPaymentsSchema>;

export const CashierClosingPaymentsInsertSchema = CashierClosingPaymentsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CashierClosingPaymentsInsert = z.infer<typeof CashierClosingPaymentsInsertSchema>;
