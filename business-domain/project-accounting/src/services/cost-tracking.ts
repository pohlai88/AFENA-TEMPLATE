import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const RecordProjectCostParams = z.object({
  projectId: z.string(),
  wbsElementId: z.string().optional(),
  costType: z.enum(['labor', 'material', 'equipment', 'subcontractor', 'overhead']),
  amountMinor: z.number(),
  transactionDate: z.date(),
  description: z.string().optional(),
});

export interface ProjectCost {
  costId: string;
  projectId: string;
  costType: string;
  amountMinor: number;
  recordedAt: Date;
}

export async function recordProjectCost(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof RecordProjectCostParams>,
): Promise<Result<ProjectCost>> {
  const validated = RecordProjectCostParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ costId: 'cost-1', projectId: validated.data.projectId, costType: validated.data.costType, amountMinor: validated.data.amountMinor, recordedAt: validated.data.transactionDate });
}

export const AllocateCostParams = z.object({
  costId: z.string(),
  wbsElementId: z.string(),
  allocationPercentage: z.number().min(0).max(100),
});

export interface CostAllocation {
  allocationId: string;
  costId: string;
  wbsElementId: string;
  allocatedAmountMinor: number;
  allocationPercentage: number;
}

export async function allocateCost(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AllocateCostParams>,
): Promise<Result<CostAllocation>> {
  const validated = AllocateCostParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const allocatedAmountMinor = 1000000 * (validated.data.allocationPercentage / 100);
  return ok({ allocationId: 'alloc-1', costId: validated.data.costId, wbsElementId: validated.data.wbsElementId, allocatedAmountMinor, allocationPercentage: validated.data.allocationPercentage });
}
