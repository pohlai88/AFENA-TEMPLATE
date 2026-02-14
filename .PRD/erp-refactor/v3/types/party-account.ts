import { z } from 'zod';

export const PartyAccountSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company: z.string(),
  account: z.string().optional(),
  advance_account: z.string().optional(),
});

export type PartyAccount = z.infer<typeof PartyAccountSchema>;

export const PartyAccountInsertSchema = PartyAccountSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartyAccountInsert = z.infer<typeof PartyAccountInsertSchema>;
