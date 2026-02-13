import { z } from 'zod';

export const TerritoryItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  territory: z.string().optional(),
});

export type TerritoryItem = z.infer<typeof TerritoryItemSchema>;

export const TerritoryItemInsertSchema = TerritoryItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TerritoryItemInsert = z.infer<typeof TerritoryItemInsertSchema>;
