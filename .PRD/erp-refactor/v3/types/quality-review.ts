import { z } from 'zod';

export const QualityReviewSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  goal: z.string(),
  date: z.string().optional().default('Today'),
  procedure: z.string().optional(),
  status: z.enum(['Open', 'Passed', 'Failed']).optional().default('Open'),
  reviews: z.array(z.unknown()).optional(),
  additional_information: z.string().optional(),
});

export type QualityReview = z.infer<typeof QualityReviewSchema>;

export const QualityReviewInsertSchema = QualityReviewSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityReviewInsert = z.infer<typeof QualityReviewInsertSchema>;
