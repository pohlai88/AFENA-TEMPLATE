# Afena Search Engine — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-14T08:34:54Z. Do not edit — regenerate instead.
> **Package:** `afena-search` (`packages/search`)
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
- **Score normalization**: FTS uses `ts_rank`, ILIKE uses position-based scoring (1 - idx * 0.01)
- **Read replica**: All search queries use `dbRo` (never the RW connection)

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 8 |
| **Test files** | 1 |
| **Source directories** | adapters |

```
packages/search/src/
├── adapters/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `toTsQuery` | `./fts` |
| `ftsWhere` | `./fts` |
| `ftsRank` | `./fts` |
| `ilikeFallback` | `./fts` |
| `registerSearchableEntity` | `./registry` |
| `getRegisteredEntityTypes` | `./registry` |
| `crossEntitySearch` | `./registry` |
| `searchAll` | `./adapters/cross-entity` |
| `searchContacts` | `./adapters/contacts` |
| `refreshSearchIndex` | `./refresh` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `SearchResult` | `./types` |
| `SearchOptions` | `./types` |
| `SearchableEntityConfig` | `./types` |

---

## 5. Dependencies

### Internal (workspace)

- `afena-database`
- `afena-eslint-config`
- `afena-typescript-config`
- `afena-vitest-config`

### External

| Package | Version |
| ------- | ------- |
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
