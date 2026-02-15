# Afena Database Layer — Architecture Reference (Contract)

> **Manually maintained.** Supersedes auto-generated content. Do NOT overwrite via `afena readme gen`.
> **Package:** `afena-database` (`packages/database`)
> **Purpose:** Drizzle ORM schema definitions, dual RW/RO compute, migration management, and schema governance.

---

## Ratification Metadata (Contract)

| Field                  | Value                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `architecture_version` | 1                                                                                    |
| `last_ratified`        | 2026-02-15 *(date the closure PR merged)*                                            |
| `ratified_by`          | Gap closure 2026-02 *(PR approver / arch owner)*                                      |
| **Change process**     | PR label `arch-change`; required reviewers; CI gates (Gate 0, schema-lint) must pass |

---

## Ratification Gap Register (Mandatory, Near Top)

| Gap ID     | Current State                          | Target Contract                                           | Risk           | Fix Phase | Validation to Add     | Exit Criteria                                                                    |
| ---------- | -------------------------------------- | --------------------------------------------------------- | -------------- | --------- | --------------------- | -------------------------------------------------------------------------------- |
| GAP-DB-001 | ~~PK (id) only~~                       | ✅ PK (org_id, id) for truth tables (migration 0051)   | —              | —         | schema-lint           | Closed 2026-02-15 — composite PK applied; stock_balances fixed                                |
| GAP-DB-002 | ~~FKs sparse on domain~~               | ✅ All \*\_id columns have FK constraints                 | —              | —         | find-missing-fks.ts   | Closed 2026-02-14 (all FK constraints already in place)                          |
| GAP-DB-003 | ~~stock_balances writable~~            | ✅ REVOKE UPDATE/DELETE (migration 0044)                  | —              | —         | RLS test              | Closed 2026-02-14                                                                |
| GAP-DB-004 | ~~No outbox + search_documents~~       | ✅ Outbox + incremental search worker                     | —              | —         | drain/health/lag      | Closed 2026-02-15 — search_outbox, search_documents, chunked backfill, drain, Vercel cron, SEARCH_WORKER_DATABASE_URL |
| GAP-DB-005 | ~~RLS_TABLES hand-maintained~~         | ✅ Generated from _registry (RLS_TABLES, REVOKE_\*)       | —              | —         | cross-tenant-rls.test | Closed 2026-02-14                                                                |
| GAP-DB-006 | ~~No data serialization layer~~        | ✅ packages/canon/src/serialization (coerceMutationInput) | —              | —         | serialization.test.ts | Closed 2026-02-14                                                                |
| GAP-DB-007 | ~~No schema-derived allowlist~~        | ✅ pickWritable(table, input) in contacts, companies      | —              | —         | handlers              | Closed 2026-02-14                                                                |
| GAP-DB-008 | ~~doc_postings lacks doc_version~~     | ✅ doc_version + unique (migration 0044)                  | —              | —         | migration             | Closed 2026-02-14                                                                |
| GAP-DB-009 | No prepared statements for hot queries | ✅ Documented fallback (neon-http stateless)              | —              | —         | DRIZ-03b documented   | Closed 2026-02-14 (neon-http doesn't persist prepares; use batch/cache instead)  |

**Phase key:** P0 = IDs + skeleton; P1 = consolidated doc; P2 = serialization/sanitization + schema-driven; P3 = deprecations + generator changes

**FK whitelist authority (GAP-DB-002):** `schema-lint.config.ts` contains `FK_EXEMPT_COLUMNS` or `FK_EXEMPT_TABLES` with stable IDs (e.g. EX-FK-001). No ad-hoc whitelisting by comment.

---

## Invariant Index

| ID                                       | Section             |
| ---------------------------------------- | ------------------- |
| P0, P1, P2, P3                           | Overview            |
| RLS-01, RLS-02                           | Tenancy/RLS         |
| CFG-01, CFG-02                           | Config              |
| SCH-01..05, SCH-03a, SCH-03b             | Schema Design       |
| DRIZ-01..05, DRIZ-03, DRIZ-03a, DRIZ-03b | Drizzle ORM         |
| WP-01..05                                | Write Path          |
| SER-01..05                               | Serialization       |
| ZOD-01..03                               | Serialization (Zod) |
| SAN-01, SAN-01a, SAN-01b, SAN-02, SAN-03 | Sanitization        |
| GOV-00..07                               | Governance          |

---

## Exception Index

| ID             | Scope                                 |
| -------------- | ------------------------------------- |
| EX-RLS-001     | users, r2_files (authUid)             |
| EX-CFG-001     | Edge env fallbacks                    |
| EX-SCH-001..\* | Tables exempt from registry           |
| EX-SCH-002     | search_backfill_state (worker-only)   |
| EX-DRIZ-001    | Migration scripts (raw SQL)           |
| EX-DRIZ-002    | Edge routes (no prepare)              |
| EX-WP-001..003 | Migration/seed, system/auth, workflow |
| EX-SER-001     | custom_data                           |
| EX-SAN-001     | system columns                        |
| EX-SAN-002     | Audit logging of sanitization rejections deferred |
| EX-GOV-\*      | Per-gate whitelists                   |
| EX-FK-001..\*  | FK whitelist entries                  |

**EX-SAN-002 — Audit logging of sanitization rejections deferred**

- **Rationale:** Avoid scope creep; current behavior blocks writes; audit record may be added later
- **Risk:** Low
- **Future trigger:** Implement when we need forensic visibility for blocked-field attempts
- **Non-goal:** This exception does not weaken sanitization; only audit logging is deferred

---

## 1. Overview and Principles

- 4-layer model (Kernel, Control, Projection, Evidence)
- Non-negotiable principles (P0–P3)
- Key design decisions
- **Ratification Gap Register** (table above) — first-class, near top
- **Invariant index** — consolidated doc must list all invariant IDs (RLS-_, CFG-_, DRIZ-_, SER-_, SAN-_, WP-_, GOV-\*)
- **Exception index** — consolidated doc must list all exception IDs (EX-\*)
- Ratification metadata: architecture_version, last_ratified, ratified_by, change process (Gate 0)

**Invariants:** P0 (Truth in Postgres), P1 (Tenant structural), P2 (One write brain), P3 (Projections rebuildable)

**Source of truth:** This document

**Validated by:** Gap Register completeness; alignment scorecard in CI (future)

**Exceptions:** Document any principle exceptions with EX-\* IDs

---

## 2. Tenancy, Identity, and RLS

- `org_id` convention: `org_id uuid NOT NULL DEFAULT auth.require_org_id()`. Optional sentinel guard: `CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)`. Neon Auth patterns use UUID.
- `auth.org_id()`, `auth.require_org_id()`, `auth.user_id()` — granted to authenticated
- tenantPolicy, ownerPolicy, crudPolicy patterns
- RLS_TABLES generated from TABLE_REGISTRY (Gate 7 schema-driven)
- Cross-tenant isolation tests
- **Integration tests:** `auth.org_id()` reads `activeOrganizationId` or `active_organization_id` from `request.jwt.claims`; `org_id` alone is not sufficient. Use `SET LOCAL request.jwt.claims = '...'` with escaped JSON (escape single quotes) when simulating tenant context; `SET LOCAL` does not support parameterized queries.

**Invariants:** RLS-01 (every domain table has org_id + RLS + tenantPolicy), RLS-02 (auth.org_id() NULL → zero rows)

**Source of truth:** [packages/database/src/helpers/tenant-policy.ts](packages/database/src/helpers/tenant-policy.ts), [packages/crud/src/**tests**/cross-tenant-rls.test.ts](packages/crud/src/__tests__/cross-tenant-rls.test.ts)

**Validated by:** schema-lint has-tenant-policy, has-org-id (uuid semantics), cross-tenant-rls.test.ts

**Exceptions:** EX-RLS-001: users, r2_files use authUid (user-scoped)

---

## 3. Configuration and Settings

**Env vars:**

- `DATABASE_URL` — RW compute (required)
- `DATABASE_URL_RO` — RO compute (optional; falls back to DATABASE_URL)
- `DATABASE_URL_MIGRATIONS` — for drizzle-kit migrate (optional; falls back to DATABASE_URL)
- **SEARCH_WORKER_DATABASE_URL** — database connection used by **internal search maintenance** (drain/bootstrap). **MUST** use a role that can operate across orgs (e.g. **BYPASSRLS**) for drain/bootstrap, otherwise maintenance may fail under RLS.
  - **Fallback:** if unset, uses `DATABASE_URL`.
  - **Rule:** public app routes use `DATABASE_URL`; internal search maintenance uses `SEARCH_WORKER_DATABASE_URL`.
  - **Safety:** never use `SEARCH_WORKER_DATABASE_URL` in request/tenant-scoped routes or server actions.

**Connection setup ([packages/database/src/db.ts](packages/database/src/db.ts)):**

- `drizzle-orm/neon-http` + `neon()` — HTTP driver, serverless-optimized (fetch per query)
- Pass `schema` for relational API (`db.query.*`)
- `logger: isDev` — SQL logging in development only
- Module-level declaration — enables connection/prepared reuse in serverless

**Driver choice (Neon):**

- **HTTP (current):** `drizzle-orm/neon-http` — short-lived, stateless; ideal for Vercel/Lambda/Next.js.
- **WebSocket (Pool):** `drizzle-orm/neon-serverless` + `Pool` — for Cloudflare Workers or long-running Node servers.

**Connection string:**

- Use pooled URL (`-pooler` in hostname) for serverless
- Add `sslnegotiation=direct` (PG17) to reduce cold-start: `?sslmode=require&channel_binding=require&sslnegotiation=direct`
- Avoid double pooling: HTTP driver has no client pool; let Neon PgBouncer handle

**Retry + connection hardening (Implemented):**

- **Retry logic (Source of truth):** [packages/database/src/retry.ts](packages/database/src/retry.ts) — `withDbRetry()` implementation.
  **Usage sites:** `mutate()` ([packages/crud/src/mutate.ts](packages/crud/src/mutate.ts)), `drainSearchOutbox()` ([packages/search/src/worker/search-worker.ts](packages/search/src/worker/search-worker.ts)).
- **Connection string hardening (Source of truth):** [packages/database/src/db.ts](packages/database/src/db.ts) — `sslnegotiation=direct` is auto-appended when missing.

**Read path architecture (§3 / §6):**

- **Default rule:** use `dbRo` for reads unless read-after-write correctness requires primary.
- **Writes / mutations:** use `db` (see §6 Write Path).
- **Reads / lists / dashboards / search:** use `dbRo` (or `getDb()`).
- **Read-after-write:** use `getDb({ forcePrimary: true })` — prevents accidental stale reads when you just inserted/updated and immediately fetch.
- **Prohibition:** never call `insert/update/delete` on `dbRo` (enforced by **INVARIANT-RO**).

**RW vs RO routing:** mutate → db; list/read → dbRo; read-after-write → getDb({ forcePrimary: true }).

**When to use forcePrimary:** After `mutate()` or any write, if the next read must see the committed data, use `getDb({ forcePrimary: true })`. Otherwise replicas may lag and return stale rows.

**Write safety:** Export naming (dbRo), ESLint INVARIANT-RO, DB role (SELECT only for DATABASE_URL_RO)

**Invariants:** CFG-01 (DATABASE_URL required), CFG-02 (dbRo never used for insert/update/delete)

**Source of truth:** [packages/database/src/db.ts](packages/database/src/db.ts)

**Validated by:** ESLint no-restricted-syntax for dbRo writes

**Exceptions:** EX-CFG-001: Edge env fallbacks

---

## 4. Schema Design

- Column helpers: baseEntityColumns, erpEntityColumns, docEntityColumns, postingColumns
- Field types: moneyMinor, currencyCode, qty, statusColumn, etc.
- Custom fields: Data type catalog, custom_data JSONB, custom_field_values typed index
- org_id: `uuid NOT NULL DEFAULT auth.require_org_id()` (redundant CHECK removed). Optional: `CHECK (org_id <> '00000000-0000-0000-0000-000000000000'::uuid)` for sentinel rejection.

**Table taxonomy (powers Gate 2/3/4):**

| table_kind  | Layer      | Description                            |
| ----------- | ---------- | -------------------------------------- |
| truth       | Kernel     | Domain entities; identity rule applies |
| control     | Control    | Workflow, outbox, posting state        |
| projection  | Projection | Rebuildable views, materialized        |
| evidence    | Evidence   | Audit, versions, immutable             |
| link        | Link       | Junction tables; may lack version      |
| system/auth | System     | users, r2_files, api_keys, roles       |

- **SCH-03a:** Every table MUST be registered with `table_kind` (truth/control/projection/evidence/link/system).
- **SCH-03b:** schema-lint MUST fail if a table exists without a registry entry (except EX-SCH-\* list).
- **SCH-04:** Truth tables MUST use the identity rule (GAP-DB-001 target: PK (org_id, id)).

**Invariants:** SCH-01 (base columns via helpers), SCH-02 (org_id uuid NOT NULL + optional sentinel), SCH-03a/03b (table_kind registry), SCH-04 (truth tables use identity rule)

**Source of truth:** [packages/database/src/schema/\_registry.ts](packages/database/src/schema/_registry.ts) (or similar) for table_kind; [packages/database/src/helpers/](packages/database/src/helpers/), [packages/database/src/schema/](packages/database/src/schema/)

**Validated by:** schema-lint has-base-columns, has-org-id (uuid semantics; NOT NULL + optional sentinel)

**Exceptions:** EX-SCH-001: link tables without version (document which)

---

## 5. Drizzle ORM Usage and Performance Optimization

**Core usage:**

- Schema as SSOT: barrel (`db:barrel`), schema-lint config
- Connection: `drizzle-orm/neon-http` + `@neondatabase/serverless` neon() — HTTP driver for serverless
- Pass `schema` to drizzle() for relational queries (`db.query.X.findMany`)
- Migrations: `drizzle-kit generate` → `drizzle-kit migrate`
- Neon branching: DATABASE_URL per branch for dev/preview/prod

**Performance optimizations:**

| Optimization            | Current          | Target                                                           |
| ----------------------- | ---------------- | ---------------------------------------------------------------- |
| **Prepared statements** | Not used         | `.prepare('name')` for hot queries; declare outside handler      |
| **Batch API**           | Implemented      | `batch([...])` from afena-database; use for list+count patterns |
| **Bulk insert**         | Per-row possible | `insert(table).values([...])` — single statement                 |
| **Relational Queries**  | Partial          | `db.query.X.findMany({ with: { Y: true } })` — single SQL output |
| **Read replicas**       | Manual db/dbRo   | Keep; neon-http has no withReplicas; manual split correct        |
| **Cache**               | None             | Optional Upstash; `.$withCache()` opt-in for read-heavy          |

**Hot-path optimisation (DRIZ-03):**

- **DRIZ-03:** Hot paths MUST use one of: prepare (when supported) OR batch OR cache, with benchmark proof.
- **DRIZ-03a:** Prepared statements are required where supported by the driver/runtime.
- **DRIZ-03b:** If the driver does not persist prepares (e.g. neon-http per-request), use: query-shape optimisation + batching + caching instead.
- Declare `db` and prepared queries **outside handler scope**
- neon-http caveat: HTTP-based drivers may not persist prepares across requests; verify before relying on `.prepare()` for hot paths.

**Driver vs runtime optimisation support:**

| Runtime                         | Driver               | Prepared                                        | Batch | Interactive tx |
| ------------------------------- | -------------------- | ----------------------------------------------- | ----- | -------------- |
| Node serverless (Vercel/Lambda) | neon-http            | May not persist                                 | Yes   | No             |
| Long-running Node               | neon-serverless Pool | Driver/runtime dependent; verify with benchmark | Yes   | Yes            |
| Edge (Workers)                  | neon-serverless Pool | Driver/runtime dependent; verify with benchmark | Yes   | Yes            |

**Batch API:** `batch([stmt1, stmt2, ...])` from afena-database (wraps dbRo.batch) — multiple read statements in one round trip. Use for list+count patterns. Source: [packages/database/src/batch.ts](packages/database/src/batch.ts). For mutations: keep `db.transaction()`.

**Migration NOT VALID — FK rollout on large tables:**

For adding foreign keys to tables with many rows, use a two-phase pattern to avoid long table locks:

1. **Add constraint without validating existing data** (fast; brief catalog lock only):
   ```sql
   ALTER TABLE orders ADD CONSTRAINT orders_customer_id_fk
     FOREIGN KEY (customer_id) REFERENCES customers(id) NOT VALID;
   ```
2. **Validate existing data** (can take time; uses SHARE UPDATE EXCLUSIVE — allows reads/writes):
   ```sql
   ALTER TABLE orders VALIDATE CONSTRAINT orders_customer_id_fk;
   ```

For NOT NULL on existing columns, use the same pattern: add `CHECK (col IS NOT NULL) NOT VALID`, then `VALIDATE CONSTRAINT`.

**Postgres-native usage:**

- **Query shape (DRIZ-01):** Filter by org_id early; standard indexes: (org_id, doc_no), (org_id, created_at), (org_id, status), (org_id, \*\_id)
- **Transaction boundaries (DRIZ-02):** Single transaction per mutation; outbox in same tx; avoid long-running tx
- **Connection scope (DRIZ-04):** db declared at module level — correct for Next.js serverless

**Module-level db (DRIZ-05):** DB instance MUST be declared at module level; never create `drizzle()` inside request handlers.

**Invariants:** DRIZ-01 (query shape), DRIZ-02 (transaction boundaries), DRIZ-03/03a/03b (hot-path: prepare OR batch OR cache with proof), DRIZ-04 (connection outside handler), DRIZ-05 (module-level db only; never per-request)

**Source of truth:** [packages/database/src/db.ts](packages/database/src/db.ts), [packages/database/drizzle.config.ts](packages/database/drizzle.config.ts)

**Validated by:** schema-lint, ESLint INVARIANT-01, code review (no `drizzle()` inside handlers)

**Exceptions:** EX-DRIZ-001: migration scripts may use raw SQL; EX-DRIZ-002: Edge routes may skip prepared (no reuse benefit)

---

## 6. Write Path Architecture

- mutate() → single write brain
- Posting worker → journals, stock_moves only via doc_postings
- Outbox → workflow/outbox; future: search outbox
- No UI scripts, random SQL, or app code inserting journal lines

**Definitions (machine-checkable via table_kind):**

- Kernel truth tables = `table_kind = truth`
- Control plane tables = `table_kind = control`

**Invariants:** WP-01 (mutate only), WP-02 (posting worker only path to journals), WP-03 (no direct projection writes), WP-04 (domain tables may NOT be mutated by ops/admin routes directly; ops routes may only enqueue control-plane actions (workflow/posting/outbox) or call mutate()), WP-05 (routes may only write to control-plane tables directly; any write to kernel truth tables MUST go through mutate())

**Source of truth:** [packages/crud/src/mutate.ts](packages/crud/src/mutate.ts)

**Validated by:** ESLint INVARIANT-01, cross-tenant tests, posting-path.test.ts

**Exceptions:** EX-WP-001: migration/seed scripts (documented, non-app paths); EX-WP-002: system/auth tables (api_keys, roles, user_roles, user_scopes) bypass mutate; EX-WP-003: workflow engine and actions use db directly (control plane, not domain CRUD)

---

## 7. Data Serialization — Typed Boundary Layer (Contract)

**Ownership:** Canon owns transforms; handlers receive only validated+coerced input.

**Inbound:** Must coerce + validate before handler runs. **Outbound:** Must serialize DB-native types to API-safe types.

**Allowed coercions (explicit list):**

| Type                | Inbound                                              | Outbound                               |
| ------------------- | ---------------------------------------------------- | -------------------------------------- |
| ISO datetime string | → Date (SER-03)                                      | timestamptz → ISO-8601 string (SER-04) |
| UUID string         | Validate format (no conversion; TS keeps string)     | uuid → string                          |
| money               | number/string → bigint minor units (single function) | bigint → number (minor)                |
| JSONB               | unknown → object (Zod validated)                     | object → as-is                         |

**Invariants:**

- **SER-01:** No handler may accept raw request JSON; only validated+coerced MutationSpec.
- **SER-02:** Canon owns all coercion/transform logic; handlers do not implement ad-hoc parsing.
- **SER-03:** Inbound datetime values MUST be normalised to `Date` before reaching handlers.
- **SER-04:** Outbound datetime values MUST be ISO-8601 strings.
- **SER-05:** Handlers MUST accept `MutationSpec<T>` and not accept arbitrary payloads. Typed envelope: handlers receive `(ctx, spec)` never `(ctx, rawInput)`.

**Source of truth:** [packages/canon/src/serialization/](packages/canon/src/serialization/) (to add), [packages/crud/src/mutate.ts](packages/crud/src/mutate.ts)

**Validated by:** serialization.test.ts, mutationSpecSchema Zod in canon

**Exceptions:** EX-SER-001: custom_data validated separately via validateCustomData

**Zod contract (single gate, no scattered parsing):**

- **ZOD-01:** All inbound requests are parsed by `MutationSpecSchema.parse(input)` (or `safeParse`) before reaching handlers.
- **ZOD-02:** Canon defines entity write schemas and scalar schemas (uuid, moneyMinor, isoDatetime).
- **ZOD-03:** No "local Zod schemas" inside handlers/routes except for system/auth endpoints listed in EX-WP-002.

Zod is the single gate that turns `unknown` request JSON into typed `MutationSpec<T>`. All coercion (SER-01..05) runs here. Option A (Zod-first): `WritableShape(entity)` = keys of `canon.zodWriteSchema(entity)`. Option B (schema-first): derive from Drizzle columns; Zod validates values/types. Pick one and lock it.

---

## 8. Data Sanitization — Write-Shape Governance (Contract)

**Two-part write governance:**

1. **Denylist:** SYSTEM_COLUMNS (stripSystemColumns) — keep
2. **Allowlist:** Entity write-shape derived from Drizzle schema metadata, not hand-maintained lists

**Invariants:**

- **SAN-01:** Writable columns are derived from schema metadata, not hand-maintained lists.
- **SAN-01a:** Writable columns = Drizzle table columns MINUS SYSTEM_COLUMNS MINUS computed/readonly columns MINUS server-set FKs. Server-set FKs (examples): `org_id`, `created_by`, `updated_by`, `posting_batch_id`, `submitted_by`, `posted_by`, `amended_from_id` (amendment flow only).
- **SAN-01b:** Writable column derivation must be deterministic and generated (or derived) from the schema barrel.
- **SAN-02:** Custom fields are validated against field defs before write. **MUST** block writes. **SHOULD** audit (deferred via **EX-SAN-002**).
- **SAN-03:** No HTML sanitization at DB; UI escapes on render.

**Source of truth:** [packages/crud/src/sanitize.ts](packages/crud/src/sanitize.ts), [packages/crud/src/services/custom-field-validation.ts](packages/crud/src/services/custom-field-validation.ts)

**Validated by:** sanitize.test.ts, validateCustomData in mutate path

**Exceptions:** EX-SAN-001: system columns always stripped (no override); EX-SAN-002: audit logging of sanitization rejections deferred (see Exception index)

---

## 9. Governance and DB Gate Suite

**DB Gate Suite (CI):**

| Gate   | Description                                                                                                               | Current                     | Future            |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------- |
| Gate 0 | Doc contract completeness — database.architecture.md must include: Ratification Metadata table, Gap Register, Invariant index, Exception index | See GOV-00 validation below | CI script         |
| Gate 1 | Tenant enforcement (org_id defaults, RLS enabled, policies)                                                               | schema-lint                 | schema-lint       |
| Gate 2 | Identity rules (truth tables (org_id, id) or exception)                                                                   | schema-lint                 | schema-lint       |
| Gate 3 | FK coverage (\*\_id has FK unless whitelisted)                                                                            | schema-lint                 | schema-lint       |
| Gate 4 | Postable docs registered                                                                                                  | schema-lint.config.ts       | schema-derived    |
| Gate 5 | REVOKE policy derivation correctness (append-only, projection worker-only)                                                | schema-lint runGate5        | migration lint    |
| Gate 6 | Cross-tenant RLS enforcement                                                                                              | cross-tenant-rls.test       | RLS test          |
| Gate 7 | Registry drift — TABLE_REGISTRY, RLS_TABLES, REVOKE generated from schema + config                                 | schema-driven gen               | schema-driven gen |

**GOV-00 validation (deterministic):** CI must verify the doc contains these exact headings:

- `## Ratification Metadata (Contract)`
- `## Ratification Gap Register (Mandatory, Near Top)`
- `## Invariant Index`
- `## Exception Index`

**Gate 5 — REVOKE hardening:** REVOKE hardening for worker tables (migration 0054) verified. search_documents REVOKE INSERT/UPDATE/DELETE is part of Gate 5 posture.

**Gate 7 — Schema-driven registry:** `_registry.ts` is 100% generated. Policy lives in config files:
- `packages/database/table-registry.config.ts` — TABLE_KIND_OVERRIDES, REGISTRY_EXEMPT
- `packages/database/revoke.config.ts` — REVOKE_UPDATE_DELETE_TABLES
- `pnpm db:barrel` runs: generate-schema-barrel.ts (barrel + __TABLE_NAMES__ manifest) → generate-table-registry.ts
- CI: db:barrel → db:lint → git diff on generated files. entity-new no longer touches registry.
- entity-new `--kind <kind>` — auto-inserts into TABLE_KIND_OVERRIDES (truth, control, system, evidence, projection, link).

**Invariants:** GOV-00 (doc contract completeness) through GOV-07 (one per gate)

**Source of truth:** [packages/database/src/scripts/schema-lint.ts](packages/database/src/scripts/schema-lint.ts), [packages/database/schema-lint.config.ts](packages/database/schema-lint.config.ts)

**Validated by:** `pnpm --filter afena-database db:barrel` → `pnpm --filter afena-database db:lint` → `git diff --exit-code` (CI). Gate 5 runGate5, Gate 6 cross-tenant-rls, Gate 7 handler-registry-invariant.test.ts.

**Exceptions:** EX-GOV-\* per gate (whitelisted tables, etc.)

---

## 10. Neon MCP Reference

- Inline condensed version of neon-mcp.usage.md
- Table: Use case → MCP tool
- Link to full Neon MCP docs

### Schema Synchronization Workflow

Keep **Drizzle schema (TS)**, **migration files (SQL)**, and **Neon DB** in sync:

| Step | Command / Tool | Purpose |
|------|-----------------|---------|
| 1. Drift check | `pnpm --filter afena-database db:drift-check` | Ensures `drizzle-kit generate` would produce no new migration (schema ↔ migrations in sync) |
| 2. Apply migrations | `pnpm --filter afena-database db:migrate` | Applies pending migrations to Neon (uses `DATABASE_URL_MIGRATIONS` or `DATABASE_URL`) |
| 3. Introspect (optional) | `mcp_Neon_get_database_tables`, `mcp_Neon_describe_table_schema` | Verify Neon schema matches expectations |
| 4. Compare branches | `mcp_Neon_compare_database_schema` | Compare schema between Neon branches before merge |

**If `db:migrate` fails with duplicate key on `__drizzle_migrations`:** Migration table may have custom hashes or sequence drift. Fix by: (1) updating hashes to match file content (SHA256 of migration SQL), (2) resetting the id sequence: `SELECT setval(pg_get_serial_sequence('drizzle.__drizzle_migrations', 'id'), (SELECT MAX(id) FROM drizzle.__drizzle_migrations));`

**Optional:** Add [neon-drizzle.mdc](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-drizzle.mdc) to `.cursor/rules/` for AI-assisted Drizzle+Neon code generation.

**GitHub reference repos (Non-normative — informational only):**

| Repo                                                                                            | Use for                                                                                          |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [neondatabase/drizzle-overview](https://github.com/neondatabase/drizzle-overview)               | Schema + relations + relational API; programmatic migrate; bulk insert; module-level db          |
| [neondatabase/cloudflare-drizzle-neon](https://github.com/neondatabase/cloudflare-drizzle-neon) | Edge/Workers driver choice (neon-serverless vs neon-http); migrate runs locally with postgres.js |
| [neondatabase/guide-neon-drizzle](https://github.com/neondatabase/guide-neon-drizzle)           | Migration + seed flow; **avoid** per-request db creation (anti-pattern)                          |

---

## Cross-References

- [db.schema.governance.md](./db.schema.governance.md)
- [multitenancy.architecture.md](./multitenancy.architecture.md)
