import { z } from 'zod';

export const PartySpecificItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  party_type: z.enum(['Customer', 'Supplier']),
  party: z.string(),
  restrict_based_on: z.enum(['Item', 'Item Group', 'Brand']),
  based_on_value: z.string(),
});

export type PartySpecificItem = z.infer<typeof PartySpecificItemSchema>;

export const PartySpecificItemInsertSchema = PartySpecificItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PartySpecificItemInsert = z.infer<typeof PartySpecificItemInsertSchema>;
