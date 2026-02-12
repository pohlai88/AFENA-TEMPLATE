'use server';

import { mutate, readEntity, listEntities } from 'afena-crud';
import { db, sql } from 'afena-database';

import { auth } from '@/lib/auth/server';

import type { ApiResponse, MutationSpec } from 'afena-canon';
import type { MutationContext } from 'afena-crud';

/**
 * Build MutationContext from the current server-side session.
 * All mutations route through this to ensure actor identity is captured.
 */
async function buildContext(): Promise<MutationContext> {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    throw new Error('Unauthorized — no active session');
  }

  const result = await db.execute(
    sql`select auth.org_id() as org_id, auth.org_role() as role`,
  );
  const rows = (result as any).rows as { org_id: string | null; role: string | null }[];
  const orgId = rows?.[0]?.org_id ?? '';
  const role = rows?.[0]?.role ?? '';

  return {
    actor: {
      userId: session.user.id,
      orgId,
      roles: role ? [role] : [],
      email: session.user.email ?? '',
      name: session.user.name ?? session.user.email ?? '',
    },
    requestId: crypto.randomUUID(),
    channel: 'web_ui',
  };
}

// ── Create ──────────────────────────────────────────────────

export async function createContact(input: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}): Promise<ApiResponse> {
  const ctx = await buildContext();
  const spec: MutationSpec = {
    actionType: 'contacts.create',
    entityRef: { type: 'contacts' },
    input,
    idempotencyKey: crypto.randomUUID(),
  };
  return mutate(spec, ctx);
}

// ── Update ──────────────────────────────────────────────────

export async function updateContact(
  id: string,
  expectedVersion: number,
  input: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  },
): Promise<ApiResponse> {
  const ctx = await buildContext();
  const spec: MutationSpec = {
    actionType: 'contacts.update',
    entityRef: { type: 'contacts', id },
    input,
    expectedVersion,
  };
  return mutate(spec, ctx);
}

// ── Delete (soft) ───────────────────────────────────────────

export async function deleteContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  const ctx = await buildContext();
  const spec: MutationSpec = {
    actionType: 'contacts.delete',
    entityRef: { type: 'contacts', id },
    input: {},
    expectedVersion,
  };
  return mutate(spec, ctx);
}

// ── Restore ─────────────────────────────────────────────────

export async function restoreContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  const ctx = await buildContext();
  const spec: MutationSpec = {
    actionType: 'contacts.restore',
    entityRef: { type: 'contacts', id },
    input: {},
    expectedVersion,
  };
  return mutate(spec, ctx);
}

// ── Read ────────────────────────────────────────────────────

export async function getContact(id: string): Promise<ApiResponse> {
  const requestId = crypto.randomUUID();
  return readEntity('contacts', id, requestId);
}

export async function getContacts(options?: {
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  const requestId = crypto.randomUUID();
  return listEntities('contacts', requestId, options);
}

export async function getDeletedContacts(options?: {
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  const requestId = crypto.randomUUID();
  return listEntities('contacts', requestId, {
    ...options,
    includeDeleted: true,
  });
}

// ── Version History ─────────────────────────────────────────

export async function getContactVersions(contactId: string): Promise<ApiResponse> {
  const { db, entityVersions, eq, and, desc } = await import('afena-database');

  try {
    const rows = await db
      .select()
      .from(entityVersions)
      .where(
        and(
          eq(entityVersions.entityType, 'contacts'),
          eq(entityVersions.entityId, contactId),
        ),
      )
      .orderBy(desc(entityVersions.version))
      .limit(50);

    return { ok: true, data: rows, meta: { requestId: crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return {
      ok: false,
      error: { code: 'INTERNAL_ERROR' as const, message },
      meta: { requestId: crypto.randomUUID() },
    };
  }
}

// ── Audit Logs ──────────────────────────────────────────────

export async function getContactAuditLogs(contactId: string): Promise<ApiResponse> {
  const { db, auditLogs, eq, and, desc } = await import('afena-database');

  try {
    const rows = await db
      .select()
      .from(auditLogs)
      .where(
        and(
          eq(auditLogs.entityType, 'contacts'),
          eq(auditLogs.entityId, contactId),
        ),
      )
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return { ok: true, data: rows, meta: { requestId: crypto.randomUUID() } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return {
      ok: false,
      error: { code: 'INTERNAL_ERROR' as const, message },
      meta: { requestId: crypto.randomUUID() },
    };
  }
}
