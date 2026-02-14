import { z } from 'zod';

export const ProjectUserSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  user: z.string(),
  email: z.string().optional(),
  image: z.string().optional(),
  full_name: z.string().optional(),
  welcome_email_sent: z.boolean().optional().default(false),
  view_attachments: z.boolean().optional().default(false),
  hide_timesheets: z.boolean().optional().default(false),
  project_status: z.string().optional(),
});

export type ProjectUser = z.infer<typeof ProjectUserSchema>;

export const ProjectUserInsertSchema = ProjectUserSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectUserInsert = z.infer<typeof ProjectUserInsertSchema>;
