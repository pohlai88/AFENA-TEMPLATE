import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const AssignDataStewardParams = z.object({
  entityType: z.enum(['item', 'customer', 'supplier', 'location', 'uom']),
  domain: z.string(),
  stewardUserId: z.string(),
  responsibilities: z.array(
    z.enum(['approve_changes', 'quality_review', 'deduplication', 'ownership']),
  ),
});

export interface DataSteward {
  stewardId: string;
  userId: string;
  entityType: string;
  domain: string;
  responsibilities: string[];
  assignedDate: Date;
}

export async function assignDataSteward(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof AssignDataStewardParams>,
): Promise<Result<DataSteward>> {
  const validated = AssignDataStewardParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Assign data steward with responsibilities
  return ok({
    stewardId: `steward-${Date.now()}`,
    userId: validated.data.stewardUserId,
    entityType: validated.data.entityType,
    domain: validated.data.domain,
    responsibilities: validated.data.responsibilities,
    assignedDate: new Date(),
  });
}

const CreateChangeRequestParams = z.object({
  entityType: z.enum(['item', 'customer', 'supplier', 'location', 'uom']),
  recordId: z.string(),
  changeType: z.enum(['create', 'update', 'delete', 'merge']),
  proposedChanges: z.record(z.string(), z.any()),
  justification: z.string(),
});

export interface ChangeRequest {
  requestId: string;
  entityType: string;
  recordId: string;
  changeType: string;
  proposedChanges: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: Date;
}

export async function createChangeRequest(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateChangeRequestParams>,
): Promise<Result<ChangeRequest>> {
  const validated = CreateChangeRequestParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create change request for steward approval
  return ok({
    requestId: `cr-${Date.now()}`,
    entityType: validated.data.entityType,
    recordId: validated.data.recordId,
    changeType: validated.data.changeType,
    proposedChanges: validated.data.proposedChanges,
    status: 'pending',
    requestedBy: userId,
    requestedAt: new Date(),
  });
}

const ApproveChangeRequestParams = z.object({
  requestId: z.string(),
  decision: z.enum(['approve', 'reject']),
  comments: z.string().optional(),
});

export interface ChangeApproval {
  requestId: string;
  decision: 'approve' | 'reject';
  approvedBy: string;
  approvedAt: Date;
  comments?: string;
}

export async function approveChangeRequest(
  db: DbInstance,
  orgId: string,
  stewardUserId: string,
  params: z.infer<typeof ApproveChangeRequestParams>,
): Promise<Result<ChangeApproval>> {
  const validated = ApproveChangeRequestParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Process approval and apply changes if approved
  return ok({
    requestId: validated.data.requestId,
    decision: validated.data.decision,
    approvedBy: stewardUserId,
    approvedAt: new Date(),
    comments: validated.data.comments,
  });
}

const GetPendingRequestsParams = z.object({
  entityType: z.enum(['item', 'customer', 'supplier', 'location', 'uom']).optional(),
  stewardUserId: z.string().optional(),
});

export interface PendingRequestsSummary {
  totalPending: number;
  byEntityType: Record<string, number>;
  oldestRequest: Date | null;
  averageWaitTime: number;
}

export async function getPendingRequests(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetPendingRequestsParams>,
): Promise<Result<PendingRequestsSummary>> {
  const validated = GetPendingRequestsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query pending change requests
  return ok({
    totalPending: 15,
    byEntityType: { item: 8, customer: 5, supplier: 2 },
    oldestRequest: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    averageWaitTime: 1.5,
  });
}
