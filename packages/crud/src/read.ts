import { and, batch, companies, contacts, desc, eq, getDb, sql } from 'afena-database';
import { getLogger } from 'afena-logger';
// @entity-gen:read-import

import { buildCursorWhere, decodeCursor, encodeCursor } from './cursor';
import { err, ok } from './envelope';
import {
  buildListCacheKey,
  getCachedList,
  getListCacheVersion,
  isListCacheEnabled,
  setCachedList,
} from './list-cache';

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
 * Supports cursor pagination (Phase 2B): when cursor provided, use limit+1, orderBy, nextCursor.
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
    cursor?: string;
    forcePrimary?: boolean;
  },
): Promise<ApiResponse> {
  const table = TABLE_REGISTRY[entityType];
  if (!table) {
    return err('VALIDATION_FAILED', `Unknown entity type: ${entityType}`, requestId);
  }

  // Phase 2C: Optional cache — orgId required; skip when absent
  let cacheKey: string | null = null;
  if (isListCacheEnabled() && options?.orgId) {
    const version = await getListCacheVersion(entityType, options.orgId);
    cacheKey = buildListCacheKey(
      {
        entityType,
        orgId: options.orgId,
        ...(options.includeDeleted !== undefined ? { includeDeleted: options.includeDeleted } : {}),
        ...(options.includeCount !== undefined ? { includeCount: options.includeCount } : {}),
        ...(options.limit !== undefined ? { limit: options.limit } : {}),
        ...(options.offset !== undefined ? { offset: options.offset } : {}),
        ...(options.cursor !== undefined ? { cursor: options.cursor } : {}),
      },
      version,
    );
    const cached = await getCachedList(cacheKey);
    if (cached) {
      return {
        ok: true,
        data: cached.data,
        meta: { requestId, ...cached.meta },
      };
    }
  }

  const conditions: Parameters<typeof and>[0][] = [];
  // Only apply soft-delete filter if the column exists
  if (!options?.includeDeleted && 'isDeleted' in table) {
    conditions.push(eq(table.isDeleted, false));
  }
  if (options?.orgId) {
    conditions.push(eq(table.orgId, options.orgId));
  }
  const baseWhereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const conn = getDb(options?.forcePrimary ? { forcePrimary: true } : undefined);
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;

  // Cursor pagination path
  if (options?.cursor) {
    if (process.env.NODE_ENV === 'development' && offset > 0) {
      getLogger().warn('[listEntities] cursor provided; ignoring offset (cursor takes precedence)');
    }
    if (!('createdAt' in table)) {
      return err('VALIDATION_FAILED', 'Cursor pagination not supported: table lacks createdAt', requestId);
    }
    let decoded;
    try {
      decoded = decodeCursor(options.cursor);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid cursor';
      return err('VALIDATION_FAILED', msg, requestId);
    }

    const cursorConditions = [...conditions, buildCursorWhere(table, decoded)];
    const listWhereClause = and(...cursorConditions);

    const listQuery = conn
      .select()
      .from(table)
      .where(listWhereClause)
      .orderBy(desc(table.createdAt), desc(table.id))
      .limit(limit + 1);

    if (options?.includeCount) {
      const useBatch = !options?.forcePrimary;
      const countQuery = conn
        .select({ count: sql<bigint>`count(*)::bigint` })
        .from(table)
        .where(baseWhereClause ?? sql`true`);

      let rowsPlus: unknown[];
      let totalCount: number;

      if (useBatch) {
        const [listResult, countRows] = await batch([listQuery, countQuery]);
        rowsPlus = listResult;
        totalCount = Number((countRows[0] as { count: bigint })?.count ?? 0);
      } else {
        const [listResult, countResult] = await Promise.all([listQuery, countQuery]);
        rowsPlus = listResult;
        totalCount = Number((countResult[0] as { count: bigint })?.count ?? 0);
      }

      const page = rowsPlus.slice(0, limit);
      const hasMore = rowsPlus.length > limit;
      const lastRow = page[page.length - 1] as { createdAt?: Date | string; id?: unknown } | undefined;
      const nextCursor =
        hasMore && page.length > 0 && lastRow
          ? encodeCursor({
            createdAt: lastRow.createdAt instanceof Date ? lastRow.createdAt.toISOString() : String(lastRow.createdAt ?? ''),
            id: typeof lastRow.id === 'string' ? lastRow.id : '',
          })
          : undefined;

      if (cacheKey) {
        setCachedList(cacheKey, { data: page, meta: { totalCount, ...(nextCursor ? { nextCursor } : {}) } }).catch(() => { });
      }
      return ok(page, requestId, undefined, { totalCount, ...(nextCursor ? { nextCursor } : {}) });
    }

    const rowsPlus = await listQuery;
    const page = rowsPlus.slice(0, limit);
    const hasMore = rowsPlus.length > limit;
    const lastRow = page[page.length - 1] as { createdAt?: Date | string; id?: unknown } | undefined;
    const nextCursor =
      hasMore && page.length > 0 && lastRow
        ? encodeCursor({
          createdAt: lastRow.createdAt instanceof Date ? lastRow.createdAt.toISOString() : String(lastRow.createdAt ?? ''),
          id: typeof lastRow.id === 'string' ? lastRow.id : '',
        })
        : undefined;

    if (cacheKey) {
      setCachedList(cacheKey, { data: page, ...(nextCursor ? { meta: { nextCursor } } : {}) }).catch(() => { });
    }
    return ok(page, requestId, undefined, nextCursor ? { nextCursor } : undefined);
  }

  // Offset pagination path (cursor not provided)
  const whereClause = baseWhereClause;

  if (options?.includeCount) {
    const useBatch = !options?.forcePrimary;
    let rows: unknown[];
    let totalCount: number;

    if (useBatch) {
      const [listResult, countRows] = await batch([
        conn
          .select()
          .from(table)
          .where(whereClause ?? sql`true`)
          .limit(limit)
          .offset(offset),
        conn
          .select({ count: sql<bigint>`count(*)::bigint` })
          .from(table)
          .where(whereClause ?? sql`true`),
      ]);
      rows = listResult;
      totalCount = Number((countRows[0] as { count: bigint })?.count ?? 0);
    } else {
      const [listResult, countResult] = await Promise.all([
        conn
          .select()
          .from(table)
          .where(whereClause ?? sql`true`)
          .limit(limit)
          .offset(offset),
        conn
          .select({ count: sql<bigint>`count(*)::bigint` })
          .from(table)
          .where(whereClause ?? sql`true`),
      ]);
      rows = listResult;
      totalCount = Number((countResult[0] as { count: bigint })?.count ?? 0);
    }
    if (cacheKey) {
      setCachedList(cacheKey, { data: rows, meta: { totalCount } }).catch(() => { });
    }
    return ok(rows, requestId, undefined, { totalCount });
  }

  const rows = await conn
    .select()
    .from(table)
    .where(whereClause ?? sql`true`)
    .limit(limit)
    .offset(offset);

  if (cacheKey) {
    setCachedList(cacheKey, { data: rows }).catch(() => { });
  }
  return ok(rows, requestId);
}
