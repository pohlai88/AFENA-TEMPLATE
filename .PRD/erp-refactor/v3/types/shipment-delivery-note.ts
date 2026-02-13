import { z } from 'zod';

export const ShipmentDeliveryNoteSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  delivery_note: z.string(),
  grand_total: z.number().optional(),
});

export type ShipmentDeliveryNote = z.infer<typeof ShipmentDeliveryNoteSchema>;

export const ShipmentDeliveryNoteInsertSchema = ShipmentDeliveryNoteSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ShipmentDeliveryNoteInsert = z.infer<typeof ShipmentDeliveryNoteInsertSchema>;
