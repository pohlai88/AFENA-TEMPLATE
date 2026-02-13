import { z } from 'zod';

export const AppointmentBookingSlotsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']),
  from_time: z.string(),
  to_time: z.string(),
});

export type AppointmentBookingSlots = z.infer<typeof AppointmentBookingSlotsSchema>;

export const AppointmentBookingSlotsInsertSchema = AppointmentBookingSlotsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AppointmentBookingSlotsInsert = z.infer<typeof AppointmentBookingSlotsInsertSchema>;
