import { and, contacts, db, eq } from 'afena-database';

import { err, ok } from './envelope';

import type { ApiResponse, EntityType } from 'afena-canon';

/** Table registry for reads — maps entity type to Drizzle table. */
const TABLE_REGISTRY: Record<string, any> = {
  contacts,
};

/**
 * Read a single entity by ID.
 * Respects RLS (tenant isolation) and soft-delete filter.
 * K-05: one of only 3 public exports from packages/crud.
 */
export async function readEntity(
  entityType: EntityType,
  id: string,
  requestId: string,
): Promise<ApiResponse> {
  const table = TABLE_REGISTRY[entityType];
  if (!table) {
    return err('VALIDATION_FAILED', `Unknown entity type: ${entityType}`, requestId);
  }

  const [row] = await db
    .select()
    .from(table)
    .where(and(eq(table.id, id), eq(table.isDeleted, false)))
    .limit(1);

  if (!row) {
    return err('NOT_FOUND', `${entityType} not found: ${id}`, requestId);
  }

  return ok(row, requestId);
}

/**
 * List entities with basic filtering.
 * Respects RLS (tenant isolation). Excludes soft-deleted by default.
 * K-05: one of only 3 public exports from packages/crud.
 */
export async function listEntities(
  entityType: EntityType,
  requestId: string,
  options?: {
    includeDeleted?: boolean;
    limit?: number;
    offset?: number;
  },
): Promise<ApiResponse> {
  const table = TABLE_REGISTRY[entityType];
  if (!table) {
    return err('VALIDATION_FAILED', `Unknown entity type: ${entityType}`, requestId);
  }

  const whereClause = options?.includeDeleted ? undefined : eq(table.isDeleted, false);

  const rows = await db
    .select()
    .from(table)
    .where(whereClause)
    .limit(options?.limit ?? 100)
    .offset(options?.offset ?? 0);

  return ok(rows, requestId);
}
