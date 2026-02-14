import { z } from 'zod';

export const JobCardScheduledTimeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  time_in_mins: z.number().optional(),
});

export type JobCardScheduledTime = z.infer<typeof JobCardScheduledTimeSchema>;

export const JobCardScheduledTimeInsertSchema = JobCardScheduledTimeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardScheduledTimeInsert = z.infer<typeof JobCardScheduledTimeInsertSchema>;
