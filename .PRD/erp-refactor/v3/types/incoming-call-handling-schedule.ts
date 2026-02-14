import { z } from 'zod';

export const IncomingCallHandlingScheduleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  from_time: z.string().default('9:00:00'),
  to_time: z.string().default('17:00:00'),
  agent_group: z.string(),
});

export type IncomingCallHandlingSchedule = z.infer<typeof IncomingCallHandlingScheduleSchema>;

export const IncomingCallHandlingScheduleInsertSchema = IncomingCallHandlingScheduleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IncomingCallHandlingScheduleInsert = z.infer<typeof IncomingCallHandlingScheduleInsertSchema>;
