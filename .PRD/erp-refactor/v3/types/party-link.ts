import { z } from 'zod';

export const PartyLinkSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  primary_role: z.string(),
  secondary_role: z.string().optional(),
  primary_party: z.string().optional(),
  secondary_party: z.string().optional(),
});

export type PartyLink = z.infer<typeof PartyLinkSchema>;

export const PartyLinkInsertSchema = PartyLinkSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartyLinkInsert = z.infer<typeof PartyLinkInsertSchema>;
