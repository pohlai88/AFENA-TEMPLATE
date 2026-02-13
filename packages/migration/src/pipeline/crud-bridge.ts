/**
 * Bridge between the migration pipeline and the afena-crud kernel.
 *
 * This module defines the function signatures the pipeline needs,
 * without importing afena-crud directly. The caller injects the
 * real implementations at runtime via SqlPipelineConfig.
 *
 * This keeps the migration package loosely coupled to crud — it
 * can be tested with mocks and doesn't pull in the full crud
 * dependency graph at build time.
 */

/**
 * Simplified mutate function for migration use.
 * Maps to afena-crud's mutate(MutationSpec, MutationContext).
 *
 * The migration pipeline calls this with a simplified shape;
 * the bridge adapter (provided by the caller) converts it to
 * the real MutationSpec + MutationContext.
 */
export interface CrudMutateFn {
  (params: {
    actionType: string;
    entityType: string;
    entityId?: string;
    input: Record<string, unknown>;
    expectedVersion?: number;
    idempotencyKey?: string;
  }): Promise<CrudMutateResult>;
}

export interface CrudMutateResult {
  status: 'ok' | 'rejected' | 'error';
  entityId: string | null;
  versionAfter: number | null;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Read a raw DB row by entity type + ID.
 * Maps to afena-crud's readEntity() or a direct Drizzle select.
 *
 * Returns the full row as Record<string, unknown> for snapshot capture.
 * Returns null if not found.
 */
export interface ReadRawRowFn {
  (entityType: string, entityId: string): Promise<Record<string, unknown> | null>;
}

/**
 * Full bridge config injected into SqlMigrationPipeline.
 */
export interface CrudBridge {
  mutate: CrudMutateFn;
  readRawRow: ReadRawRowFn;
}

/**
 * Build a CrudBridge from the real afena-crud exports.
 *
 * Usage (at the app layer, NOT inside packages/migration):
 *
 * ```ts
 * import { mutate, readEntity, buildSystemContext } from 'afena-crud';
 * import { buildCrudBridge } from 'afena-migration';
 *
 * const bridge = buildCrudBridge({
 *   mutate: async (params) => {
 *     const spec = {
 *       actionType: params.actionType,
 *       entityRef: { type: params.entityType, id: params.entityId },
 *       input: params.input,
 *       expectedVersion: params.expectedVersion,
 *       idempotencyKey: params.idempotencyKey,
 *     };
 *     const ctx = buildSystemContext(orgId, 'background_job');
 *     const response = await mutate(spec, ctx);
 *     return {
 *       status: response.receipt?.status ?? 'error',
 *       entityId: response.receipt?.entityId ?? null,
 *       versionAfter: response.receipt?.versionAfter ?? null,
 *       errorCode: response.receipt?.errorCode,
 *       errorMessage: response.error?.message,
 *     };
 *   },
 *   readRawRow: async (entityType, entityId) => {
 *     const response = await readEntity(entityType, entityId, crypto.randomUUID(), { forcePrimary: true });
 *     return response.data ?? null;
 *   },
 * });
 * ```
 */
export function buildCrudBridge(fns: CrudBridge): CrudBridge {
  return fns;
}
