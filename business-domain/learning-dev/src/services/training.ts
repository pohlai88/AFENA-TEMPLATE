import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const EnrollInTrainingParams = z.object({
  employeeId: z.string(),
  courseId: z.string(),
  enrollmentDate: z.date(),
  targetCompletionDate: z.date().optional(),
});

export interface TrainingEnrollment {
  enrollmentId: string;
  employeeId: string;
  courseId: string;
  status: 'enrolled' | 'in-progress' | 'completed';
  enrolledAt: Date;
}

export async function enrollInTraining(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof EnrollInTrainingParams>,
): Promise<Result<TrainingEnrollment>> {
  const validated = EnrollInTrainingParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ enrollmentId: 'enroll-1', employeeId: validated.data.employeeId, courseId: validated.data.courseId, status: 'enrolled', enrolledAt: validated.data.enrollmentDate });
}

export const CompleteTrainingParams = z.object({
  enrollmentId: z.string(),
  completionDate: z.date(),
  score: z.number().min(0).max(100).optional(),
  certificateUrl: z.string().optional(),
});

export interface TrainingCompletion {
  enrollmentId: string;
  completedAt: Date;
  score: number;
  certificationAwarded: boolean;
}

export async function completeTraining(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CompleteTrainingParams>,
): Promise<Result<TrainingCompletion>> {
  const validated = CompleteTrainingParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ enrollmentId: validated.data.enrollmentId, completedAt: validated.data.completionDate, score: validated.data.score || 0, certificationAwarded: true });
}
