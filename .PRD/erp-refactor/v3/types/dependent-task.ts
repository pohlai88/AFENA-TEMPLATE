import { z } from 'zod';

export const DependentTaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  task: z.string().optional(),
});

export type DependentTask = z.infer<typeof DependentTaskSchema>;

export const DependentTaskInsertSchema = DependentTaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DependentTaskInsert = z.infer<typeof DependentTaskInsertSchema>;
