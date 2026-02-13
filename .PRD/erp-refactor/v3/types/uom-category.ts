import { z } from 'zod';

export const UomCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  category_name: z.string(),
});

export type UomCategory = z.infer<typeof UomCategorySchema>;

export const UomCategoryInsertSchema = UomCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type UomCategoryInsert = z.infer<typeof UomCategoryInsertSchema>;
