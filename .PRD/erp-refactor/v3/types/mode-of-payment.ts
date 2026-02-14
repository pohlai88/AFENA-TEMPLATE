import { z } from 'zod';

export const ModeOfPaymentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  mode_of_payment: z.string(),
  enabled: z.boolean().optional().default(true),
  type: z.enum(['Cash', 'Bank', 'General', 'Phone']).optional(),
  accounts: z.array(z.unknown()).optional(),
});

export type ModeOfPayment = z.infer<typeof ModeOfPaymentSchema>;

export const ModeOfPaymentInsertSchema = ModeOfPaymentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ModeOfPaymentInsert = z.infer<typeof ModeOfPaymentInsertSchema>;
