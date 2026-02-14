import { z } from 'zod';

export const AppointmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  scheduled_time: z.string(),
  status: z.enum(['Open', 'Unverified', 'Closed']),
  customer_name: z.string(),
  customer_phone_number: z.string().optional(),
  customer_skype: z.string().optional(),
  customer_email: z.string(),
  customer_details: z.string().optional(),
  appointment_with: z.string().optional(),
  party: z.string().optional(),
  calendar_event: z.string().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const AppointmentInsertSchema = AppointmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AppointmentInsert = z.infer<typeof AppointmentInsertSchema>;
