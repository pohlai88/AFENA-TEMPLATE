import { z } from 'zod';

export const EmployeeEducationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  school_univ: z.string().optional(),
  qualification: z.string().optional(),
  level: z.enum(['Graduate', 'Post Graduate', 'Under Graduate']).optional(),
  year_of_passing: z.number().int().optional(),
  class_per: z.string().optional(),
  maj_opt_subj: z.string().optional(),
});

export type EmployeeEducation = z.infer<typeof EmployeeEducationSchema>;

export const EmployeeEducationInsertSchema = EmployeeEducationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type EmployeeEducationInsert = z.infer<typeof EmployeeEducationInsertSchema>;
