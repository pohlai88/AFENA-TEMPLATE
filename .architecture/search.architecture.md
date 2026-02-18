# afenda Search Engine — Architecture Reference

> **Auto-generated** by `afenda readme gen` at 2026-02-16T12:44:12Z. Do not edit — regenerate instead.
> **Package:** `afenda-search` (`packages/search`)
> **Purpose:** Full-text search helpers, per-entity adapters, and cross-entity search registry.

---

## 1. Architecture Overview

PostgreSQL-native search using tsvector columns + GIN indexes. Each entity registers a search
adapter function. Cross-entity search fans out to all registered adapters in parallel, merges
results by score, and caps at the requested limit.

Two search paths: FTS (queries ≥ 3 chars, no @) and ILIKE fallback (short queries, email searches).
The `search_index` materialized view provides a unified cross-entity search surface.

---

## 2. Key Design Decisions

- **FTS config**: `'simple'` (not `'english'`) — multi-language friendly
- **Adapter pattern**: Each entity provides a `searchFn(query, limit) → SearchResult[]`
- **Cross-entity**: `Promise.all` fan-out with per-adapter error isolation (`.catch(() => [])`)
- **Score normalization**: FTS uses `ts_rank`, ILIKE uses position-based scoring (1 - idx \* 0.01)
- **Read replica**: All search queries use `dbRo` (never the RW connection)

---

## 3. Package Structure (live)

| Metric                 | Value            |
| ---------------------- | ---------------- |
| **Source files**       | 10               |
| **Test files**         | 0                |
| **Source directories** | adapters, worker |

```
packages/search/src/
├── adapters/
├── worker/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export                         | Source                    |
| ------------------------------ | ------------------------- |
| `toTsQuery`                    | `./fts`                   |
| `ftsWhere`                     | `./fts`                   |
| `ftsRank`                      | `./fts`                   |
| `ilikeFallback`                | `./fts`                   |
| `registerSearchableEntity`     | `./registry`              |
| `getRegisteredEntityTypes`     | `./registry`              |
| `crossEntitySearch`            | `./registry`              |
| `searchAll`                    | `./adapters/cross-entity` |
| `searchContacts`               | `./adapters/contacts`     |
| `refreshSearchIndex`           | `./refresh`               |
| `backfillSearchDocuments`      | `./backfill`              |
| `backfillSearchDocumentsChunk` | `./backfill`              |
| `isSearchDocumentsEmpty`       | `./backfill`              |
| `isBackfillComplete`           | `./backfill`              |
| `processSearchOutboxBatch`     | `./worker/search-worker`  |
| `drainSearchOutbox`            | `./worker/search-worker`  |
| `runSearchWorker`              | `./worker/search-worker`  |
| `type SearchWorkerConfig`      | `./worker/search-worker`  |
| `type SearchOutboxEvent`       | `./worker/search-worker`  |

### Type Exports

| Type                     | Source    |
| ------------------------ | --------- |
| `SearchResult`           | `./types` |
| `SearchOptions`          | `./types` |
| `SearchableEntityConfig` | `./types` |

---

## 5. Dependencies

### Internal (workspace)

- `afenda-database`
- `afenda-eslint-config`
- `afenda-logger`
- `afenda-typescript-config`

### External

| Package       | Version   |
| ------------- | --------- |
| `drizzle-orm` | `^0.44.0` |

---

## Design Patterns Detected

- **Observer**
- **Registry**

---

## Integrations

- **Command palette** (⌘K/Ctrl+K): `apps/web` calls `/api/search` → `crossEntitySearch()`
- **Entity list pages**: Per-entity adapters used for filtered search within entity type

---

## Cross-References

- [`database.architecture.md`](./database.architecture.md)
- [`route.architecture.md`](./route.architecture.md)
