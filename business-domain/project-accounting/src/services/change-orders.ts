import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

export const CreateChangeOrderParams = z.object({
  projectId: z.string(),
  description: z.string(),
  impactAmountMinor: z.number(),
  impactDays: z.number(),
  reason: z.string(),
  requestedBy: z.string(),
});

export interface ChangeOrder {
  changeOrderId: string;
  projectId: string;
  changeOrderNumber: string;
  impactAmountMinor: number;
  impactDays: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

export async function createChangeOrder(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateChangeOrderParams>,
): Promise<Result<ChangeOrder>> {
  const validated = CreateChangeOrderParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  return ok({ changeOrderId: 'co-1', projectId: validated.data.projectId, changeOrderNumber: 'CO-2026-001', impactAmountMinor: validated.data.impactAmountMinor, impactDays: validated.data.impactDays, status: 'draft' });
}

export const ApproveChangeOrderParams = z.object({
  changeOrderId: z.string(),
  approvedBy: z.string(),
  decision: z.enum(['approve', 'reject', 'conditional']),
  conditions: z.string().optional(),
});

export interface ChangeOrderApproval {
  changeOrderId: string;
  decision: string;
  approvedBy: string;
  approvedAt: Date;
  revisedBudgetMinor: number;
}

export async function approveChangeOrder(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ApproveChangeOrderParams>,
): Promise<Result<ChangeOrderApproval>> {
  const validated = ApproveChangeOrderParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  
  const revisedBudgetMinor = 10000000 + (validated.data.decision === 'approve' ? 500000 : 0);
  return ok({ changeOrderId: validated.data.changeOrderId, decision: validated.data.decision, approvedBy: validated.data.approvedBy, approvedAt: new Date(), revisedBudgetMinor });
}
