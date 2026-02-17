import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const SetGoalParams = z.object({
  employeeId: z.string(),
  goalName: z.string(),
  description: z.string(),
  targetDate: z.date(),
  measurable: z.boolean(),
  alignedToCompanyGoal: z.string().optional(),
});

export interface Goal {
  goalId: string;
  employeeId: string;
  goalName: string;
  targetDate: Date;
  status: 'active' | 'achieved' | 'missed' | 'cancelled';
  progress: number;
}

export async function setGoal(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof SetGoalParams>,
): Promise<Result<Goal>> {
  const validated = SetGoalParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ goalId: 'goal-1', employeeId: validated.data.employeeId, goalName: validated.data.goalName, targetDate: validated.data.targetDate, status: 'active', progress: 0 });
}

export const TrackGoalProgressParams = z.object({
  goalId: z.string(),
  progressPercentage: z.number().min(0).max(100),
  milestoneNote: z.string().optional(),
});

export interface GoalProgress {
  goalId: string;
  currentProgress: number;
  lastUpdated: Date;
  onTrack: boolean;
  projectedCompletion: Date;
}

export async function trackGoalProgress(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof TrackGoalProgressParams>,
): Promise<Result<GoalProgress>> {
  const validated = TrackGoalProgressParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const projectedCompletion = new Date();
  projectedCompletion.setMonth(projectedCompletion.getMonth() + 3);
  
  return ok({ goalId: validated.data.goalId, currentProgress: validated.data.progressPercentage, lastUpdated: new Date(), onTrack: validated.data.progressPercentage >= 50, projectedCompletion });
}
