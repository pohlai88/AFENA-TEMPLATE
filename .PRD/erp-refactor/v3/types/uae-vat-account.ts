import { z } from 'zod';

export const UaeVatAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  account: z.string().optional(),
});

export type UaeVatAccount = z.infer<typeof UaeVatAccountSchema>;

export const UaeVatAccountInsertSchema = UaeVatAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UaeVatAccountInsert = z.infer<typeof UaeVatAccountInsertSchema>;
