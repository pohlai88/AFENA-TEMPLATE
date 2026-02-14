import { z } from 'zod';

export const EmployeeExternalWorkHistorySchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  company_name: z.string().optional(),
  designation: z.string().optional(),
  salary: z.number().optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
  total_experience: z.string().optional(),
});

export type EmployeeExternalWorkHistory = z.infer<typeof EmployeeExternalWorkHistorySchema>;

export const EmployeeExternalWorkHistoryInsertSchema = EmployeeExternalWorkHistorySchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeExternalWorkHistoryInsert = z.infer<typeof EmployeeExternalWorkHistoryInsertSchema>;
