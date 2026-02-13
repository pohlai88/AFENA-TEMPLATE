import { z } from 'zod';

export const QualityGoalObjectiveSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  objective: z.string(),
  target: z.string().optional(),
  uom: z.string().optional(),
});

export type QualityGoalObjective = z.infer<typeof QualityGoalObjectiveSchema>;

export const QualityGoalObjectiveInsertSchema = QualityGoalObjectiveSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityGoalObjectiveInsert = z.infer<typeof QualityGoalObjectiveInsertSchema>;
