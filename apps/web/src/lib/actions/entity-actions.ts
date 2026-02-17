import { after } from 'next/server';

import { mutate, readEntity, listEntities } from 'afenda-crud';
import { db, auditLogs, entityVersions, eq, and, desc } from 'afenda-database';
import { getRequestId } from 'afenda-logger';

import { pokeSearchDrain, shouldPokeSearchDrain } from '@/lib/api/poke-search-drain';

import { buildContext } from './context';

import type { ApiResponse, EntityType, JsonValue, MutationSpec } from 'afenda-canon';

function maybePokeSearchDrain(entityType: EntityType): void {
  if (shouldPokeSearchDrain(entityType)) {
    after(() => pokeSearchDrain());
  }
}

/**
 * Generate standard CRUD server actions for any entity type.
 * Eliminates boilerplate — every entity gets the same 12 actions.
 *
 * NOTE: This is NOT a 'use server' file — it's a utility that returns
 * an object of async functions. The actual server action files that
 * call these functions must have 'use server'.
 */
export function generateEntityActions(entityType: EntityType) {
  async function create(input: Record<string, unknown> | JsonValue): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.create` as MutationSpec['actionType'],
      entityRef: { type: entityType },
      input: input as JsonValue,
      idempotencyKey: crypto.randomUUID(),
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function update(
    id: string,
    expectedVersion: number,
    input: Record<string, unknown> | JsonValue,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.update` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: input as JsonValue,
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function remove(
    id: string,
    expectedVersion: number,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.delete` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: {},
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function restore(
    id: string,
    expectedVersion: number,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.restore` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: {},
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function read(
    id: string,
    options?: { forcePrimary?: boolean; includeLegacyRef?: boolean },
  ): Promise<ApiResponse> {
    const requestId = getRequestId() ?? crypto.randomUUID();
    return readEntity(entityType, id, requestId, options);
  }

  /**
   * List entities with optional pagination.
   * Supports both offset-based and cursor-based pagination.
   *
   * **Cursor pagination:**
   * - Cursor is opaque - do not parse client-side
   * - Only valid for same filter set (don't change orgId between pages)
   * - limit: 1..200 (enforced)
   *
   * @example
   * // Cursor-based (recommended for large lists)
   * const page1 = await list({ limit: 50, orgId });
   * const page2 = await list({ limit: 50, cursor: page1.meta.nextCursor, orgId });
   */
  async function list(options?: {
    includeDeleted?: boolean;
    includeCount?: boolean;
    includeLegacyRef?: boolean;
    limit?: number;
    offset?: number;
    orgId?: string;
    cursor?: string;
    forcePrimary?: boolean;
  }): Promise<ApiResponse> {
    const requestId = getRequestId() ?? crypto.randomUUID();
    return listEntities(entityType, requestId, options);
  }

  async function getVersions(entityId: string): Promise<ApiResponse> {
    try {
      const rows = await db
        .select()
        .from(entityVersions)
        .where(
          and(
            eq(entityVersions.entityType, entityType),
            eq(entityVersions.entityId, entityId),
          ),
        )
        .orderBy(desc(entityVersions.version))
        .limit(50);

      return { ok: true, data: rows, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return {
        ok: false,
        error: { code: 'INTERNAL_ERROR' as const, message },
        meta: { requestId: getRequestId() ?? crypto.randomUUID() },
      };
    }
  }

  async function getAuditLogs(entityId: string): Promise<ApiResponse> {
    try {
      const rows = await db
        .select()
        .from(auditLogs)
        .where(
          and(
            eq(auditLogs.entityType, entityType),
            eq(auditLogs.entityId, entityId),
          ),
        )
        .orderBy(desc(auditLogs.createdAt))
        .limit(100);

      return { ok: true, data: rows, meta: { requestId: getRequestId() ?? crypto.randomUUID() } };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      return {
        ok: false,
        error: { code: 'INTERNAL_ERROR' as const, message },
        meta: { requestId: getRequestId() ?? crypto.randomUUID() },
      };
    }
  }

  async function submit(
    id: string,
    expectedVersion: number,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.submit` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: {},
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function cancel(
    id: string,
    expectedVersion: number,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.cancel` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: {},
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function approve(
    id: string,
    expectedVersion: number,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.approve` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: {},
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  async function reject(
    id: string,
    expectedVersion: number,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.reject` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input: {},
      expectedVersion,
    };
    const result = await mutate(spec, ctx);
    if (result.ok) maybePokeSearchDrain(entityType);
    return result;
  }

  /**
   * Upsert by org — for singleton config entities (global-defaults, *-settings).
   * Finds existing row for org; updates if found, creates if not.
   * Use when UI wants a single "save settings" flow without find-or-create.
   */
  async function ensure(input: Record<string, unknown> | JsonValue): Promise<ApiResponse> {
    const listRes = await list({ limit: 1 });
    if (!listRes.ok) return listRes;
    const items = Array.isArray(listRes.data) ? listRes.data : [];
    const first = items[0] as { id?: string; version?: number } | undefined;
    if (first?.id != null && typeof first.version === 'number') {
      return update(first.id, first.version, input as Record<string, unknown>);
    }
    return create(input);
  }

  return {
    create,
    update,
    remove,
    restore,
    ensure,
    submit,
    cancel,
    approve,
    reject,
    read,
    list,
    getVersions,
    getAuditLogs,
  };
}
