import { z } from 'zod';

export const IssuePrioritySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  description: z.string().optional(),
});

export type IssuePriority = z.infer<typeof IssuePrioritySchema>;

export const IssuePriorityInsertSchema = IssuePrioritySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type IssuePriorityInsert = z.infer<typeof IssuePriorityInsertSchema>;
