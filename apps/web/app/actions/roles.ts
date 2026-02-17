'use server';

/* eslint-disable no-restricted-syntax -- roles/permissions/userRoles/userScopes are system admin tables, not domain entities managed by mutate() */

import { revalidatePath } from 'next/cache';

import { db, dbRo, eq, desc, roles, rolePermissions, userRoles, userScopes } from 'afenda-database';
import { getRequestId } from 'afenda-logger';

import type { ApiResponse } from 'afenda-canon';

// ── List Roles ─────────────────────────────────────────

export async function listRoles(): Promise<ApiResponse> {
  try {
    const rows = await dbRo
      .select()
      .from(roles)
      .orderBy(desc(roles.createdAt))
      .limit(100);

    return { ok: true, data: rows, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Get Role ───────────────────────────────────────────

export async function getRole(id: string): Promise<ApiResponse> {
  try {
    const [row] = await dbRo
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!row) {
      return { ok: false, error: { code: 'NOT_FOUND' as const, message: 'Role not found' }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
    }

    return { ok: true, data: row, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Create Role ────────────────────────────────────────

export async function createRole(input: {
  key: string;
  name: string;
}): Promise<ApiResponse> {
  try {
    const [row] = await db
      .insert(roles)
      .values({ key: input.key, name: input.name })
      .returning();

    revalidatePath('/org/[slug]/settings/roles', 'page');
    return { ok: true, data: row, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Delete Role (non-system only) ──────────────────────

export async function deleteRole(id: string): Promise<ApiResponse> {
  try {
    const [existing] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!existing) {
      return { ok: false, error: { code: 'NOT_FOUND' as const, message: 'Role not found' }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
    }
    if (existing.isSystem) {
      return { ok: false, error: { code: 'VALIDATION_FAILED' as const, message: 'Cannot delete system roles' }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
    }

    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    await db.delete(userRoles).where(eq(userRoles.roleId, id));
    await db.delete(roles).where(eq(roles.id, id));

    revalidatePath('/org/[slug]/settings/roles', 'page');
    return { ok: true, data: null, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── List Permissions for a Role ────────────────────────

export async function listRolePermissions(roleId: string): Promise<ApiResponse> {
  try {
    const rows = await dbRo
      .select()
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, roleId))
      .orderBy(rolePermissions.entityType, rolePermissions.verb);

    return { ok: true, data: rows, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Add Permission to Role ─────────────────────────────

export async function addRolePermission(input: {
  roleId: string;
  entityType: string;
  verb: string;
  scope?: string;
}): Promise<ApiResponse> {
  try {
    const [row] = await db
      .insert(rolePermissions)
      .values({
        roleId: input.roleId,
        entityType: input.entityType,
        verb: input.verb,
        ...(input.scope ? { scope: input.scope } : {}),
      })
      .returning();

    revalidatePath('/org/[slug]/settings/roles', 'page');
    return { ok: true, data: row, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Remove Permission from Role ────────────────────────

export async function removeRolePermission(permissionId: string): Promise<ApiResponse> {
  try {
    await db.delete(rolePermissions).where(eq(rolePermissions.id, permissionId));

    revalidatePath('/org/[slug]/settings/roles', 'page');
    return { ok: true, data: null, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── List User-Role Assignments ─────────────────────────

export async function listUserRoles(): Promise<ApiResponse> {
  try {
    const rows = await dbRo
      .select()
      .from(userRoles)
      .orderBy(desc(userRoles.createdAt))
      .limit(200);

    return { ok: true, data: rows, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Assign Role to User ───────────────────────────────

export async function assignUserRole(input: {
  userId: string;
  roleId: string;
}): Promise<ApiResponse> {
  try {
    const [row] = await db
      .insert(userRoles)
      .values({ userId: input.userId, roleId: input.roleId })
      .returning();

    revalidatePath('/org/[slug]/settings/roles', 'page');
    return { ok: true, data: row, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── Remove Role from User ─────────────────────────────

export async function removeUserRole(assignmentId: string): Promise<ApiResponse> {
  try {
    await db.delete(userRoles).where(eq(userRoles.id, assignmentId));

    revalidatePath('/org/[slug]/settings/roles', 'page');
    return { ok: true, data: null, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}

// ── List User Scopes ──────────────────────────────────

export async function listUserScopes(userId: string): Promise<ApiResponse> {
  try {
    const rows = await dbRo
      .select()
      .from(userScopes)
      .where(eq(userScopes.userId, userId))
      .orderBy(userScopes.scopeType);

    return { ok: true, data: rows, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, error: { code: 'INTERNAL_ERROR' as const, message }, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
  }
}
