---
name: DB Phase 2 Implementation
overview: Implementation plan for Phase 2A (Relational API), Phase 2B (Cursor Pagination), and Phase 2C (optional Cache and Bulk Insert Audit) from db.architecture.md.
status: finalized
todos: []
isProject: false
---

# DB Phase 2 Implementation Plan

Implementation plan for the remaining DB architecture work from [db.architecture.md](.cursor/plans/db.architecture.md) (lines 790-829).

---

## Phase 2A: Relational API — Delivery Note + Lines

**Goal:** Use `db.query.X.findFirst({ with: { Y: true } })` in at least one read path.

**Approach:** Add a dedicated `readDeliveryNoteWithLines` module (no ENTITY_TYPES expansion). Delivery notes are doc entities with posting lifecycle; a standalone read is simpler than full entity-gen.

### Key Files

| File                                                                                               | Change                                                                                                                                                                        |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [packages/database/src/schema/spine-relations.ts](packages/database/src/schema/spine-relations.ts) | Relations already exist: `deliveryNotesRelations` (lines 95-101), `deliveryNoteLinesRelations` (103-112). Relation key for `with` is `lines`.                                 |
| [packages/database/src/db.ts](packages/database/src/db.ts)                                         | `db` and `dbRo` already receive `schema` — relational API is available.                                                                                                       |
| [packages/crud/src/read-delivery-note.ts](packages/crud/src/read-delivery-note.ts) (or `packages/crud/src/readers/delivery-notes.ts`) | **New file.** `readDeliveryNoteWithLines(id, orgId, requestId, options?)` using `getDb().query.deliveryNotes.findFirst({ where: and(eq(deliveryNotes.orgId, orgId), eq(deliveryNotes.id, id)), with: { lines: true } })`. Returns `{ header, lines }` envelope. |
| [packages/crud/src/index.ts](packages/crud/src/index.ts)                                           | Export `readDeliveryNoteWithLines`.                                                                                                                                           |
| [apps/web/app/api/delivery-notes/[id]/route.ts](apps/web/app/api/delivery-notes/[id]/route.ts)     | **New route.** GET handler calling `readDeliveryNoteWithLines`, wrapped with `withAuthOrApiKey`. **Pass orgId explicitly from session context** (e.g. `session.orgId` from `AuthSession`), not by re-querying DB. **Note:** BFF read route (unversioned). If it becomes external contract later, move to `/api/v1/...`. |

### Implementation Notes

- **Composite PK:** Prefer `and(eq(deliveryNotes.orgId, orgId), eq(deliveryNotes.id, id))` when orgId is available from auth context (better index use and unambiguous under composite PK). RLS remains authoritative.
- **Relation name:** Use `with: { lines: true }` (from `deliveryNotesRelations.lines`).
- **Doc entity:** `delivery_notes` uses `docEntityColumns` (no `isDeleted`); no soft-delete filter needed.
- **Return shape:** Return stable envelope `{ ok: true, data: { header, lines } }`. Do not leak raw Drizzle objects.

### Tests

- Unit test: `readDeliveryNoteWithLines` returns header + lines or NOT_FOUND.
- Integration test (optional): Seed delivery note + lines; assert bounded query count (no N+1) and returns header + lines correctly.

---

## Phase 2B: Cursor Pagination

**Goal:** Add optional cursor-based pagination to `listEntities` with stable sort and `meta.nextCursor`.

### Requirements (from db.architecture.md)

- `cursor?: string` in options
- `meta.nextCursor` when more pages exist
- Stable sort: `(createdAt DESC, id DESC)`
- Cursor encoding: `base64url(JSON.stringify({ createdAt, id }))` (createdAt = ISO string)
- Cursor createdAt is ISO string; decode to Date for Drizzle comparisons.
- Invalid cursor → 400

### Key Files

| File                                                                                           | Change                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [packages/canon/src/types/envelope.ts](packages/canon/src/types/envelope.ts)                   | Add `nextCursor?: string` to `ApiResponse.meta`.                                                                                                                                                                |
| [packages/crud/src/read.ts](packages/crud/src/read.ts)                                         | Add `cursor` to options; implement Appendix A/B codec + WHERE builder. Guard: 400 if table lacks `createdAt`. Guard: only add `isDeleted` filter if column exists. **includeCount:** count uses `baseWhereClause` only (Appendix C). |
| [packages/crud/src/envelope.ts](packages/crud/src/envelope.ts)                                 | Extend `ApiMetaExtras` with `nextCursor`.                                                                                                                                                                       |
| [apps/web/src/lib/actions/entity-actions.ts](apps/web/src/lib/actions/entity-actions.ts)       | Add `cursor?: string` to `list()` options.                                                                                                                                                                      |
| [apps/web/src/lib/api/entity-route-handlers.ts](apps/web/src/lib/api/entity-route-handlers.ts) | Parse `cursor` from `?cursor=`, pass to `actions.list()`, return `meta.nextCursor` in response.                                                                                                                 |

### Cursor Logic

- Fetch `limit + 1` rows.
- `page = rows.slice(0, limit)`; `hasMore = rows.length > limit`.
- If `hasMore`, `nextCursor` = encode cursor from `page[page.length - 1]` (last *returned* row, not the extra lookahead row).

```mermaid
flowchart LR
    A[Request with cursor] --> B{Valid base64url JSON?}
    B -->|No| C[400 Invalid cursor]
    B -->|Yes| D[Decode createdAt, id]
    D --> E[WHERE createdAt less or id less]
    E --> F["ORDER BY createdAt DESC, id DESC LIMIT limit+1"]
    F --> G{rows.length > limit?}
    G -->|Yes| H["page = rows.slice(0, limit); nextCursor from page[limit-1]"]
    G -->|No| I[Return rows, no nextCursor]
```

### Cursor Decode Validation (strict)

- Object must have keys `createdAt` and `id`.
- `createdAt`: ISO string (RFC3339-ish). Numeric millis not supported.
- `id`: string (UUID).
- Reject unknown keys (optional but recommended for security surface).

### Compatibility

- **Offset vs cursor:** When both provided, ignore offset (cursor takes precedence). Log warning in dev. Backward compatible.
- **includeCount:** Supported but discouraged for cursor pagination (count can be expensive).
- **createdAt guard:** Cursor pagination only supported for tables that include `createdAt`. Otherwise return 400 with clear error.

### Tests

- Unit: Valid cursor decodes and produces correct WHERE.
- Unit: Invalid cursor returns 400.
- Integration: Cursor pagination returns correct page and `nextCursor` when more data exists.

---

## Phase 2C: Optional (Lower Priority)

### Cache (Upstash)

- **Effort:** Medium | **Impact:** Low–Medium
- Add Redis (RedisLabs + ioredis) for read-heavy `listEntities` / search.
- Requires `REDIS_URL` (e.g. `redis://default:password@host:port`).
- Defer until list/search latency is a bottleneck.
- **Cache keys (deterministic, tenant-safe):** table name, orgId (always), whereClause inputs (normalized), orderBy, limit, cursor/offset, includeCount. **orgId required for cache keys; if orgId absent, caching disabled.** Never cache across orgs.
- TTL defaults: 30–120s. Only cache read-heavy endpoints.

### Bulk Insert Audit

- **Effort:** Low | **Impact:** Low
- Audit handlers (depreciation-engine, revenue-recognition, etc.) that insert in loops.
- **Concrete output:** Create [docs/ops/bulk-insert-audit.md](docs/ops/bulk-insert-audit.md) or `.architecture/bulk-insert-audit.md` listing:
  - candidate file
  - pattern observed (loop insert)
  - proposed batch insert shape
  - estimated impact
- Stops it from being a "nice idea" that never completes.

---

## Recommended Sprint Order

| Order | Task                                   | Effort | Dependencies                         |
| ----- | -------------------------------------- | ------ | ------------------------------------ |
| 1     | Phase 2A: Relational API               | Medium | None                                 |
| 2     | Phase 2B: Cursor Pagination            | Medium | None                                 |
| 3     | Phase 2C: Cache (optional)             | Medium | Phase 2B useful for cache key design |
| 4     | Phase 2C: Bulk Insert Audit (optional) | Low    | None                                 |

---

## Appendix A: Cursor codec (base64url) + strict validation (ISO-only)

```ts
export type CursorPayload = {
  createdAt: string; // ISO string
  id: string;        // UUID
};

export type DecodedCursor = {
  createdAtIso: string; // for encoding/debugging
  createdAt: Date;      // for Drizzle comparisons
  id: string;
};

// base64url helpers (Node 18+ supports 'base64url')
export function encodeCursor(payload: CursorPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function decodeCursor(cursor: string): DecodedCursor {
  let raw: string;
  try {
    raw = Buffer.from(cursor, "base64url").toString("utf8");
  } catch {
    throw new Error("Invalid cursor: not base64url");
  }

  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    throw new Error("Invalid cursor: not JSON");
  }

  if (typeof obj !== "object" || obj === null) {
    throw new Error("Invalid cursor: not an object");
  }

  const rec = obj as Record<string, unknown>;

  // Strict keys (recommended)
  const allowed = new Set(["createdAt", "id"]);
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) throw new Error("Invalid cursor: unknown key");
  }

  const createdAt = rec.createdAt;
  const id = rec.id;

  if (typeof createdAt !== "string" || createdAt.length < 10) {
    throw new Error("Invalid cursor: createdAt");
  }
  const ms = Date.parse(createdAt);
  if (!Number.isFinite(ms)) throw new Error("Invalid cursor: createdAt not ISO");

  if (typeof id !== "string" || id.length < 16) {
    throw new Error("Invalid cursor: id");
  }

  const createdAtIso = createdAt;
  const createdAtDate = new Date(createdAtIso);

  return { createdAtIso, createdAt: createdAtDate, id };
}
```

---

## Appendix B: Drizzle cursor WHERE builder (exact `or(and())` form)

```ts
import { and, or, eq, lt, desc } from "drizzle-orm";
import { decodeCursor, encodeCursor, type DecodedCursor } from "./cursor"; // wherever you place it

// For DESC sort (createdAt, id), "after cursor" means:
// (createdAt < c.createdAt) OR (createdAt = c.createdAt AND id < c.id)
export function buildCursorWhere<TTable extends { createdAt: any; id: any }>(
  table: TTable,
  cursor: DecodedCursor,
) {
  return or(
    lt(table.createdAt, cursor.createdAt),
    and(eq(table.createdAt, cursor.createdAt), lt(table.id, cursor.id)),
  );
}

// Assembly pattern in listEntities (logic reference; final impl may differ by types)
export async function listEntitiesCursorExample({
  conn,
  table,
  options,
}: {
  conn: any;
  table: any;
  options: {
    includeDeleted?: boolean;
    limit?: number;
    orgId?: string;
    cursor?: string;
  };
}) {
  const conditions: any[] = [];

  // Only apply soft-delete filter if the column exists
  if (!options.includeDeleted && "isDeleted" in table) {
    conditions.push(eq(table.isDeleted, false));
  }

  if (options.orgId) {
    conditions.push(eq(table.orgId, options.orgId));
  }

  let cursorDecoded: DecodedCursor | undefined;
  if (options.cursor) {
    if (!("createdAt" in table)) {
      throw new Error("Cursor pagination not supported: table lacks createdAt");
    }
    cursorDecoded = decodeCursor(options.cursor);
    conditions.push(buildCursorWhere(table, cursorDecoded));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const limit = options.limit ?? 50;
  const rowsPlus = await conn
    .select()
    .from(table)
    .where(whereClause)
    .orderBy(desc(table.createdAt), desc(table.id))
    .limit(limit + 1);

  const page = rowsPlus.slice(0, limit);
  const hasMore = rowsPlus.length > limit;

  const nextCursor =
    hasMore && page.length > 0
      ? encodeCursor({
          createdAt:
            page[page.length - 1].createdAt?.toISOString?.() ??
            String(page[page.length - 1].createdAt),
          id: String(page[page.length - 1].id),
        })
      : undefined;

  return { page, nextCursor };
}
```

---

## Appendix C: includeCount + cursor interaction

**Implementation rule:** `totalCount` = total matching rows **ignoring cursor pagination**.

- Build `baseWhereClause` (filters only: orgId, includeDeleted).
  - Apply `isDeleted=false` only if the table has an `isDeleted` column; otherwise omit.
- Build `cursorWhereClause` separately (from `buildCursorWhere`).
- **List query** uses `and(baseWhereClause, cursorWhereClause)` when cursor present.
- **Count query** uses `baseWhereClause` only (never include cursor condition).

---

## Appendix D: getDb / batch context (for cursor + includeCount branching)

```ts
// packages/database/src/db.ts
export function getDb(options?: { forcePrimary?: boolean }): DbInstance {
  return options?.forcePrimary ? db : dbRo;
}

// packages/database/src/batch.ts — uses dbRo only
export function batch(queries: Parameters<typeof dbRo.batch>[0]): ReturnType<typeof dbRo.batch> {
  return dbRo.batch(queries);
}
```

**Rule:** When `forcePrimary: true`, do **not** call `batch()` (it uses `dbRo`). Use `Promise.all` on the primary connection (`db`) instead.

When `forcePrimary: true`, `listEntities` uses `Promise.all` (2 RTT on primary). When false, uses `batch()` (dbRo). Cursor mode + includeCount follows the same branching.

---

## Optional: type-safe column guard

If you want to avoid `as any` and `"createdAt" in table` runtime checks, provide the actual `table` typing from `listEntities` (how `entityType` maps to table) and a **type-safe `hasColumn(table, "createdAt")`** helper pattern can be added.

---

## Out of Scope (This Plan)

- Adding `delivery_notes` to `ENTITY_TYPES` / generic entity CRUD
- Changing sort order for existing offset-based list (remains `createdAt DESC, id DESC` when cursor is used)
- Upstash provisioning or env setup (Phase 2C Cache)
