import { z } from 'zod';

export const QualityGoalSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  goal: z.string(),
  frequency: z.enum(['None', 'Daily', 'Weekly', 'Monthly', 'Quarterly']).optional().default('None'),
  procedure: z.string().optional(),
  weekday: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).optional(),
  date: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']).optional(),
  objectives: z.array(z.unknown()).optional(),
});

export type QualityGoal = z.infer<typeof QualityGoalSchema>;

export const QualityGoalInsertSchema = QualityGoalSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type QualityGoalInsert = z.infer<typeof QualityGoalInsertSchema>;
