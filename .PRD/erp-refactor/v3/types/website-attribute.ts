import { z } from 'zod';

export const WebsiteAttributeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  attribute: z.string(),
});

export type WebsiteAttribute = z.infer<typeof WebsiteAttributeSchema>;

export const WebsiteAttributeInsertSchema = WebsiteAttributeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type WebsiteAttributeInsert = z.infer<typeof WebsiteAttributeInsertSchema>;
