import { z } from 'zod';

export const TaxCategorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  title: z.string(),
  disabled: z.boolean().optional().default(false),
});

export type TaxCategory = z.infer<typeof TaxCategorySchema>;

export const TaxCategoryInsertSchema = TaxCategorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaxCategoryInsert = z.infer<typeof TaxCategoryInsertSchema>;
