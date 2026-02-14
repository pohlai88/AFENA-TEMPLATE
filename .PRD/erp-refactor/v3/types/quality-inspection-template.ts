import { z } from 'zod';

export const QualityInspectionTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  quality_inspection_template_name: z.string(),
  item_quality_inspection_parameter: z.array(z.unknown()),
});

export type QualityInspectionTemplate = z.infer<typeof QualityInspectionTemplateSchema>;

export const QualityInspectionTemplateInsertSchema = QualityInspectionTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityInspectionTemplateInsert = z.infer<typeof QualityInspectionTemplateInsertSchema>;
