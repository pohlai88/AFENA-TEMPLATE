import { z } from 'zod';

export const EmployeeInternalWorkHistorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  branch: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export type EmployeeInternalWorkHistory = z.infer<typeof EmployeeInternalWorkHistorySchema>;

export const EmployeeInternalWorkHistoryInsertSchema = EmployeeInternalWorkHistorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeInternalWorkHistoryInsert = z.infer<typeof EmployeeInternalWorkHistoryInsertSchema>;
