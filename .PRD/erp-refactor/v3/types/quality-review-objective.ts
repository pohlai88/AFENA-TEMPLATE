import { z } from 'zod';

export const QualityReviewObjectiveSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  objective: z.string().optional(),
  target: z.string().optional(),
  uom: z.string().optional(),
  status: z.enum(['Open', 'Passed', 'Failed']).optional().default('Open'),
  review: z.string().optional(),
});

export type QualityReviewObjective = z.infer<typeof QualityReviewObjectiveSchema>;

export const QualityReviewObjectiveInsertSchema = QualityReviewObjectiveSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityReviewObjectiveInsert = z.infer<typeof QualityReviewObjectiveInsertSchema>;
