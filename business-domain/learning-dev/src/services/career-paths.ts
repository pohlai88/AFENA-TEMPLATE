import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CreateCareerPathParams = z.object({
  pathName: z.string(),
  startRole: z.string(),
  targetRole: z.string(),
  milestones: z.array(z.object({ role: z.string(), requiredSkills: z.array(z.string()), typicalDuration: z.number() })),
});

export interface CareerPath {
  pathId: string;
  pathName: string;
  totalMilestones: number;
  estimatedYears: number;
}

export async function createCareerPath(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateCareerPathParams>,
): Promise<Result<CareerPath>> {
  const validated = CreateCareerPathParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const estimatedYears = validated.data.milestones.reduce((sum, m) => sum + m.typicalDuration, 0);
  return ok({ pathId: 'path-1', pathName: validated.data.pathName, totalMilestones: validated.data.milestones.length, estimatedYears });
}

export const AssessPathProgressParams = z.object({
  employeeId: z.string(),
  pathId: z.string(),
});

export interface PathProgress {
  employeeId: string;
  pathId: string;
  currentMilestone: number;
  totalMilestones: number;
  completionPercentage: number;
  estimatedCompletion: Date;
}

export async function assessPathProgress(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AssessPathProgressParams>,
): Promise<Result<PathProgress>> {
  const validated = AssessPathProgressParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const estimatedCompletion = new Date();
  estimatedCompletion.setFullYear(estimatedCompletion.getFullYear() + 2);
  
  return ok({ employeeId: validated.data.employeeId, pathId: validated.data.pathId, currentMilestone: 2, totalMilestones: 5, completionPercentage: 40, estimatedCompletion });
}
