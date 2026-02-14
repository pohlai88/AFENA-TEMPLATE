# Drizzle ORM Utilization Plan — Schema as Single Source of Truth

> **Purpose:** Replace hardcoded registries and manual schema exports with Drizzle-driven automation. Align with Neon MCP, db.schema.governance, and database.architecture.

---

## 1. Current State (Underutilization)

| Area | Current | Problem |
|------|---------|---------|
| **Schema barrel** | 370+ manual exports in `schema/index.ts` | Every new table requires 2–4 lines; drift risk |
| **ENTITY_TYPES** | Hardcoded in `canon/src/types/entity.ts` | Must sync with HANDLER_REGISTRY, TABLE_REGISTRY |
| **HANDLER_REGISTRY** | Manual in `mutate.ts` | Duplicated with read.ts TABLE_REGISTRY |
| **TABLE_REGISTRY** | Manual in `mutate.ts` + `read.ts` | Same table list in two places |
| **Schema lint** | EXEMPT_TABLES, ERP_ENTITY_TABLES, POSTABLE_TABLES, LINE_TABLES hardcoded | New tables require manual list updates |
| **Relations** | Partial (users, r2Files, spine-relations) | Not all entities have Drizzle relations; relational queries underused |
| **Migrations** | drizzle-kit generate/migrate | ✅ Good — schema → SQL |

---

## 2. Design Principles

1. **Schema is SSOT** — Drizzle schema files define tables; everything else derives from them.
2. **Codegen over hand-coding** — Scripts generate registries, barrel, and metadata from schema.
3. **Neon MCP** — Use for introspection, migrations, and branch management where applicable.
4. **Governance preserved** — Column helpers, tenant policy, and 8-rule lint stay; implementation becomes schema-driven.

---

## 3. Implementation Plan

### Phase 1: Schema Barrel Auto-Generation

**Goal:** Replace manual `schema/index.ts` with a script that scans `schema/*.ts` and emits exports.

**Script:** `packages/database/src/scripts/generate-schema-barrel.ts`

- Scan `src/schema/*.ts` (exclude `index.ts`, `relations.ts`, `spine-relations.ts`)
- For each file: extract `pgTable` exports and `*Relations` exports
- Emit `index.ts` with:
  - `export { X } from './x'`
  - `export type { X, NewX } from './x'` (infer from table)
- Run as `pnpm db:barrel` or as part of `db:generate`

**Invariant:** `db:barrel` must be run after adding new schema files. Add to entity-new.ts and CI.

---

### Phase 2: Schema-Derived Metadata for Lint

**Goal:** Replace hardcoded EXEMPT_TABLES, ERP_ENTITY_TABLES, etc. with schema introspection.

**Approach:**

| Metadata | Derivation |
|----------|------------|
| **ERP_ENTITY_TABLES** | Tables that include `customData` column (from erpEntityColumns) |
| **EXEMPT_TABLES** | Config file or convention: `schema/*.ts` with `// @lint:exempt` or table name in `schema-lint.config.ts` |
| **POSTABLE_TABLES** | Tables with `posting_status` column |
| **LINE_TABLES** | Tables with `net_minor` or `*_lines` suffix + line-like columns |

**Config file:** `packages/database/schema-lint.config.ts`

```ts
export const schemaLintConfig = {
  exemptTables: ['users', 'r2_files', 'audit_logs', 'entity_versions', ...],
  // Optional overrides; most metadata derived from schema
};
```

---

### Phase 3: Schema-Driven Registries (ENTITY_TYPES, TABLE_REGISTRY, HANDLER_REGISTRY)

**Goal:** Derive ENTITY_TYPES and TABLE_REGISTRY from schema; HANDLER_REGISTRY stays manual (handlers are code, not schema).

**Option A — Generated Canon + CRUD:**

1. **Entity types:** Script scans schema for tables that:
   - Use `erpEntityColumns` or `docEntityColumns`
   - Are in a whitelist (e.g. `ENTITY_SCHEMA_FILES` in config)
2. Emit `canon/src/types/entity.generated.ts` with `ENTITY_TYPES` array
3. Emit `crud/src/table-registry.generated.ts` with `TABLE_REGISTRY` built from schema imports

**Option B — Runtime derivation (simpler):**

1. `TABLE_REGISTRY` built from a single import: `import * as schema from 'afena-database'`
2. Filter to tables that have handlers: `Object.keys(HANDLER_REGISTRY)` → entity types
3. `ENTITY_TYPES` = `Object.keys(HANDLER_REGISTRY)` (canon imports from crud or a shared generated file)

**Recommendation:** Option B for TABLE_REGISTRY (single source: schema). ENTITY_TYPES and HANDLER_REGISTRY stay in sync via entity-new.ts markers, but we add a **generated** `TABLE_REGISTRY` that imports from schema and filters by a list of entity types (from a config or generated from handlers).

**Concrete:**

- Add `packages/database/src/registry.ts`:
  ```ts
  import * as schema from './schema/index';
  export const DOMAIN_TABLE_NAMES = ['contacts', 'companies', ...] as const; // from config
  export const TABLE_REGISTRY = Object.fromEntries(
    DOMAIN_TABLE_NAMES.map((name) => [name, schema[camelCase(name)]])
  );
  ```
- CRUD imports `TABLE_REGISTRY` from `afena-database` instead of defining its own.
- `DOMAIN_TABLE_NAMES` can be generated from a config file that entity-new.ts updates.

---

### Phase 4: Drizzle Relational Queries

**Current:** `db` and `dbRo` receive `schema`; Drizzle supports `db.query.X.findMany({ with: { Y: true } })`.

**Gap:** Many tables lack `relations()` definitions. `spine-relations.ts` and `relations.ts` cover only a subset.

**Action:**

1. Add relations for high-traffic entities (contacts, companies, sales_orders, etc.).
2. Use `db.query.contacts.findMany({ with: { addresses: true } })` in read paths where appropriate.
3. Document pattern in database.architecture.md.

---

### Phase 5: Neon MCP Integration

**Use cases:**

| Use Case | Neon MCP Tool | When |
|----------|---------------|------|
| Schema introspection | `mcp_Neon_describe_table_schema`, `mcp_Neon_get_database_tables` | Debugging, docs |
| Run migrations | `mcp_Neon_run_sql`, `mcp_Neon_run_sql_transaction` | Apply migrations to Neon branch |
| Query tuning | `mcp_Neon_prepare_query_tuning`, `mcp_Neon_explain_sql_statement` | Performance work |
| Branch management | `mcp_Neon_create_branch`, `mcp_Neon_list_projects` | Preview envs |

**Documentation:** Add `.architecture/neon-mcp.usage.md` with examples for common workflows.

---

## 4. File Changes Summary

| File | Change | Status |
|------|--------|--------|
| `packages/database/src/scripts/generate-schema-barrel.ts` | **New** — auto-generate schema index | ✅ Done |
| `packages/database/schema-lint.config.ts` | **New** — config for exempt/override tables | ✅ Done |
| `packages/database/src/scripts/schema-lint.ts` | **Update** — use schema-derived metadata + config | ✅ Done |
| `packages/database/package.json` | Add `db:barrel` script | ✅ Done |
| `packages/database/src/scripts/entity-new.ts` | Run db:barrel after schema generation | ✅ Done |
| `packages/database/src/registry.ts` | **New** — TABLE_REGISTRY from schema (optional Phase 3) | Deferred |
| `packages/crud/src/read.ts` | Import TABLE_REGISTRY from afena-database (if Phase 3) | Deferred |
| `packages/crud/src/mutate.ts` | Import TABLE_REGISTRY from afena-database (if Phase 3) | Deferred |
| `.architecture/neon-mcp.usage.md` | **New** — Neon MCP usage guide | ✅ Done |

---

## 5. Execution Order

1. **Phase 1** — Schema barrel generation (low risk, immediate value)
2. **Phase 2** — Schema-derived lint metadata (reduces manual list maintenance)
3. **Phase 5** — Neon MCP docs (no code change, documentation only)
4. **Phase 4** — Relations (incremental, per-entity)
5. **Phase 3** — Centralized TABLE_REGISTRY (higher refactor, do after 1–2)

---

## 6. Drizzle Best Practices (from Neon + Drizzle docs)

- **Connection:** Use `drizzle-orm/neon-http` for serverless; pass `schema` for relational queries.
- **Migrations:** `drizzle-kit generate` → `drizzle-kit migrate`; schema is source of truth.
- **RLS:** Consider `crudPolicy` / `pgPolicy` from `drizzle-orm/neon` for declarative RLS (future).
- **Prepared statements:** Use `.prepare()` for hot queries.
- **Batching:** Prefer `insert().values([...])` over multiple inserts.
- **Neon branching:** Use `DATABASE_URL` per branch for dev/preview/prod.

---

## 7. References

- [db.schema.governance.md](./db.schema.governance.md)
- [database.architecture.md](./database.architecture.md)
- [Neon RLS + Drizzle](https://neon.com/docs/guides/rls-drizzle)
- [Neon AI Rules: Drizzle](https://neon.com/docs/ai/ai-rules-neon-drizzle)
- [Drizzle ORM Overview](https://orm.drizzle.team/docs/overview)
