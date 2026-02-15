# DB Architecture — GitHub MCP Gap Analysis

**Date:** 2026-02-16  
**Source:** Current plan (db.architecture.md) vs GitHub research (Neon, Drizzle, multi-tenant patterns)  
**Purpose:** Identify critical, essential, or good DB design points we may be missing  
**Neon MCP:** Initialized 2026-02-16 — project `nexuscanon-axis` (dark-band-87285012) verified

---

## Neon MCP Project Snapshot

| Setting | Value |
|--------|-------|
| Project | nexuscanon-axis (dark-band-87285012) |
| Region | aws-ap-southeast-1 |
| PG version | 17 |
| Autoscaling | 0.25–2 CU |
| Scale-to-zero | Disabled (`suspend_timeout_seconds: 0`) |
| Branches | 1 (production only) |
| PgBouncer | `query_wait_timeout=120s`; pooled URL (`-pooler`) |
| Slow queries | None >1s (app-level) |

**Schema verified:** `audit_logs`, `communications` — indexes present (`org_created_id_idx`, entity timelines). No missing improvement from schema inspection.

---

## Current Architecture Summary

AFENDA-NEXUS has a mature DB architecture:

- **Tenancy:** `org_id` + RLS + tenantPolicy; composite PK `(org_id, id)`; schema-driven registry
- **Write path:** mutate() single brain; posting worker; outbox (search, workflow)
- **Serialization:** canon coerceMutationInput; Zod MutationSpec; pickWritable
- **Governance:** Gates 0–7; schema-lint; db:barrel; CI diff
- **Performance:** neon-http; batch API; Redis list cache; cursor pagination; bulk inserts
- **Neon:** pooled URL; sslnegotiation=direct; withDbRetry; SEARCH_WORKER_DATABASE_URL

---

## Critical (Should Implement)

### 1. **Neon-specific error handling & connection lifecycle**

**Finding:** Neon AI rules recommend handling `connection pool timeout` and `query_wait_timeout` (PgBouncer 120s).

**Current:** Implemented. `isDbTimeoutError`, `getDbTimeoutCode` in afena-database; mutate.ts calls `meterDbTimeout` for all timeout types; structured log in non-production.

**Implemented:** `getDbTimeoutCode` returns `NEON_POOL_TIMEOUT`, `PG_QUERY_WAIT_TIMEOUT`, `PG_STATEMENT_TIMEOUT`, `PG_IDLE_IN_TX_TIMEOUT`. mutate.ts calls `meterDbTimeout` and logs structured code in non-production.

**Effort:** Low | **Impact:** High (prevents opaque failures in production)

---

### 2. **Statement timeout & idle-in-transaction guard**

**Finding:** Neon scale-to-zero and serverless benefit from `statement_timeout` and `idle_in_transaction_session_timeout`.

**Current:** `applyGovernor()` in `packages/crud/src/governor.ts` sets `SET LOCAL statement_timeout`, `idle_in_transaction_session_timeout`, `lock_timeout` at transaction start. Covers transactional paths (mutate, drain, etc.).

**Recommendation:** Document that governor covers transactional paths. For non-transaction reads (e.g. direct `db.select()` outside `db.transaction()`), consider:
- Adding connection-level defaults via `options` in connection string (e.g. `?options=-c%20statement_timeout%3D30000`) if supported by neon-http, or
- Ensuring all hot read paths run inside transactions with governor applied

**Effort:** Low | **Impact:** Medium (governor already covers main write path)

---

### 3. **Neon branching strategy documentation**

**Finding:** Neon AI rules and docs stress using different branches for dev/test/preview via env vars.

**Current:** Implemented. `getBranchUrl()` in db.ts; DEV_DATABASE_URL, TEST_DATABASE_URL in .env.example; §3 updated.

**Implemented:** `getBranchUrl()` in db.ts; DEV_DATABASE_URL, TEST_DATABASE_URL in .env.example; §3 in db.architecture.md updated.

**Effort:** Low | **Impact:** Medium (reduces prod/test mix-ups)

---

## Essential (Strongly Recommended)

### 4. **Prepared statements for hot read paths (when driver supports)**

**Finding:** Neon AI rules: "Use prepared statements for repeated queries" and "Batch operations when possible."

**Current:** DRIZ-03b documents neon-http may not persist prepares; batch + cache used instead. Plan correctly defers prepared for neon-http.

**Recommendation:** If you ever switch to `neon-serverless` Pool for long-running Node:
- Add `.prepare('name')` for `readEntity` by id and `listEntities` with org filter
- Declare outside handler scope
- Keep current batch/cache approach for neon-http

**Effort:** Medium | **Impact:** Medium (only if driver change; current approach is correct)

---

### 5. **Programmatic migration for serverless deploy hooks**

**Finding:** Neon + Drizzle guides mention programmatic `migrate(db, { migrationsFolder })` for serverless deploy hooks.

**Current:** Using `drizzle-kit migrate` CLI in CI/deploy.

**Recommendation:** Document Option B in plan; consider adding programmatic migrate for Vercel deploy hooks if migrations must run at deploy time (vs. separate CI step).

**Effort:** Low | **Impact:** Medium (flexibility for deploy pipelines)

---

### 6. **Neon AI Rules for Cursor**

**Finding:** Plan §10 already mentions: "Add neon-drizzle.mdc to .cursor/rules/ for AI-assisted Drizzle+Neon code generation."

**Current:** Implemented. [.cursor/rules/neon-drizzle.mdc](.cursor/rules/neon-drizzle.mdc) added.

**Recommendation (done):** Add `neon-drizzle.mdc` from [neondatabase-labs/ai-rules](https://github.com/neondatabase-labs/ai-rules) to `.cursor/rules/` to improve AI-generated DB code quality.

**Effort:** Trivial | **Impact:** Good (better AI suggestions)

---

## Good to Have

### 7. **Schema export types (User, NewUser pattern)**

**Finding:** Neon AI rules show `export type User = typeof usersTable.$inferSelect` and `NewUser = typeof usersTable.$inferInsert`.

**Current:** Many schema files already export `$inferSelect` / `$inferInsert`; entity-new may generate these.

**Recommendation:** Audit schema files; ensure all domain tables export Select + Insert types. Add to schema-lint or entity-new template if missing.

**Effort:** Low | **Impact:** Good (type safety, DX)

---

### 8. **Connection string validation & multi-branch helper**

**Finding:** Neon AI rules: `if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');` and `getBranchUrl()` pattern for dev/test/prod.

**Current:** db.ts throws early if `DATABASE_URL` is missing. Single DATABASE_URL; SEARCH_WORKER_DATABASE_URL; DATABASE_URL_MIGRATIONS.

**Recommendation:** If using Neon branches for preview deploys, add a small `getBranchUrl()` helper that returns the appropriate URL from env (DEV_DATABASE_URL, TEST_DATABASE_URL, DATABASE_URL). Document in §3.

**Effort:** Low | **Impact:** Good (cleaner env handling when branches exist)

---

### 9. **Audit logging of sanitization rejections (EX-SAN-002)**

**Finding:** Plan §8 mentions "Audit of rejections" with reason codes; EX-SAN-002 defers this.

**Current:** Deferred; blocks writes but does not log blocked-field attempts.

**Recommendation:** When implementing audit visibility, add `SAN_BLOCKED_FIELD`, `SAN_TYPE_MISMATCH`, `SER_COERCION_FAIL` to audit_logs. Low priority until forensic needs arise.

**Effort:** Medium | **Impact:** Good (compliance, debugging)

---

## Already Well Covered (No Action)

| Area | Status |
|------|--------|
| Composite PK (org_id, id) | ✅ GAP-DB-001 closed |
| RLS + tenantPolicy | ✅ tenant-policy.ts; schema-lint |
| FK coverage | ✅ GAP-DB-002 closed |
| Outbox + search worker | ✅ GAP-DB-004 closed |
| Serialization (SER-01..05) | ✅ canon; MutationSpec |
| Sanitization (SAN-01..03) | ✅ pickWritable; writable-columns |
| Batch API | ✅ policy-engine; listEntities |
| List cache | ✅ RedisLabs + ioredis |
| Cursor pagination | ✅ cursor.ts; indexes |
| Module-level db | ✅ DRIZ-05 |
| Retry (withDbRetry) | ✅ mutate; drain; RETRYABLE_PATTERNS include connection pool timeout, query_wait_timeout |
| sslnegotiation=direct | ✅ db.ts |
| NOT VALID FK pattern | ✅ Documented |
| Gate 0–7 | ✅ CI enforced |
| Governor (statement_timeout, idle_in_transaction) | ✅ governor.ts; applyGovernor in transactions |
| DATABASE_URL validation | ✅ db.ts throws if missing |

---

## Recommended Implementation Order

| Priority | Item | Effort | Impact | Status |
|----------|------|--------|--------|--------|
| 1 | Map Neon timeout errors to meterDbTimeout + structured codes | Low | High | ✅ Done |
| 2 | Document governor coverage; consider non-tx read defaults | Low | Medium | ✅ Done |
| 3 | Neon branching strategy (doc) | Low | Medium | ✅ Done |
| 4 | Add neon-drizzle.mdc to .cursor/rules | Trivial | Good | ✅ Done |
| 5 | Programmatic migrate (doc/optional) | Low | Medium | ✅ Done |

---

## References

- [neondatabase-labs/ai-rules — neon-drizzle.mdc](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-drizzle.mdc)
- [Neon AI Rules: Drizzle](https://neon.com/docs/ai/ai-rules-neon-drizzle)
- [Connection latency and timeouts](https://neon.com/docs/connect/connection-latency)
- [Connection errors](https://neon.com/docs/connect/connection-errors)
- [Connection pooling](https://neon.com/docs/connect/connection-pooling)
- GitHub code search: multi-tenant RLS, composite PK, outbox pattern, statement_timeout
