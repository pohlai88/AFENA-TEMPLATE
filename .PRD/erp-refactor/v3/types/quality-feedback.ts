import { z } from 'zod';

export const QualityFeedbackSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  template: z.string(),
  document_type: z.enum(['User', 'Customer']),
  document_name: z.string(),
  parameters: z.array(z.unknown()).optional(),
});

export type QualityFeedback = z.infer<typeof QualityFeedbackSchema>;

export const QualityFeedbackInsertSchema = QualityFeedbackSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityFeedbackInsert = z.infer<typeof QualityFeedbackInsertSchema>;
