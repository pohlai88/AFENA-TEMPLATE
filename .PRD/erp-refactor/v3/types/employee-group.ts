import { z } from 'zod';

export const EmployeeGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee_group_name: z.string(),
  employee_list: z.array(z.unknown()).optional(),
});

export type EmployeeGroup = z.infer<typeof EmployeeGroupSchema>;

export const EmployeeGroupInsertSchema = EmployeeGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeGroupInsert = z.infer<typeof EmployeeGroupInsertSchema>;
