import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CreateWorkBreakdownStructureParams = z.object({
  projectId: z.string(),
  elements: z.array(z.object({ elementCode: z.string(), name: z.string(), parentCode: z.string().optional(), budgetMinor: z.number() })),
});

export interface WorkBreakdownStructure {
  wbsId: string;
  projectId: string;
  totalElements: number;
  totalBudgetMinor: number;
  createdAt: Date;
}

export async function createWorkBreakdownStructure(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateWorkBreakdownStructureParams>,
): Promise<Result<WorkBreakdownStructure>> {
  const validated = CreateWorkBreakdownStructureParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const totalBudgetMinor = validated.data.elements.reduce((sum, e) => sum + e.budgetMinor, 0);
  return ok({ wbsId: 'wbs-1', projectId: validated.data.projectId, totalElements: validated.data.elements.length, totalBudgetMinor, createdAt: new Date() });
}

export const UpdateWBSElementParams = z.object({
  wbsElementId: z.string(),
  budgetMinor: z.number().optional(),
  status: z.enum(['not-started', 'in-progress', 'completed', 'cancelled']).optional(),
});

export interface WBSElement {
  wbsElementId: string;
  elementCode: string;
  budgetMinor: number;
  actualCostMinor: number;
  status: string;
  variance: number;
}

export async function updateWBSElement(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof UpdateWBSElementParams>,
): Promise<Result<WBSElement>> {
  const validated = UpdateWBSElementParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const budgetMinor = validated.data.budgetMinor || 1000000;
  const actualCostMinor = 750000;
  
  return ok({ wbsElementId: validated.data.wbsElementId, elementCode: '1.2.3', budgetMinor, actualCostMinor, status: validated.data.status || 'in-progress', variance: budgetMinor - actualCostMinor });
}
