import { z } from 'zod';

export const TaskTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  weight: z.number().optional(),
  description: z.string().optional(),
});

export type TaskType = z.infer<typeof TaskTypeSchema>;

export const TaskTypeInsertSchema = TaskTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type TaskTypeInsert = z.infer<typeof TaskTypeInsertSchema>;
