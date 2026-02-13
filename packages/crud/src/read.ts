import { and, companies, contacts, getDb, eq } from 'afena-database';
// @entity-gen:read-import

import { err, ok } from './envelope';

import type { ApiResponse, EntityType } from 'afena-canon';

/** Table registry for reads — maps entity type to Drizzle table. */
const TABLE_REGISTRY: Record<string, any> = {
  contacts,
  companies,
  // @entity-gen:table-registry-read
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
  options?: { forcePrimary?: boolean },
): Promise<ApiResponse> {
  const table = TABLE_REGISTRY[entityType];
  if (!table) {
    return err('VALIDATION_FAILED', `Unknown entity type: ${entityType}`, requestId);
  }

  const conn = getDb(options?.forcePrimary ? { forcePrimary: true } : undefined);
  const [row] = await conn
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
    forcePrimary?: boolean;
  },
): Promise<ApiResponse> {
  const table = TABLE_REGISTRY[entityType];
  if (!table) {
    return err('VALIDATION_FAILED', `Unknown entity type: ${entityType}`, requestId);
  }

  const whereClause = options?.includeDeleted ? undefined : eq(table.isDeleted, false);

  const conn = getDb(options?.forcePrimary ? { forcePrimary: true } : undefined);
  const rows = await conn
    .select()
    .from(table)
    .where(whereClause)
    .limit(options?.limit ?? 100)
    .offset(options?.offset ?? 0);

  return ok(rows, requestId);
}
