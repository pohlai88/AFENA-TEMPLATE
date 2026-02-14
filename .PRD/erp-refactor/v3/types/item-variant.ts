import { z } from 'zod';

export const ItemVariantSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_attribute: z.string(),
  item_attribute_value: z.string(),
});

export type ItemVariant = z.infer<typeof ItemVariantSchema>;

export const ItemVariantInsertSchema = ItemVariantSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemVariantInsert = z.infer<typeof ItemVariantInsertSchema>;
