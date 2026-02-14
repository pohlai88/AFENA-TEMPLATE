# Plan vs Codebase Comparison (Non-normative)

> **Non-normative snapshot.** Line numbers and code locations will drift. Use for refactoring decisions only. Do not include in database.architecture.md (SSOT).

*Snapshot date: 2025-02-14*

---

## Identical (Plan and Code Match)

| Item                        | Plan               | Code                                                       | Location                                                   |
| --------------------------- | ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| Driver                      | neon-http + neon() | `drizzle-orm/neon-http`, `neon(databaseUrl)`               | packages/database/src/db.ts                                |
| Schema passed to drizzle    | Yes                | `drizzle(sqlRw, { schema })`                               | db.ts:17                                                   |
| Module-level db             | DRIZ-04, DRIZ-05   | db/dbRo declared at module level                           | db.ts:15-32                                                |
| dbRo for reads              | CFG-02             | dbRo used for list/search; getDb() returns dbRo by default | read.ts, search adapters, views route                      |
| getDb(forcePrimary)         | §3                 | `getDb({ forcePrimary: true })` returns db                 | db.ts:40-42, read.ts:31,67                                 |
| DATABASE_URL required       | CFG-01             | Throws if not set                                          | db.ts:8-10                                                 |
| DATABASE_URL_MIGRATIONS     | §3                 | drizzle.config.ts uses it, falls back to DATABASE_URL    | drizzle.config.ts:4                                        |
| drizzle.config schema glob  | §5                 | `schema: ['./src/schema/*.ts']`                            | drizzle.config.ts:11                                       |
| tablesFilter                | §5                 | `['!_neon*', '!__drizzle*']`                               | drizzle.config.ts:17                                       |
| mutate() single write brain | WP-01              | mutate() is K-01; handlers called from mutate only         | mutate.ts:52-54                                            |
| stripSystemColumns          | SAN-*              | K-11 backstop before handler                               | sanitize.ts, mutate.ts:91-93                               |
| ESLint dbRo writes          | CFG-02             | no-restricted-syntax forbids dbRo.insert/update/delete     | packages/eslint-config/base.js:106-115                     |
| tenantPolicy pattern        | RLS-01             | crudPolicy with auth.org_id()                              | tenant-policy.ts                                           |
| schema-lint rules           | Gate 1             | has-base-columns, has-tenant-policy, has-org-check, etc.   | schema-lint.ts                                             |
| db.transaction in mutate    | DRIZ-02            | Single tx per mutation                                     | mutate.ts:241                                              |

---

## Good to Preserve (Keep As-Is)

| Item                              | Why                                                                                                       |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| HANDLER_REGISTRY + TABLE_REGISTRY | Centralized; entity-gen stubs extend them; plan targets schema-driven gen later                           |
| pickAllowed per handler           | Hand-maintained allowlist; plan targets schema-derived (GAP-DB-007); keep until schema metadata available |
| custom-field-validation.ts        | validateCustomData in mutate path; SAN-02 satisfied                                                       |
| policy-engine getDb()             | Uses getDb() for reads; correct RO routing                                                                |
| search adapters dbRo              | contacts.ts, companies.ts, cross-entity.ts use dbRo                                                       |
| roles.ts eslint-disable           | Explicit: "system admin tables, not domain entities"; EX-WP-* style exception                             |
| REFRESH MATERIALIZED VIEW via db  | search/refresh.ts uses db (not dbRo); correct — REFRESH needs write                                       |

---

## Good to Apply (Plan Not Yet Implemented)

| Gap/Invariant         | Current                               | Target                                | Action                                                                                           |
| --------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| GAP-DB-006 SER-01     | No canon serialization layer          | Typed boundary; Zod coercion          | Add packages/canon/src/serialization/; mutationSpecSchema exists, extend with explicit coercions |
| GAP-DB-007 SAN-01     | pickAllowed hand-maintained           | Schema-derived allowlist              | Derive writable cols from Drizzle schema metadata; replace ALLOWED arrays                        |
| GAP-DB-009 DRIZ-03    | No .prepare()                         | Prepared for readEntity, listEntities | Add `.prepare('readEntity')` etc. outside handler; use in read.ts                                |
| sslnegotiation=direct | .env.example has sslmode=require only | PG17 cold-start reduction             | Add `&channel_binding=require&sslnegotiation=direct` to connection strings                       |
| Retry logic           | None                                  | Exponential backoff                   | Add async-retry or equivalent for transient drops                                                |
| Relational API        | db.query.* not used in app code       | db.query.X.findMany({ with })         | Use in read paths where joins needed; schema has relations                                       |
| Batch API             | Not used                              | db.batch([...]) for multi-select      | Use in policy-engine, custom-field-validation where multiple reads                               |
| Bulk insert           | Some handlers may do per-row          | insert(table).values([...])           | Audit handlers; use bulk where applicable                                                        |

---

## Good to Optimize

| Area                 | Current                         | Optimization                                                                 |
| -------------------- | ------------------------------- | ---------------------------------------------------------------------------- |
| read.ts listEntities | No org_id filter in whereClause | Add org_id filter (RLS handles, but explicit improves index use per DRIZ-01) |
| listEntities limit   | Default 100                     | Consider cursor/pagination pattern for large lists                           |
| Workflow engine db   | Uses db for all ops             | Correct; ensure no long-running tx (DRIZ-02)                                 |
| Migration SQL        | Drizzle-generated               | Verify idempotent FK pattern in new migrations                               |

---

## Drift (May Remove or Refactor)

| Drift                                      | Location                                                                                                         | Plan Alignment                                       | Recommendation                                                                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Direct db writes outside mutate()          | apps/web with-auth-or-api-key, with-api-key (api_keys), roles.ts (roles, rolePermissions, userRoles, userScopes) | WP-01 says mutate only; EX-WP-001: migration/seed    | Document as EX-WP-002: system/auth tables bypass mutate. Keep; add to plan Exceptions.                                            |
| apps/web/app/actions/workflows.ts          | Raw db.execute() for workflow definitions, instances                                                             | Outside CRUD domain; workflow engine has own adapter | Keep; workflow is control plane. Document as EX-WP-003.                                                                            |
| .PRD/erp-refactor/v3/                      | Separate db.ts, migrate.ts with per-request or different structure                                               | PRD/scratch; not production                          | Ignore for consolidation; or delete if obsolete.                                                                                  |
| RLS_TABLES in cross-tenant-rls.test.ts     | Hand-maintained list of 38+ tables                                                                               | GAP-DB-005: generate from schema                     | After schema-driven RLS_TABLES, remove hand list; test imports generated list.                                                    |
| entity-new.ts pickAllowed                  | Generated stub with hardcoded ALLOWED                                                                            | Template for new entities; GAP-DB-007                | When schema-derived allowlist exists, update entity-new template to use it.                                                       |
| TABLE_REGISTRY / HANDLER_REGISTRY          | Hand-maintained + @entity-gen                                                                                    | GAP-DB-005/007: schema-driven                        | After schema-driven gen, remove manual entries; keep as generated output.                                                         |

---

## Summary Matrix

| Category  | Count | Notes                                           |
| --------- | ----- | ----------------------------------------------- |
| Identical | 16    | Core config, driver, mutate path, RLS, ESLint   |
| Preserve  | 7     | Patterns to keep until schema-driven phase      |
| Apply     | 8     | Gaps and optimizations from plan                |
| Optimize  | 4     | Minor improvements                              |
| Drift     | 6     | Document as exceptions or remove after refactor |
