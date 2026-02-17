import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const RequestAccessParams = z.object({
  requestedRoleIds: z.array(z.string()),
  requestedPermissions: z.array(z.string()).optional(),
  justification: z.string(),
  durationDays: z.number().min(1).max(365).optional(),
  urgency: z.enum(['low', 'normal', 'high', 'critical']).optional(),
});

export interface AccessRequest {
  requestId: string;
  requestedBy: string;
  requestedRoleIds: string[];
  requestedPermissions: string[];
  justification: string;
  urgency: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  requestedAt: Date;
  expiresAt?: Date;
}

export async function requestAccess(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof RequestAccessParams>,
): Promise<Result<AccessRequest>> {
  const validated = RequestAccessParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create access request and route to approvers
  return ok({
    requestId: `req-${Date.now()}`,
    requestedBy: userId,
    requestedRoleIds: validated.data.requestedRoleIds,
    requestedPermissions: validated.data.requestedPermissions ?? [],
    justification: validated.data.justification,
    urgency: validated.data.urgency ?? 'normal',
    status: 'pending',
    requestedAt: new Date(),
    expiresAt: validated.data.durationDays
      ? new Date(Date.now() + validated.data.durationDays * 24 * 60 * 60 * 1000)
      : undefined,
  });
}

const ApproveAccessRequestParams = z.object({
  requestId: z.string(),
  decision: z.enum(['approve', 'reject']),
  comments: z.string().optional(),
});

export interface AccessApproval {
  requestId: string;
  decision: 'approve' | 'reject';
  approvedBy: string;
  approvedAt: Date;
  comments?: string;
  provisioned: boolean;
}

export async function approveAccessRequest(
  db: DbInstance,
  orgId: string,
  approverId: string,
  params: z.infer<typeof ApproveAccessRequestParams>,
): Promise<Result<AccessApproval>> {
  const validated = ApproveAccessRequestParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Approve/reject access request and provision if approved
  return ok({
    requestId: validated.data.requestId,
    decision: validated.data.decision,
    approvedBy: approverId,
    approvedAt: new Date(),
    comments: validated.data.comments,
    provisioned: validated.data.decision === 'approve',
  });
}

const GetPendingApprovalsParams = z.object({
  approverId: z.string().optional(),
  urgency: z.enum(['low', 'normal', 'high', 'critical']).optional(),
});

export interface PendingApprovals {
  requests: Array<{
    requestId: string;
    requestedBy: string;
    requestedRoles: string[];
    justification: string;
    urgency: string;
    requestedAt: Date;
  }>;
  totalPending: number;
  byUrgency: Record<string, number>;
}

export async function getPendingApprovals(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetPendingApprovalsParams>,
): Promise<Result<PendingApprovals>> {
  const validated = GetPendingApprovalsParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get pending access requests for approver
  return ok({
    requests: [],
    totalPending: 12,
    byUrgency: {
      critical: 2,
      high: 4,
      normal: 5,
      low: 1,
    },
  });
}

const BulkProvisionParams = z.object({
  userId: z.string(),
  roleIds: z.array(z.string()),
  permissions: z.array(z.string()).optional(),
  expiresAt: z.date().optional(),
});

export interface BulkProvisionResult {
  userId: string;
  rolesProvisioned: number;
  permissionsGranted: number;
  sodViolations: Array<{ rule: string; severity: string }>;
  success: boolean;
}

export async function bulkProvision(
  db: DbInstance,
  orgId: string,
  provisionedBy: string,
  params: z.infer<typeof BulkProvisionParams>,
): Promise<Result<BulkProvisionResult>> {
  const validated = BulkProvisionParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Provision multiple roles/permissions with SoD checks
  return ok({
    userId: validated.data.userId,
    rolesProvisioned: validated.data.roleIds.length,
    permissionsGranted: validated.data.permissions?.length ?? 0,
    sodViolations: [],
    success: true,
  });
}
