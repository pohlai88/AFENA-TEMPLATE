import { z } from 'zod';

export const QualityActionSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  corrective_preventive: z.enum(['Corrective', 'Preventive']).default('Corrective'),
  review: z.string().optional(),
  feedback: z.string().optional(),
  status: z.enum(['Open', 'Completed']).optional().default('Open'),
  date: z.string().optional().default('Today'),
  goal: z.string().optional(),
  procedure: z.string().optional(),
  resolutions: z.array(z.unknown()).optional(),
});

export type QualityAction = z.infer<typeof QualityActionSchema>;

export const QualityActionInsertSchema = QualityActionSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityActionInsert = z.infer<typeof QualityActionInsertSchema>;
