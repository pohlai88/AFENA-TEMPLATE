import { z } from 'zod';

export const JobCardTimeLogSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee: z.string().optional(),
  from_time: z.string().optional(),
  to_time: z.string().optional(),
  time_in_mins: z.number().optional(),
  completed_qty: z.number().optional().default(0),
  operation: z.string().optional(),
});

export type JobCardTimeLog = z.infer<typeof JobCardTimeLogSchema>;

export const JobCardTimeLogInsertSchema = JobCardTimeLogSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardTimeLogInsert = z.infer<typeof JobCardTimeLogInsertSchema>;
