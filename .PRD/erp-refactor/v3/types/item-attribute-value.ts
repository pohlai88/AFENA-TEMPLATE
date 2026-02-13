import { z } from 'zod';

export const ItemAttributeValueSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  attribute_value: z.string(),
  abbr: z.string(),
});

export type ItemAttributeValue = z.infer<typeof ItemAttributeValueSchema>;

export const ItemAttributeValueInsertSchema = ItemAttributeValueSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemAttributeValueInsert = z.infer<typeof ItemAttributeValueInsertSchema>;
