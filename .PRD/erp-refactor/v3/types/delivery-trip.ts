import { z } from 'zod';

export const DeliveryTripSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.enum(['MAT-DT-.YYYY.-']).optional(),
  company: z.string(),
  email_notification_sent: z.boolean().optional().default(false),
  driver: z.string().optional(),
  driver_name: z.string().optional(),
  driver_email: z.string().optional(),
  driver_address: z.string().optional(),
  total_distance: z.number().optional(),
  uom: z.string().optional(),
  vehicle: z.string(),
  departure_time: z.string(),
  employee: z.string().optional(),
  delivery_stops: z.array(z.unknown()),
  status: z.enum(['Draft', 'Scheduled', 'In Transit', 'Completed', 'Cancelled']).optional(),
  amended_from: z.string().optional(),
});

export type DeliveryTrip = z.infer<typeof DeliveryTripSchema>;

export const DeliveryTripInsertSchema = DeliveryTripSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DeliveryTripInsert = z.infer<typeof DeliveryTripInsertSchema>;
