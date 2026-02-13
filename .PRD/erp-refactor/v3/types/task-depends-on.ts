import { z } from 'zod';

export const TaskDependsOnSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  task: z.string().optional(),
  subject: z.string().optional(),
  project: z.string().optional(),
});

export type TaskDependsOn = z.infer<typeof TaskDependsOnSchema>;

export const TaskDependsOnInsertSchema = TaskDependsOnSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaskDependsOnInsert = z.infer<typeof TaskDependsOnInsertSchema>;
