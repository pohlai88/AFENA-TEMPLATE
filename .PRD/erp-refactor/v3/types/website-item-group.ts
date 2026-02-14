import { z } from 'zod';

export const WebsiteItemGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_group: z.string(),
});

export type WebsiteItemGroup = z.infer<typeof WebsiteItemGroupSchema>;

export const WebsiteItemGroupInsertSchema = WebsiteItemGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WebsiteItemGroupInsert = z.infer<typeof WebsiteItemGroupInsertSchema>;
