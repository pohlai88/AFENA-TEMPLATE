import { z } from 'zod';

export const CommunicationMediumTimeslotSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  from_time: z.string(),
  to_time: z.string(),
  employee_group: z.string(),
});

export type CommunicationMediumTimeslot = z.infer<typeof CommunicationMediumTimeslotSchema>;

export const CommunicationMediumTimeslotInsertSchema = CommunicationMediumTimeslotSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type CommunicationMediumTimeslotInsert = z.infer<typeof CommunicationMediumTimeslotInsertSchema>;
