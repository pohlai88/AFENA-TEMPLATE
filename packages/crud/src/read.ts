import { and, batch, companies, contacts, eq, getDb, sql } from 'afena-database';
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
    includeCount?: boolean;
    limit?: number;
    offset?: number;
    orgId?: string;
    forcePrimary?: boolean;
  },
): Promise<ApiResponse> {
  const table = TABLE_REGISTRY[entityType];
  if (!table) {
    return err('VALIDATION_FAILED', `Unknown entity type: ${entityType}`, requestId);
  }

  const conditions: Parameters<typeof and>[0][] = [];
  if (!options?.includeDeleted) {
    conditions.push(eq(table.isDeleted, false));
  }
  if (options?.orgId) {
    conditions.push(eq(table.orgId, options.orgId));
  }
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const conn = getDb(options?.forcePrimary ? { forcePrimary: true } : undefined);
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;

  if (options?.includeCount) {
    // batch() uses dbRo; when forcePrimary we need read-after-write, so run list+count on primary (2 RTT)
    const useBatch = !options?.forcePrimary;
    let rows: unknown[];
    let totalCount: number;

    if (useBatch) {
      const [listResult, countRows] = await batch([
        conn
          .select()
          .from(table)
          .where(whereClause)
          .limit(limit)
          .offset(offset),
        conn
          .select({ count: sql<bigint>`count(*)::bigint` })
          .from(table)
          .where(whereClause),
      ]);
      rows = listResult;
      totalCount = Number((countRows[0] as { count: bigint })?.count ?? 0);
    } else {
      const [listResult, countResult] = await Promise.all([
        conn
          .select()
          .from(table)
          .where(whereClause)
          .limit(limit)
          .offset(offset),
        conn
          .select({ count: sql<bigint>`count(*)::bigint` })
          .from(table)
          .where(whereClause),
      ]);
      rows = listResult;
      totalCount = Number((countResult[0] as { count: bigint })?.count ?? 0);
    }
    return ok(rows, requestId, undefined, { totalCount });
  }

  const rows = await conn
    .select()
    .from(table)
    .where(whereClause)
    .limit(limit)
    .offset(offset);

  return ok(rows, requestId);
}
