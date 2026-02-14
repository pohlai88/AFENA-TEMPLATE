import { z } from 'zod';

export const ProjectsSettingsSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  ignore_workstation_time_overlap: z.boolean().optional().default(false),
  ignore_user_time_overlap: z.boolean().optional().default(false),
  ignore_employee_time_overlap: z.boolean().optional().default(false),
  fetch_timesheet_in_sales_invoice: z.boolean().optional().default(false),
});

export type ProjectsSettings = z.infer<typeof ProjectsSettingsSchema>;

export const ProjectsSettingsInsertSchema = ProjectsSettingsSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type ProjectsSettingsInsert = z.infer<typeof ProjectsSettingsInsertSchema>;
