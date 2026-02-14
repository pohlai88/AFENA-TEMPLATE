import { z } from 'zod';

export const ShipmentParcelTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parcel_template_name: z.string(),
  length: z.number().int(),
  width: z.number().int(),
  height: z.number().int(),
  weight: z.number(),
});

export type ShipmentParcelTemplate = z.infer<typeof ShipmentParcelTemplateSchema>;

export const ShipmentParcelTemplateInsertSchema = ShipmentParcelTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentParcelTemplateInsert = z.infer<typeof ShipmentParcelTemplateInsertSchema>;
