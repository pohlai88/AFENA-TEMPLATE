import { z } from 'zod';

export const ModeOfPaymentAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string().optional(),
  default_account: z.string().optional(),
});

export type ModeOfPaymentAccount = z.infer<typeof ModeOfPaymentAccountSchema>;

export const ModeOfPaymentAccountInsertSchema = ModeOfPaymentAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ModeOfPaymentAccountInsert = z.infer<typeof ModeOfPaymentAccountInsertSchema>;
