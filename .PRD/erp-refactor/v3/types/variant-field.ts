import { z } from 'zod';

export const VariantFieldSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  field_name: z.string(),
});

export type VariantField = z.infer<typeof VariantFieldSchema>;

export const VariantFieldInsertSchema = VariantFieldSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VariantFieldInsert = z.infer<typeof VariantFieldInsertSchema>;
