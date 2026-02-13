import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  brand: z.string(),
  image: z.string().optional(),
  description: z.string().optional(),
  brand_defaults: z.array(z.unknown()).optional(),
});

export type Brand = z.infer<typeof BrandSchema>;

export const BrandInsertSchema = BrandSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type BrandInsert = z.infer<typeof BrandInsertSchema>;
