# Afena Database Architecture — Engineering Reference

> **Status:** Current as of Feb 12, 2026
> **Neon Project:** `dark-band-87285012` (ap-southeast-1)
> **ORM:** Drizzle ORM 0.44+ with `drizzle-orm/neon-http` driver
> **Package:** `packages/database` (`afena-database`)

---

## 1. Connection Architecture

### 1.1 Dual Compute (RW/RO)

Neon read replicas are independent compute endpoints serving reads from the same storage. Two singletons are exported from `packages/database/src/db.ts`:

| Singleton | Env Var           | Purpose                                   | Consumers                                         |
| --------- | ----------------- | ----------------------------------------- | ------------------------------------------------- |
| `db`      | `DATABASE_URL`    | Writes, transactions, read-after-write    | `mutate()`, workflow engine, advisory writer      |
| `dbRo`    | `DATABASE_URL_RO` | List pages, dashboards, search, reporting | `readEntity()`, `listEntities()`, search adapters |

**Fallback:** If `DATABASE_URL_RO` is not set, `dbRo` reuses the RW connection (dev/preview environments).

**Routing helper:**

```typescript
getDb(options?: { forcePrimary?: boolean }): DbInstance
```

Returns `db` when `forcePrimary: true`, otherwise `dbRo`. Used by `readEntity()` and `listEntities()` for read-after-write stickiness.

### 1.2 Connection Strings

| Env Var                   | Usage                       | Notes                                                 |
| ------------------------- | --------------------------- | ----------------------------------------------------- |
| `DATABASE_URL`            | Runtime RW (pooled)         | Neon serverless driver via `@neondatabase/serverless` |
| `DATABASE_URL_RO`         | Runtime RO (pooled)         | Optional — falls back to `DATABASE_URL`               |
| `DATABASE_URL_MIGRATIONS` | DDL/migrations (direct TCP) | Used by `drizzle-kit` only — not pooled               |

### 1.3 Write Safety (3 layers)

1. **Export naming:** `dbRo` name makes read-only intent explicit
2. **ESLint rules:** `no-restricted-syntax` forbids `dbRo.insert()`, `dbRo.update()`, `dbRo.delete()` (INVARIANT-RO)
3. **DB role (recommended):** Connect `DATABASE_URL_RO` with a Neon read-only role (`SELECT` only)

### 1.4 Write Governance (INVARIANT-01)

ESLint `no-restricted-syntax` also forbids `db.insert()`, `db.update()`, `db.delete()` globally. Only `packages/crud` overrides this — all domain writes flow through `mutate()`.

**Exempt packages:** `packages/crud/eslint.config.js`, `packages/advisory`, `packages/workflow` (fire-and-forget logging)

---

## 2. Table Inventory (30 tables)

### 2.1 Auth & Storage (2 tables — no org_id)

| Table      | PK          | RLS                | Notes                                                               |
| ---------- | ----------- | ------------------ | ------------------------------------------------------------------- |
| `users`    | `id` (UUID) | `authUid(user_id)` | Neon Auth identity. `user_id` from `auth.user_id()`                 |
| `r2_files` | `id` (UUID) | `authUid(user_id)` | Cloudflare R2 file metadata. FK → `users.user_id` ON DELETE CASCADE |

**Pattern:** User-scoped RLS via `authUid()` — no org isolation needed.

### 2.2 CRUD Kernel (3 tables — append-only)

| Table              | PK          | RLS                             | Mutability  | Notes                                                 |
| ------------------ | ----------- | ------------------------------- | ----------- | ----------------------------------------------------- |
| `audit_logs`       | `id` (UUID) | org-scoped + actor check (K-14) | Append-only | 3 JSONB payloads (before/after/diff), idempotency key |
| `entity_versions`  | `id` (UUID) | org-scoped                      | Append-only | Snapshot-first versioning, fork-aware                 |
| `mutation_batches` | `id` (UUID) | org-scoped                      | Append-only | Groups bulk operations                                |

**Pattern:** No `baseEntityColumns` — these are infrastructure tables with custom column sets. All have `org_not_empty` CHECK and org-scoped crudPolicy.

### 2.3 Domain Entities (1 table)

| Table      | PK          | Columns                                                  | RLS            | Notes                                                         |
| ---------- | ----------- | -------------------------------------------------------- | -------------- | ------------------------------------------------------------- |
| `contacts` | `id` (UUID) | `baseEntityColumns` + name, email, phone, company, notes | `tenantPolicy` | First domain entity. Has `search_vector` tsvector + GIN index |

**Pattern:** Uses `baseEntityColumns` (10 cols: id, orgId, createdAt, updatedAt, createdBy, updatedBy, version, isDeleted, deletedAt, deletedBy) + `tenantPolicy` + `erpIndexes`-equivalent manual indexes.

### 2.4 Advisory Engine (2 tables — append-only)

| Table               | PK          | RLS        | Mutability          | Notes                                             |
| ------------------- | ----------- | ---------- | ------------------- | ------------------------------------------------- |
| `advisories`        | `id` (UUID) | org-scoped | Status-only updates | Fingerprint dedup, 6 CHECK constraints, 5 indexes |
| `advisory_evidence` | `id` (UUID) | org-scoped | Append-only         | FK → advisories. REVOKE UPDATE/DELETE             |

**Pattern:** Deterministic advisory output. `advisories.score` uses `doublePrecision` (acceptable — not money).

### 2.5 Workflow Engine (2 tables)

| Table                 | PK          | Columns                                                                                                  | RLS            | Mutability  | Notes                                               |
| --------------------- | ----------- | -------------------------------------------------------------------------------------------------------- | -------------- | ----------- | --------------------------------------------------- |
| `workflow_rules`      | `id` (UUID) | `baseEntityColumns` + name, timing, entityTypes[], verbs[], priority, enabled, conditionJson, actionJson | `tenantPolicy` | Full CRUD   | Per-org customizable rules                          |
| `workflow_executions` | `id` (UUID) | Custom columns                                                                                           | org-scoped     | Append-only | Fire-and-forget execution log. REVOKE UPDATE/DELETE |

### 2.6 ERP Spine Tables (6 tables)

| Table              | PK          | Columns                                                                                             | RLS            | Notes                                                   |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------- |
| `companies`        | `id` (UUID) | `erpEntityColumns` + name, legalName, registrationNo, taxId, baseCurrency, fiscalYearStart, address | `tenantPolicy` | Multi-company axis                                      |
| `sites`            | `id` (UUID) | `erpEntityColumns` + name, code, type, address                                                      | `tenantPolicy` | UNIQUE(org_id, code). type CHECK from canon `SiteType`  |
| `currencies`       | `id` (UUID) | orgId + code, name, symbol, minorUnits, isBase, fxRateToBase, enabled                               | `tenantPolicy` | UNIQUE(org_id, code). Seeded: MYR/USD/SGD/EUR           |
| `uom`              | `id` (UUID) | orgId + name, symbol, type                                                                          | `tenantPolicy` | UNIQUE(org_id, symbol). type CHECK from canon `UomType` |
| `uom_conversions`  | `id` (UUID) | orgId + fromUomId, toUomId, factor                                                                  | `tenantPolicy` | UNIQUE(org_id, from, to)                                |
| `number_sequences` | `id` (UUID) | orgId + companyId, entityType, prefix, suffix, nextValue, padLength, fiscalYear                     | `tenantPolicy` | UNIQUE(org_id, company, entity, fy)                     |

**Pattern:** `erpEntityColumns` = `baseEntityColumns` + `companyId?` (UUID) + `siteId?` (UUID) + `customData` (JSONB NOT NULL DEFAULT `'{}'`).

### 2.7 Custom Fields (3 tables)

| Table                     | PK          | RLS            | Notes                                                                |
| ------------------------- | ----------- | -------------- | -------------------------------------------------------------------- |
| `custom_fields`           | `id` (UUID) | `tenantPolicy` | Field definitions. 22 columns, 8 CHECK constraints, composite unique |
| `custom_field_values`     | `id` (UUID) | `tenantPolicy` | Typed index table. 8 value columns, exactly-one CHECK, composite FK  |
| `custom_field_sync_queue` | `id` (UUID) | `tenantPolicy` | Retry queue for failed index syncs                                   |

**Key constraints:**

- `custom_fields`: UNIQUE(org_id, entity_type, field_name), field_name snake_case CHECK, required-needs-default CHECK, type_config jsonb_typeof CHECK, enum-requires-choices CHECK
- `custom_field_values`: Composite FK (org_id, entity_type, field_id) → custom_fields ON DELETE RESTRICT. Exactly-one typed column CHECK
- `custom_field_sync_queue`: Partial B-tree on `next_retry_at WHERE completed_at IS NULL`

### 2.8 Entity Views (2 tables)

| Table                | PK          | RLS            | Notes                                                                                |
| -------------------- | ----------- | -------------- | ------------------------------------------------------------------------------------ |
| `entity_views`       | `id` (UUID) | `tenantPolicy` | Admin-configurable table/form/kanban layouts. UNIQUE(org_id, entity_type, view_name) |
| `entity_view_fields` | `id` (UUID) | `tenantPolicy` | Per-view field config. FK → entity_views ON DELETE CASCADE                           |

### 2.9 LiteMetadata (3 tables)

| Table                 | PK          | RLS            | Notes                                                 |
| --------------------- | ----------- | -------------- | ----------------------------------------------------- |
| `meta_assets`         | `id` (UUID) | `tenantPolicy` | Asset registry. UNIQUE(org_id, asset_key)             |
| `meta_lineage_edges`  | `id` (UUID) | `tenantPolicy` | From/to asset FK. UNIQUE(org_id, from, to, edge_type) |
| `meta_quality_checks` | `id` (UUID) | `tenantPolicy` | Target asset FK. Rule type + config JSONB             |

### 2.10 Aliasing (5 tables)

| Table                         | PK          | RLS            | Notes                                                                 |
| ----------------------------- | ----------- | -------------- | --------------------------------------------------------------------- |
| `meta_alias_sets`             | `id` (UUID) | `tenantPolicy` | Partial UNIQUE(org_id, set_key). One-default-per-org partial unique   |
| `meta_aliases`                | `id` (UUID) | `tenantPolicy` | FK → alias_sets. search_text trigger + GIN index. 5 target_key CHECKs |
| `meta_alias_resolution_rules` | `id` (UUID) | `tenantPolicy` | Priority-based scope matching. UNIQUE(org_id, scope_type, scope_key)  |
| `meta_value_aliases`          | `id` (UUID) | `tenantPolicy` | Enum value localization. target_key LIKE 'enum:%' CHECK               |
| `meta_semantic_terms`         | `id` (UUID) | `tenantPolicy` | Business glossary. Partial UNIQUE(org_id, term_key)                   |

**Alias Resolution Algorithm** (deterministic, highest priority wins):

1. `scope_type = 'user'` + `scope_key = current_user_id` (priority 40)
2. `scope_type = 'role'` + `scope_key = user's role` (priority 30)
3. `scope_type = 'team'` + `scope_key = user's team` (priority 30)
4. `scope_type = 'locale'` + `scope_key = user's locale` (priority 20)
5. `scope_type = 'app_area'` + `scope_key = current page/module` (priority 10)
6. `scope_type = 'org'` + `scope_key = 'default'` (priority 0)

If multiple rules match at the same priority, the one with the highest `priority` value wins.

**Label Resolution Priority** (4-tier, deterministic):

1. `entity_view_fields.label_override` (explicit per-view override)
2. `meta_aliases` from the **resolved alias set** (via resolution rules for user/team/locale)
3. `meta_assets.display_name` or `custom_fields.field_label` (system default)
4. Fallback: column name (for core/module fields with no metadata)

**Stable `target_key` conventions:**

| Target Type    | Key Format                                   | Example                          |
| -------------- | -------------------------------------------- | -------------------------------- |
| `asset`        | `db.<schema>.<table>.<column>`               | `db.public.invoices.total_minor` |
| `custom_field` | `<entity_type>.custom:<field_name>`          | `contacts.custom:loyalty_tier`   |
| `metric`       | `metric:<metric_key>`                        | `metric:ar_days`                 |
| `view_field`   | `view:<entity_type>:<view_name>:<field_key>` | `view:contacts:Default:name`     |
| `enum_value`   | `enum:<EnumName>:<value>`                    | `enum:DocStatus:submitted`       |

### 2.11 Semantic Terms (1 table)

| Table             | PK          | RLS            | Notes                                                    |
| ----------------- | ----------- | -------------- | -------------------------------------------------------- |
| `meta_term_links` | `id` (UUID) | `tenantPolicy` | FK → semantic_terms. UNIQUE(org_id, term_id, target_key) |

---

## 3. Column Patterns

### 3.1 baseEntityColumns (10 columns)

Every domain entity table spreads this object:

| Column       | Type        | Default                 | Notes                                |
| ------------ | ----------- | ----------------------- | ------------------------------------ |
| `id`         | UUID        | `gen_random_uuid()`     | PK                                   |
| `org_id`     | text        | `auth.require_org_id()` | Tenant isolation                     |
| `created_at` | timestamptz | `now()`                 | Immutable                            |
| `updated_at` | timestamptz | `now()`                 | DB trigger `set_updated_at()` (K-08) |
| `created_by` | text        | `auth.user_id()`        | Actor identity                       |
| `updated_by` | text        | `auth.user_id()`        | Actor identity                       |
| `version`    | integer     | `1`                     | Optimistic locking                   |
| `is_deleted` | boolean     | `false`                 | Soft-delete flag                     |
| `deleted_at` | timestamptz | null                    | Soft-delete timestamp                |
| `deleted_by` | text        | null                    | Soft-delete actor                    |

### 3.2 erpEntityColumns (13 columns)

Extends `baseEntityColumns` with:

| Column        | Type  | Default | Notes                          |
| ------------- | ----- | ------- | ------------------------------ |
| `company_id`  | UUID  | null    | Optional FK → companies        |
| `site_id`     | UUID  | null    | Optional FK → sites            |
| `custom_data` | JSONB | `'{}'`  | Typed custom field values blob |

### 3.3 Column Helpers (field-types.ts)

| Helper                         | Output Type                        | Usage                       |
| ------------------------------ | ---------------------------------- | --------------------------- |
| `moneyMinor(name)`             | integer NOT NULL DEFAULT 0         | Safe money in minor units   |
| `currencyCode(name)`           | text NOT NULL DEFAULT 'MYR'        | ISO 4217                    |
| `fxRate(name)`                 | numeric(20,10) DEFAULT '1'         | Exchange rate               |
| `baseAmountMinor(name)`        | integer NOT NULL DEFAULT 0         | Base currency amount        |
| `moneyDocumentColumns(prefix)` | 6 columns                          | Full money document set     |
| `qty(name)`                    | numeric(18,6) NOT NULL DEFAULT '0' | Manufacturing precision     |
| `uomRef(name)`                 | UUID                               | FK to uom table             |
| `statusColumn(name)`           | text NOT NULL                      | Enum status                 |
| `emailColumn(name)`            | text                               | Email field                 |
| `phoneColumn(name)`            | text                               | Phone field                 |
| `addressJsonb(name)`           | JSONB                              | Structured address          |
| `tagsArray(name)`              | text[] NOT NULL DEFAULT '{}'       | Tag arrays                  |
| `docNumber(name)`              | text NOT NULL                      | Document number (INV-00001) |
| `companyRef()`                 | UUID                               | FK to companies             |
| `siteRef()`                    | UUID                               | FK to sites                 |
| `contactRef(name)`             | UUID                               | FK to contacts              |

---

## 4. Security Architecture

### 4.1 Row-Level Security (RLS)

Every table has RLS enabled via one of three policies:

| Policy            | Tables                                                                                                | Read Predicate             | Write Predicate                   |
| ----------------- | ----------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------- |
| `tenantPolicy`    | All domain + ERP tables (22)                                                                          | `auth.org_id() = org_id`   | `auth.org_id() = org_id`          |
| `authUid`         | users, r2_files (2)                                                                                   | `auth.user_id() = user_id` | `auth.user_id() = user_id`        |
| Custom crudPolicy | audit_logs, entity_versions, mutation_batches, advisories, advisory_evidence, workflow_executions (6) | org-scoped                 | org-scoped + actor/channel checks |

**Neon Auth functions used:**

- `auth.org_id()` — current org from JWT (RLS predicates)
- `auth.require_org_id()` — same but throws if missing (column DEFAULTs)
- `auth.user_id()` — current user from JWT

### 4.2 CHECK Constraints

Every org-scoped table has `org_not_empty` CHECK (`org_id <> ''`). Additional domain-specific CHECKs:

| Table                 | Constraint         | Rule                                                                                                                                   |
| --------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `sites`               | type CHECK         | `type IN ('warehouse','branch','plant','office')`                                                                                      |
| `uom`                 | type CHECK         | `type IN ('weight','volume','length','area','count','time','custom')`                                                                  |
| `advisories`          | 6 CHECKs           | type taxonomy regex, severity/status/method enums, fingerprint length                                                                  |
| `advisory_evidence`   | type CHECK         | `evidence_type IN (...)`                                                                                                               |
| `workflow_rules`      | timing CHECK       | `timing IN ('before','after')`                                                                                                         |
| `workflow_executions` | timing CHECK       | `timing IN ('before','after')`                                                                                                         |
| `custom_fields`       | 8 CHECKs           | field_name snake_case, storage_mode, required+default, type_config object, enum choices, short_text maxLength, entity_ref targetEntity |
| `custom_field_values` | 2 CHECKs           | exactly-one typed column, source enum                                                                                                  |
| `entity_views`        | view_type CHECK    | `view_type IN ('table','form','kanban','detail')`                                                                                      |
| `entity_view_fields`  | field_source CHECK | `field_source IN ('core','module','custom')`                                                                                           |
| `meta_alias_sets`     | set_key CHECK      | snake_case regex                                                                                                                       |
| `meta_aliases`        | 7 CHECKs           | alias_not_empty, slug_kebab, 5 target_key format CHECKs                                                                                |
| `meta_value_aliases`  | 2 CHECKs           | target_key LIKE 'enum:%', alias_not_empty                                                                                              |
| `meta_semantic_terms` | term_key CHECK     | snake_case regex                                                                                                                       |

### 4.3 Append-Only Tables

These tables have `REVOKE UPDATE, DELETE` on the `authenticated` role (enforced post-migration):

- `advisory_evidence`
- `workflow_executions`

`audit_logs` and `entity_versions` are logically append-only (enforced by kernel, not DB REVOKE).

---

## 5. Index Strategy

### 5.1 Standard Indexes (erpIndexes)

Every domain table gets:

- `(org_id, id)` — primary lookup
- `(org_id, created_at)` — timeline queries

### 5.2 BRIN Indexes (time-series, ~1000x smaller than B-tree)

| Table                 | Column       | Notes                               |
| --------------------- | ------------ | ----------------------------------- |
| `audit_logs`          | `created_at` | Append-only, naturally time-ordered |
| `workflow_executions` | `created_at` | Append-only, naturally time-ordered |

### 5.3 Covering Indexes (INCLUDE — index-only scans)

| Table                         | Key Columns                        | INCLUDE                  | Notes                               |
| ----------------------------- | ---------------------------------- | ------------------------ | ----------------------------------- |
| `custom_field_values`         | (org_id, entity_type, entity_id)   | (field_id, value_text)   | Detail page custom value resolution |
| `meta_aliases`                | (org_id, alias_set_id, target_key) | (alias, alias_slug)      | Label resolution                    |
| `meta_alias_resolution_rules` | (org_id, scope_type, scope_key)    | (alias_set_id, priority) | Resolution lookup                   |

### 5.4 Conditional Indexes on custom_field_values (per-typed-column)

For filterable/sortable custom fields, 7 per-typed-column indexes exist:

| Index                             | Key Columns                                    | Condition                         |
| --------------------------------- | ---------------------------------------------- | --------------------------------- |
| `custom_field_values_text_idx`    | (org_id, entity_type, field_id, value_text)    | `WHERE value_text IS NOT NULL`    |
| `custom_field_values_int_idx`     | (org_id, entity_type, field_id, value_int)     | `WHERE value_int IS NOT NULL`     |
| `custom_field_values_numeric_idx` | (org_id, entity_type, field_id, value_numeric) | `WHERE value_numeric IS NOT NULL` |
| `custom_field_values_date_idx`    | (org_id, entity_type, field_id, value_date)    | `WHERE value_date IS NOT NULL`    |
| `custom_field_values_ts_idx`      | (org_id, entity_type, field_id, value_ts)      | `WHERE value_ts IS NOT NULL`      |
| `custom_field_values_bool_idx`    | (org_id, entity_type, field_id, value_bool)    | `WHERE value_bool IS NOT NULL`    |
| `custom_field_values_uuid_idx`    | (org_id, entity_type, field_id, value_uuid)    | `WHERE value_uuid IS NOT NULL`    |

Plus two always-on lookup indexes:

- `(org_id, entity_type, entity_id)` — "all custom values for this entity"
- `(org_id, entity_type, field_id)` — "all values for this field across entities"

### 5.5 Partial Indexes

| Table                     | Condition                                           | Purpose                   |
| ------------------------- | --------------------------------------------------- | ------------------------- |
| `companies`               | `WHERE is_deleted = false`                          | Only index active records |
| `sites`                   | `WHERE is_deleted = false`                          | Only index active records |
| `contacts`                | `WHERE is_deleted = false`                          | Only index active records |
| `custom_fields`           | `WHERE is_active = true AND is_deprecated = false`  | Active field definitions  |
| `custom_field_sync_queue` | `WHERE completed_at IS NULL`                        | Pending retry jobs        |
| `meta_alias_sets`         | `WHERE is_deleted = false`                          | Active alias sets         |
| `meta_aliases`            | `WHERE effective_to IS NULL AND is_deleted = false` | Active aliases            |
| `meta_value_aliases`      | `WHERE effective_to IS NULL AND is_deleted = false` | Active value aliases      |
| `meta_semantic_terms`     | `WHERE is_deleted = false`                          | Active terms              |
| `audit_logs`              | `WHERE idempotency_key IS NOT NULL`                 | Idempotency dedup         |
| `advisories`              | `WHERE status IN ('open','ack')`                    | Fingerprint dedup         |

### 5.6 Expression Indexes

| Table           | Expression          | Purpose                       |
| --------------- | ------------------- | ----------------------------- |
| `custom_fields` | `lower(field_name)` | Case-insensitive field lookup |

### 5.7 GIN Indexes

| Table          | Expression                           | Purpose                                    |
| -------------- | ------------------------------------ | ------------------------------------------ |
| `meta_aliases` | `to_tsvector('simple', search_text)` | Full-text search on aliases + synonyms     |
| `contacts`     | `search_vector` (tsvector)           | Full-text search on name + email + company |

---

## 6. Triggers

| Trigger                        | Table          | Timing                  | Function                             | Purpose                                   |
| ------------------------------ | -------------- | ----------------------- | ------------------------------------ | ----------------------------------------- |
| `trg_set_updated_at`           | `contacts`     | BEFORE UPDATE           | `public.set_updated_at()`            | K-08: updated_at by DB, not app           |
| `trg_contacts_search_vector`   | `contacts`     | BEFORE INSERT OR UPDATE | `contacts_search_vector_update()`    | Maintain tsvector for FTS                 |
| `trg_meta_aliases_search_text` | `meta_aliases` | BEFORE INSERT OR UPDATE | `meta_aliases_search_text_trigger()` | Concatenate alias + synonyms + target_key |

---

## 7. Enum Governance

All enum values are defined in `packages/canon` as TypeScript const arrays with Zod schemas. DB CHECK constraints are generated from these values. **Single source of truth: canon → DB CHECK.**

### 7.1 Convention for Adding New Enums

```typescript
// packages/canon/src/enums/<enum-name>.ts
import { z } from 'zod';

export const MY_VALUES = ['value_a', 'value_b'] as const;
export type MyValue = (typeof MY_VALUES)[number];
export const myValueSchema = z.enum(MY_VALUES);
```

Then re-export from `packages/canon/src/enums/index.ts`. DB CHECK constraints reference the same values.

### 7.2 Enum Registry (17 enums)

| Enum                  | Values (actual implementation)                                                                                                      | Used By                                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `DataType`            | short_text, long_text, integer, decimal, money, boolean, date, datetime, enum, multi_enum, email, phone, url, entity_ref, json (15) | custom_fields.field_type               |
| `StorageMode`         | jsonb_only, indexed                                                                                                                 | custom_fields.storage_mode             |
| `DocStatus`           | draft, submitted, cancelled, amended                                                                                                | Future document tables                 |
| `PaymentStatus`       | unpaid, partial, paid, overpaid, refunded                                                                                           | Future payment tables                  |
| `SiteType`            | warehouse, branch, plant, office                                                                                                    | sites.type                             |
| `UomType`             | weight, volume, length, area, count, time, custom                                                                                   | uom.type                               |
| `ContactType`         | customer, supplier, lead, employee, other                                                                                           | Future contacts.type                   |
| `FieldSource`         | user, rule, import, system                                                                                                          | custom_field_values.source             |
| `ViewType`            | table, form, kanban, detail                                                                                                         | entity_views.view_type                 |
| `FieldSourceType`     | core, module, custom                                                                                                                | entity_view_fields.field_source        |
| `FxSource`            | manual, rate_table, system                                                                                                          | moneyDocumentColumns.fxSource          |
| `MetaAssetType`       | table, column, view, pipeline, report, api                                                                                          | meta_assets.asset_type                 |
| `MetaEdgeType`        | ingests, transforms, serves, derives                                                                                                | meta_lineage_edges.edge_type           |
| `MetaClassification`  | pii, financial, internal, public                                                                                                    | meta_assets.classification             |
| `MetaQualityTier`     | gold, silver, bronze                                                                                                                | meta_assets.quality_tier               |
| `MetaAliasTargetType` | asset, custom_field, metric, view_field, enum_value                                                                                 | meta_aliases.target_type               |
| `MetaAliasScopeType`  | org, team, role, user, locale, app_area (6)                                                                                         | meta_alias_resolution_rules.scope_type |

---

## 8. Cross-Package Data Flow

```
apps/web (Next.js)
  ├── Server Actions → buildContext() → mutate() / readEntity() / listEntities()
  ├── API Routes → dbRo (entity views)
  └── lib/org.ts → db + sql (org queries)

packages/crud (afena-crud)
  ├── mutate.ts → db.transaction() → handler → audit_logs + entity_versions
  ├── read.ts → getDb() (defaults to dbRo) → TABLE_REGISTRY
  └── services/
      ├── custom-field-validation.ts → dbRo (loadFieldDefs)
      └── custom-field-sync.ts → db (syncCustomFieldValues)

packages/search (afena-search)
  └── adapters/contacts.ts → dbRo (FTS + ILIKE fallback)

packages/advisory (afena-advisory)
  └── writer.ts → db (advisories + advisory_evidence)

packages/workflow (afena-workflow)
  ├── db-loader.ts → db (workflow_rules)
  └── engine.ts → db (workflow_executions, fire-and-forget)
```

### 8.1 Write Path

```
Server Action → buildContext() → mutate(spec, ctx)
  → Zod validation
  → K-15 namespace check
  → K-11 system column strip
  → K-04 expectedVersion enforcement
  → K-10 idempotency check (audit_logs lookup)
  → INVARIANT-07 policy enforcement
  → Workflow before-rules (can block/enrich)
  → db.transaction():
      → Handler.create/update/delete/restore
      → entity_versions.insert (K-03)
      → audit_logs.insert (K-03)
  → Workflow after-rules (fire-and-forget)
  → Return Receipt
```

### 8.2 Read Path

```
Server Action → readEntity(type, id, requestId, { forcePrimary? })
  → getDb({ forcePrimary }) → db or dbRo
  → TABLE_REGISTRY[type].select().where(id, !isDeleted)
  → Return via RLS-filtered result
```

---

## 9. Migration History (13 migrations)

| #    | Tag                               | Summary                                                                                                          |
| ---- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 0000 | `first_stranger`                  | Initial users table                                                                                              |
| 0001 | `true_night_nurse`                | r2_files table                                                                                                   |
| 0002 | `mature_carmella_unuscione`       | r2_files enhancements                                                                                            |
| 0003 | `condemned_hellfire_club`         | r2_files FK adjustments                                                                                          |
| 0004 | `cultured_ogun`                   | r2_files FK cascade fix                                                                                          |
| 0005 | `mixed_abomination`               | CRUD kernel: pgcrypto, set_updated_at, audit_logs, entity_versions, mutation_batches, contacts                   |
| 0006 | `quick_firelord`                  | Advisory engine: advisories, advisory_evidence                                                                   |
| 0007 | `petite_corsair`                  | r2_files checksum column                                                                                         |
| 0008 | `easy_dreaming_celestial`         | Workflow engine: workflow_rules, workflow_executions                                                             |
| 0009 | `sparkling_namorita`              | Workflow executions enhancements, entity_versions fork fields, audit_logs actor fields                           |
| 0010 | `unusual_korath`                  | **Phase A:** All ERP spine tables, custom fields, entity views, LiteMetadata, aliasing, semantic terms (45K SQL) |
| 0011 | `phase_a_postgres_best_practices` | BRIN indexes, covering indexes, partial indexes for soft-delete                                                  |
| 0012 | `phase_a_seed_defaults`           | `seed_org_defaults()` function: currencies, UOM, alias sets, meta_assets, entity views, number sequences         |

---

## 10. Seed Data (seed_org_defaults function)

Called during org creation. Seeds:

| Category             | Data                                               |
| -------------------- | -------------------------------------------------- |
| **Currencies**       | MYR (base), USD, SGD, EUR                          |
| **UOM**              | pcs, kg, L, m, box, hr, g, mL                      |
| **UOM Conversions**  | kg ↔ g (1000), L ↔ mL (1000)                       |
| **Alias Sets**       | `default_system` (is_default=true, is_system=true) |
| **Resolution Rules** | org default → default_system                       |
| **Meta Assets**      | Rows for all existing tables                       |
| **Entity Views**     | Default table view per entity type                 |
| **Number Sequences** | Per entity type with sensible prefixes             |

---

## 11. Tooling

### 11.1 Schema Lint (`pnpm db:lint`)

`packages/database/src/scripts/schema-lint.ts` — 8 rules:

| Rule                 | Severity | Check                              |
| -------------------- | -------- | ---------------------------------- |
| `has-base-columns`   | error    | id, org_id, created_at present     |
| `has-tenant-policy`  | error    | tenantPolicy/crudPolicy in config  |
| `has-org-check`      | error    | org_not_empty CHECK constraint     |
| `has-org-id-index`   | error    | (org_id, id) index                 |
| `no-float-money`     | error    | No real/double on money columns    |
| `snake-case-columns` | warning  | All column DB names are snake_case |
| `has-custom-data`    | warning  | ERP entity tables have customData  |
| `naming-convention`  | warning  | Table name is plural snake_case    |

### 11.2 Entity Generator (`pnpm entity:new <name>`)

`packages/database/src/scripts/entity-new.ts` — generates 4 files:

1. `packages/database/src/schema/<name>.ts` — Drizzle table
2. `packages/crud/src/handlers/<name>.ts` — CRUD handler stub
3. `packages/crud/src/__tests__/<name>.smoke.test.ts` — Test stub
4. `apps/web/app/actions/<name>.ts` — Server action stub

Supports flags: `--company`, `--site`, `--doc-number`

**Manual wiring required after generation** (printed as instructions):

- Add export to `packages/database/src/schema/index.ts`
- Add to `ENTITY_TYPES` in `packages/canon/src/types/entity.ts`
- Add to `ACTION_TYPES` in `packages/canon/src/types/action.ts`
- Add to `HANDLER_REGISTRY` in `packages/crud/src/mutate.ts`
- Seed `meta_assets` rows for the new table + columns
- Create default `entity_views` row

> **Note:** The PRD specifies auto-updating these files. Current implementation prints manual instructions instead (safer — avoids AST manipulation bugs). Auto-update is a future enhancement.

### 11.3 Drizzle Kit Commands

| Command            | Purpose                             |
| ------------------ | ----------------------------------- |
| `pnpm db:generate` | Generate migration from schema diff |
| `pnpm db:migrate`  | Apply pending migrations            |
| `pnpm db:push`     | Push schema directly (dev only)     |
| `pnpm db:studio`   | Open Drizzle Studio GUI             |

---

## 12. Custom Field Architecture

### 12.1 Three-Layer Storage

| Layer          | Storage                                                 | Who Controls   | Migration Required |
| -------------- | ------------------------------------------------------- | -------------- | ------------------ |
| Core columns   | `baseEntityColumns`                                     | Developer      | Yes                |
| Module columns | Entity-specific typed fields                            | Developer      | Yes                |
| Custom fields  | `custom_data` JSONB + `custom_field_values` typed index | Org admin (UI) | **No**             |

### 12.2 Data Flow

```
Admin creates field definition → custom_fields row
User saves entity → custom_data JSONB blob updated
  → validateCustomData() checks against field defs
  → syncCustomFieldValues() upserts typed index rows (fire-and-forget)
  → On sync failure → custom_field_sync_queue row for retry
```

### 12.3 Storage Modes

| Mode                   | Behavior                                                        |
| ---------------------- | --------------------------------------------------------------- |
| `jsonb_only` (default) | Value stored only in `custom_data` JSONB                        |
| `indexed`              | Value stored in JSONB AND in `custom_field_values` typed column |

### 12.4 Schema Hash (drift detection)

`computeSchemaHash(fieldType, typeConfig, storageMode, isRequired?, isUnique?)` — djb2 hash of field definition. Stored on `custom_fields.schema_hash`. Detects records written under old schema for repair.

### 12.5 Data Type Catalog (15 governed types)

**File:** `packages/canon/src/enums/data-types.ts` + `packages/canon/src/schemas/data-types.ts` + `packages/canon/src/validators/custom-field-value.ts`

Admins can ONLY choose from this governed list. No free-form types.

#### Type → Storage Column Mapping

| Data Type    | Postgres Column | `type_config` Shape                                             | Validation                                          |
| ------------ | --------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| `short_text` | `value_text`    | `{ maxLength: int 1-4000, default 255 }`                        | `typeof === 'string'`, length ≤ maxLength           |
| `long_text`  | `value_text`    | `{ maxLength?: int 1-100000 }`                                  | `typeof === 'string'`, optional length check        |
| `integer`    | `value_int`     | `{ min?: int, max?: int }`                                      | `Number.isInteger()`, within min/max                |
| `decimal`    | `value_numeric` | `{ precision: int 1-38 default 18, scale: int 0-18 default 6 }` | `typeof === 'number'`, `Number.isFinite()`          |
| `money`      | `value_int`     | `{ currencyField?: string }`                                    | `Number.isInteger()` (minor units)                  |
| `boolean`    | `value_bool`    | `{}`                                                            | `typeof === 'boolean'`                              |
| `date`       | `value_date`    | `{ minDate?: string, maxDate?: string }`                        | ISO 8601 date (`YYYY-MM-DD`) regex                  |
| `datetime`   | `value_ts`      | `{}`                                                            | ISO 8601 datetime, `new Date()` parseable           |
| `enum`       | `value_text`    | `{ choices: string[] min 1 max 100 }`                           | value ∈ choices                                     |
| `multi_enum` | `value_json`    | `{ choices: string[] min 1 max 100, maxSelections?: int }`      | Array, every item ∈ choices, length ≤ maxSelections |
| `email`      | `value_text`    | `{}`                                                            | Basic email regex                                   |
| `phone`      | `value_text`    | `{}`                                                            | Non-empty string                                    |
| `url`        | `value_text`    | `{}`                                                            | Starts with `http://` or `https://`                 |
| `entity_ref` | `value_uuid`    | `{ targetEntity: string }`                                      | Valid UUID (RFC 4122 regex)                         |
| `json`       | `value_json`    | `{ schema?: Record<string, unknown> }`                          | `typeof === 'object'`, not null, not array          |

#### type_config Zod Schemas

Each data type has a Zod schema in `packages/canon/src/schemas/data-types.ts` (`TYPE_CONFIG_SCHEMAS`). Validated at custom field creation time via `validateTypeConfig(dataType, config)`. DB CHECK constraints provide a safety net:

```sql
CHECK (jsonb_typeof(type_config) = 'object')
CHECK (field_type NOT IN ('enum','multi_enum') OR type_config ? 'choices')
CHECK (field_type != 'short_text'              OR type_config ? 'maxLength')
CHECK (field_type != 'entity_ref'              OR type_config ? 'targetEntity')
```

#### Value Validation

`validateFieldValue(dataType, typeConfig, value)` in `packages/canon/src/validators/custom-field-value.ts` — called by `validateCustomData()` in the kernel before every entity write.

#### Value Column Routing

`getValueColumn(dataType)` returns the correct `value_*` column name from `DATA_TYPE_VALUE_COLUMN_MAP`. Used by `syncCustomFieldValues()` to upsert into the typed index table.

---

## 13. TypeScript Architecture

### 13.1 Package Config

```
packages/database/
├── tsconfig.json          # composite: true, declaration: true
├── tsconfig.build.json    # composite: false (for tsup DTS)
├── drizzle.config.ts      # schema: ['./src/schema/*.ts']
├── package.json           # exports: { ".": "./src/index.ts" }
└── src/
    ├── db.ts              # db, dbRo, getDb, DbInstance
    ├── index.ts            # Barrel: db + schema + helpers + drizzle-orm re-exports
    ├── helpers/
    │   ├── base-entity.ts  # baseEntityColumns (10 cols)
    │   ├── erp-entity.ts   # erpEntityColumns (13 cols)
    │   ├── field-types.ts  # 16 column helpers
    │   ├── standard-indexes.ts  # erpIndexes(), docIndexes()
    │   └── tenant-policy.ts     # tenantPolicy(), ownerPolicy()
    ├── schema/             # 30 table definitions + relations + barrel
    ├── scripts/
    │   ├── schema-lint.ts  # 8-rule schema linter
    │   └── entity-new.ts   # Entity generator (4 files)
    └── triggers/
        └── set-updated-at.sql  # K-08 trigger function
```

### 13.2 Barrel Exports (index.ts)

The barrel re-exports:

- **Singletons:** `db`, `dbRo`, `getDb`, `DbInstance`
- **All 30 tables** + their inferred types (Select + Insert)
- **Relations:** `usersRelations`, `r2FilesRelations`
- **Helpers:** `tenantPolicy`, `ownerPolicy`, `baseEntityColumns`, `erpEntityColumns`, `erpIndexes`, `docIndexes`
- **Column helpers:** 16 functions from `field-types.ts`
- **Drizzle operators:** `eq`, `and`, `or`, `sql`, `desc`, `asc`, `like`, `ilike`, `inArray`, `notInArray`, `isNull`, `isNotNull`

---

## 14. Invariants

| ID           | Rule                                                | Enforcement                                                |
| ------------ | --------------------------------------------------- | ---------------------------------------------------------- |
| K-01         | `mutate()` is the only way to write domain data     | ESLint `no-restricted-syntax` on `db.insert/update/delete` |
| K-02         | Single DB transaction per mutation                  | `db.transaction()` in mutate.ts                            |
| K-03         | Every mutation writes audit_logs + entity_versions  | Kernel code in transaction                                 |
| K-04         | `expectedVersion` required on update/delete/restore | Kernel validation                                          |
| K-08         | `updated_at` set by DB trigger, not app code        | `public.set_updated_at()` trigger                          |
| K-10         | `idempotencyKey` for create only                    | Kernel + unique partial index                              |
| K-11         | System columns stripped from input                  | `stripSystemColumns()` + handler allowlist                 |
| K-14         | Audit logs: actor check on writes                   | RLS policy with actor/channel condition                    |
| INVARIANT-RO | No writes on `dbRo`                                 | ESLint rules + naming convention                           |
| INVARIANT-07 | RBAC policy gate before mutation                    | `enforcePolicy()` in mutate.ts                             |

---

## 15. Future-Proofing

The current schema is designed to not block these future capabilities:

| Feature                     | Phase  | Schema Ready                                                |
| --------------------------- | ------ | ----------------------------------------------------------- |
| Computed custom fields      | D      | `custom_fields` can add `is_computed` + `compute_expr`      |
| Temporal truth (accounting) | D      | Ledger tables can add `effective_from/to`                   |
| Read model projections      | D      | Convention: `projections` schema on `dbRo`                  |
| Partitioning                | Future | audit_logs by month, custom_field_values by entity_type     |
| CDC for analytics           | Future | Tables are CDC-ready: stable UUIDs, updated_at, soft-delete |
| Alias resolution engine     | B/C    | Tables + indexes exist, strategy pattern in code            |
| Format rules                | C      | Add `meta_format_rules` table                               |
