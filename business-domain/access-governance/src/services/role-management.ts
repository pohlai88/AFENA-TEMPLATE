import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const CreateRoleParams = z.object({
  roleName: z.string(),
  description: z.string(),
  permissions: z.array(z.string()),
  parentRoleId: z.string().optional(),
  isSystemRole: z.boolean().optional(),
});

export interface Role {
  roleId: string;
  roleName: string;
  description: string;
  permissions: string[];
  parentRoleId?: string;
  isSystemRole: boolean;
  createdBy: string;
  createdAt: Date;
}

export async function createRole(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof CreateRoleParams>,
): Promise<Result<Role>> {
  const validated = CreateRoleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Create role with permissions and hierarchy
  return ok({
    roleId: `role-${Date.now()}`,
    roleName: validated.data.roleName,
    description: validated.data.description,
    permissions: validated.data.permissions,
    parentRoleId: validated.data.parentRoleId,
    isSystemRole: validated.data.isSystemRole ?? false,
    createdBy: userId,
    createdAt: new Date(),
  });
}

const AssignRoleParams = z.object({
  userId: z.string(),
  roleId: z.string(),
  expiresAt: z.date().optional(),
  justification: z.string().optional(),
});

export interface RoleAssignment {
  assignmentId: string;
  userId: string;
  roleId: string;
  assignedBy: string;
  assignedAt: Date;
  expiresAt?: Date;
  justification?: string;
  status: 'active' | 'expired' | 'revoked';
}

export async function assignRole(
  db: DbInstance,
  orgId: string,
  assignedBy: string,
  params: z.infer<typeof AssignRoleParams>,
): Promise<Result<RoleAssignment>> {
  const validated = AssignRoleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Assign role to user with SoD checks
  return ok({
    assignmentId: `assign-${Date.now()}`,
    userId: validated.data.userId,
    roleId: validated.data.roleId,
    assignedBy,
    assignedAt: new Date(),
    expiresAt: validated.data.expiresAt,
    justification: validated.data.justification,
    status: 'active',
  });
}

const RevokeRoleParams = z.object({
  assignmentId: z.string(),
  reason: z.string(),
});

export interface RevokeResult {
  assignmentId: string;
  revoked: boolean;
  revokedBy: string;
  revokedAt: Date;
}

export async function revokeRole(
  db: DbInstance,
  orgId: string,
  revokedBy: string,
  params: z.infer<typeof RevokeRoleParams>,
): Promise<Result<RevokeResult>> {
  const validated = RevokeRoleParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Revoke role assignment
  return ok({
    assignmentId: validated.data.assignmentId,
    revoked: true,
    revokedBy,
    revokedAt: new Date(),
  });
}

const GetUserRolesParams = z.object({
  userId: z.string(),
  includeExpired: z.boolean().optional(),
});

export interface UserRoles {
  userId: string;
  roles: Array<{
    roleId: string;
    roleName: string;
    assignedAt: Date;
    expiresAt?: Date;
    status: string;
  }>;
  effectivePermissions: string[];
  totalRoles: number;
}

export async function getUserRoles(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetUserRolesParams>,
): Promise<Result<UserRoles>> {
  const validated = GetUserRolesParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get user's roles and effective permissions
  return ok({
    userId: validated.data.userId,
    roles: [
      {
        roleId: 'role-001',
        roleName: 'AP Clerk',
        assignedAt: new Date(),
        status: 'active',
      },
    ],
    effectivePermissions: ['payables.read', 'payables.create', 'vendors.read'],
    totalRoles: 1,
  });
}
