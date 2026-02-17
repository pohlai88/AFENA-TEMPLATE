import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const ApproveClosePeriodParams = z.object({
  calendarId: z.string(),
  approvalType: z.enum(['controller', 'cfo', 'audit', 'final']),
  decision: z.enum(['approve', 'reject']),
  comments: z.string(),
  conditions: z.array(z.string()).optional(),
});

export interface CloseApproval {
  approvalId: string;
  calendarId: string;
  approvalType: string;
  decision: string;
  approvedBy: string;
  approvedAt: Date;
  comments: string;
  conditions: string[];
}

export async function approveClosePeriod(
  db: DbInstance,
  orgId: string,
  approverId: string,
  params: z.infer<typeof ApproveClosePeriodParams>,
): Promise<Result<CloseApproval>> {
  const validated = ApproveClosePeriodParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Approve close period at specified level
  return ok({
    approvalId: `appr-${Date.now()}`,
    calendarId: validated.data.calendarId,
    approvalType: validated.data.approvalType,
    decision: validated.data.decision,
    approvedBy: approverId,
    approvedAt: new Date(),
    comments: validated.data.comments,
    conditions: validated.data.conditions ?? [],
  });
}

const GetApprovalStatusParams = z.object({
  calendarId: z.string(),
});

export interface ApprovalStatus {
  calendarId: string;
  approvalChain: Array<{
    approvalType: string;
    required: boolean;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: Date;
  }>;
  canFinalize: boolean;
  pendingApprovals: string[];
}

export async function getApprovalStatus(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetApprovalStatusParams>,
): Promise<Result<ApprovalStatus>> {
  const validated = GetApprovalStatusParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get approval status for close period
  return ok({
    calendarId: validated.data.calendarId,
    approvalChain: [
      {
        approvalType: 'controller',
        required: true,
        status: 'approved',
        approvedBy: 'user-123',
        approvedAt: new Date(),
      },
      { approvalType: 'cfo', required: true, status: 'pending' },
      { approvalType: 'audit', required: false, status: 'pending' },
    ],
    canFinalize: false,
    pendingApprovals: ['cfo'],
  });
}

const CreateChecklistParams = z.object({
  calendarId: z.string(),
  checklistName: z.string(),
  items: z.array(
    z.object({
      itemName: z.string(),
      description: z.string(),
      required: z.boolean(),
    }),
  ),
});

export interface CloseChecklist {
  checklistId: string;
  calendarId: string;
  checklistName: string;
  items: Array<{
    itemId: string;
    itemName: string;
    description: string;
    required: boolean;
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
  }>;
  completionPercentage: number;
}

export async function createChecklist(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateChecklistParams>,
): Promise<Result<CloseChecklist>> {
  const validated = CreateChecklistParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create close checklist
  return ok({
    checklistId: `checklist-${Date.now()}`,
    calendarId: validated.data.calendarId,
    checklistName: validated.data.checklistName,
    items: validated.data.items.map((item, idx) => ({
      itemId: `item-${idx}`,
      itemName: item.itemName,
      description: item.description,
      required: item.required,
      completed: false,
    })),
    completionPercentage: 0,
  });
}

const CompleteChecklistItemParams = z.object({
  checklistId: z.string(),
  itemId: z.string(),
  comments: z.string().optional(),
});

export interface ChecklistItemCompletion {
  checklistId: string;
  itemId: string;
  completed: boolean;
  completedBy: string;
  completedAt: Date;
}

export async function completeChecklistItem(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CompleteChecklistItemParams>,
): Promise<Result<ChecklistItemCompletion>> {
  const validated = CompleteChecklistItemParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Mark checklist item as complete
  return ok({
    checklistId: validated.data.checklistId,
    itemId: validated.data.itemId,
    completed: true,
    completedBy: userId,
    completedAt: new Date(),
  });
}
