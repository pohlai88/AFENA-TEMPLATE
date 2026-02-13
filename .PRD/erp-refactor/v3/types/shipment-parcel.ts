import { z } from 'zod';

export const ShipmentParcelSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  length: z.number().int().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  weight: z.number(),
  count: z.number().int().default(1),
});

export type ShipmentParcel = z.infer<typeof ShipmentParcelSchema>;

export const ShipmentParcelInsertSchema = ShipmentParcelSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentParcelInsert = z.infer<typeof ShipmentParcelInsertSchema>;
