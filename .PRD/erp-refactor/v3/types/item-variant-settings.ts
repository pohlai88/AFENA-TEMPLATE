import { z } from 'zod';

export const ItemVariantSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  do_not_update_variants: z.boolean().optional().default(false),
  allow_rename_attribute_value: z.boolean().optional().default(false),
  allow_different_uom: z.boolean().optional().default(false),
  fields: z.array(z.unknown()).optional(),
});

export type ItemVariantSettings = z.infer<typeof ItemVariantSettingsSchema>;

export const ItemVariantSettingsInsertSchema = ItemVariantSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemVariantSettingsInsert = z.infer<typeof ItemVariantSettingsInsertSchema>;
