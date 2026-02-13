import { z } from 'zod';

export const DesignationSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  designation_name: z.string(),
  description: z.string().optional(),
});

export type Designation = z.infer<typeof DesignationSchema>;

export const DesignationInsertSchema = DesignationSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type DesignationInsert = z.infer<typeof DesignationInsertSchema>;
