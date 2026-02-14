import { z } from 'zod';

export const QualityInspectionParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parameter: z.string(),
  parameter_group: z.string().optional(),
  description: z.string().optional(),
});

export type QualityInspectionParameter = z.infer<typeof QualityInspectionParameterSchema>;

export const QualityInspectionParameterInsertSchema = QualityInspectionParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionParameterInsert = z.infer<typeof QualityInspectionParameterInsertSchema>;
