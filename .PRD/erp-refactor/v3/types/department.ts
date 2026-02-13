import { z } from 'zod';

export const DepartmentSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  department_name: z.string(),
  parent_department: z.string().optional(),
  company: z.string(),
  is_group: z.boolean().optional().default(false),
  disabled: z.boolean().optional().default(false),
  lft: z.number().int().optional(),
  rgt: z.number().int().optional(),
  old_parent: z.string().optional(),
});

export type Department = z.infer<typeof DepartmentSchema>;

export const DepartmentInsertSchema = DepartmentSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DepartmentInsert = z.infer<typeof DepartmentInsertSchema>;
