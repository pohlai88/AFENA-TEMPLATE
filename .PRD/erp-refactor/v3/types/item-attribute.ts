import { z } from 'zod';

export const ItemAttributeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  attribute_name: z.string(),
  numeric_values: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  from_range: z.number().optional().default(0),
  increment: z.number().optional().default(0),
  to_range: z.number().optional().default(0),
  item_attribute_values: z.array(z.unknown()).optional(),
});

export type ItemAttribute = z.infer<typeof ItemAttributeSchema>;

export const ItemAttributeInsertSchema = ItemAttributeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemAttributeInsert = z.infer<typeof ItemAttributeInsertSchema>;
