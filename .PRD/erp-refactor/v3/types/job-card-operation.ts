import { z } from 'zod';

export const JobCardOperationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  sub_operation: z.string().optional(),
  completed_qty: z.number().optional(),
  completed_time: z.string().optional(),
  status: z.enum(['Complete', 'Pause', 'Pending', 'Work In Progress']).optional().default('Pending'),
});

export type JobCardOperation = z.infer<typeof JobCardOperationSchema>;

export const JobCardOperationInsertSchema = JobCardOperationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type JobCardOperationInsert = z.infer<typeof JobCardOperationInsertSchema>;
