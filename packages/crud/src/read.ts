import {
    and,
    batch,
    companies,
    contacts,
    desc,
    eq,
    getDb,
    sql,
} from 'afenda-database';
// TODO: Restore archived entities (branches, currencyExchanges, departments, tasks, videoSettings) when regenerated
import { getLogger } from 'afenda-logger';
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
import { getLegacyRefs } from './read-legacy';

import type { ApiResponse, EntityType } from 'afenda-canon';

/** Table registry for reads — maps entity type to Drizzle table. */
const TABLE_REGISTRY: Record<string, any> = {
  contacts,
  companies,
  // TODO: Restore archived entities when regenerated:
  // 'video-settings': videoSettings,
  // 'currency-exchanges': currencyExchanges,
  // departments,
  // branches,
  // tasks,
  // @entity-gen:table-registry-read
};

/** Enrich rows with legacyRef when includeLegacyRef; no-op when false or empty. */
async function enrichWithLegacyRef(
  conn: ReturnType<typeof getDb>,
  orgId: string,
  entityType: EntityType,
  rows: Record<string, unknown>[],
): Promise<Record<string, unknown>[]> {
  if (rows.length === 0) return rows;
  const ids = rows.map((r) => r.id as string).filter(Boolean);
  if (ids.length === 0) return rows;
  const refs = await getLegacyRefs(conn, orgId, entityType, ids);
  return rows.map((r) => ({
    ...r,
    ...(refs.has(r.id as string) ? { legacyRef: refs.get(r.id as string) } : {}),
  }));
}

/**
 * Read a single entity by ID.
 * Respects RLS (tenant isolation) and soft-delete filter.
 * K-05: one of only 3 public exports from packages/crud.
 */
export async function readEntity(
  entityType: EntityType,
  id: string,
  requestId: string,
  options?: { forcePrimary?: boolean; includeLegacyRef?: boolean },
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

  if (options?.includeLegacyRef) {
    const orgId = (row as { orgId?: string }).orgId;
    if (!orgId) {
      return err('VALIDATION_FAILED', 'org context required', requestId);
    }
    const refs = await getLegacyRefs(conn, orgId, entityType, [id]);
    const legacyRef = refs.get(id);
    return ok(legacyRef ? { ...row, legacyRef } : row, requestId);
  }

  return ok(row, requestId);
}

/**
 * List entities with optional cursor-based pagination.
 * Respects RLS (tenant isolation). Excludes soft-deleted by default.
 * K-05: one of only 3 public exports from packages/crud.
 *
 * **Pagination modes:**
 * - **Offset-based** (default): `{ limit: 50, offset: 100 }` — simple but slow at high offsets
 * - **Cursor-based**: `{ limit: 50, cursor: 'xyz...' }` — O(1) performance, recommended for infinite scroll
 *
 * **Cursor usage:**
 * ```typescript
 * // First page
 * const page1 = await listEntities('contacts', requestId, { limit: 50, orgId: 'org-123' });
 * // Returns: { ok: true, data: [...], meta: { nextCursor: 'abc...' } }
 *
 * // Next page
 * const page2 = await listEntities('contacts', requestId, {
 *   limit: 50,
 *   cursor: page1.meta.nextCursor,
 *   orgId: 'org-123'
 * });
 * ```
 *
 * **Cursor contract (IMPORTANT):**
 * - **Cursor is opaque. Do not parse it client-side.** It's versioned and may change.
 * - **Cursors are only valid for the same filter set** (same orgId + same WHERE conditions).
 * - Changing filters mid-pagination will produce undefined results.
 * - Cursor binds to sort order `(createdAt DESC, id DESC)` — don't reuse across different orderings.
 *
 * **Rules:**
 * - `limit` must be 1..200 (enforced)
 * - `limit=0` is rejected (use `limit=1` for minimal page)
 * - Cursor requires table to have `createdAt` column
 * - **Cursor requires `orgId`** (enforced for filter binding validation)
 * - If both `cursor` and `offset` provided, cursor wins
 * - `includeCount: true` with cursor → `totalCount` is full count (ignores cursor position)
 * - Invalid/malformed cursor → returns `VALIDATION_FAILED` error
 *
 * **Performance:**
 * - Cursor pagination: O(1) regardless of page depth
 * - Offset pagination: O(offset) — degrades on page 100+
 * - Requires composite index `(org_id, created_at DESC, id DESC)` for optimal performance
 *
 * @param entityType - Entity type to query
 * @param requestId - Request correlation ID
 * @param options - Filtering and pagination options
 */
export async function listEntities(
  entityType: EntityType,
  requestId: string,
  options?: {
    includeDeleted?: boolean;
    includeCount?: boolean;
    includeLegacyRef?: boolean;
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

  // Rule A: includeLegacyRef requires org context (derived by caller from tenant context)
  if (options?.includeLegacyRef && !options?.orgId) {
    return err('VALIDATION_FAILED', 'org context required', requestId);
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
        ...(options.includeLegacyRef !== undefined ? { includeLegacyRef: options.includeLegacyRef } : {}),
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

  // Validate limit
  const MAX_LIMIT = 200;
  const DEFAULT_LIMIT = 50;
  const limit = options?.limit ?? DEFAULT_LIMIT;

  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return err('VALIDATION_FAILED', `limit must be integer 1..${MAX_LIMIT}`, requestId);
  }

  const offset = options?.offset ?? 0;

  // Cursor pagination path
  if (options?.cursor) {
    if (!options.orgId) {
      return err('VALIDATION_FAILED', 'cursor requires orgId to validate filter binding', requestId);
    }
    if (process.env.NODE_ENV === 'development' && offset > 0) {
      getLogger().warn('[listEntities] cursor provided; ignoring offset (cursor takes precedence)');
    }
    if (!('createdAt' in table)) {
      return err('VALIDATION_FAILED', 'Cursor pagination not supported: table lacks createdAt', requestId);
    }
    let decoded;
    try {
      decoded = decodeCursor(options.cursor, options.orgId);
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
            v: 1,
            order: 'createdAt_desc_id_desc',
            orgId: options.orgId ?? '',
            createdAt: lastRow.createdAt instanceof Date ? lastRow.createdAt.toISOString() : String(lastRow.createdAt ?? ''),
            id: typeof lastRow.id === 'string' ? lastRow.id : '',
          })
          : undefined;

      const enriched = options?.includeLegacyRef && options?.orgId
        ? await enrichWithLegacyRef(conn, options.orgId, entityType, page as Record<string, unknown>[])
        : page;
      if (cacheKey) {
        setCachedList(cacheKey, { data: enriched, meta: { totalCount, ...(nextCursor ? { nextCursor } : {}) } }).catch(() => { });
      }
      return ok(enriched, requestId, undefined, { totalCount, ...(nextCursor ? { nextCursor } : {}) });
    }

    const rowsPlus = await listQuery;
    const page = rowsPlus.slice(0, limit);
    const hasMore = rowsPlus.length > limit;
    const lastRow = page[page.length - 1] as { createdAt?: Date | string; id?: unknown } | undefined;
    const nextCursor =
      hasMore && page.length > 0 && lastRow
        ? encodeCursor({
          v: 1,
          order: 'createdAt_desc_id_desc',
          orgId: options.orgId ?? '',
          createdAt: lastRow.createdAt instanceof Date ? lastRow.createdAt.toISOString() : String(lastRow.createdAt ?? ''),
          id: typeof lastRow.id === 'string' ? lastRow.id : '',
        })
        : undefined;

    const enrichedCursor = options?.includeLegacyRef && options?.orgId
      ? await enrichWithLegacyRef(conn, options.orgId, entityType, page as Record<string, unknown>[])
      : page;
    if (cacheKey) {
      setCachedList(cacheKey, { data: enrichedCursor, ...(nextCursor ? { meta: { nextCursor } } : {}) }).catch(() => { });
    }
    return ok(enrichedCursor, requestId, undefined, nextCursor ? { nextCursor } : undefined);
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
    const enrichedOffset = options?.includeLegacyRef && options?.orgId
      ? await enrichWithLegacyRef(conn, options.orgId, entityType, rows as Record<string, unknown>[])
      : rows;
    if (cacheKey) {
      setCachedList(cacheKey, { data: enrichedOffset, meta: { totalCount } }).catch(() => { });
    }
    return ok(enrichedOffset, requestId, undefined, { totalCount });
  }

  const rows = await conn
    .select()
    .from(table)
    .where(whereClause ?? sql`true`)
    .limit(limit)
    .offset(offset);

  const enrichedFinal = options?.includeLegacyRef && options?.orgId
    ? await enrichWithLegacyRef(conn, options.orgId!, entityType, rows as Record<string, unknown>[])
    : rows;
  if (cacheKey) {
    setCachedList(cacheKey, { data: enrichedFinal }).catch(() => { });
  }
  return ok(enrichedFinal, requestId);
}
