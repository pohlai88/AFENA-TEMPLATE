import { z } from 'zod';

export const EmployeeGroupTableSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  employee: z.string().optional(),
  employee_name: z.string().optional(),
  user_id: z.string().optional(),
});

export type EmployeeGroupTable = z.infer<typeof EmployeeGroupTableSchema>;

export const EmployeeGroupTableInsertSchema = EmployeeGroupTableSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeGroupTableInsert = z.infer<typeof EmployeeGroupTableInsertSchema>;
