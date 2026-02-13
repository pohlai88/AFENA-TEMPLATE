import { z } from 'zod';

export const WebsiteFilterFieldSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  fieldname: z.string().optional(),
});

export type WebsiteFilterField = z.infer<typeof WebsiteFilterFieldSchema>;

export const WebsiteFilterFieldInsertSchema = WebsiteFilterFieldSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WebsiteFilterFieldInsert = z.infer<typeof WebsiteFilterFieldInsertSchema>;
