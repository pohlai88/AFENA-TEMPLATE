import { z } from 'zod';

export const TerritorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  territory_name: z.string(),
  parent_territory: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  territory_manager: z.string().optional(),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
  targets: z.array(z.unknown()).optional(),
});

export type Territory = z.infer<typeof TerritorySchema>;

export const TerritoryInsertSchema = TerritorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TerritoryInsert = z.infer<typeof TerritoryInsertSchema>;
