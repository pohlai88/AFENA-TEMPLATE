# Afena Multi-Tenancy Architecture — Engineering Reference

> **Status:** Current as of Feb 13, 2026
> **PRD:** `.PRD/multitenancy.gap.md` (v4-final — Sealed Execution Spec)
> **Neon Project:** `dark-band-87285012` (ap-southeast-1)
> **Model:** Shared schema + RLS (NOT project-per-user)

---

## 1. Tenant Model

### 1.1 Design Decision

**Tenant = Organization.** Every user belongs to at least one org (personal or shared). All domain data is scoped by `org_id`. This is a shared-schema model — all tenants share the same Postgres database, isolated by Row-Level Security.

| Aspect                   | Afena                       | ERPNext                   | Assessment                   |
| ------------------------ | --------------------------- | ------------------------- | ---------------------------- |
| **Isolation**            | Shared DB + RLS (`org_id`)  | Separate DB per tenant    | Better for SaaS              |
| **Cross-tenant queries** | Blocked by RLS              | Impossible (separate DBs) | Correct                      |
| **Tenant provisioning**  | Insert org + seed (seconds) | Create new site (minutes) | Faster                       |
| **Schema migrations**    | Single migration for all    | Per-site (slow at scale)  | Dramatically better at scale |
| **Custom fields**        | JSONB + typed index (no DDL)| ALTER TABLE per site      | Better for SaaS              |
| **Noisy neighbor**       | Governors (§6)              | Isolated by default       | Requires governors           |

### 1.2 Column Convention

- **`org_id`**: `text NOT NULL DEFAULT auth.require_org_id() CHECK (org_id <> '')`
- **`user_id`** (where needed): `text NOT NULL DEFAULT auth.user_id()`
- **Type is `text`** — matches Neon Auth JWT claim types and `auth.user_id()` / `auth.org_id()` return types

### 1.3 Routing

**Path-based:** `/org/[slug]/...` — extracted in middleware (`proxy.ts`).

**Subdomain-ready:** Architecture does not preclude subdomain routing; the org slug extraction is a single function (`extractOrgSlug`).

---

## 2. Authentication Layer

### 2.1 Neon Auth Integration

| Component          | File                                  | Purpose                                     |
| ------------------ | ------------------------------------- | ------------------------------------------- |
| Server auth        | `apps/web/src/lib/auth/server.ts`     | `createNeonAuth()` — handler, middleware, getSession |
| Client auth        | `apps/web/src/lib/auth/client.ts`     | `createAuthClient()` — client-side hooks    |
| Auth UI provider   | `apps/web/app/auth-provider.tsx`      | `NeonAuthUIProvider` wrapping router        |
| Auth pages         | `apps/web/app/auth/[path]/page.tsx`   | `AuthView` with `generateStaticParams()`    |
| Auth API handler   | `apps/web/app/api/auth/[...path]/route.ts` | `auth.handler()` catch-all             |
| Middleware (proxy)  | `apps/web/proxy.ts`                  | `auth.middleware()` on protected routes     |

### 2.2 Session Resolution (Two Gates)

| Gate             | File                                | Used By        | Returns                                       |
| ---------------- | ----------------------------------- | -------------- | --------------------------------------------- |
| `buildContext()` | `src/lib/actions/context.ts`        | Server actions | `MutationContext` (actor, requestId, channel)  |
| `withAuth()`     | `src/lib/api/with-auth.ts`          | API routes     | `AuthSession` (userId, orgId, email, name)     |

Both call `auth.getSession()` then query `auth.org_id()` (and optionally `auth.org_role()`) from the DB session to resolve the org context.

### 2.3 Auth Helper Functions (SQL — `auth` schema)

| Function                  | Returns  | Granted To      | Notes                                                        |
| ------------------------- | -------- | --------------- | ------------------------------------------------------------ |
| `auth.org_id()`           | `text`   | `authenticated` | JWT-only, unbreakable JSON cast, NO `app.org_id` fallback   |
| `auth.require_org_id()`   | `text`   | `authenticated` | Same as `org_id()` but throws if NULL — used in column DEFAULTs |
| `auth.org_id_uuid()`      | `uuid`   | `authenticated` | Safe cast via `try_uuid()`                                   |
| `auth.org_id_or_setting()`| `text`   | **NOT granted** | Admin-only, has `app.org_id` fallback — for migrations/scripts |
| `auth.org_role()`         | `text`   | `authenticated` | SECURITY DEFINER, reads from `neon_auth` schema              |
| `auth.user_id()`          | `text`   | `authenticated` | Neon built-in — current user from JWT                        |
| `auth.try_uuid(text)`     | `uuid`   | `authenticated` | Safe cast, IMMUTABLE, returns NULL on invalid                |

**Security:** All functions use `REVOKE ALL FROM PUBLIC` then explicit `GRANT TO authenticated`.

### 2.4 Env Vars

| Var                         | Purpose                   |
| --------------------------- | ------------------------- |
| `NEON_AUTH_BASE_URL`        | Server-side auth endpoint |
| `NEON_AUTH_COOKIE_SECRET`   | Cookie encryption         |
| `NEXT_PUBLIC_NEON_AUTH_URL` | Client-side auth endpoint |

---

## 3. Row-Level Security (RLS)

### 3.1 Three RLS Policy Patterns

| Policy            | Tables                                                                                                | Read Predicate             | Write Predicate                   |
| ----------------- | ----------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------- |
| `tenantPolicy`    | All domain + ERP + policy + trust tables (29)                                                         | `auth.org_id() = org_id`   | `auth.org_id() = org_id`          |
| `authUid`         | users, r2_files (2)                                                                                   | `auth.user_id() = user_id` | `auth.user_id() = user_id`        |
| Custom crudPolicy | audit_logs, entity_versions, mutation_batches, advisories, advisory_evidence, workflow_executions (6)  | org-scoped                 | org-scoped + actor/channel checks |

### 3.2 tenantPolicy Implementation

```typescript
// packages/database/src/helpers/tenant-policy.ts
export const tenantPolicy = (table: { orgId: AnyColumn }) =>
  crudPolicy({
    role: authenticatedRole,
    read: sql`(select auth.org_id() = ${table.orgId})`,
    modify: sql`(select auth.org_id() = ${table.orgId})`,
  });
```

The `(select ...)` wrapper enables Postgres to cache the RLS predicate per-statement instead of re-evaluating per-row.

### 3.3 RLS Invariants

| ID            | Rule                                                              | Enforcement                  |
| ------------- | ----------------------------------------------------------------- | ---------------------------- |
| INVARIANT-11  | Every domain table MUST have `org_id` + RLS ENABLED+FORCED + `tenantPolicy` | Schema lint (`has-tenant-policy` rule) |
| INVARIANT-12  | `auth.org_id()` NULL → zero rows + write fails                   | RLS predicate + `require_org_id()` DEFAULT |

### 3.4 CHECK Constraints

Every org-scoped table has `org_not_empty` CHECK (`org_id <> ''`). This is a backstop — even if RLS is somehow bypassed, empty org_id values cannot be written.

---

## 4. Policy Engine (RBAC)

### 4.1 Tables

| Table              | Purpose                                                    | Key Constraints                                                    |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------ |
| `roles`            | Org-scoped role definitions (admin, manager, clerk, etc.)  | UNIQUE(org_id, key), `key <> ''` CHECK                             |
| `user_roles`       | User → role assignments                                    | UNIQUE(org_id, user_id, role_id)                                   |
| `role_permissions` | Verb+scope+fieldRules per entity type per role             | UNIQUE(org_id, role_id, entity_type, verb), verb/scope CHECKs      |
| `user_scopes`      | User → company/site/team scope assignments                 | UNIQUE(org_id, user_id, scope_type, scope_id), scope_type CHECK    |

All 4 tables have `tenantPolicy` + `org_not_empty` CHECK. No `baseEntityColumns` (no soft-delete, no version).

### 4.2 Verb CHECK Constraint

```sql
verb IN ('create','update','delete','submit','cancel','amend','approve','reject','restore')
```

Matches canon `AUTH_VERBS` exactly. Migration 0018 added `approve`, `reject`, `restore`.

### 4.3 Scope CHECK Constraint

```sql
scope IN ('org','self','company','site','team')
```

Matches canon `AUTH_SCOPES` exactly.

### 4.4 Policy Evaluation Pipeline

`enforcePolicyV2()` in `packages/crud/src/policy-engine.ts`:

1. **Resolve actor** — query `user_roles` → `role_permissions` + `user_scopes` for the org+user
2. **Verb check** — does any role grant this verb on this entity type?
3. **Scope check** — does the permission's scope match the actor's access? (Option A: explicit columns)
4. **Field check** — are any input fields in the `deny_write` list? (`deny_write` beats `allow_write`)
5. **Return** `PolicyDecision` + `AuthoritySnapshotV2` for audit trail

### 4.5 Scope Resolution (Option A — Explicit Columns)

| Scope     | Rule                                                               | Column Required   |
| --------- | ------------------------------------------------------------------ | ----------------- |
| `org`     | Allowed if permission exists                                       | None              |
| `self`    | Allowed only if `row.createdBy == actor.userId`                    | `created_by`      |
| `company` | Allowed only if `row.companyId` in actor's `user_scopes(company)`  | `company_id`      |
| `site`    | Allowed only if `row.siteId` in actor's `user_scopes(site)`       | `site_id`         |
| `team`    | **Deferred** — behaves as `org` until team membership table exists | Team table needed  |

If the entity doesn't have the required column, scope behaves as `org`.

### 4.6 Field Rules

```json
{
  "deny_write": ["cost_price", "salary_minor"],
  "mask_read": [{ "field": "salary_minor", "mode": "redact" }],
  "allow_write": ["*"]
}
```

- **Write enforcement:** Before handler — `deny_write` fields in input → `DENY_FIELD`
- **Read masking:** Deferred (§10 — ship write rules first)

### 4.7 Authority Snapshot

Every mutation records the policy evaluation result in `audit_logs.authority_snapshot` (JSONB):

```typescript
interface AuthoritySnapshotV2 {
  policyVersion: 'v2';
  verb: string;
  entityType: string;
  decision: PolicyDecision;
  actor: { orgId: string; userId: string; roleIds: string[] };
  matchedPermissions: ResolvedPermission[];
}
```

### 4.8 Invariant Tests (INVARIANT-POLICY-01)

| Test                                                    | File                  |
| ------------------------------------------------------- | --------------------- |
| Deny when actor has no permissions (DENY_VERB)          | `governance.test.ts`  |
| Allow when actor has matching verb + org scope           | `governance.test.ts`  |
| Deny when verb matches but scope fails (DENY_SCOPE)     | `governance.test.ts`  |
| Deny when field in deny_write list (DENY_FIELD)          | `governance.test.ts`  |
| Self-scope: own row passes, other row fails              | `governance.test.ts`  |
| Company-scope: matching company passes, other fails      | `governance.test.ts`  |
| Every mutation path routes through `mutate()` (no bypass)| `kernel.smoke.test.ts`|

---

## 5. Lifecycle Engine

### 5.1 State Machine

Entities using `docEntityColumns` have a governed lifecycle:

| Current Status | Allowed Verbs                  | Denied Verbs            |
| -------------- | ------------------------------ | ----------------------- |
| **Draft**      | create, update, delete, submit | —                       |
| **Submitted**  | approve, reject, cancel, amend | update, delete, submit  |
| **Active**     | update, cancel, delete         | submit, approve, reject |
| **Cancelled**  | restore only                   | everything else         |
| **Amended**    | — (read-only)                  | everything              |

### 5.2 Implementation

`enforceLifecycle()` in `packages/crud/src/lifecycle.ts` — called **before** policy evaluation in the `mutate()` pipeline. Non-doc entities (no `doc_status` column) pass through unchanged.

### 5.3 docEntityColumns (18 columns)

Extends `erpEntityColumns` with:

| Column            | Type        | Default   | Notes                                   |
| ----------------- | ----------- | --------- | --------------------------------------- |
| `doc_status`      | text        | `'draft'` | Lifecycle state                         |
| `submitted_at`    | timestamptz | null      | Submission checkpoint                   |
| `submitted_by`    | text        | null      | Submission actor                        |
| `cancelled_at`    | timestamptz | null      | Cancellation record                     |
| `cancelled_by`    | text        | null      | Cancellation actor                      |
| `amended_from_id` | UUID        | null      | Links amended doc to its predecessor    |

### 5.4 Invariant Tests (INVARIANT-LIFECYCLE-01)

| Test                                                        | File                 |
| ----------------------------------------------------------- | -------------------- |
| Update submitted doc → fails (LifecycleError)               | `governance.test.ts` |
| Delete submitted doc → fails                                | `governance.test.ts` |
| Submit already-submitted doc → fails                        | `governance.test.ts` |
| Active doc rejects submit/approve/reject                    | `governance.test.ts` |
| Cancelled doc allows only restore                           | `governance.test.ts` |
| Amended doc rejects everything                              | `governance.test.ts` |
| Non-doc entity passes through all verbs                     | `governance.test.ts` |

---

## 6. Governors (Noisy Neighbor Protection)

### 6.1 Transaction Governors (INVARIANT-GOVERNORS-01)

Every `db.transaction()` starts with `SET LOCAL` (transaction-scoped, no leaks between pooled connections):

| Setting                               | Interactive | Background |
| ------------------------------------- | ----------- | ---------- |
| `statement_timeout`                   | 5s          | 30s        |
| `idle_in_transaction_session_timeout` | 20s         | 60s        |
| `application_name`                    | `afena:{channel}:org={orgId}` | same |

Implementation: `applyGovernor()` in `packages/crud/src/governor.ts`.

### 6.2 Rate Limiter

In-memory sliding-window rate limiter. Key: `org_id + route_group`.

| Route Group | Max Requests/min |
| ----------- | ---------------- |
| `mutation`  | 60               |
| `query`     | 120              |
| `search`    | 60               |
| `api`       | 100              |

Implementation: `checkRateLimit()` in `packages/crud/src/rate-limiter.ts`.

### 6.3 Job Quota

In-memory concurrent slot limiter. Key: `org_id + queue`.

| Queue      | Max Concurrent | Max Enqueued/min |
| ---------- | -------------- | ---------------- |
| `default`  | 5              | 30               |
| `workflow` | 3              | 20               |
| `advisory` | 2              | 10               |
| `import`   | 1              | 5                |
| `sync`     | 2              | 15               |

Implementation: `acquireJobSlot()` / `releaseJob()` in `packages/crud/src/job-quota.ts`.

### 6.4 Usage Metering

Fire-and-forget upserts to `org_usage_daily` table (composite PK: `org_id + day`):

| Meter                | Trigger                                | Column         |
| -------------------- | -------------------------------------- | -------------- |
| `meterApiRequest`    | After every successful mutation        | `api_requests` |
| `meterJobRun`        | After background job completes         | `job_runs`, `job_ms` |
| `meterDbTimeout`     | On statement/idle timeout              | `db_timeouts`  |
| `meterStorageBytes`  | After file upload                      | `storage_bytes`|

Implementation: `packages/crud/src/metering.ts`. All meters swallow errors — metering never fails the primary operation.

### 6.5 Governor Invariant Tests

| Test                                                        | File                     |
| ----------------------------------------------------------- | ------------------------ |
| Interactive preset: 5s statement, 20s idle                  | `governance.test.ts`     |
| Background preset: 30s statement, 60s idle                  | `governance.test.ts`     |
| Application name includes org_id                            | `governance.test.ts`     |
| Rate limiter: allows up to limit, denies after              | `rate-limiter.test.ts`   |
| Job quota: concurrent limit + enqueue rate                  | `job-quota.test.ts`      |
| Metering: fire-and-forget upserts                           | `metering.test.ts`       |

---

## 7. Trust Hooks (Evidence & Compliance)

### 7.1 Tables

| Table                | Purpose                                    | Key Constraints                     |
| -------------------- | ------------------------------------------ | ----------------------------------- |
| `entity_attachments` | Junction table linking files to any entity | `tenantPolicy`, entity_type CHECK   |
| `communications`     | Email/comment/note/call log per entity     | `tenantPolicy`, type CHECK          |

Both are append-oriented evidence tables — no `baseEntityColumns` (no soft-delete, no version).

### 7.2 Communication Types

```sql
type IN ('email', 'comment', 'note', 'call')
```

---

## 8. Mutation Pipeline (End-to-End Tenant Safety)

The `mutate()` function in `packages/crud/src/mutate.ts` enforces tenant safety at every step:

```
1.  Zod validation           (MutationSpec schema)
2.  K-15 namespace check     (actionType ↔ entityRef.type)
3.  K-11 system column strip (remove org_id, id, etc. from input)
4.  K-04 expectedVersion     (optimistic locking)
5.  K-10 idempotency check   (audit_logs lookup for create)
6.  Resolve handler           (HANDLER_REGISTRY)
7.  Resolve target row        (TABLE_REGISTRY — for lifecycle + policy)
8.  enforceLifecycle()        ← BEFORE policy, absolute
9.  enforcePolicyV2()         ← DB-backed RBAC
10. Workflow before-rules     (can block/enrich)
11. db.transaction():
    a. applyGovernor()        ← SET LOCAL timeouts
    b. handler.{verb}()       ← actual mutation
    c. entity_versions.insert ← K-03
    d. audit_logs.insert      ← K-03 + authority snapshot
12. Workflow after-rules      (fire-and-forget)
13. meterApiRequest()         (fire-and-forget)
14. Return Receipt
```

**Key guarantee:** RLS (`tenantPolicy`) is the DB-level backstop. Even if all application-level checks were bypassed, RLS would prevent cross-tenant data access.

---

## 9. Org Context Resolution

### 9.1 Middleware (`proxy.ts`)

```
Request → loggingMiddleware.onRequest() → extractOrgSlug() → auth.middleware() → NextResponse
```

- Extracts org slug from path (`/org/[slug]/...`)
- Sets `x-request-id` header
- Public routes bypass auth: `/`, `/auth`, `/api/auth`

### 9.2 Server-Side Org Context

`getOrgContext(slug)` in `apps/web/app/(app)/org/[slug]/_server/org-context_server.ts` — React.cache() wrapped, resolves org details from DB for the layout.

### 9.3 AsyncLocalStorage (ALS)

`withAuth()` establishes an ALS scope with `request_id`, `org_id`, `actor_id`, `actor_type`, `service`. All downstream code reads from ALS via `getRequestId()`. Graceful degradation: `getRequestId() ?? crypto.randomUUID()`.

---

## 10. Validation Findings — PRD vs Implementation

### ✅ Fully Implemented (PRD §1–§4, §8)

| PRD Section                        | Status | Evidence                                                                     |
| ---------------------------------- | ------ | ---------------------------------------------------------------------------- |
| §A1 — Postgres enums (verb/scope)  | ✅     | CHECK constraints on `role_permissions` + `user_scopes` (not SQL enums — by design) |
| §A2 — Policy tables + RLS          | ✅     | 4 tables: `roles`, `user_roles`, `role_permissions`, `user_scopes` — all with `tenantPolicy` |
| §A3 — RLS policies                 | ✅     | `tenantPolicy` on all 4 tables, `org_not_empty` CHECK                        |
| §A4 — Kernel integration (no bypass)| ✅    | `mutate()` pipeline: lifecycle → policy → governor → handler                 |
| §A5 — PolicyDecision object        | ✅     | `PolicyDecision` type in `packages/canon/src/types/policy.ts`                |
| §A6 — Scope resolution (Option A)  | ✅     | `checkScope()` in `policy-engine.ts` — explicit columns, no registry         |
| §A7 — Field rules (write only)     | ✅     | `deny_write` / `allow_write` enforced in `evaluatePolicyDecision()`          |
| §A9 — Invariant tests              | ✅     | 25 tests in `governance.test.ts` + 11 in `policy.test.ts`                   |
| §B1 — Doc status enum              | ✅     | CHECK constraint + canon `DOC_STATUSES` (5 states)                           |
| §B2 — docEntityColumns             | ✅     | Helper in `packages/database/src/helpers/doc-entity.ts`                      |
| §B3 — Lifecycle guard              | ✅     | `enforceLifecycle()` — 5-state machine (extended from original 3)            |
| §B5 — Lifecycle invariant tests    | ✅     | 7+ lifecycle tests in `governance.test.ts`                                   |
| §C1 — DB session enforcement       | ✅     | `applyGovernor()` — `SET LOCAL` in every transaction                         |
| §C2 — Rate limits + job quotas     | ✅     | `rate-limiter.ts` + `job-quota.ts` — in-memory MVP                           |
| §C3 — Metering hooks               | ✅     | `metering.ts` — 4 fire-and-forget meters + `org_usage_daily` table          |
| §C4 — Governor invariant tests     | ✅     | Tests in `governance.test.ts`, `rate-limiter.test.ts`, `job-quota.test.ts`  |
| Sprint 3 — Trust hooks             | ✅     | `entity_attachments` + `communications` tables with RLS                      |

### ⚠️ Gaps, Missing Config, and Improvement Areas

#### GAP-01: Rate Limiter Not Wired into Request Path (**P0 — Missing Config**)

`checkRateLimit()` exists but is **never called** in the `mutate()` pipeline or in `withAuth()`. The rate limiter is implemented but not integrated.

**Impact:** No actual rate limiting is enforced. A single tenant can send unlimited requests.

**Fix:** Call `checkRateLimit(orgId, 'mutation')` in `mutate()` before the transaction, and `checkRateLimit(orgId, 'api')` in `withAuth()`. Return `429 Too Many Requests` when denied.

#### GAP-02: Job Quota Not Wired into Any Job Runner (**P1 — Missing Config**)

`acquireJobSlot()` / `releaseJob()` exist but there is **no background job runner** to call them. The workflow engine's after-rules are fire-and-forget promises, not queued jobs.

**Impact:** Job quotas are enforced in code but have no consumer. When a job runner is added, it must call `acquireJobSlot()` before execution and `releaseJob()` after.

**Fix:** Deferred until a job queue system (e.g. pg-boss, BullMQ) is introduced. Document the contract.

#### GAP-03: `resolveActor()` Queries RW Database (**P1 — Improvement**)

`policy-engine.ts` uses `db` (RW) for all 3 queries (`user_roles`, `role_permissions`, `user_scopes`). These are read-only queries that should use `dbRo`.

**Impact:** Unnecessary load on the RW compute endpoint. No correctness issue (permissions are not write-after-read sensitive in the same request).

**Fix:** Change `db` → `dbRo` (or `getDb()`) in `resolveActor()`. The permission tables are rarely mutated, so eventual consistency is acceptable.

#### GAP-04: No Role Seeding in `seed_org_defaults()` (**P1 — Missing Config**)

`seed_org_defaults(p_org_id)` seeds currencies, UOM, alias sets, meta_assets, entity views, and number sequences — but does **not** seed any default roles or role permissions.

**Impact:** A newly created org has zero roles. The policy engine will deny every mutation (`DENY_VERB`) until an admin manually creates roles. This is a chicken-and-egg problem — you need a role to create roles.

**Fix:** Add default role seeding to `seed_org_defaults()`:
- `owner` role (is_system=true) with all verbs on all entity types at `org` scope
- `admin` role (is_system=true) with all verbs except system actions
- `member` role with create/update/read on common entities
- Assign the org creator to the `owner` role in `user_roles`

#### GAP-05: No Admin UI for Role/Permission Management (**P2 — Missing Feature**)

No pages exist under `/org/[slug]/settings/roles` or similar for managing roles, permissions, or user scope assignments. All RBAC configuration must be done via direct DB manipulation.

**Impact:** Non-technical org admins cannot manage access control.

**Fix:** Build settings pages: role list, role detail (with permission grid), user-role assignment, user-scope assignment. Use the existing entity page templates as a starting point.

#### GAP-06: `team` Scope Deferred — No Team Table (**P2 — By Design, Documented**)

`checkScope('team', ...)` returns `true` (behaves as `org`). The PRD explicitly defers this until a team membership table exists.

**Impact:** No team-level access control. All team-scoped permissions behave as org-wide.

**Status:** Deferred by design. Additive change when needed.

#### GAP-07: Read Masking Not Implemented (**P2 — By Design, Documented**)

`mask_read` field rules are defined in the `FieldRules` type but not enforced anywhere. The PRD §A7 explicitly says "ship write rules first."

**Impact:** Sensitive fields (e.g. `salary_minor`) are visible to all org members with read access.

**Fix:** Implement read masking in the query layer (`readEntity()` / `listEntities()`) or in a serialization layer before returning data to the client.

#### GAP-08: `meterStorageBytes()` Never Called (**P2 — Missing Config**)

The storage meter exists but is not called from any file upload or attachment creation path.

**Impact:** `storage_bytes` in `org_usage_daily` is always 0.

**Fix:** Call `meterStorageBytes(orgId, bytes)` in the R2 upload handler and/or `entity_attachments` creation path.

#### GAP-09: No `reporting` Governor Preset Used (**P3 — Improvement**)

`GovernorPreset` includes `'reporting'` but `buildGovernorConfig()` treats it the same as `'interactive'` (5s/20s). No code path uses the `'reporting'` preset.

**Impact:** Reporting queries on the read replica have the same timeout as interactive mutations.

**Fix:** Add a `DEFAULT_REPORTING` preset (e.g. 30s statement, 60s idle) and use it in read-heavy API routes.

#### GAP-10: Bulk Mutation Policy Enforcement (**P3 — Future**)

PRD §A8 states: "Bulk mutation batches must enforce policy **per row** (or prove safe grouping)." The `mutation_batches` table exists and `batchId` is supported in `MutationSpec`, but bulk operations call `mutate()` in a loop — policy is enforced per call, which is correct but potentially slow.

**Impact:** No correctness issue. Performance concern for large imports.

**Fix:** Consider batch-optimized policy resolution (resolve actor once, evaluate per row) when import volumes warrant it.

#### GAP-11: Background Jobs Lack Actor Context (**P1 — Missing Config**)

PRD §A8 states: "Background jobs must carry an `actor` context (or explicit 'system actor' with limited rights)." No system actor pattern is defined. The workflow engine's fire-and-forget after-rules inherit the request actor, but a standalone cron job or queue worker would have no actor.

**Impact:** When a background job system is added, it must establish a `MutationContext` with either the triggering user's identity or a system actor.

**Fix:** Define a `SYSTEM_ACTOR` constant in canon with `userId: 'system'`, `orgId` from the job payload, `roles: ['system']`. Add a `system` role to the seed defaults.

#### GAP-12: `org_id` Type Mismatch in PRD vs Implementation (**Cosmetic — Documented**)

The PRD §A2 SQL examples show `org_id uuid NOT NULL DEFAULT auth.require_org_id()` and `user_id uuid NOT NULL`. The actual implementation uses `text` for both. This is documented in the PRD status block but the SQL examples were never updated.

**Impact:** None — the implementation is correct. The PRD examples are misleading.

**Fix:** Update PRD SQL examples to use `text` instead of `uuid`.

---

## 11. Test Coverage Summary

| Test File                       | Tests | Coverage Area                                         |
| ------------------------------- | ----- | ----------------------------------------------------- |
| `governance.test.ts`            | 25    | Policy decisions, lifecycle transitions, governor presets |
| `policy.test.ts`                | 11    | V1 role-family RBAC (legacy), authority snapshots     |
| `rate-limiter.test.ts`          | 8     | Sliding window, route groups, reset                   |
| `job-quota.test.ts`             | 10    | Concurrent slots, enqueue rate, release               |
| `metering.test.ts`              | 13    | Fire-and-forget upserts, edge cases                   |
| `kernel.smoke.test.ts`          | 15    | K-04 through K-15, error codes                        |
| `action-type-invariant.test.ts` | 4     | G0 gate: HANDLER_REGISTRY ↔ ACTION_TYPES              |
| **Total multi-tenancy related** | **86**|                                                       |

---

## 12. Migration History (Multi-Tenancy Specific)

| #    | Tag                    | Summary                                                                                |
| ---- | ---------------------- | -------------------------------------------------------------------------------------- |
| 0013 | `sudden_korath`        | Policy engine (roles, user_roles, role_permissions, user_scopes) + governors (org_usage_daily) |
| 0014 | `lethal_adam_warlock`  | Trust hooks (communications, entity_attachments) with indexes + RLS policies           |
| 0018 | `cloudy_human_robot`   | Add approve/reject/restore verbs to role_permissions CHECK constraint                  |

---

## 13. Prioritized Action Items

| Priority | Item                                          | Effort | Section |
| -------- | --------------------------------------------- | ------ | ------- |
| **P0**   | Wire `checkRateLimit()` into mutate + withAuth | Small  | GAP-01  |
| **P1**   | Seed default roles in `seed_org_defaults()`    | Small  | GAP-04  |
| **P1**   | Define system actor pattern for background jobs | Small  | GAP-11  |
| **P1**   | Move `resolveActor()` queries to `dbRo`        | Small  | GAP-03  |
| **P2**   | Admin UI for role/permission management         | Medium | GAP-05  |
| **P2**   | Wire `meterStorageBytes()` in upload path       | Small  | GAP-08  |
| **P2**   | Implement read masking in query layer           | Medium | GAP-07  |
| **P3**   | Add `reporting` governor preset                 | Small  | GAP-09  |
| **P3**   | Batch-optimized policy resolution               | Medium | GAP-10  |

---

## 14. Invariant Summary

| ID                      | Rule                                                                     | Status |
| ----------------------- | ------------------------------------------------------------------------ | ------ |
| INVARIANT-11            | Every domain table has `org_id` + RLS + `tenantPolicy`                   | ✅     |
| INVARIANT-12            | `auth.org_id()` NULL → zero rows + write fails                          | ✅     |
| INVARIANT-POLICY-01     | Every mutation calls `enforceLifecycle()` + `enforcePolicyV2()`          | ✅     |
| INVARIANT-LIFECYCLE-01  | Submitted docs reject update/delete before handler                       | ✅     |
| INVARIANT-GOVERNORS-01  | Every DB transaction sets timeouts + `application_name`                  | ✅     |
| INVARIANT-01 (K-01)     | `mutate()` is the only way to write domain data                          | ✅     |
| INVARIANT-RO            | No writes on `dbRo`                                                      | ✅     |

---

_Updated: 2026-02-13_
