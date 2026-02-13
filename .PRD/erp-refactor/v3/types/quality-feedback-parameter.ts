import { z } from 'zod';

export const QualityFeedbackParameterSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  parameter: z.string().optional(),
  rating: z.enum(['1', '2', '3', '4', '5']).default('1'),
  feedback: z.string().optional(),
});

export type QualityFeedbackParameter = z.infer<typeof QualityFeedbackParameterSchema>;

export const QualityFeedbackParameterInsertSchema = QualityFeedbackParameterSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackParameterInsert = z.infer<typeof QualityFeedbackParameterInsertSchema>;
