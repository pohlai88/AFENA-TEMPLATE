import { z } from 'zod';

export const ProjectUpdateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  docstatus: z.number().default(0),
  naming_series: z.string().optional(),
  project: z.string(),
  sent: z.boolean().optional().default(false),
  date: z.string().optional(),
  time: z.string().optional(),
  users: z.array(z.unknown()).optional(),
  amended_from: z.string().optional(),
});

export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>;

export const ProjectUpdateInsertSchema = ProjectUpdateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectUpdateInsert = z.infer<typeof ProjectUpdateInsertSchema>;
