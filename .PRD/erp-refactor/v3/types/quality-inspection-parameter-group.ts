import { z } from 'zod';

export const QualityInspectionParameterGroupSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  group_name: z.string(),
});

export type QualityInspectionParameterGroup = z.infer<typeof QualityInspectionParameterGroupSchema>;

export const QualityInspectionParameterGroupInsertSchema = QualityInspectionParameterGroupSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionParameterGroupInsert = z.infer<typeof QualityInspectionParameterGroupInsertSchema>;
