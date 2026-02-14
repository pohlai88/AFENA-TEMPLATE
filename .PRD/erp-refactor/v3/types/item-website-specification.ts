import { z } from 'zod';

export const ItemWebsiteSpecificationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
});

export type ItemWebsiteSpecification = z.infer<typeof ItemWebsiteSpecificationSchema>;

export const ItemWebsiteSpecificationInsertSchema = ItemWebsiteSpecificationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemWebsiteSpecificationInsert = z.infer<typeof ItemWebsiteSpecificationInsertSchema>;
