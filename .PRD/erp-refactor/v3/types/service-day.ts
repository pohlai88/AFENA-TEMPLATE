import { z } from 'zod';

export const ServiceDaySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  workday: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  start_time: z.string(),
  end_time: z.string(),
});

export type ServiceDay = z.infer<typeof ServiceDaySchema>;

export const ServiceDayInsertSchema = ServiceDaySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ServiceDayInsert = z.infer<typeof ServiceDayInsertSchema>;
