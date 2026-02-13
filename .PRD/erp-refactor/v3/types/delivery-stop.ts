import { z } from 'zod';

export const DeliveryStopSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  customer: z.string().optional(),
  address: z.string(),
  locked: z.boolean().optional().default(false),
  customer_address: z.string().optional(),
  visited: z.boolean().optional().default(false),
  delivery_note: z.string().optional(),
  grand_total: z.number().optional(),
  contact: z.string().optional(),
  email_sent_to: z.string().optional(),
  customer_contact: z.string().optional(),
  distance: z.number().optional(),
  estimated_arrival: z.string().optional(),
  lat: z.number().optional(),
  uom: z.string().optional(),
  lng: z.number().optional(),
  details: z.string().optional(),
});

export type DeliveryStop = z.infer<typeof DeliveryStopSchema>;

export const DeliveryStopInsertSchema = DeliveryStopSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryStopInsert = z.infer<typeof DeliveryStopInsertSchema>;
