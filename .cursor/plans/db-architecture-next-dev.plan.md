---
name: DB Architecture Next Dev
overview: Gate 7 sprint — schema-driven registry generation, clean, reversible, CI-enforced. 2–3 days, low risk.
todos:
  - id: config
    content: table-registry.config.ts + revoke.config.ts (kinds, exempt, revoke)
    status: completed
  - id: manifest
    content: Barrel generator outputs __TABLE_NAMES__ manifest
    status: completed
  - id: generator
    content: generate-table-registry.ts (imports configs + manifest, 3 strict validations)
    status: completed
  - id: db-barrel
    content: db:barrel = barrel + registry; db:lint = schema-lint
    status: completed
  - id: entity-new
    content: Remove insertRegistryEntry; optional --kind flag
    status: completed
  - id: ci-diff
    content: CI db:barrel → db:lint → git diff --exit-code
    status: completed
  - id: handler-invariant
    content: handler-registry-invariant.test.ts (ALLOWED_HANDLER_KINDS)
    status: completed
  - id: doc-sync
    content: Gate 7, config locations, validated-by exact commands
    status: completed
isProject: false
---

# DB Architecture Next Development Plan (Gate 7 Sprint)

Based on [.cursor/plans/db.architecture.md](.cursor/plans/db.architecture.md). All GAP-DB-001..009 closed. Focus: **Gate 7 = schema-driven registry, clean, reversible, CI-enforced.**

---

## Definition of Done (Gate 7 = TRUE)

1. `_registry.ts` is **100% generated**; manual lists live in config files.
2. `pnpm db:barrel` produces: schema barrel + `__TABLE_NAMES__` manifest + `_registry.ts`.
3. CI fails if: `_registry.ts` stale, schema table missing from registry, or config has typos/unknown names.
4. `entity-new` no longer touches registry (or only writes to config via `--kind`).

---

## Structural Change: Config Files, Not Manual Islands

**Recommendation:** `_registry.ts` is fully generated. Move manual bits to explicit config files:


| Config                                       | Contents                                    |
| -------------------------------------------- | ------------------------------------------- |
| `packages/database/table-registry.config.ts` | `TABLE_KIND_OVERRIDES`, `REGISTRY_EXEMPT`   |
| `packages/database/revoke.config.ts`         | `REVOKE_UPDATE_DELETE_TABLES` (append-only) |


Generator imports both configs and emits stable output. Policy lives in config; registry is the compiled artifact.

---

## Table Discovery: Manifest Over Introspection

**Risk:** Barrel exports non-table stuff (relations, enums, helpers). `isDrizzleTable()` is brittle across Drizzle versions.

**Safer approach:** Barrel generator also outputs `__TABLE_NAMES__` manifest:

```ts
// In schema index or separate __schema-manifest.ts
export const __TABLE_NAMES__ = ['addresses', 'advisories', ...] as const;
```

Table-registry generator imports `__TABLE_NAMES__` (string list). No introspection. Most stable and future-proof.

**Implementation:** Extend `generate-schema-barrel.ts` to parse each schema file for `pgTable('table_name', ...)` and emit the manifest. Exclude: `_registry`, `index`, `relations`, `spine-relations`.

---

## Strict Validation (3 Checks)

Generator MUST enforce:

1. **Override keys exist:** Every key in `TABLE_KIND_OVERRIDES` exists in discovered table names. Throw: `"Override refers to unknown table: X"`.
2. **No duplicate table names** in manifest (barrel exports can alias; rare but possible).
3. **REGISTRY_EXEMPT names must NOT exist** in discovered tables — otherwise someone forgot to add schema and we're masking drift.
4. **REVOKE names must exist** in discovered tables (and optionally kind ≠ system).

---

## Config Files

### table-registry.config.ts

```ts
export type TableKind = 'truth' | 'control' | 'projection' | 'evidence' | 'link' | 'system';

export const TABLE_KIND_OVERRIDES = {
  users: 'system', r2_files: 'system', api_keys: 'system', roles: 'system',
  user_roles: 'system', user_scopes: 'system', advisories: 'system', advisory_evidence: 'system',
  audit_logs: 'evidence', entity_versions: 'evidence',
  workflow_rules: 'control', workflow_executions: 'control', workflow_definitions: 'control',
  workflow_instances: 'control', workflow_step_executions: 'control',
  workflow_events_outbox: 'control', workflow_side_effects_outbox: 'control',
  workflow_step_receipts: 'control', workflow_outbox_receipts: 'control',
  search_outbox: 'control', doc_postings: 'control', mutation_batches: 'control',
  stock_balances: 'projection', search_documents: 'projection', reporting_snapshots: 'projection',
  doc_links: 'link', company_addresses: 'link', contact_addresses: 'link',
  inventory_trace_links: 'link', meta_term_links: 'link', role_permissions: 'link',
} as const satisfies Record<string, TableKind>;

/** EX-SCH-002: worker-only, no Drizzle schema. Must NOT be in __TABLE_NAMES__. */
export const REGISTRY_EXEMPT = ['search_backfill_state'] as const;
```

### revoke.config.ts

```ts
/** Append-only. Generator validates each name exists in discovered tables. */
export const REVOKE_UPDATE_DELETE_TABLES = [
  'audit_logs', 'stock_movements', 'stock_balances', 'wip_movements',
  'depreciation_schedules', 'asset_events', 'reporting_snapshots', 'approval_decisions',
  'webhook_deliveries', 'bank_statement_lines', 'search_documents',
] as const;
```

---

## Generator Output Shape

```ts
/**
 * Table taxonomy registry — SCH-03a/03b. GENERATED by pnpm db:barrel
 */
export type TableKind = 'truth' | 'control' | 'projection' | 'evidence' | 'link' | 'system';

export const TABLE_REGISTRY = {
  addresses: 'truth',
  advisory_evidence: 'system',
  // ... keys sorted deterministically, no grouping
} as const satisfies Record<string, TableKind>;

export const REGISTRY_EXEMPT = new Set<string>([...]);

export const RLS_TABLES: readonly string[] = Object.entries(TABLE_REGISTRY)
  .filter(([, k]) => k !== 'system')
  .map(([n]) => n)
  .sort();

export const REVOKE_UPDATE_DELETE_TABLES: readonly string[] = [...];
```

- **Determinism:** Sort by key only. No pretty grouping (grouping = churn).
- **Typing:** `as const satisfies Record<string, TableKind>` for literal keys + value validation.

---

## db:barrel and CI

`**pnpm db:barrel**` (only thing CI runs for generation):

1. `generate-schema-barrel.ts` (schema barrel + `__TABLE_NAMES__` manifest)
2. `generate-table-registry.ts`

`**pnpm db:lint`:** schema-lint (imports generated registry).

**CI order:**

1. `pnpm db:barrel`
2. `pnpm db:lint`
3. `git diff --exit-code` (or `pnpm -s gen:check`)

Ensure CI checks out with full history if using `git diff` (some actions use shallow).

---

## entity-new

- Remove `insertRegistryEntry()` entirely.
- Post-step message: "If your new table is not `truth`, add it to `TABLE_KIND_OVERRIDES` then run `pnpm db:barrel`."
- **Optional (cheap win):** Add `--kind control|system|evidence|projection|link` flag; if provided, auto-insert into `TABLE_KIND_OVERRIDES` in config.

---

## Phase 2: HANDLER_REGISTRY Invariant

- Handler key must exist in TABLE_REGISTRY.
- Handler `table_kind` must be in **ALLOWED_HANDLER_KINDS** (explicit set in test).
- Start with `{ truth, control }`; easy to extend (e.g. projection rebuilders, evidence append handlers) without deleting the test.

```ts
const ALLOWED_HANDLER_KINDS = new Set<TableKind>(['truth', 'control']);
```

---

## Gotchas (from _registry.ts + barrel analysis)


| Gotcha                               | Detail                                                                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **relations.ts, spine-relations.ts** | Barrel exports these; they export relations, NOT tables. Manifest approach avoids registering them.                              |
| **search_backfill_state**            | No Drizzle schema (migration-only). Correctly in REGISTRY_EXEMPT. Generator must validate it does NOT appear in **TABLE_NAMES**. |
| **bank-statements.ts**               | Exports `bankStatementLines` (table: bank_statement_lines). No `bank_statements` table. _registry has bank_statement_lines.      |
| **Multi-table files**                | approval-chains (4 tables), fixed-assets (3), budgets (2), etc. Manifest must collect all pgTable names per file.                |
| **Barrel exports _registry first**   | Generator must not treat TABLE_REGISTRY, RLS_TABLES as tables. Manifest approach sidesteps this.                                 |


---

## Pitfalls and Mitigations


| Pitfall                   | Mitigation                                        |
| ------------------------- | ------------------------------------------------- |
| Config typos              | Generator validates override keys exist           |
| Barrel exports non-tables | Manifest lists only table names; no introspection |
| Manual lists wiped        | Config files; generator never touches them        |
| CI skips generation       | Enforce order; diff gate                          |
| Drizzle version drift     | Manifest from pgTable parse; no internal APIs     |


---

## Micro-Checklist Per Task

### config

- TABLE_KIND_OVERRIDES `as const satisfies Record<string, TableKind>`
- REGISTRY_EXEMPT in table-registry.config.ts
- REVOKE_UPDATE_DELETE_TABLES in revoke.config.ts

### manifest (barrel)

- Parse schema files for pgTable('name', ...)
- Exclude _registry, index, relations, spine-relations
- Emit **TABLE_NAMES** (sorted, deduped)

### generator

- Import manifest + both configs
- Validate overrides exist
- Validate revoke names exist
- Validate exempt names do NOT exist
- Validate no duplicate table names
- Deterministic output (sorted keys)

### db-barrel

- Generator runs after barrel
- db:lint imports generated registry (no circular deps)

### entity-new

- Remove insertRegistryEntry
- Optional: --kind flag writes to TABLE_KIND_OVERRIDES

### ci-diff

- db:barrel runs before diff
- git diff --exit-code after generation

### doc-sync

- Gate 7 describes generator + configs
- Validated-by: exact commands only

---

## Two-PR Strategy (Optional)

**PR1 (no behavior change):**

- Add config files
- Generator emits exact same TABLE_REGISTRY ordering/contents as current
- Wire into db:barrel + CI diff

**PR2 (cleanup):**

- Remove manual maintenance + entity-new insertion
- Move manual islands into config (if not done in PR1)

Keeps review friction low; rollback trivial.

---

## Implementation Order (2–3 days)

1. table-registry.config.ts + revoke.config.ts
2. Extend generate-schema-barrel.ts → **TABLE_NAMES** manifest
3. generate-table-registry.ts (imports configs + manifest, 3 validations)
4. Integrate into db:barrel
5. Remove entity-new insertRegistryEntry
6. CI diff gate
7. handler-registry-invariant.test.ts
8. Doc sync

---

## Key Files


| File                                                                                                                             | Role                                        |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [packages/database/src/schema/_registry.ts](packages/database/src/schema/_registry.ts)                                           | 100% generated output                       |
| [packages/database/table-registry.config.ts](packages/database/table-registry.config.ts)                                         | TABLE_KIND_OVERRIDES, REGISTRY_EXEMPT       |
| [packages/database/revoke.config.ts](packages/database/revoke.config.ts)                                                         | REVOKE_UPDATE_DELETE_TABLES                 |
| [packages/database/src/scripts/generate-schema-barrel.ts](packages/database/src/scripts/generate-schema-barrel.ts)               | + **TABLE_NAMES** manifest                  |
| [packages/database/src/scripts/generate-table-registry.ts](packages/database/src/scripts/generate-table-registry.ts)             | Generator                                   |
| [packages/database/src/scripts/entity-new.ts](packages/database/src/scripts/entity-new.ts)                                       | Remove insertRegistryEntry; optional --kind |
| [packages/crud/src/**tests**/handler-registry-invariant.test.ts](packages/crud/src/__tests__/handler-registry-invariant.test.ts) | ALLOWED_HANDLER_KINDS                       |
| [.github/workflows/ci.yml](.github/workflows/ci.yml)                                                                             | Diff gate                                   |


