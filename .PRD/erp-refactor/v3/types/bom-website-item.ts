import { z } from 'zod';

export const BomWebsiteItemSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string().optional(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  qty: z.number().optional(),
  website_image: z.string().optional(),
});

export type BomWebsiteItem = z.infer<typeof BomWebsiteItemSchema>;

export const BomWebsiteItemInsertSchema = BomWebsiteItemSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BomWebsiteItemInsert = z.infer<typeof BomWebsiteItemInsertSchema>;
