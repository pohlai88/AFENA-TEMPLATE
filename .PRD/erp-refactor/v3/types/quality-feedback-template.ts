import { z } from 'zod';

export const QualityFeedbackTemplateSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template: z.string(),
  parameters: z.array(z.unknown()),
});

export type QualityFeedbackTemplate = z.infer<typeof QualityFeedbackTemplateSchema>;

export const QualityFeedbackTemplateInsertSchema = QualityFeedbackTemplateSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackTemplateInsert = z.infer<typeof QualityFeedbackTemplateInsertSchema>;
