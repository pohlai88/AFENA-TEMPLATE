import { z } from 'zod';

export const PsoaProjectSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  project_name: z.string().optional(),
});

export type PsoaProject = z.infer<typeof PsoaProjectSchema>;

export const PsoaProjectInsertSchema = PsoaProjectSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PsoaProjectInsert = z.infer<typeof PsoaProjectInsertSchema>;
