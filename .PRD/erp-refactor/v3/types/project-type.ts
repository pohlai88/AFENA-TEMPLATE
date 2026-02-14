import { z } from 'zod';

export const ProjectTypeSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  project_type: z.string(),
  description: z.string().optional(),
});

export type ProjectType = z.infer<typeof ProjectTypeSchema>;

export const ProjectTypeInsertSchema = ProjectTypeSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectTypeInsert = z.infer<typeof ProjectTypeInsertSchema>;
