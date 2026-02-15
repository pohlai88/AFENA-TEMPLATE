# Phase A — ERP Database Schema Governance (Typed Custom Fields)

> **Superseded** by [database.architecture.md](./database.architecture.md) §4 Schema Design.
> This document is historical; do not edit.
> If conflicts exist, the consolidated doc wins.
> **Ratified:** 2026-02-14

Lock every ERP table into a governed template so nothing drifts — combining ERPNext's user-extensible custom fields (typed + governed), Retool's dynamic introspection via a typed index table, Neon's RW/RO dual compute for read scaling, and a LiteMetadata registry for business truth — all built on the existing CRUD-SAP kernel.

> **Implementation Status (2026-02-13):** All 12 core steps complete. RW/RO dual compute, canon enums, column helpers (`baseEntityColumns`, `erpEntityColumns`, `docEntityColumns`), spine tables (companies, sites, currencies, UOM), custom fields (15 types, typed index, JSONB dual storage), entity views, LiteMetadata + aliasing + semantic terms, 8-rule schema lint, entity generator script (~20+ files + 8 registry auto-wires), migrations 0010–0012 applied. 43/43 tests passing.
>
> **Doc–Code Audit (2026-02-13):** 33 matches, 7 drift items fixed, 1 missing item annotated. Key corrections: `docEntityColumns` third tier documented, `schema_hash` uses djb2 (not SHA-256), `meta_aliases.search_text` is trigger-populated (not GENERATED), `statusColumn()` takes only `name` (CHECK at table level), entity generator path corrected to `src/scripts/`, Drizzle partial-index limitation annotated.
>
> **Deferred by Design (not gaps — additive when needed):**
>
> - **`search_index` materialized view** — FTS via tsvector column + GIN index instead (simpler, sufficient)
> - **`audit_logs` partitioning** — table exists unpartitioned; partition when volume warrants it

---

## Design Philosophy

**Three layers of schema truth:**

| Layer              | What                                                 | Who Controls          | Storage                                                                        |
| ------------------ | ---------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------ |
| **Core columns**   | `baseEntityColumns` + ERP axis keys                  | Developer (migration) | Drizzle schema files                                                           |
| **Module columns** | Entity-specific typed fields                         | Developer (migration) | Drizzle schema files                                                           |
| **Custom fields**  | User-defined fields at runtime, **typed + governed** | Org admin (UI)        | `custom_fields` meta → `custom_data` JSONB + `custom_field_values` typed index |

Custom fields are "no migrations" but **strictly governed** by the Data Type catalog. Admins can only choose from governed types. Values are stored in JSONB for convenience AND in a typed index table for querying/sorting/filtering.

---

## A0. Neon RW/RO Dual Compute — Read Scaling from Day 1

Neon read replicas are independent compute endpoints serving reads from the same storage (no data duplication). This gives us a "transaction vs query" split with zero infra overhead.

### Two connection strings, two DB singletons

**File:** `packages/database/src/db.ts` (upgrade existing)

```typescript
// RW compute — writes + transactional reads
export const db = drizzle(neon(DATABASE_URL), { schema });

// RO compute — list pages, dashboards, search, reporting
export const dbRo = drizzle(neon(DATABASE_URL_RO ?? DATABASE_URL), { schema });
```

**Fallback:** if `DATABASE_URL_RO` is not set, `dbRo` falls back to `DATABASE_URL` (dev/preview environments).

### Routing Rules

| Route to        | Use Cases                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **`db` (RW)**   | `mutate()` writes, `SELECT … FOR UPDATE`, number sequence allocation, read-after-write flows                                       |
| **`dbRo` (RO)** | `listEntities()`, `readEntity()` (non-critical), search, dashboards, `custom_field_values` filtering, metadata browsing, reporting |

### Read-After-Write Stickiness

Read replicas are **eventually consistent** (small lag). After a write, the app must read from RW briefly:

- `mutate()` returns a receipt with `entityId` + `version`
- The detail page after create/update uses `db` (RW) if `?freshWrite=true` query param or a short-lived cookie
- List pages always use `dbRo` (stale-by-seconds is acceptable)
- Implementation: `getDb(options?: { forcePrimary?: boolean })` helper that returns `db` or `dbRo`

### Where to wire

- `packages/crud/src/read.ts` → `readEntity()` and `listEntities()` use `dbRo` by default, accept `forcePrimary` option
- `packages/search/src/adapters/*.ts` → all search adapters use `dbRo`
- `packages/crud/src/mutate.ts` → always `db` (RW)
- `packages/workflow/src/engine.ts` → execution log writes use `db` (RW)

### Write safety for `dbRo` (prevent accidental writes)

Three layers of protection:

1. **Export control:** `dbRo` is exported from `packages/database/src/index.ts` as `dbRo` (not `db`) — naming makes intent clear
2. **ESLint rule:** add `no-restricted-syntax` rule: forbid `dbRo.insert`, `dbRo.update`, `dbRo.delete` patterns in all packages
3. **DB role (recommended):** connect `DATABASE_URL_RO` with a Neon read-only database role (`SELECT` only, no `INSERT/UPDATE/DELETE` grants) — ultimate safety net

---

## A1. Data Type Catalog — The Core of the System

**File:** `packages/canon/src/enums/data-types.ts`

Admins can ONLY choose from this governed list. No free-form types.

### Governed Data Types (15 types, covers 95% of ERP)

| Data Type    | Postgres Storage          | `type_config` Shape                             | Example                          |
| ------------ | ------------------------- | ----------------------------------------------- | -------------------------------- |
| `short_text` | `value_text`              | `{ maxLength: number }`                         | Customer PO ref (max 80 chars)   |
| `long_text`  | `value_text`              | `{ maxLength?: number }`                        | Internal notes                   |
| `integer`    | `value_int`               | `{ min?: number, max?: number }`                | Headcount, days                  |
| `decimal`    | `value_numeric`           | `{ precision: number, scale: number }`          | Weight, percentage               |
| `money`      | `value_int` (minor units) | `{ currencyField?: string }`                    | Deposit amount (cents)           |
| `boolean`    | `value_bool`              | `{}`                                            | Is VIP, Has warranty             |
| `date`       | `value_date`              | `{ minDate?: string, maxDate?: string }`        | Warranty expiry                  |
| `datetime`   | `value_ts`                | `{}`                                            | Last contacted at                |
| `enum`       | `value_text`              | `{ choices: string[] }`                         | Priority, loyalty tier           |
| `multi_enum` | `value_json` (string[])   | `{ choices: string[], maxSelections?: number }` | Tags, categories                 |
| `email`      | `value_text`              | `{}`                                            | Alternate email                  |
| `phone`      | `value_text`              | `{}`                                            | Fax number                       |
| `url`        | `value_text`              | `{}`                                            | LinkedIn profile                 |
| `entity_ref` | `value_uuid`              | `{ targetEntity: string }`                      | Referred-by contact              |
| `json`       | `value_json`              | `{ schema?: object }`                           | Structured metadata (controlled) |

**Rules:**

- `priority` is NOT a special type — it's `enum` with `{ choices: ['low','medium','high','urgent'] }`. No special cases.
- `money` in custom fields stores minor units in `value_int`. The `currencyField` in `type_config` optionally points to another custom field or the document's `currency_code`.
- `entity_ref` stores a UUID and `targetEntity` tells the UI which entity to link to.
- `json` is allowed but controlled — optional JSON Schema in `type_config` for validation.

### `type_config` Zod Schemas (in canon)

Each data type gets a Zod schema for its `type_config`, enforced at custom field creation time:

```typescript
// packages/canon/src/schemas/data-types.ts
export const TYPE_CONFIG_SCHEMAS = {
  short_text: z.object({
    maxLength: z.number().int().min(1).max(4000).default(255),
  }),
  long_text: z.object({
    maxLength: z.number().int().min(1).max(100000).optional(),
  }),
  integer: z.object({
    min: z.number().int().optional(),
    max: z.number().int().optional(),
  }),
  decimal: z.object({
    precision: z.number().int().min(1).max(38).default(18),
    scale: z.number().int().min(0).max(18).default(6),
  }),
  money: z.object({ currencyField: z.string().optional() }),
  boolean: z.object({}),
  date: z.object({
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
  }),
  datetime: z.object({}),
  enum: z.object({ choices: z.array(z.string().min(1)).min(1).max(100) }),
  multi_enum: z.object({
    choices: z.array(z.string().min(1)).min(1).max(100),
    maxSelections: z.number().int().min(1).optional(),
  }),
  email: z.object({}),
  phone: z.object({}),
  url: z.object({}),
  entity_ref: z.object({ targetEntity: z.string().min(1) }),
  json: z.object({ schema: z.record(z.unknown()).optional() }),
} as const;
```

### Value Validation per Type (in canon)

Each data type also gets a value validator:

```typescript
// packages/canon/src/validators/custom-field-value.ts
// validateFieldValue(dataType, typeConfig, value) → { valid, error? }
```

| Data Type    | Validation                                                          |
| ------------ | ------------------------------------------------------------------- |
| `short_text` | `typeof === 'string'`, length ≤ `maxLength`                         |
| `integer`    | `Number.isInteger()`, within `min`/`max`                            |
| `decimal`    | `typeof === 'number'`, `Number.isFinite()`                          |
| `money`      | `Number.isInteger()` (minor units)                                  |
| `boolean`    | `typeof === 'boolean'`                                              |
| `date`       | ISO 8601 date string (`YYYY-MM-DD`)                                 |
| `datetime`   | ISO 8601 datetime string                                            |
| `enum`       | value ∈ `choices`                                                   |
| `multi_enum` | `Array.isArray()`, every item ∈ `choices`, length ≤ `maxSelections` |
| `email`      | basic email regex                                                   |
| `phone`      | non-empty string (international formats vary)                       |
| `url`        | starts with `http://` or `https://`                                 |
| `entity_ref` | valid UUID format                                                   |
| `json`       | `typeof === 'object'`, optional JSON Schema validation              |

---

## A2. ERP Axis Keys — Lock Before 50 Tables

### Upgrade `baseEntityColumns` → `erpEntityColumns`

```
Current baseEntityColumns:
  id, orgId, createdAt, updatedAt, createdBy, updatedBy, version, isDeleted, deletedAt, deletedBy

New erpEntityColumns (superset):
  id, orgId, companyId?, siteId?, createdAt, updatedAt, createdBy, updatedBy,
  version, isDeleted, deletedAt, deletedBy, customData

New docEntityColumns (superset of erpEntityColumns — lifecycle entities):
  ...erpEntityColumns, docStatus, submittedAt, submittedBy,
  cancelledAt, cancelledBy, amendedFromId
```

**New columns:**

| Column        | Type                          | When Required               | Why                                                  |
| ------------- | ----------------------------- | --------------------------- | ---------------------------------------------------- |
| `company_id`  | `uuid` FK → `companies.id`    | Accounting/finance modules  | Multi-company ERP (legal entity isolation)           |
| `site_id`     | `uuid` FK → `sites.id`        | Inventory/warehouse modules | Multi-site operations                                |
| `custom_data` | `jsonb NOT NULL DEFAULT '{}'` | ALL ERP domain entities     | Typed custom field values (governed, not open-ended) |

**Rules:**

- `baseEntityColumns` stays unchanged (system tables, simple entities without lifecycle)
- New `erpEntityColumns` extends it with `companyId?`, `siteId?`, `customData`
- New `docEntityColumns` extends `erpEntityColumns` with `docStatus`, `submittedAt/By`, `cancelledAt/By`, `amendedFromId` — for entities with a lifecycle state machine (draft → submitted → active → cancelled)
- Accounting modules MUST use `erpEntityColumns` (or `docEntityColumns`) with `companyId` required
- Inventory modules MUST use `erpEntityColumns` (or `docEntityColumns`) with `siteId` required
- Entities with lifecycle (contacts, invoices, purchase orders) use `docEntityColumns`
- Simple spine entities (currencies, uom) can keep standalone columns

**Files:**

- `packages/database/src/helpers/erp-entity.ts`
- `packages/database/src/helpers/doc-entity.ts`

---

## A3. ERP Spine Tables (before any modules)

These 8 tables are the "skeleton" every ERP module depends on.

### 1. `companies` — Legal entity / accounting entity

```
...erpEntityColumns (orgId required, companyId = null for root company)
name              text NOT NULL
legal_name        text
registration_no   text
tax_id            text
base_currency     text NOT NULL DEFAULT 'MYR'  -- ISO 4217
fiscal_year_start integer DEFAULT 1            -- month (1=Jan)
address           jsonb
```

RLS: `tenantPolicy` (org-scoped)

### 2. `sites` — Warehouse / branch / plant

```
...erpEntityColumns (orgId required, companyId required)
name        text NOT NULL
code        text NOT NULL  -- short code: 'WH-KL', 'HQ'
type        text NOT NULL  -- CHECK from canon SiteType enum
address     jsonb
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, code)`

### 3. `currencies` — ISO 4217 reference (org-scoped copy)

```
id              uuid PK
org_id          text NOT NULL
code            text NOT NULL  -- 'MYR', 'USD', 'SGD'
name            text NOT NULL  -- 'Malaysian Ringgit'
symbol          text           -- 'RM', '$'
minor_units     integer NOT NULL DEFAULT 2  -- cents=2, JPY=0, BHD=3
is_base         boolean NOT NULL DEFAULT false
fx_rate_to_base numeric(20,10) DEFAULT 1
enabled         boolean NOT NULL DEFAULT true
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, code)`
CHECK: exactly one `is_base = true` per org (enforced in kernel, advisory in DB)

### 4. `uom` — Units of measure

```
id      uuid PK
org_id  text NOT NULL
name    text NOT NULL  -- 'Kilogram', 'Piece', 'Litre'
symbol  text NOT NULL  -- 'kg', 'pcs', 'L'
type    text NOT NULL  -- CHECK from canon UomType enum
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, symbol)`

### 5. `uom_conversions` — Unit conversion factors

```
id          uuid PK
org_id      text NOT NULL
from_uom_id uuid FK → uom.id
to_uom_id   uuid FK → uom.id
factor      numeric(20,10) NOT NULL  -- 1 kg = 1000 g → factor=1000
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, from_uom_id, to_uom_id)`

### 6. `number_sequences` — Document numbering (invoice_no, po_no)

```
id          uuid PK
org_id      text NOT NULL
company_id  uuid FK → companies.id  (nullable for org-wide sequences)
entity_type text NOT NULL  -- 'invoices', 'purchase_orders'
prefix      text NOT NULL DEFAULT ''  -- 'INV-', 'PO-'
suffix      text NOT NULL DEFAULT ''
next_value  integer NOT NULL DEFAULT 1
pad_length  integer NOT NULL DEFAULT 5  -- INV-00001
fiscal_year integer  -- null = perpetual, else resets per fiscal year
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, company_id, entity_type, fiscal_year)`
NOTE: `next_value` increment uses `UPDATE ... RETURNING` with row-level lock to prevent gaps under concurrency.

### 7. `custom_fields` — Typed field definitions (governed)

```
id              uuid PK
org_id          text NOT NULL
entity_type     text NOT NULL       -- 'contacts', 'invoices'
field_name      text NOT NULL       -- 'loyalty_tier' (snake_case, validated)
field_label     text NOT NULL       -- 'Loyalty Tier' (display)
field_type      text NOT NULL       -- CHECK from canon DATA_TYPES enum
type_config     jsonb NOT NULL DEFAULT '{}'  -- validated per field_type (see A1)
storage_mode    text NOT NULL DEFAULT 'jsonb_only'  -- CHECK: 'jsonb_only', 'indexed'
default_value   jsonb               -- typed default (NOT text), null = no default
is_required     boolean NOT NULL DEFAULT false
is_searchable   boolean NOT NULL DEFAULT false
is_filterable   boolean NOT NULL DEFAULT false
is_sortable     boolean NOT NULL DEFAULT false
display_order   integer NOT NULL DEFAULT 0
section         text                -- UI grouping: 'General', 'Financial'
created_at      timestamptz NOT NULL DEFAULT now()
created_by      text NOT NULL DEFAULT (auth.user_id())
updated_at      timestamptz NOT NULL DEFAULT now()
updated_by      text NOT NULL DEFAULT (auth.user_id())
is_active       boolean NOT NULL DEFAULT true   -- soft-disable without deleting
is_locked       boolean NOT NULL DEFAULT false  -- system/protected fields (can't be edited by admins)
is_deprecated   boolean NOT NULL DEFAULT false  -- hidden in UI but still readable (migration path)
is_unique       boolean NOT NULL DEFAULT false  -- enforce uniqueness per entity (e.g. 'external_id')
schema_hash     text NOT NULL                   -- hash of {field_type,type_config,is_required,storage_mode} for drift detection
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, entity_type, field_name)`
UNIQUE: `(org_id, entity_type, id)` — composite key for FK from `custom_field_values` (prevents cross-entity field corruption)
CHECK: `field_type IN (...)` from canon `DATA_TYPES`
CHECK: `storage_mode IN ('jsonb_only', 'indexed')`
CHECK: `field_name ~ '^[a-z][a-z0-9_]*$'` (snake_case enforcement)
CHECK: `is_required = false OR default_value IS NOT NULL` — required fields must have a default (see note below)

**Hot query index (powers form rendering, table columns, validation):**

```sql
CREATE INDEX custom_fields_active_by_entity
  ON custom_fields (org_id, entity_type, display_order, field_name)
  WHERE is_active = true AND is_deprecated = false;
```

> **Drizzle limitation:** Partial indexes (`WHERE` clause) and expression indexes (`lower()`) cannot be expressed in the Drizzle schema builder. These indexes are created in the raw migration SQL (`0010_*.sql`) and are NOT represented in the Drizzle schema file. This is a known Drizzle ORM limitation — the same applies to partial unique indexes on `meta_alias_sets`, `meta_aliases`, `meta_value_aliases`, `meta_semantic_terms`, and the GIN search index on `meta_aliases`.

**DB-level `type_config` guardrails (prevent nonsense, not full validation):**

```sql
CHECK (jsonb_typeof(type_config) = 'object')
CHECK (field_type NOT IN ('enum','multi_enum') OR type_config ? 'choices')
CHECK (field_type != 'short_text'              OR type_config ? 'maxLength')
CHECK (field_type != 'entity_ref'              OR type_config ? 'targetEntity')
```

**Key design decisions:**

- `type_config` is validated by canon Zod schemas at write time (kernel enforces); DB CHECKs are a safety net for obvious bad states
- `default_value` is `jsonb` not `text` — stores typed defaults (number as number, not "42")
- `storage_mode = 'indexed'` means values are also written to `custom_field_values` for querying
- `is_active` allows disabling a field without losing data (soft-disable)
- `is_locked` prevents admin edits to system/protected fields (e.g. fields used by workflows)
- `is_deprecated` hides field in UI but keeps reading — migration path for removing fields safely
- `is_unique` enforces uniqueness per entity in kernel (e.g. "Customer External ID"); for `indexed` fields, a partial unique index can be added later
- `schema_hash` is deterministic: JSON stringify of `{fieldType, typeConfig, isRequired, isUnique, storageMode}` → `djb2` hash (prefixed `djb2:<hex>`). Stored on every field update. Entity rows can optionally store `custom_schema_hash` at write time to detect "records written under old schema" for repair/migration
- `field_name` regex CHECK prevents injection and ensures consistent naming
- **Required+default invariant:** required fields must have defaults. This means you cannot have a required field that _must be explicitly entered_ (no default). UI can still prompt users to override the default. If later you need "required but no default," remove the CHECK.

### 8. `custom_field_values` — Typed index table (Retool-style querying)

```
id              uuid PK DEFAULT gen_random_uuid()
org_id          text NOT NULL
entity_type     text NOT NULL
entity_id       uuid NOT NULL       -- FK to the domain entity row
field_id        uuid NOT NULL       -- composite FK (see below)
-- Typed value columns (exactly ONE is populated per row):
value_text      text
value_int       integer
value_numeric   numeric(20,10)
value_bool      boolean
value_date      date
value_ts        timestamptz
value_json      jsonb
value_uuid      uuid
-- Change tracking (audit + lineage)
updated_at      timestamptz NOT NULL DEFAULT now()
updated_by      text NOT NULL DEFAULT (auth.user_id())
source          text NOT NULL DEFAULT 'user'  -- CHECK: 'user','rule','import','system'
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, entity_id, field_id)` — one value per entity per field
CHECK: `source IN ('user', 'rule', 'import', 'system')`

**Exactly-one-typed-column CHECK (prevents silent data corruption):**

```sql
CHECK (
  (value_text    IS NOT NULL)::int +
  (value_int     IS NOT NULL)::int +
  (value_numeric IS NOT NULL)::int +
  (value_bool    IS NOT NULL)::int +
  (value_date    IS NOT NULL)::int +
  (value_ts      IS NOT NULL)::int +
  (value_json    IS NOT NULL)::int +
  (value_uuid    IS NOT NULL)::int
  = 1
)
```

**Composite FK (prevents cross-entity field corruption):**

```sql
FOREIGN KEY (org_id, entity_type, field_id)
  REFERENCES custom_fields (org_id, entity_type, id)
  ON DELETE RESTRICT
```

This ensures a `custom_field_values` row for `entity_type='contacts'` can only reference a `custom_fields` row where `entity_type='contacts'`. Prevents silent corruption.

NOTE: `entity_id` is NOT a FK (points to many tables) — enforced by index instead.

**Value clearing rule:** to clear a custom field value, **DELETE the row** `(org_id, entity_type, entity_id, field_id)`. You cannot set all typed columns to NULL because the exactly-one CHECK will reject it. This is intentional — absence of a row = no value.

**Always-on indexes (hot path):**

```
(org_id, entity_type, entity_id)               -- "show me all custom values for this entity"
(org_id, entity_type, field_id)                -- "show me all values for this field across entities"
```

**Conditional indexes (for filterable/sortable fields):**

```
(org_id, entity_type, field_id, value_text)    -- for short_text, enum, email, phone, url
(org_id, entity_type, field_id, value_int)     -- for integer, money
(org_id, entity_type, field_id, value_numeric) -- for decimal
(org_id, entity_type, field_id, value_date)    -- for date
(org_id, entity_type, field_id, value_ts)      -- for datetime
(org_id, entity_type, field_id, value_bool)    -- for boolean
(org_id, entity_type, field_id, value_uuid)    -- for entity_ref
```

**Data type → value column mapping:**

| Data Type                                                  | Value Column    |
| ---------------------------------------------------------- | --------------- |
| `short_text`, `long_text`, `enum`, `email`, `phone`, `url` | `value_text`    |
| `integer`, `money`                                         | `value_int`     |
| `decimal`                                                  | `value_numeric` |
| `boolean`                                                  | `value_bool`    |
| `date`                                                     | `value_date`    |
| `datetime`                                                 | `value_ts`      |
| `multi_enum`, `json`                                       | `value_json`    |
| `entity_ref`                                               | `value_uuid`    |

**How it works end-to-end:**

1. Org admin creates custom field: `{ entity_type: 'contacts', field_name: 'loyalty_tier', field_type: 'enum', type_config: { choices: ['gold','silver','bronze'] }, storage_mode: 'indexed', is_filterable: true }`
2. User creates/updates a contact with `custom_data: { loyalty_tier: 'gold' }`
3. Kernel validates: `'gold' ∈ ['gold','silver','bronze']` ✅
4. Kernel writes `custom_data` JSONB on the contacts row (via `db` RW)
5. Kernel upserts `custom_field_values` row: `{ entity_id, field_id, value_text: 'gold', source: 'user' }`
6. UI reads `custom_fields` to render a `<Select>` with gold/silver/bronze options (via `dbRo`)
7. Data table can filter/sort by `custom_field_values` with proper indexes (via `dbRo`)
8. Retool-style: introspect `custom_fields` → auto-generate columns, filters, forms

### 9. `entity_views` — Retool-style dynamic view definitions

```
id          uuid PK
org_id      text NOT NULL
entity_type text NOT NULL       -- 'contacts', 'invoices'
view_name   text NOT NULL       -- 'Default', 'Sales Team View'
view_type   text NOT NULL DEFAULT 'table'  -- CHECK: 'table','form','kanban','detail'
is_default  boolean NOT NULL DEFAULT false
is_system   boolean NOT NULL DEFAULT false  -- system views can't be deleted
created_at  timestamptz NOT NULL DEFAULT now()
created_by  text NOT NULL DEFAULT (auth.user_id())
updated_at  timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, entity_type, view_name)`

### 10. `entity_view_fields` — Fields in a view (order + config)

```
id              uuid PK
org_id          text NOT NULL
view_id         uuid NOT NULL FK → entity_views.id
field_source    text NOT NULL  -- CHECK: 'core','module','custom'
field_key       text NOT NULL  -- 'name' (core), 'loyalty_tier' (custom)
display_order   integer NOT NULL DEFAULT 0
is_visible      boolean NOT NULL DEFAULT true
is_sortable     boolean NOT NULL DEFAULT true
is_filterable   boolean NOT NULL DEFAULT true
column_width    integer          -- px, null = auto
component_override text          -- optional UI component name
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, view_id, field_key)`

**How entity views work:**

- Each entity type has a `Default` system view created by the entity generator
- Admins can create custom views (e.g. "Sales Team View" showing only relevant columns)
- `field_source = 'custom'` joins to `custom_fields` for type-aware rendering
- UI reads view definition → renders `<DataTable>` with correct columns, order, widths
- Views are served from `dbRo` (read-only)

---

## A4. Column Helper Registry — "ERP-Safe Types"

**File:** `packages/database/src/helpers/field-types.ts`

| Helper                  | Postgres Type                      | Usage                                                          |
| ----------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `moneyMinor(name)`      | `integer NOT NULL DEFAULT 0`       | All money amounts (cents/sen)                                  |
| `currencyCode(name)`    | `text NOT NULL DEFAULT 'MYR'`      | ISO 4217 code                                                  |
| `fxRate(name)`          | `numeric(20,10) DEFAULT 1`         | Exchange rate                                                  |
| `baseAmountMinor(name)` | `integer NOT NULL DEFAULT 0`       | Converted to base currency                                     |
| `qty(name)`             | `numeric(18,6) NOT NULL DEFAULT 0` | Inventory/manufacturing quantities                             |
| `uomRef(name)`          | `uuid` FK → `uom.id`               | Unit of measure reference                                      |
| `statusColumn(name)`    | `text NOT NULL`                    | Status fields (CHECK added at table level from canon enum)     |
| `emailColumn(name)`     | `text` + CHECK regex               | Email fields                                                   |
| `phoneColumn(name)`     | `text`                             | Phone fields (no CHECK — international formats vary)           |
| `addressJsonb(name)`    | `jsonb`                            | Structured: `{ line1, line2, city, state, postcode, country }` |
| `tagsArray(name)`       | `text[] DEFAULT '{}'`              | Tag arrays                                                     |
| `docNumber(name)`       | `text NOT NULL`                    | Document numbers (INV-00001)                                   |
| `companyRef()`          | `uuid` FK → `companies.id`         | Company reference                                              |
| `siteRef()`             | `uuid` FK → `sites.id`             | Site reference                                                 |
| `contactRef(name)`      | `uuid` FK → `contacts.id`          | Contact/partner reference                                      |
| `customData()`          | `jsonb NOT NULL DEFAULT '{}'`      | Custom field values (JSONB blob)                               |

### Money Pattern (document with currency conversion)

For any financial document (invoice, payment, journal entry):

```typescript
// Document header
...erpEntityColumns,
...moneyDocumentColumns('total'),  // → total_minor, currency_code, fx_rate, base_total_minor
```

`moneyDocumentColumns(prefix)` expands to:

- `{prefix}_minor: integer NOT NULL DEFAULT 0`
- `currency_code: text NOT NULL DEFAULT 'MYR'`
- `fx_rate: numeric(20,10) DEFAULT 1`
- `fx_source: text NOT NULL DEFAULT 'manual'` — CHECK: `'manual','rate_table','system'` (provenance for reconciliation)
- `fx_as_of: date` — rate date (null = spot rate at write time)
- `base_{prefix}_minor: integer NOT NULL DEFAULT 0`

**FX audit invariant:** every financial document records HOW and WHEN the rate was obtained. This makes later reconciliation, revaluation, and audit trivial. ERPNext stores similar provenance on GL entries.

---

## A5. Enum Governance — Canon as SSOT

**File:** `packages/canon/src/enums/index.ts`

All ERP enums live in canon. Pattern:

```typescript
// packages/canon/src/enums/doc-status.ts
export const DOC_STATUSES = ['draft', 'submitted', 'cancelled', 'amended'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
export const docStatusSchema = z.enum(DOC_STATUSES);
```

**Initial enums to define:**

| Enum                  | Values                                                                                                                         | Used By                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `DataType`            | short_text, long_text, integer, decimal, money, boolean, date, datetime, enum, multi_enum, email, phone, url, entity_ref, json | Custom fields — the master catalog |
| `StorageMode`         | jsonb_only, indexed                                                                                                            | Custom fields                      |
| `DocStatus`           | draft, submitted, cancelled, amended                                                                                           | All document entities              |
| `PaymentStatus`       | unpaid, partial, paid, overpaid, refunded                                                                                      | Invoices, bills                    |
| `SiteType`            | warehouse, branch, plant, office                                                                                               | Sites                              |
| `UomType`             | weight, volume, length, area, count, time, custom                                                                              | UOM                                |
| `ContactType`         | customer, supplier, lead, employee, other                                                                                      | Contacts (upgrade)                 |
| `FieldSource`         | user, rule, import, system                                                                                                     | Custom field value provenance      |
| `ViewType`            | table, form, kanban, detail                                                                                                    | Entity views                       |
| `FieldSourceType`     | core, module, custom                                                                                                           | Entity view fields                 |
| `MetaAssetType`       | table, column, view, pipeline, report, api                                                                                     | LiteMetadata                       |
| `MetaEdgeType`        | ingests, transforms, serves, derives                                                                                           | LiteMetadata lineage               |
| `MetaClassification`  | pii, financial, internal, public                                                                                               | LiteMetadata                       |
| `MetaQualityTier`     | gold, silver, bronze                                                                                                           | LiteMetadata                       |
| `MetaAliasTargetType` | asset, custom_field, metric, view_field, enum_value                                                                            | Meta aliases                       |
| `MetaAliasScopeType`  | org, team, role, user, locale, app_area                                                                                        | Alias resolution rules             |
| `FxSource`            | manual, rate_table, system                                                                                                     | Money document FX provenance       |

---

## A6. Standard Indexes — Every ERP Table

**File:** `packages/database/src/helpers/standard-indexes.ts`

Helper that generates the minimum required indexes:

```typescript
export function erpIndexes(tableName: string, table: { orgId; id; createdAt }) {
  return [
    index(`${tableName}_org_id_idx`).on(table.orgId, table.id),
    index(`${tableName}_org_created_idx`).on(table.orgId, table.createdAt),
    check(`${tableName}_org_not_empty`, sql`org_id <> ''`),
    tenantPolicy(table),
  ];
}
```

For document tables, additional:

```typescript
export function docIndexes(tableName: string, table: { orgId; docNo; createdAt; partnerId? }) {
  return [
    ...erpIndexes(tableName, table),
    uniqueIndex(`${tableName}_org_doc_no_idx`).on(table.orgId, table.docNo),
    // optional partner index if table has partnerId
  ];
}
```

---

## A7. LiteMetadata Registry — OpenMetadata-Inspired Business Truth

**Files:** `packages/database/src/schema/meta-*.ts`

A lightweight metadata layer that tracks what data exists, where it flows, and how healthy it is. This turns the ERP from "data storage" into a "business truth platform" — ingest → transform → model → serve.

### `meta_assets` — What exists in the data world

```
id              uuid PK
org_id          text NOT NULL
asset_type      text NOT NULL       -- CHECK from canon MetaAssetType
asset_key       text NOT NULL       -- 'db.public.invoices.total_minor'
canonical_name  text NOT NULL       -- machine-stable: 'total_minor' (never changes, used by rules/queries)
display_name    text NOT NULL       -- default human label: 'Invoice Total (Minor Units)'
description     text
owner_team      text                -- 'finance', 'engineering'
steward_user    text                -- userId of data steward
classification  text                -- CHECK from canon MetaClassification
quality_tier    text                -- CHECK from canon MetaQualityTier
tags            text[] DEFAULT '{}'
created_at      timestamptz NOT NULL DEFAULT now()
updated_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, asset_key)`

**Canonical vs Display name:**

- `canonical_name` is machine-stable — used in formulas, rules, queries. Never changes after creation.
- `display_name` is the default human label — aliases override this, not `canonical_name`.
- This prevents "renames breaking formulas".

### `meta_lineage_edges` — How data flows

```
id              uuid PK
org_id          text NOT NULL
from_asset_id   uuid NOT NULL FK → meta_assets.id
to_asset_id     uuid NOT NULL FK → meta_assets.id
edge_type       text NOT NULL       -- CHECK from canon MetaEdgeType
description     text
created_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, from_asset_id, to_asset_id, edge_type)`

### `meta_quality_checks` — Data quality rules

```
id              uuid PK
org_id          text NOT NULL
target_asset_id uuid NOT NULL FK → meta_assets.id
rule_type       text NOT NULL       -- 'not_null', 'unique', 'range', 'freshness', 'custom'
config          jsonb NOT NULL DEFAULT '{}'
last_run_at     timestamptz
last_run_status text                -- 'pass', 'fail', 'error'
last_run_detail jsonb
created_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`

**How it works:**

- Entity generator auto-registers `meta_assets` for new tables + columns
- Lineage edges are added when data flows are defined (e.g. "invoices.total derives from invoice_lines.amount")
- Quality checks run as scheduled jobs (Phase D) — results stored for dashboard
- All metadata reads go through `dbRo`
- This is the foundation for a future data catalog UI and governance dashboard

**Phase A scope:** create tables + seed initial assets for existing entities. Quality check execution is Phase D.

### `meta_alias_sets` — Naming vocabularies (team/locale/glossary)

Aliases let business users rename, localize, and stabilize meaning **without changing physical schema**. DB column stays `total_minor`, Finance calls it "Invoice Total (RM)", Sales calls it "AR Invoice Total".

```
id          uuid PK
org_id      text NOT NULL
set_key     text NOT NULL       -- snake_case: 'finance_glossary', 'ms_my_locale'
name        text NOT NULL       -- 'Finance Glossary'
description text
locale      text                -- 'ms-MY', 'en-US', 'vi-VN' (null = language-agnostic)
is_default  boolean NOT NULL DEFAULT false  -- only one per org
is_system   boolean NOT NULL DEFAULT false  -- system sets can't be deleted
is_deleted  boolean NOT NULL DEFAULT false
deleted_at  timestamptz
deleted_by  text
created_at  timestamptz NOT NULL DEFAULT now()
created_by  text NOT NULL DEFAULT (auth.user_id())
updated_at  timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
CHECK: `set_key ~ '^[a-z][a-z0-9_]*$'`

**Partial unique indexes (Postgres requires CREATE UNIQUE INDEX for WHERE clauses):**

```sql
CREATE UNIQUE INDEX meta_alias_sets_set_key_uniq
  ON meta_alias_sets (org_id, set_key)
  WHERE is_deleted = false;
```

**One-default-per-org (DB-enforced, not just kernel):**

```sql
CREATE UNIQUE INDEX meta_alias_sets_one_default_per_org
  ON meta_alias_sets (org_id)
  WHERE is_default = true AND is_deleted = false;
```

### `meta_aliases` — The alias records (versioned, scoped)

Maps a human-readable alias to a stable target key (asset, custom field, metric, or view field).

```
id              uuid PK
org_id          text NOT NULL
alias_set_id    uuid NOT NULL FK → meta_alias_sets.id
target_type     text NOT NULL       -- CHECK from canon MetaAliasTargetType
target_key      text NOT NULL       -- stable key (see conventions below)
alias           text NOT NULL       -- the human name: 'Invoice Total (RM)'
alias_slug      text                -- URL-safe token: 'invoice-total-rm' (for exports, CSV headers, links)
description     text
synonyms        text[] DEFAULT '{}' -- for search: ['AR total', 'jumlah invois']
is_primary      boolean NOT NULL DEFAULT true
effective_from  timestamptz NOT NULL DEFAULT now()
effective_to    timestamptz         -- null = currently active
-- Search column for alias-aware querying (trigger-populated, NOT generated —
-- array_to_string() is not IMMUTABLE so Postgres rejects GENERATED ALWAYS AS)
search_text     text  -- populated by INSERT/UPDATE trigger: alias || ' ' || array_to_string(synonyms, ' ') || ' ' || target_key
is_deleted      boolean NOT NULL DEFAULT false
deleted_at      timestamptz
deleted_by      text
created_at      timestamptz NOT NULL DEFAULT now()
created_by      text NOT NULL DEFAULT (auth.user_id())
updated_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
**Partial unique indexes (Postgres requires CREATE UNIQUE INDEX for WHERE clauses):**

```sql
CREATE UNIQUE INDEX meta_aliases_active_target_uniq
  ON meta_aliases (org_id, alias_set_id, target_key)
  WHERE effective_to IS NULL AND is_deleted = false;

CREATE UNIQUE INDEX meta_aliases_active_slug_uniq
  ON meta_aliases (org_id, alias_set_id, alias_slug)
  WHERE effective_to IS NULL AND is_deleted = false AND alias_slug IS NOT NULL;
```

CHECK: `target_type IN (...)` from canon
CHECK: `alias <> ''` — no empty aliases
CHECK: `alias_slug IS NULL OR alias_slug ~ '^[a-z0-9][a-z0-9-]*$'` — kebab-case
INDEX: `GIN(to_tsvector('simple', search_text))` — enables "search by business term" (type "AR total" → finds `db.public.invoices.total_minor`)

**Target key format CHECKs (drift protection):**

```sql
CHECK (target_type != 'asset'        OR target_key LIKE 'db.%')
CHECK (target_type != 'custom_field'  OR target_key LIKE '%.custom:%')
CHECK (target_type != 'metric'        OR target_key LIKE 'metric:%')
CHECK (target_type != 'view_field'    OR target_key LIKE 'view:%')
CHECK (target_type != 'enum_value'    OR target_key LIKE 'enum:%')
```

These CHECKs prevent target_key format drift at the DB level.

**Stable `target_key` conventions (standardized now, everything depends on it):**

| Target Type    | Key Format                                   | Example                          |
| -------------- | -------------------------------------------- | -------------------------------- |
| `asset`        | `db.<schema>.<table>.<column>`               | `db.public.invoices.total_minor` |
| `custom_field` | `<entity_type>.custom:<field_name>`          | `contacts.custom:loyalty_tier`   |
| `metric`       | `metric:<metric_key>`                        | `metric:ar_days`                 |
| `view_field`   | `view:<entity_type>:<view_name>:<field_key>` | `view:contacts:Default:name`     |

### `meta_alias_resolution_rules` — Who wins, how alias sets are chosen

Determines the "active alias set" per context (org, team, role, user, locale, app area). This is what makes aliasing a **real semantic layer** rather than a static dictionary.

```
id              uuid PK
org_id          text NOT NULL
scope_type      text NOT NULL       -- CHECK from canon MetaAliasScopeType
scope_key       text NOT NULL       -- 'finance', 'role:controller', 'user:<uuid>', 'ms-MY', 'dashboard'
alias_set_id    uuid NOT NULL FK → meta_alias_sets.id
priority        integer NOT NULL DEFAULT 0  -- higher = wins
is_active       boolean NOT NULL DEFAULT true
created_at      timestamptz NOT NULL DEFAULT now()
updated_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, scope_type, scope_key)` — one rule per scope
CHECK: `scope_type IN (...)` from canon

**Resolution lookup index (O(log n) alias resolution):**

```sql
CREATE INDEX meta_alias_resolution_rules_lookup
  ON meta_alias_resolution_rules (org_id, scope_type, scope_key, is_active, priority DESC);
-- Query uses ORDER BY priority DESC — planner uses reverse index scan
```

**Resolution algorithm (deterministic, highest priority wins):**

1. `scope_type = 'user'` + `scope_key = current_user_id` (priority 40)
2. `scope_type = 'role'` + `scope_key = user's role` (priority 30)
3. `scope_type = 'team'` + `scope_key = user's team` (priority 30)
4. `scope_type = 'locale'` + `scope_key = user's locale` (priority 20)
5. `scope_type = 'app_area'` + `scope_key = current page/module` (priority 10)
6. `scope_type = 'org'` + `scope_key = 'default'` (priority 0)

If multiple rules match at the same priority, the one with the highest `priority` value wins.

### `meta_value_aliases` — Alias enum/status values (not just fields)

ERP users need value-level localization: `submitted` → "Posted", `partial` → "Partially Paid", `plant` → "Factory".

```
id              uuid PK
org_id          text NOT NULL
alias_set_id    uuid NOT NULL FK → meta_alias_sets.id
target_key      text NOT NULL       -- 'enum:DocStatus:submitted', 'enum:SiteType:plant'
alias           text NOT NULL       -- 'Posted', 'Factory'
synonyms        text[] DEFAULT '{}'
effective_from  timestamptz NOT NULL DEFAULT now()
effective_to    timestamptz         -- null = currently active
is_deleted      boolean NOT NULL DEFAULT false
deleted_at      timestamptz
deleted_by      text
created_at      timestamptz NOT NULL DEFAULT now()
created_by      text NOT NULL DEFAULT (auth.user_id())
```

RLS: `tenantPolicy`
**Partial unique index:**

```sql
CREATE UNIQUE INDEX meta_value_aliases_active_target_uniq
  ON meta_value_aliases (org_id, alias_set_id, target_key)
  WHERE effective_to IS NULL AND is_deleted = false;
```

CHECK: `target_key LIKE 'enum:%'` — value aliases always target enum values
CHECK: `alias <> ''`

**Value `target_key` convention:** `enum:<EnumName>:<value>` (e.g. `enum:DocStatus:submitted`, `enum:PaymentStatus:partial`)

### `meta_semantic_terms` — Business concepts (meaning, not just names)

Aliases are _names_. Semantic terms are _meaning_. Cheap to add, huge payoff for concept-level lineage.

```
id              uuid PK
org_id          text NOT NULL
term_key        text NOT NULL       -- 'invoice_total', 'gross_margin', 'dso'
name            text NOT NULL       -- 'Invoice Total', 'Gross Margin', 'Days Sales Outstanding'
definition      text                -- 'Sum of all line items on an invoice'
examples        text[]              -- ['Total on INV-00001 = RM 1,500']
classification  text                -- CHECK from canon MetaClassification
is_deleted      boolean NOT NULL DEFAULT false
deleted_at      timestamptz
deleted_by      text
created_at      timestamptz NOT NULL DEFAULT now()
updated_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
**Partial unique index:**

```sql
CREATE UNIQUE INDEX meta_semantic_terms_term_key_uniq
  ON meta_semantic_terms (org_id, term_key)
  WHERE is_deleted = false;
```

CHECK: `term_key ~ '^[a-z][a-z0-9_]*$'`

### `meta_term_links` — Many-to-many: terms ↔ targets

```
id              uuid PK
org_id          text NOT NULL
term_id         uuid NOT NULL FK → meta_semantic_terms.id
target_key      text NOT NULL       -- any stable target_key
created_at      timestamptz NOT NULL DEFAULT now()
```

RLS: `tenantPolicy`
UNIQUE: `(org_id, term_id, target_key)`

**Example:** Term `invoice_total` linked to:

- `db.public.invoices.total_minor`
- `metric:invoice_total`
- `view:invoices:Default:total`

Enables: "show me all fields related to Gross Margin" → follow term links → find all assets/fields/metrics.

**How aliasing integrates:**

1. **LiteMetadata:** `meta_assets.asset_key` is stable → `meta_aliases.target_key` points to it → catalog UI shows business-friendly names. `canonical_name` never changes; aliases override `display_name`.
2. **Entity views:** label resolution priority (4-tier, deterministic):
   - `entity_view_fields.label_override` (explicit per-view override)
   - `meta_aliases` from the **resolved alias set** (via `meta_alias_resolution_rules` for user/team/locale)
   - `meta_assets.display_name` or `custom_fields.field_label` (system default)
   - Fallback: column name (for core/module fields with no metadata)
3. **Custom fields:** `field_name` is **immutable forever** — only labels/aliases change. Renaming is safe.
4. **Enum values:** `meta_value_aliases` localizes status/type values in dropdowns, badges, and table cells.
5. **Search:** `meta_aliases.search_text` (generated column) + GIN index enables "search by business term" — type "AR total" → finds `db.public.invoices.total_minor`.
6. **Semantic terms:** `meta_semantic_terms` + `meta_term_links` enable concept-level lineage and business glossary.

**RW/RO:** alias writes go to `db` (RW), all reads (rendering labels, catalog browsing, search) go to `dbRo`. Staleness is acceptable — alias changes don't need strong consistency.

---

## A8. Custom Field Validation + Typed Index Sync in Kernel

**File:** `packages/crud/src/custom-fields.ts`

### Validation (before DB write)

```typescript
async function validateCustomData(
  orgId: string,
  entityType: string,
  customData: Record<string, unknown>,
): Promise<{
  valid: boolean;
  cleaned: Record<string, unknown>;
  errors: string[];
}>;
```

1. Load `custom_fields` for org + entity_type (TTL-cached, like workflow rules)
2. For each key in `customData`:
   - Key must exist in `custom_fields` metadata → strip unknown keys
   - Value must pass `validateFieldValue(dataType, typeConfig, value)` from canon
   - Required fields must be present (on create) or unchanged (on update)
3. Return cleaned data (unknown keys stripped, types coerced where safe)

### Typed Index Sync (after DB write, fire-and-forget)

```typescript
async function syncCustomFieldValues(
  orgId: string,
  entityType: string,
  entityId: string,
  customData: Record<string, unknown>,
  fieldDefs: CustomFieldDef[],
): Promise<void>;
```

1. For each field with `storage_mode = 'indexed'`:
   - Map `field_type` → correct `value_*` column
   - Upsert into `custom_field_values`
2. Fire-and-forget (like workflow execution logging) — uses top-level `db`, not `tx`
3. Errors logged but don't fail the mutation
4. **On failure:** enqueue to `custom_field_sync_queue` for retry

**Wired into `mutate()`:** after `pickAllowed()` and before DB write for validation; after DB write for index sync.

### Index Sync Retry Queue (idempotent, eventually correct)

```
custom_field_sync_queue
  id              uuid PK
  org_id          text NOT NULL
  entity_type     text NOT NULL
  entity_id       uuid NOT NULL
  queued_at       timestamptz NOT NULL DEFAULT now()
  attempts        integer NOT NULL DEFAULT 0
  last_error      text
  next_retry_at   timestamptz NOT NULL DEFAULT now()
  completed_at    timestamptz
```

RLS: `tenantPolicy`
INDEX: `(next_retry_at)` WHERE `completed_at IS NULL` — worker picks up pending jobs (partial index in migration SQL only; Drizzle schema has the B-tree index without WHERE clause due to Drizzle limitation)

**How it works:** if fire-and-forget sync fails, a row is inserted. A periodic worker (or next mutation on the same entity) retries. Prevents "my filter is missing records" bugs that are impossible to debug.

---

## A9. Schema Lint — `pnpm db:lint`

**File:** `packages/database/src/scripts/schema-lint.ts`

A script that imports all schema files and validates:

| Rule                 | Check                                                                                       | Severity |
| -------------------- | ------------------------------------------------------------------------------------------- | -------- |
| `has-base-columns`   | Table has `id`, `orgId`, `createdAt`, `updatedAt`, `version`                                | error    |
| `has-tenant-policy`  | Table config includes `tenantPolicy()` or `crudPolicy()`                                    | error    |
| `has-org-check`      | Table config includes `check('*_org_not_empty', ...)`                                       | error    |
| `has-org-id-index`   | Table has `(orgId, id)` index                                                               | error    |
| `no-float-money`     | No `real()` or `doublePrecision()` columns named `*amount*`, `*price*`, `*cost*`, `*total*` | error    |
| `snake-case-columns` | All column DB names are snake_case                                                          | warning  |
| `has-custom-data`    | ERP entity tables have `customData` jsonb column                                            | warning  |
| `naming-convention`  | Table name is plural snake_case                                                             | warning  |

**Runs in CI:** `pnpm db:lint` → exit 1 on any error-severity failure.

---

## A10. Entity Generator — `npx tsx src/scripts/entity-new.ts <name>`

**File:** `packages/database/src/scripts/entity-new.ts`

Generates ~20+ files and auto-wires all registries via named markers (`@entity-gen:*`).

```
npx tsx src/scripts/entity-new.ts invoices --doc --skip-schema
```

**Flags:**

- `--doc` — Include lifecycle verbs (submit/cancel/approve/reject)
- `--skip-schema` — Skip schema generation (for existing tables like companies)

**Creates (new files):**

1. `packages/database/src/schema/<entity>.ts` — Drizzle table with `erpEntityColumns` + standard indexes + tenantPolicy
2. `packages/crud/src/handlers/<entity>.ts` — Handler stub (create/update/delete/restore) with K-11 allowlist
3. `packages/crud/src/__tests__/<entity>.smoke.test.ts` — Registration smoke test
4. `packages/search/src/adapters/<entity>.ts` — Search adapter stub (FTS + ILIKE fallback)
5. `apps/web/app/actions/<entity>.ts` — Server action wrappers via `generateEntityActions()`
6. `apps/web/app/(app)/org/[slug]/<entity>/_components/<singular>-contract.ts` — EntityContract
7. `apps/web/app/(app)/org/[slug]/<entity>/_components/<singular>-columns.ts` — Column defs
8. `apps/web/app/(app)/org/[slug]/<entity>/_components/<singular>-fields.ts` — Field defs + Zod schema
9. `apps/web/app/(app)/org/[slug]/<entity>/_server/<entity>.query_server.ts` — React.cache() loaders
10. `apps/web/app/(app)/org/[slug]/<entity>/_server/<entity>.policy_server.ts` — Action resolver
11. `apps/web/app/(app)/org/[slug]/<entity>/_server/<entity>.server-actions.ts` — Sealed dispatcher
12. `apps/web/app/(app)/org/[slug]/<entity>/page.tsx` — List page
13. `apps/web/app/(app)/org/[slug]/<entity>/[id]/page.tsx` — Detail page
14. `apps/web/app/(app)/org/[slug]/<entity>/new/page.tsx` — Create page
15. `apps/web/app/(app)/org/[slug]/<entity>/[id]/edit/page.tsx` — Edit page
16. `apps/web/app/(app)/org/[slug]/<entity>/[id]/versions/page.tsx` — Versions page
17. `apps/web/app/(app)/org/[slug]/<entity>/[id]/audit/page.tsx` — Audit page
18. `apps/web/app/(app)/org/[slug]/<entity>/trash/page.tsx` — Trash page
19. 7× `surface.ts` files — Capability surface annotations (co-located per page)

**Auto-wires (existing files via `@entity-gen:*` markers):**

- `packages/database/src/schema/index.ts` — schema barrel export
- `packages/canon/src/types/entity.ts` — `ENTITY_TYPES`
- `packages/canon/src/types/action.ts` — `ACTION_TYPES`
- `packages/canon/src/types/capability.ts` — `CAPABILITY_CATALOG`
- `packages/crud/src/mutate.ts` — `HANDLER_REGISTRY` + `TABLE_REGISTRY` + handler import
- `packages/crud/src/read.ts` — `TABLE_REGISTRY` + table import
- `packages/crud/src/handler-meta.ts` — `HANDLER_META`
- `apps/web/app/(app)/org/[slug]/_components/nav-config.ts` — `NAV_ITEMS`

**Also seeds:**

- `meta_assets` rows for the new table + its columns (auto-registered)
- Default `entity_views` row ("Default" table view with all core + module columns)
- Default `meta_alias_sets` row (`default_system`) if not exists
- Default `meta_alias_resolution_rules` row (org default → `default_system`) if not exists

### Default seeding convention (org creation)

When a new org is created, seed these defaults so UI works on day 1:

1. `meta_alias_sets`: `default_system` (is_default=true, is_system=true)
2. `meta_alias_resolution_rules`: `scope_type='org', scope_key='default'` → `default_system`
3. `entity_views`: Default table view per entity type (auto-created by generator)
4. `currencies`: common currencies (MYR, USD, SGD, EUR) with MYR as base
5. `uom`: common units (pcs, kg, L, m, box)
6. `number_sequences`: per entity type with sensible prefixes (INV-, PO-, SO-)

---

## Execution Order (12 steps)

| Step   | Deliverable                                                                                                                                                                                                          | Files                                                                                                                              | Depends On      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **1**  | RW/RO dual compute: upgrade `db.ts` to export `db` + `dbRo` + `getDb()` helper                                                                                                                                       | `packages/database/src/db.ts`, `packages/database/src/index.ts`                                                                    | —               |
| **2**  | Canon: Data Type catalog + ALL enums + type_config Zod schemas + value validators                                                                                                                                    | `packages/canon/src/enums/*.ts`, `packages/canon/src/schemas/data-types.ts`, `packages/canon/src/validators/custom-field-value.ts` | —               |
| **3**  | Column helpers (`moneyMinor`, `statusColumn`, `customData`, etc.)                                                                                                                                                    | `packages/database/src/helpers/field-types.ts`                                                                                     | Step 2          |
| **4**  | `erpEntityColumns` + `erpIndexes` + `docIndexes`                                                                                                                                                                     | `packages/database/src/helpers/erp-entity.ts`, `standard-indexes.ts`                                                               | Step 3          |
| **5**  | Spine tables: companies, sites, currencies, uom, uom_conversions, number_sequences                                                                                                                                   | `packages/database/src/schema/*.ts`                                                                                                | Step 4          |
| **6**  | Custom field tables: custom_fields (composite unique), custom_field_values (composite FK, hot path indexes), custom_field_sync_queue                                                                                 | `packages/database/src/schema/custom-fields.ts`, `custom-field-values.ts`, `custom-field-sync-queue.ts`                            | Step 4          |
| **7**  | Entity views tables: entity_views, entity_view_fields                                                                                                                                                                | `packages/database/src/schema/entity-views.ts`, `entity-view-fields.ts`                                                            | Step 4          |
| **8**  | LiteMetadata + aliasing + semantic terms: meta_assets, meta_lineage_edges, meta_quality_checks, meta_alias_sets, meta_aliases, meta_alias_resolution_rules, meta_value_aliases, meta_semantic_terms, meta_term_links | `packages/database/src/schema/meta-*.ts`                                                                                           | Step 4          |
| **9**  | Migration: generate + apply + seed (currencies, UOM, meta_assets for existing tables)                                                                                                                                | `packages/database/drizzle/0011_*.sql`                                                                                             | Steps 5-8       |
| **10** | Custom field validation + typed index sync in kernel; wire `dbRo` into reads/search                                                                                                                                  | `packages/crud/src/services/custom-field-validation.ts`, `packages/crud/src/read.ts`, `packages/search/src/adapters/*.ts`          | Steps 1 + 2 + 6 |
| **11** | Schema lint script + entity generator script                                                                                                                                                                         | `packages/database/src/scripts/schema-lint.ts`, `packages/database/src/scripts/entity-new.ts`                                      | Steps 2-8       |
| **12** | Tests: RW/RO routing, custom field validation, typed index sync, schema lint                                                                                                                                         | `packages/database/src/__tests__/db-routing.test.ts`, `packages/crud/src/__tests__/custom-fields.test.ts`                          | Steps 10-11     |

---

## What This Enables (Phase B/C/D)

- **Routes (Phase B):** server actions auto-generated by entity generator; `GET /api/custom-fields/:entityType` serves field metadata; `GET /api/views/:entityType` serves view definitions; `GET /api/aliases/:aliasSetKey` serves resolved labels for a team/locale
- **UI (Phase C):** `<DynamicForm>` reads `custom_fields` + alias-resolved labels; `<DataTable>` reads `entity_views` with alias-resolved column headers, filtering/sorting via `custom_field_values` on `dbRo`; admin UI for managing custom fields, views, alias sets, and business glossary
- **Business Logic (Phase D):** handler registry auto-populated by generator; custom field validation built into kernel; workflow rules can reference custom fields in conditions; computed fields + materialized projections on RO replica; LiteMetadata quality checks as scheduled jobs; semantic term linking for concept-level lineage

---

## Future-Phase Conventions (design now, implement later)

These are documented here so the Phase A schema doesn't block them:

### Computed Custom Fields (Phase D)

- Add `is_computed boolean` + `compute_expr jsonb` to `custom_fields`
- Computed fields do NOT write into `custom_data` — they materialize into projection tables or materialized views on `dbRo`
- Example: `days_overdue = today - due_date`

### Temporal Truth (Accounting Modules)

- Add `effective_from timestamptz` + `effective_to timestamptz` to ledger/journal tables
- Enables backdated corrections and "what we knew then" audits
- Only for accounting-grade entities, not all ERP tables

### Read Model Projections (CQRS-lite)

- Build per-module read models optimized for `dbRo`: `invoice_list_projection`, `inventory_balance_projection`, `customer_aging_projection`
- Populated by triggers or async jobs after mutations
- Convention: projection tables live in a `projections` schema, always queried via `dbRo`

### Postgres Best Practices (world-class defaults)

Applied across all Phase A tables based on PostgreSQL 18 documentation:

**BRIN indexes for time-series tables (tiny index, huge tables):**

- `audit_logs(created_at)` — BRIN instead of B-tree (audit logs are append-only, naturally ordered by time)
- `workflow_executions(created_at)` — same pattern
- BRIN indexes are ~1000x smaller than B-tree for time-ordered data
- NOTE: `custom_field_sync_queue(next_retry_at)` uses **B-tree** (not BRIN) because retries reshuffle `next_retry_at` out of time order. Use `WHERE completed_at IS NULL` partial index.

**Partial indexes for soft-deleted rows (only index active records):**

- All tables with `is_deleted` get partial indexes: `WHERE is_deleted = false`
- All tables with `is_active` get partial indexes: `WHERE is_active = true`
- Keeps index size small and queries fast for the 99% case (active records)

**Covering indexes (INCLUDE) for index-only scans:**

- `custom_field_values(org_id, entity_type, entity_id) INCLUDE (field_id, value_text)` — detail page can resolve custom values without heap access
- `meta_aliases(org_id, alias_set_id, target_key) INCLUDE (alias, alias_slug)` WHERE `effective_to IS NULL` — label resolution without heap access
- `meta_alias_resolution_rules(org_id, scope_type, scope_key) INCLUDE (alias_set_id, priority)` WHERE `is_active = true` — resolution lookup without heap access

**Expression indexes for common query patterns:**

- `lower(field_name)` on `custom_fields` — case-insensitive field lookup
- `(org_id, entity_type)` on `custom_fields` WHERE `is_active = true AND is_deprecated = false` — "active fields for this entity" (the hot query)

### Partitioning Strategy

- `audit_logs`: partition by `created_at` (monthly) when volume exceeds ~10M rows
- `custom_field_values`: partition by `entity_type` if cross-entity queries are rare
- `workflow_executions`: partition by `created_at` (monthly)
- Convention: partitioning is opt-in per table, triggered by volume thresholds

### CDC for Analytics (Future)

- Neon supports logical replication for streaming changes to analytics warehouses
- Phase A tables are already CDC-ready: stable UUIDs, `updated_at`, soft-delete markers, append-only event logs
- No additional schema changes needed — just enable logical replication when analytics pipeline is built

### Alias Resolution Engine + Strategy Pattern (Phase B/C)

- Implement `AliasResolverStrategy` in code: resolves the active alias set for a given user/team/locale context by querying `meta_alias_resolution_rules`
- Implement `LabelRendererStrategy`: formats labels with units/currency (e.g. "Invoice Total (RM)") using field metadata
- Implement `SearchExpansionStrategy`: expands user search queries by synonyms from `meta_aliases` + `meta_value_aliases`
- Implement `MetadataAdapter`: pulls from `dbRo` and returns a **resolved semantic model** (assets + display labels + field definitions + widgets + views + resolved columns)
- This keeps CRUD-SAP clean: "truth in core", "presentation via adapter"

### Format Rules (Phase C — UI Rendering)

- Add `meta_format_rules` table: `target_key`, `format_type` (money/qty/percent/date/datetime/number), `config` jsonb (currency symbol, decimals, thousand separators, locale format), optionally alias-set-scoped
- Makes dashboards/retail views feel "finished" — money shows "RM", qty shows "kg", dates show locale format
- Phase A column helpers (`moneyMinor`, `qty`, etc.) already encode the data type — format rules add the presentation layer

---

## Decisions Locked In

| Decision           | Choice                                                                                                                                  | Rationale                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Money              | `integer` minor units + `currency_code` + `fx_rate` + `base_amount_minor`                                                               | Fast, safe, no float rounding                                                      |
| Quantity           | `numeric(18,6)`                                                                                                                         | Manufacturing/chemical precision                                                   |
| Enum SSOT          | `packages/canon` (TS const + Zod) → DB CHECK generated                                                                                  | Single source, type-safe end-to-end                                                |
| Custom fields      | **Typed + governed**: JSONB `custom_data` + `custom_fields` meta + `custom_field_values` typed index                                    | No migrations for user fields, Neon-branch-safe, queryable, sortable               |
| Data Type catalog  | 15 governed types, Postgres-aligned, Zod-validated `type_config`                                                                        | Covers 95% of ERP needs, no free-form                                              |
| Storage mode       | `jsonb_only` (default) or `indexed` (writes to typed index table)                                                                       | Performance opt-in per field                                                       |
| RW/RO routing      | Dual Neon compute: `db` (RW) for writes, `dbRo` (RO) for reads/search/dashboards                                                        | Read scaling from day 1, zero infra overhead                                       |
| Read-after-write   | `getDb({ forcePrimary })` helper + short stickiness window after mutations                                                              | Eventual consistency handled gracefully                                            |
| Entity views       | `entity_views` + `entity_view_fields` tables, Retool-style dynamic UI                                                                   | Admin-configurable table/form layouts without code                                 |
| LiteMetadata       | `meta_assets` (with canonical/display names) + lineage + quality + aliases + resolution rules + value aliases + semantic terms          | Full semantic layer: business truth + aliasing + glossary                          |
| Value provenance   | `custom_field_values.source` tracks origin (user/rule/import/system)                                                                    | Audit + lineage for every custom field change                                      |
| Generator          | `pnpm entity:new` script (not CLI)                                                                                                      | Low overhead, deterministic, upgradeable to CLI later                              |
| Axis keys          | `companyId` + `siteId` optional on `erpEntityColumns`; `docEntityColumns` adds lifecycle columns                                        | Multi-company + multi-site from day 1, opt-in per module                           |
| Priority           | Just an `enum` preset, not a special type                                                                                               | No special cases — governance wins                                                 |
| Projections        | Convention: `projections` schema, `dbRo` only, populated by triggers/jobs                                                               | Documented now, implemented per-module                                             |
| Partitioning       | Opt-in per table when volume exceeds thresholds                                                                                         | Documented now, implemented when needed                                            |
| CDC                | Tables are CDC-ready (UUIDs, updated_at, soft-delete, event log)                                                                        | No schema changes needed when analytics pipeline is built                          |
| Aliasing           | Scoped, versioned aliases via `meta_alias_sets` + `meta_aliases` + `meta_value_aliases`; stable `target_key` conventions with DB CHECKs | Business users rename without schema changes; localization-ready; drift-protected  |
| Label resolution   | View override → resolved alias set (via rules) → display_name/field_label → column name (4-tier)                                        | Deterministic, context-aware (user/team/locale), governed                          |
| Alias resolution   | `meta_alias_resolution_rules` with priority-based scope matching (user > role > team > locale > org)                                    | Automatic alias set selection per context                                          |
| Value aliases      | `meta_value_aliases` for enum/status value localization (e.g. `submitted` → "Posted")                                                   | Deep localization for dropdowns, badges, table cells                               |
| Semantic terms     | `meta_semantic_terms` + `meta_term_links` — concept-level lineage                                                                       | "Show me all fields related to Gross Margin"                                       |
| Alias search       | Trigger-populated `search_text` column + GIN index on `meta_aliases`                                                                    | Search by business term across aliases and synonyms                                |
| Canonical names    | `meta_assets.canonical_name` (immutable) vs `display_name` (aliasable)                                                                  | Renames never break formulas, rules, or queries                                    |
| Typed column CHECK | `custom_field_values` enforces exactly one `value_*` column is NOT NULL via CHECK constraint                                            | Prevents silent data corruption forever                                            |
| Field lifecycle    | `is_locked` + `is_deprecated` + `is_unique` on `custom_fields`                                                                          | Prevents admin breakage; supports integrations (unique external IDs)               |
| Schema hash        | `custom_fields.schema_hash` tracks `{fieldType, typeConfig, isRequired, isUnique, storageMode}` via `djb2` hash (prefixed `djb2:<hex>`) | Drift detection: find records written under old schema for repair                  |
| type_config CHECKs | DB-level guardrails: `jsonb_typeof='object'`, enum requires `choices`, short_text requires `maxLength`                                  | Prevents nonsense states even if kernel is bypassed                                |
| FX audit           | `fx_source` (manual/rate_table/system) + `fx_as_of` (rate date) on all money documents                                                  | Reconciliation, revaluation, audit — ERPNext GL entry pattern                      |
| dbRo write safety  | ESLint rule forbids `dbRo.insert/update/delete` + recommended read-only DB role                                                         | Prevents accidental writes to read replica                                         |
| Alias slugs        | `meta_aliases.alias_slug` (kebab-case, unique per set) for URLs, exports, CSV headers                                                   | Stable tokens for external interfaces                                              |
| Default seeding    | Org creation seeds: default alias set, resolution rule, currencies, UOM, number sequences                                               | UI works on day 1 without manual setup                                             |
| Composite FK       | `custom_field_values(org_id, entity_type, field_id)` FK → `custom_fields(org_id, entity_type, id)` ON DELETE RESTRICT                   | Prevents cross-entity field corruption (contacts value referencing invoices field) |
| Required+default   | `CHECK (is_required = false OR default_value IS NOT NULL)` on `custom_fields`                                                           | Required fields must have a default — prevents painful admin setups                |
| Soft-delete meta   | `is_deleted` + `deleted_at` + `deleted_by` on alias_sets, aliases, value_aliases, semantic_terms                                        | Consistent with entity pattern; prevents "oops deleted glossary"                   |
| One-default DB     | Partial unique index `(org_id) WHERE is_default = true AND is_deleted = false` on `meta_alias_sets`                                     | DB-enforced, not just kernel                                                       |
| Sync retry queue   | `custom_field_sync_queue` with exponential backoff for failed index syncs                                                               | No "filter missing records" bugs                                                   |
| BRIN indexes       | Time-series tables (audit_logs, workflow_executions) use BRIN instead of B-tree on `created_at`                                         | ~1000x smaller index for append-only data (Postgres 18 best practice)              |
| Partial indexes    | All `is_deleted`/`is_active` tables get `WHERE is_deleted = false` partial indexes                                                      | Index only active records (99% case)                                               |
| Covering indexes   | INCLUDE columns on hot-path lookups (custom_field_values, meta_aliases, resolution_rules)                                               | Index-only scans — no heap access for label resolution and detail pages            |

---

## Appendix: Reference Migration SQL

This is the verified migration skeleton for Step 9. It covers custom fields, entity views, LiteMetadata, aliasing, and semantic terms with all CHECK constraints, partial unique indexes, and correct Postgres syntax. Spine tables (companies, sites, currencies, uom, etc.) are separate and generated by Drizzle from schema files.

**File:** `packages/database/drizzle/0011_phase_a_schema_governance.sql`

> NOTE: RLS policies (`tenantPolicy`) are applied separately via Drizzle schema definitions. This migration creates tables + indexes + constraints only. `auth.user_id()` is assumed available (Neon Auth built-in).

```sql
-- 0011_phase_a_schema_governance.sql
-- Phase A — ERP Schema Governance (Typed Custom Fields + Views + LiteMetadata)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- A3.7 custom_fields
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_fields (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        text NOT NULL,
  entity_type   text NOT NULL,
  field_name    text NOT NULL,
  field_label   text NOT NULL,
  field_type    text NOT NULL,
  type_config   jsonb NOT NULL DEFAULT '{}'::jsonb,
  storage_mode  text NOT NULL DEFAULT 'jsonb_only',
  default_value jsonb,
  is_required   boolean NOT NULL DEFAULT false,
  is_searchable boolean NOT NULL DEFAULT false,
  is_filterable boolean NOT NULL DEFAULT false,
  is_sortable   boolean NOT NULL DEFAULT false,
  display_order integer NOT NULL DEFAULT 0,
  section       text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    text NOT NULL DEFAULT (auth.user_id()),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    text NOT NULL DEFAULT (auth.user_id()),
  is_active     boolean NOT NULL DEFAULT true,
  is_locked     boolean NOT NULL DEFAULT false,
  is_deprecated boolean NOT NULL DEFAULT false,
  is_unique     boolean NOT NULL DEFAULT false,
  schema_hash   text NOT NULL,

  CONSTRAINT custom_fields_field_name_snake
    CHECK (field_name ~ '^[a-z][a-z0-9_]*$'),
  CONSTRAINT custom_fields_storage_mode_chk
    CHECK (storage_mode IN ('jsonb_only','indexed')),
  CONSTRAINT custom_fields_required_needs_default
    CHECK (is_required = false OR default_value IS NOT NULL),
  CONSTRAINT custom_fields_type_config_is_object
    CHECK (jsonb_typeof(type_config) = 'object'),
  CONSTRAINT custom_fields_type_config_enum_choices
    CHECK (field_type NOT IN ('enum','multi_enum') OR (type_config ? 'choices')),
  CONSTRAINT custom_fields_type_config_short_text_maxlen
    CHECK (field_type <> 'short_text' OR (type_config ? 'maxLength')),
  CONSTRAINT custom_fields_type_config_entity_ref_target
    CHECK (field_type <> 'entity_ref' OR (type_config ? 'targetEntity'))
);

CREATE UNIQUE INDEX IF NOT EXISTS custom_fields_org_entity_field_name_uniq
  ON custom_fields (org_id, entity_type, field_name);
CREATE UNIQUE INDEX IF NOT EXISTS custom_fields_org_entity_id_uniq
  ON custom_fields (org_id, entity_type, id);
CREATE INDEX IF NOT EXISTS custom_fields_active_by_entity
  ON custom_fields (org_id, entity_type, display_order, field_name)
  WHERE is_active = true AND is_deprecated = false;
CREATE INDEX IF NOT EXISTS custom_fields_lower_field_name_idx
  ON custom_fields (org_id, entity_type, lower(field_name));

-- ============================================================
-- A3.8 custom_field_values
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_field_values (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        text NOT NULL,
  entity_type   text NOT NULL,
  entity_id     uuid NOT NULL,
  field_id      uuid NOT NULL,
  value_text    text,
  value_int     integer,
  value_numeric numeric(20,10),
  value_bool    boolean,
  value_date    date,
  value_ts      timestamptz,
  value_json    jsonb,
  value_uuid    uuid,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  updated_by    text NOT NULL DEFAULT (auth.user_id()),
  source        text NOT NULL DEFAULT 'user',

  CONSTRAINT custom_field_values_source_chk
    CHECK (source IN ('user','rule','import','system')),
  CONSTRAINT custom_field_values_exactly_one_typed_col
    CHECK (
      (value_text    IS NOT NULL)::int +
      (value_int     IS NOT NULL)::int +
      (value_numeric IS NOT NULL)::int +
      (value_bool    IS NOT NULL)::int +
      (value_date    IS NOT NULL)::int +
      (value_ts      IS NOT NULL)::int +
      (value_json    IS NOT NULL)::int +
      (value_uuid    IS NOT NULL)::int
      = 1
    ),
  CONSTRAINT custom_field_values_field_fk
    FOREIGN KEY (org_id, entity_type, field_id)
    REFERENCES custom_fields (org_id, entity_type, id)
    ON DELETE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS custom_field_values_org_entity_field_uniq
  ON custom_field_values (org_id, entity_id, field_id);
CREATE INDEX IF NOT EXISTS custom_field_values_entity_lookup_idx
  ON custom_field_values (org_id, entity_type, entity_id);
CREATE INDEX IF NOT EXISTS custom_field_values_field_lookup_idx
  ON custom_field_values (org_id, entity_type, field_id);
CREATE INDEX IF NOT EXISTS custom_field_values_text_idx
  ON custom_field_values (org_id, entity_type, field_id, value_text)
  WHERE value_text IS NOT NULL;
CREATE INDEX IF NOT EXISTS custom_field_values_int_idx
  ON custom_field_values (org_id, entity_type, field_id, value_int)
  WHERE value_int IS NOT NULL;
CREATE INDEX IF NOT EXISTS custom_field_values_numeric_idx
  ON custom_field_values (org_id, entity_type, field_id, value_numeric)
  WHERE value_numeric IS NOT NULL;
CREATE INDEX IF NOT EXISTS custom_field_values_date_idx
  ON custom_field_values (org_id, entity_type, field_id, value_date)
  WHERE value_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS custom_field_values_ts_idx
  ON custom_field_values (org_id, entity_type, field_id, value_ts)
  WHERE value_ts IS NOT NULL;
CREATE INDEX IF NOT EXISTS custom_field_values_bool_idx
  ON custom_field_values (org_id, entity_type, field_id, value_bool)
  WHERE value_bool IS NOT NULL;
CREATE INDEX IF NOT EXISTS custom_field_values_uuid_idx
  ON custom_field_values (org_id, entity_type, field_id, value_uuid)
  WHERE value_uuid IS NOT NULL;

-- ============================================================
-- A8 custom_field_sync_queue
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_field_sync_queue (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        text NOT NULL,
  entity_type   text NOT NULL,
  entity_id     uuid NOT NULL,
  queued_at     timestamptz NOT NULL DEFAULT now(),
  attempts      integer NOT NULL DEFAULT 0,
  last_error    text,
  next_retry_at timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz
);

CREATE INDEX IF NOT EXISTS custom_field_sync_queue_pending_retry_idx
  ON custom_field_sync_queue (next_retry_at)
  WHERE completed_at IS NULL;

-- ============================================================
-- A3.9 entity_views
-- ============================================================
CREATE TABLE IF NOT EXISTS entity_views (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      text NOT NULL,
  entity_type text NOT NULL,
  view_name   text NOT NULL,
  view_type   text NOT NULL DEFAULT 'table',
  is_default  boolean NOT NULL DEFAULT false,
  is_system   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  text NOT NULL DEFAULT (auth.user_id()),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT entity_views_view_type_chk
    CHECK (view_type IN ('table','form','kanban','detail'))
);

CREATE UNIQUE INDEX IF NOT EXISTS entity_views_org_entity_view_name_uniq
  ON entity_views (org_id, entity_type, view_name);

-- ============================================================
-- A3.10 entity_view_fields
-- ============================================================
CREATE TABLE IF NOT EXISTS entity_view_fields (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id             text NOT NULL,
  view_id            uuid NOT NULL REFERENCES entity_views(id) ON DELETE CASCADE,
  field_source       text NOT NULL,
  field_key          text NOT NULL,
  display_order      integer NOT NULL DEFAULT 0,
  is_visible         boolean NOT NULL DEFAULT true,
  is_sortable        boolean NOT NULL DEFAULT true,
  is_filterable      boolean NOT NULL DEFAULT true,
  column_width       integer,
  component_override text,

  CONSTRAINT entity_view_fields_source_chk
    CHECK (field_source IN ('core','module','custom'))
);

CREATE UNIQUE INDEX IF NOT EXISTS entity_view_fields_org_view_field_key_uniq
  ON entity_view_fields (org_id, view_id, field_key);

-- ============================================================
-- A7 LiteMetadata core
-- ============================================================
CREATE TABLE IF NOT EXISTS meta_assets (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         text NOT NULL,
  asset_type     text NOT NULL,
  asset_key      text NOT NULL,
  canonical_name text NOT NULL,
  display_name   text NOT NULL,
  description    text,
  owner_team     text,
  steward_user   text,
  classification text,
  quality_tier   text,
  tags           text[] NOT NULL DEFAULT '{}'::text[],
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_assets_org_asset_key_uniq
  ON meta_assets (org_id, asset_key);

CREATE TABLE IF NOT EXISTS meta_lineage_edges (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         text NOT NULL,
  from_asset_id  uuid NOT NULL REFERENCES meta_assets(id) ON DELETE CASCADE,
  to_asset_id    uuid NOT NULL REFERENCES meta_assets(id) ON DELETE CASCADE,
  edge_type      text NOT NULL,
  description    text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_lineage_edges_uniq
  ON meta_lineage_edges (org_id, from_asset_id, to_asset_id, edge_type);

CREATE TABLE IF NOT EXISTS meta_quality_checks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          text NOT NULL,
  target_asset_id uuid NOT NULL REFERENCES meta_assets(id) ON DELETE CASCADE,
  rule_type       text NOT NULL,
  config          jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_run_at     timestamptz,
  last_run_status text,
  last_run_detail jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- A7 Aliasing
-- ============================================================
CREATE TABLE IF NOT EXISTS meta_alias_sets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      text NOT NULL,
  set_key     text NOT NULL,
  name        text NOT NULL,
  description text,
  locale      text,
  is_default  boolean NOT NULL DEFAULT false,
  is_system   boolean NOT NULL DEFAULT false,
  is_deleted  boolean NOT NULL DEFAULT false,
  deleted_at  timestamptz,
  deleted_by  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  text NOT NULL DEFAULT (auth.user_id()),
  updated_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT meta_alias_sets_set_key_snake
    CHECK (set_key ~ '^[a-z][a-z0-9_]*$')
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_alias_sets_set_key_uniq
  ON meta_alias_sets (org_id, set_key)
  WHERE is_deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS meta_alias_sets_one_default_per_org
  ON meta_alias_sets (org_id)
  WHERE is_default = true AND is_deleted = false;

CREATE TABLE IF NOT EXISTS meta_aliases (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         text NOT NULL,
  alias_set_id   uuid NOT NULL REFERENCES meta_alias_sets(id) ON DELETE RESTRICT,
  target_type    text NOT NULL,
  target_key     text NOT NULL,
  alias          text NOT NULL,
  alias_slug     text,
  description    text,
  synonyms       text[] NOT NULL DEFAULT '{}'::text[],
  is_primary     boolean NOT NULL DEFAULT true,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to   timestamptz,
  search_text    text,  -- trigger-populated (array_to_string is not IMMUTABLE, cannot use GENERATED)
  is_deleted     boolean NOT NULL DEFAULT false,
  deleted_at     timestamptz,
  deleted_by     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     text NOT NULL DEFAULT (auth.user_id()),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT meta_aliases_alias_not_empty CHECK (alias <> ''),
  CONSTRAINT meta_aliases_slug_kebab
    CHECK (alias_slug IS NULL OR alias_slug ~ '^[a-z0-9][a-z0-9-]*$'),
  CONSTRAINT meta_aliases_target_key_asset_chk
    CHECK (target_type <> 'asset' OR target_key LIKE 'db.%'),
  CONSTRAINT meta_aliases_target_key_custom_field_chk
    CHECK (target_type <> 'custom_field' OR target_key LIKE '%.custom:%'),
  CONSTRAINT meta_aliases_target_key_metric_chk
    CHECK (target_type <> 'metric' OR target_key LIKE 'metric:%'),
  CONSTRAINT meta_aliases_target_key_view_field_chk
    CHECK (target_type <> 'view_field' OR target_key LIKE 'view:%'),
  CONSTRAINT meta_aliases_target_key_enum_value_chk
    CHECK (target_type <> 'enum_value' OR target_key LIKE 'enum:%')
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_aliases_active_target_uniq
  ON meta_aliases (org_id, alias_set_id, target_key)
  WHERE effective_to IS NULL AND is_deleted = false;
CREATE UNIQUE INDEX IF NOT EXISTS meta_aliases_active_slug_uniq
  ON meta_aliases (org_id, alias_set_id, alias_slug)
  WHERE effective_to IS NULL AND is_deleted = false AND alias_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS meta_aliases_search_gin
  ON meta_aliases USING GIN (to_tsvector('simple', search_text))
  WHERE is_deleted = false;

-- Trigger to populate search_text (array_to_string is not IMMUTABLE,
-- so GENERATED ALWAYS AS is rejected by Postgres)
CREATE OR REPLACE FUNCTION meta_aliases_search_text_trigger()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_text := NEW.alias || ' ' || array_to_string(NEW.synonyms, ' ') || ' ' || NEW.target_key;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_meta_aliases_search_text
  BEFORE INSERT OR UPDATE ON meta_aliases
  FOR EACH ROW EXECUTE FUNCTION meta_aliases_search_text_trigger();

CREATE TABLE IF NOT EXISTS meta_alias_resolution_rules (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       text NOT NULL,
  scope_type   text NOT NULL,
  scope_key    text NOT NULL,
  alias_set_id uuid NOT NULL REFERENCES meta_alias_sets(id) ON DELETE RESTRICT,
  priority     integer NOT NULL DEFAULT 0,
  is_active    boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_alias_resolution_rules_scope_uniq
  ON meta_alias_resolution_rules (org_id, scope_type, scope_key);
CREATE INDEX IF NOT EXISTS meta_alias_resolution_rules_lookup
  ON meta_alias_resolution_rules (org_id, scope_type, scope_key, is_active, priority DESC);

CREATE TABLE IF NOT EXISTS meta_value_aliases (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         text NOT NULL,
  alias_set_id   uuid NOT NULL REFERENCES meta_alias_sets(id) ON DELETE RESTRICT,
  target_key     text NOT NULL,
  alias          text NOT NULL,
  synonyms       text[] NOT NULL DEFAULT '{}'::text[],
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to   timestamptz,
  is_deleted     boolean NOT NULL DEFAULT false,
  deleted_at     timestamptz,
  deleted_by     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     text NOT NULL DEFAULT (auth.user_id()),

  CONSTRAINT meta_value_aliases_target_enum_chk
    CHECK (target_key LIKE 'enum:%'),
  CONSTRAINT meta_value_aliases_alias_not_empty
    CHECK (alias <> '')
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_value_aliases_active_target_uniq
  ON meta_value_aliases (org_id, alias_set_id, target_key)
  WHERE effective_to IS NULL AND is_deleted = false;

-- ============================================================
-- A7 Semantic terms
-- ============================================================
CREATE TABLE IF NOT EXISTS meta_semantic_terms (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         text NOT NULL,
  term_key       text NOT NULL,
  name           text NOT NULL,
  definition     text,
  examples       text[],
  classification text,
  is_deleted     boolean NOT NULL DEFAULT false,
  deleted_at     timestamptz,
  deleted_by     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT meta_semantic_terms_term_key_snake
    CHECK (term_key ~ '^[a-z][a-z0-9_]*$')
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_semantic_terms_term_key_uniq
  ON meta_semantic_terms (org_id, term_key)
  WHERE is_deleted = false;

CREATE TABLE IF NOT EXISTS meta_term_links (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     text NOT NULL,
  term_id    uuid NOT NULL REFERENCES meta_semantic_terms(id) ON DELETE CASCADE,
  target_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS meta_term_links_uniq
  ON meta_term_links (org_id, term_id, target_key);
```
