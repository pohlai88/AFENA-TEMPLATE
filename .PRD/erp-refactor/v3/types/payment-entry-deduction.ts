import { z } from 'zod';

export const PaymentEntryDeductionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string(),
  cost_center: z.string(),
  amount: z.number(),
  is_exchange_gain_loss: z.boolean().optional().default(false),
  description: z.string().optional(),
});

export type PaymentEntryDeduction = z.infer<typeof PaymentEntryDeductionSchema>;

export const PaymentEntryDeductionInsertSchema = PaymentEntryDeductionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PaymentEntryDeductionInsert = z.infer<typeof PaymentEntryDeductionInsertSchema>;
