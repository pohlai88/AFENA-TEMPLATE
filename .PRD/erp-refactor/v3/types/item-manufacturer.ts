import { z } from 'zod';

export const ItemManufacturerSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  item_code: z.string(),
  manufacturer: z.string(),
  manufacturer_part_no: z.string(),
  item_name: z.string().optional(),
  description: z.string().optional(),
  is_default: z.boolean().optional().default(false),
});

export type ItemManufacturer = z.infer<typeof ItemManufacturerSchema>;

export const ItemManufacturerInsertSchema = ItemManufacturerSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ItemManufacturerInsert = z.infer<typeof ItemManufacturerInsertSchema>;
