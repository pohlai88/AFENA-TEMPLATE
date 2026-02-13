import { z } from 'zod';

export const ProjectTemplateTaskSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  task: z.string(),
  subject: z.string().optional(),
});

export type ProjectTemplateTask = z.infer<typeof ProjectTemplateTaskSchema>;

export const ProjectTemplateTaskInsertSchema = ProjectTemplateTaskSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectTemplateTaskInsert = z.infer<typeof ProjectTemplateTaskInsertSchema>;
