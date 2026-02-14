import { z } from 'zod';

export const SouthAfricaVatAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string().optional(),
});

export type SouthAfricaVatAccount = z.infer<typeof SouthAfricaVatAccountSchema>;

export const SouthAfricaVatAccountInsertSchema = SouthAfricaVatAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type SouthAfricaVatAccountInsert = z.infer<typeof SouthAfricaVatAccountInsertSchema>;
