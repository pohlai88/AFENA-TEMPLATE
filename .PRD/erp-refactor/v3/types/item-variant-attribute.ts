import { z } from 'zod';

export const ItemVariantAttributeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  variant_of: z.string().optional(),
  attribute: z.string(),
  attribute_value: z.string().optional(),
  numeric_values: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  from_range: z.number().optional(),
  increment: z.number().optional(),
  to_range: z.number().optional(),
});

export type ItemVariantAttribute = z.infer<typeof ItemVariantAttributeSchema>;

export const ItemVariantAttributeInsertSchema = ItemVariantAttributeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemVariantAttributeInsert = z.infer<typeof ItemVariantAttributeInsertSchema>;
