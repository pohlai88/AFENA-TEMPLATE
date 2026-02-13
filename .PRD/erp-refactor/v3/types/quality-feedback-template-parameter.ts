import { z } from 'zod';

export const QualityFeedbackTemplateParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parameter: z.string().optional(),
});

export type QualityFeedbackTemplateParameter = z.infer<typeof QualityFeedbackTemplateParameterSchema>;

export const QualityFeedbackTemplateParameterInsertSchema = QualityFeedbackTemplateParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackTemplateParameterInsert = z.infer<typeof QualityFeedbackTemplateParameterInsertSchema>;
