import { z } from 'zod';

export const QualityActionResolutionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  problem: z.string().optional(),
  resolution: z.string().optional(),
  status: z.enum(['Open', 'Completed']).optional(),
  responsible: z.string().optional(),
  completion_by: z.string().optional(),
});

export type QualityActionResolution = z.infer<typeof QualityActionResolutionSchema>;

export const QualityActionResolutionInsertSchema = QualityActionResolutionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityActionResolutionInsert = z.infer<typeof QualityActionResolutionInsertSchema>;
