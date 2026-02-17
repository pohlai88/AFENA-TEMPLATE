import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const AssessCompetencyParams = z.object({
  employeeId: z.string(),
  competencyId: z.string(),
  assessedLevel: z.number().min(1).max(5),
  assessorId: z.string(),
  evidence: z.string().optional(),
});

export interface CompetencyAssessment {
  assessmentId: string;
  employeeId: string;
  competencyId: string;
  assessedLevel: number;
  requiredLevel: number;
  gap: number;
}

export async function assessCompetency(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AssessCompetencyParams>,
): Promise<Result<CompetencyAssessment>> {
  const validated = AssessCompetencyParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const requiredLevel = 4;
  const gap = requiredLevel - validated.data.assessedLevel;
  
  return ok({ assessmentId: 'comp-assess-1', employeeId: validated.data.employeeId, competencyId: validated.data.competencyId, assessedLevel: validated.data.assessedLevel, requiredLevel, gap: Math.max(0, gap) });
}

export const DefineCompetencyModelParams = z.object({
  modelName: z.string(),
  roleId: z.string(),
  competencies: z.array(z.object({ competencyId: z.string(), requiredLevel: z.number(), weight: z.number() })),
});

export interface CompetencyModel {
  modelId: string;
  modelName: string;
  roleId: string;
  totalCompetencies: number;
  createdAt: Date;
}

export async function defineCompetencyModel(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof DefineCompetencyModelParams>,
): Promise<Result<CompetencyModel>> {
  const validated = DefineCompetencyModelParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ modelId: 'model-1', modelName: validated.data.modelName, roleId: validated.data.roleId, totalCompetencies: validated.data.competencies.length, createdAt: new Date() });
}
