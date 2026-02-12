import { mutate, readEntity, listEntities } from 'afena-crud';
import { db, auditLogs, entityVersions, eq, and, desc } from 'afena-database';

import { buildContext } from './context';

import type { ApiResponse, EntityType, JsonValue, MutationSpec } from 'afena-canon';

/**
 * Generate standard CRUD server actions for any entity type.
 * Eliminates boilerplate — every entity gets the same 8 actions.
 *
 * NOTE: This is NOT a 'use server' file — it's a utility that returns
 * an object of async functions. The actual server action files that
 * call these functions must have 'use server'.
 */
export function generateEntityActions(entityType: EntityType) {
  async function create(input: JsonValue): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.create` as MutationSpec['actionType'],
      entityRef: { type: entityType },
      input,
      idempotencyKey: crypto.randomUUID(),
    };
    return mutate(spec, ctx);
  }

  async function update(
    id: string,
    expectedVersion: number,
    input: JsonValue,
  ): Promise<ApiResponse> {
    const ctx = await buildContext();
    const spec: MutationSpec = {
      actionType: `${entityType}.update` as MutationSpec['actionType'],
      entityRef: { type: entityType, id },
      input,
      expectedVersion,
    };
    return mutate(spec, ctx);
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
    return mutate(spec, ctx);
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
    return mutate(spec, ctx);
  }

  async function read(id: string, forcePrimary?: boolean): Promise<ApiResponse> {
    const requestId = crypto.randomUUID();
    return readEntity(entityType, id, requestId, forcePrimary ? { forcePrimary } : undefined);
  }

  async function list(options?: {
    includeDeleted?: boolean;
    limit?: number;
    offset?: number;
    forcePrimary?: boolean;
  }): Promise<ApiResponse> {
    const requestId = crypto.randomUUID();
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
    return mutate(spec, ctx);
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
    return mutate(spec, ctx);
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
    return mutate(spec, ctx);
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
    return mutate(spec, ctx);
  }

  return {
    create,
    update,
    remove,
    restore,
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
