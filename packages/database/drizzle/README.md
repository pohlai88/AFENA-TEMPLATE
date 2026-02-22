# Drizzle Migration CI Enforcement

This directory is managed by **Drizzle Kit** and enforced by CI gates.
All database schema changes MUST go through Drizzle migrations.

---

## Directory Structure

```
drizzle/
├── 0000_0000_baseline.sql      # Baseline migration (148 tables)
├── 0001_white_captain_britain.sql  # inventory_valuation_items (IAS 2)
├── meta/
│   ├── _journal.json           # Migration journal (ordered entries)
│   ├── 0000_snapshot.json      # Schema snapshot after baseline
│   └── 0001_snapshot.json      # Schema snapshot after 0001
└── README.md                   # This file
```

---

## Prerequisites

Before running migrations, the target database must have bootstrap prerequisites:

```bash
# Run bootstrap (creates auth schema, functions, roles, grants)
pnpm --filter afenda-database db:bootstrap
```

This executes `scripts/bootstrap-neon.sql` which idempotently creates:
- `auth` and `drizzle` schemas
- 8 auth functions (`org_id`, `user_id`, `org_id_uuid`, `org_role`, `org_id_or_setting`, `require_org_id`, `try_uuid`, `set_context`)
- 4 roles (`authenticated`, `worker`, `schema_owner`, `migration_admin`)
- Schema grants for authenticated role

---

## CI Gates

### Offline Gates (no DB required — runs on every PR)

Script: `packages/database/scripts/drizzle-migration-ci.mjs`
Command: `pnpm --filter afenda-database db:drizzle:ci`

| Gate | ID | What it checks |
|---|---|---|
| Journal ↔ SQL parity | MIG-DRZ-01 | Every journal entry has a matching `.sql` file, no orphan SQL files |
| History consistency | MIG-DRZ-02 | `drizzle-kit check` passes (snapshot chain is valid) |
| Schema drift detection | MIG-DRZ-03 | `drizzle-kit generate` into temp dir — fails if new migration would be created |
| No unmanaged DDL | MIG-DRZ-04 | Scans all `.sql` files in repo — DDL only allowed in `drizzle/` and managed ops |
| Drizzle version lock | Gate A | `drizzle-orm` and `drizzle-kit` in pnpm catalog must use `~` or exact pin |
| Migration immutability | Gate B | Sequential journal idx; no modifications to committed `.sql` files |

### Online Gates (requires DB — runs on push to main)

Script: `packages/database/scripts/drizzle-neon-guard.mjs`
Command: `pnpm --filter afenda-database db:drizzle:neon-guard`

| Gate | ID | What it checks |
|---|---|---|
| Rogue objects | MIG-DRZ-05a | Tables in Neon DB but not in `TABLE_REGISTRY` → fail |
| Schema fingerprint | MIG-DRZ-05b | `drizzle-kit export` hash vs committed fingerprint |
| Migration apply test | MIG-DRZ-05c | Ephemeral Neon branch → migrate → verify tables → cleanup |
| Bootstrap + Migrate | MIG-DRZ-06 | Ephemeral branch → bootstrap SQL → migrate → verify tables + RLS + roles |

### Architectural Gates (offline — `pnpm db:validate-gates`)

| Gate | ID | What it checks |
|---|---|---|
| org_id UUID type | ORG-UUID-01 | All org_id columns use `uuid()` not `text()` |
| Composite PK | PK-ORG-01 | All tenant tables have `(org_id, id)` PK |
| Composite FK | FK-ORG-01 | FKs to tenant tables include org_id |
| Money columns | MONEY-01 | Money amounts use bigint (cents) |
| Registry keys | REG-KEY-01 | Registry keys match snake_case table names |
| RLS UUID cast | RLS-CAST-01 | `auth.org_id()` has `::uuid` cast in all RLS policies |
| Prerequisites | PREREQ-01 | `bootstrap-neon.sql` covers required schemas, functions, roles |

---

## Environment Variables

| Variable | Required by | Description |
|---|---|---|
| `DATABASE_URL_MIGRATIONS` | Online gates, `db:migrate` | Direct (non-pooled) Neon connection string |
| `NEON_API_KEY` | MIG-DRZ-05c, MIG-DRZ-06 | Neon API key for branch creation/deletion |
| `NEON_PROJECT_ID` | MIG-DRZ-05c, MIG-DRZ-06 | Neon project ID (default: `dark-band-87285012`) |

---

## Config Files

| File | Purpose |
|---|---|
| `drizzle.config.ts` | Main config — walks up to find root `.env`. Used for `generate`, `migrate`, `push`, `studio` |
| `drizzle.ci.config.ts` | Offline CI config — no DB credentials. Schema glob: `['./src/schema/*.ts', './src/helpers/doc-status.ts']` |

---

## Migration Runner

`drizzle-kit migrate` (CLI) cannot resolve database drivers in a pnpm monorepo
due to strict dependency hoisting. The programmatic runner `scripts/run-migrate.mjs`
bypasses this by importing `drizzle-orm/neon-serverless/migrator` directly.

- `db:migrate` → `node scripts/run-migrate.mjs`  (always works)
- `db:migrate:kit` → `drizzle-kit migrate`  (kept for reference; may fail in monorepo)

---

## Developer Commands

```bash
# Bootstrap prerequisites (first-time or branch reset)
pnpm --filter afenda-database db:bootstrap

# Generate a new migration after schema changes
pnpm --filter afenda-database db:generate

# Append NK immutability triggers to newest migration
pnpm --filter afenda-database db:patch-migration-triggers

# Apply pending migrations to Neon (programmatic runner)
pnpm --filter afenda-database db:migrate

# Apply via drizzle-kit CLI (may fail in monorepo — use db:migrate instead)
pnpm --filter afenda-database db:migrate:kit

# Run offline CI gates locally
pnpm --filter afenda-database db:drizzle:ci

# Run online Neon guard locally
pnpm --filter afenda-database db:drizzle:neon-guard

# Validate all architectural gates
pnpm --filter afenda-database db:validate-gates
```

---

## Workflow: Adding a New Migration

1. Modify schema `.ts` files in `packages/database/src/schema/`
2. Register new table in `src/schema/index.ts` barrel export
3. Run `pnpm --filter afenda-database db:generate` — generates SQL + updates journal
4. If tables have `naturalKeyImmutable: true`, run `db:patch-migration-triggers`
5. Review the generated SQL in `drizzle/`
6. Run `pnpm --filter afenda-database db:drizzle:ci` — verify all offline gates pass
7. Apply migration: `pnpm --filter afenda-database db:migrate`
8. (Optional) Use Neon MCP `compare_database_schema` to verify diff before/after
9. Commit schema changes + generated migration together
10. CI runs offline gates on PR, online gates on merge to main

---

## Rules

1. **Never edit committed migration SQL files** — Gate B enforces immutability
2. **Never add DDL outside `drizzle/`** — Gate MIG-DRZ-04 enforces this
3. **Always commit schema .ts + generated SQL together** — Gate MIG-DRZ-03 detects drift
4. **Pin drizzle versions with `~`** — Gate A prevents `^` in pnpm catalog
5. **Always run bootstrap before migrate on a fresh branch** — PREREQ-01 validates prerequisites
6. **Always cast `auth.org_id()::uuid` in RLS policies** — RLS-CAST-01 prevents text/uuid mismatch
