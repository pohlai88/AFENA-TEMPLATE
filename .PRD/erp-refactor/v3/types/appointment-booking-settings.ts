import { z } from 'zod';

export const AppointmentBookingSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  enable_scheduling: z.boolean().default(false),
  availability_of_slots: z.array(z.unknown()),
  number_of_agents: z.number().int().default(1),
  agent_list: z.array(z.unknown()),
  holiday_list: z.string(),
  appointment_duration: z.number().int().default(60),
  email_reminders: z.boolean().optional().default(false),
  advance_booking_days: z.number().int().default(7),
  success_redirect_url: z.string().optional(),
});

export type AppointmentBookingSettings = z.infer<typeof AppointmentBookingSettingsSchema>;

export const AppointmentBookingSettingsInsertSchema = AppointmentBookingSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type AppointmentBookingSettingsInsert = z.infer<typeof AppointmentBookingSettingsInsertSchema>;
