import { z } from 'zod';

export const ProjectTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  project_type: z.string().optional(),
  disabled: z.boolean().optional().default(false),
  tasks: z.array(z.unknown()),
});

export type ProjectTemplate = z.infer<typeof ProjectTemplateSchema>;

export const ProjectTemplateInsertSchema = ProjectTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectTemplateInsert = z.infer<typeof ProjectTemplateInsertSchema>;
