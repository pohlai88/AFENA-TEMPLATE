import { z } from 'zod';

export const PsoaCostCenterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  cost_center_name: z.string(),
});

export type PsoaCostCenter = z.infer<typeof PsoaCostCenterSchema>;

export const PsoaCostCenterInsertSchema = PsoaCostCenterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type PsoaCostCenterInsert = z.infer<typeof PsoaCostCenterInsertSchema>;
