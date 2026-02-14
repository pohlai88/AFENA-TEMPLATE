import { z } from 'zod';

export const PosPaymentMethodSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  default: z.boolean().optional().default(false),
  allow_in_returns: z.boolean().optional().default(false),
  mode_of_payment: z.string(),
});

export type PosPaymentMethod = z.infer<typeof PosPaymentMethodSchema>;

export const PosPaymentMethodInsertSchema = PosPaymentMethodSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PosPaymentMethodInsert = z.infer<typeof PosPaymentMethodInsertSchema>;
