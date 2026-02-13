import { z } from 'zod';

export const PartyTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  party_type: z.string(),
  account_type: z.enum(['Payable', 'Receivable']),
});

export type PartyType = z.infer<typeof PartyTypeSchema>;

export const PartyTypeInsertSchema = PartyTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartyTypeInsert = z.infer<typeof PartyTypeInsertSchema>;
