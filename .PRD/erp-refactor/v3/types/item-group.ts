import { z } from 'zod';

export const ItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group_name: z.string(),
  parent_item_group: z.string().optional(),
  is_group: z.boolean().optional().default(false),
  image: z.string().optional(),
  item_group_defaults: z.array(z.unknown()).optional(),
  taxes: z.array(z.unknown()).optional(),
  lft: z.number().int().optional(),
  old_parent: z.string().optional(),
  rgt: z.number().int().optional(),
});

export type ItemGroup = z.infer<typeof ItemGroupSchema>;

export const ItemGroupInsertSchema = ItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemGroupInsert = z.infer<typeof ItemGroupInsertSchema>;
