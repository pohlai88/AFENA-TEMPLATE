# Canon Architecture — Ratified v1

> **Package:** `afenda-canon`
> **Layer:** 1 (Foundation)
> **Role:** Pure Metadata Catalog — types, schemas, enums, registries, LiteMetadata, source-type mappings, validators
> **Runtime dependencies:** `zod` only (Zod v4)

---

## Table of Contents

- [1. Identity](#1-identity)
- [2. Architecture Principles](#2-architecture-principles)
- [3. What Canon Is (and Is Not)](#3-what-canon-is-and-is-not)
- [4. Module Map](#4-module-map)
- [5. Directory Structure](#5-directory-structure)
- [6. Registries](#6-registries)
- [7. LiteMetadata](#7-litemetadata)
- [8. Mappings](#8-mappings)
- [9. Validators](#9-validators)
- [10. Enums](#10-enums)
- [11. Types](#11-types)
- [12. Zod Schemas (Zod v4)](#12-zod-schemas-zod-v4)
- [13. Dependencies](#13-dependencies)
- [14. DB Alignment](#14-db-alignment)
- [15. Consumer Integration](#15-consumer-integration)
- [16. Phasing](#16-phasing)
- [17. Testing & Invariants](#17-testing--invariants)
- [18. Locked Decisions](#18-locked-decisions)
- [19. Shippable Implementation Plan](#19-shippable-implementation-plan)
- [20. CI Guardrails](#20-ci-guardrails)
- [21. OSS Alignment Reference](#21-oss-alignment-reference)
- [22. ERP UI Surfaces](#22-erp-ui-surfaces)
- [Appendix: Comparison with OpenMetadata](#appendix-comparison-with-openmetadata)

---

## 1. Identity

`afenda-canon` is the **single source of truth** for every shared type, enum, schema, and metadata definition in the AFENDA-NEXUS monorepo. It sits at **Layer 1 (Foundation)** — depended on by everything, depending on nothing except `zod`.

Canon is the **Metadata Catalog**: it knows what data exists, how it's structured, what it means, who can see it, how good it is, and where it came from. It never touches the database, never calls an API, never renders UI.

---

## 2. Architecture Principles

| # | Principle | Rule |
|---|-----------|------|
| **P1** | **Zero workspace dependencies.** | Canon depends only on `zod` (v4). No workspace packages. No npm packages beyond `zod`. |
| **P2** | **Pure functions, total determinism.** | Every Canon function is a pure function: same inputs → same outputs, no side effects, no I/O, no randomness, no platform-specific APIs. Deterministic behavior, portable across Node/browsers/edge. |
| **P3** | **Additive-only evolution.** | New enums, types, schemas, mappings, and registries are added. Existing ones are never removed or renamed in the same major version. |
| **P4** | **Single runtime dependency: `zod` (v4).** | Zod provides schema validation, type inference, and built-in JSON Schema generation (`z.toJSONSchema()`). No other runtime deps. |
| **P5** | **Everything has an evidence trail.** | Alias resolution returns a trace. Quality scoring returns check results. Lineage returns edges with types. No black boxes. |
| **P6** | **Explicit Aspects.** | Every `AssetDescriptor` field belongs to exactly one conceptual aspect (identity, ownership, classification, quality, lineage, glossary). Aspects are type-level groupings — not runtime subdivisions. Code reads `descriptor.qualityTier`; architects reason about "the quality aspect." This mirrors DataHub's aspect model without importing DataHub's runtime. |

---

## 3. What Canon Is (and Is Not)

### Canon IS:

| Capability | Example |
|-----------|---------|
| Universal type definitions | `EntityType`, `ActionVerb`, `PolicyDecision` |
| ERP enum vocabulary | `Channel`, `PaymentStatus`, `DataType`, `DocStatus` |
| Zod schema validation | `mutationSpecSchema`, `receiptSchema`, `auditLogEntrySchema` |
| Metadata asset catalog | `AssetDescriptor`, `buildAssetKey()`, `parseAssetKey()` |
| Deterministic alias resolution | `resolveAlias()` with scored trace |
| Quality rule compilation | `compileQualityRule()`, `scoreQualityTier()` |
| Column classification | `classifyColumn()` with PII/financial detection |
| Design-time lineage | `inferEdgeType()`, `topoSortLineage()` |
| Source type mappings | `mapPostgresType()`, `inferCsvColumnType()` |
| Type compatibility matrix | `getCompatLevel()`, `isCompatible()` |
| Capability/RBAC model | `CapabilityKey`, `CAPABILITY_CATALOG` |

### Canon is NOT:

| Not This | Why |
|----------|-----|
| A database layer | Canon never imports `pg`, `drizzle`, or any DB client |
| An API service | Canon never imports `express`, `hono`, or any HTTP framework |
| A UI component library | Canon never imports React, Vue, or any UI library |
| A runtime policy engine | Canon defines `PolicyDecision` types; OPA/Casbin evaluates at runtime |
| An instance-level lineage tracker | v1 is design-time only; instance lineage (doc → mutation → posting) is v2 |

---

## 4. Module Map

```
afenda-canon/src/
├── enums/          ← ERP vocabulary (22 enum files)
├── types/          ← TypeScript interfaces + constants (13 files)
├── schemas/        ← Zod schemas for runtime validation (10 files)
├── validators/     ← Field-value validators (1 file)
├── registries/     ← [NEW] Capability + entity registries
├── lite-meta/      ← [NEW] LiteMetadata: keys, aliases, lineage, quality, classification
├── mappings/       ← [NEW] Source-type mappings (Postgres, CSV, type-compat)
└── index.ts        ← Barrel: public API surface
```

**Direction of allowed imports (enforced by dependency-cruiser):**

```
enums/ ← types/ ← schemas/
  ↑        ↑         ↑
lite-meta/ ← mappings/
  ↑
registries/   (registries may import lite-meta, not reverse)
  ↑
validators/
  ↑
index.ts (barrel)
```

### 4.1 CANON_LAYER_RULES (enforceable constant)

```typescript
// src/constants.ts
export const CANON_LAYER_RULES = {
  enums:      { mayImport: [] },
  types:      { mayImport: ['enums'] },
  schemas:    { mayImport: ['enums', 'types'] },
  'lite-meta': { mayImport: ['enums', 'types', 'schemas'] },
  mappings:   { mayImport: ['enums', 'types', 'schemas', 'lite-meta'] },
  registries: { mayImport: ['enums', 'types', 'schemas', 'lite-meta'] },
  validators: { mayImport: ['enums', 'types', 'schemas', 'lite-meta', 'mappings', 'registries'] },
} as const satisfies Record<string, { mayImport: readonly string[] }>;
```

This constant is consumed by a CI test that reads Canon's import graph and rejects violations. The `.dependency-cruiser.cjs` rules are the runtime enforcement; this constant is the single source of truth for the allowed directions.

---

## 5. Directory Structure

### Existing files (47 files, unchanged):

```
src/
├── index.ts
├── enums/
│   ├── index.ts
│   ├── auth-scope.ts
│   ├── auth-scope-type.ts
│   ├── auth-verb.ts
│   ├── channel.ts
│   ├── contact-type.ts
│   ├── data-types.ts
│   ├── doc-status.ts
│   ├── field-source.ts
│   ├── field-source-type.ts
│   ├── fx-source.ts
│   ├── governor-preset.ts
│   ├── meta-alias-scope-type.ts
│   ├── meta-alias-target-type.ts
│   ├── meta-asset-type.ts
│   ├── meta-classification.ts
│   ├── meta-edge-type.ts
│   ├── meta-quality-tier.ts
│   ├── payment-status.ts
│   ├── site-type.ts
│   ├── storage-mode.ts
│   ├── update-mode.ts
│   ├── uom-type.ts
│   └── view-type.ts
├── schemas/
│   ├── action.ts
│   ├── audit.ts
│   ├── capability.ts
│   ├── data-types.ts
│   ├── entity.ts
│   ├── envelope.ts
│   ├── errors.ts
│   ├── json-value.ts         ← [NEW] shared recursive JSON value schema
│   ├── mutation.ts
│   └── receipt.ts
├── types/
│   ├── action.ts
│   ├── action-spec.ts
│   ├── actor.ts
│   ├── audit.ts
│   ├── capability.ts
│   ├── entity.ts
│   ├── entity-contract.ts
│   ├── envelope.ts
│   ├── errors.ts
│   ├── lifecycle.ts
│   ├── mutation.ts
│   ├── policy.ts
│   └── receipt.ts
└── validators/
    └── custom-field-value.ts
```

### New files (to be created):

```
src/
├── constants.ts                      ← [NEW] CANON_LAYER_RULES, CANON_KEYSPACE_VERSION
├── lite-meta/
│   ├── index.ts                      ← barrel
│   ├── asset-keys.ts                 ← buildAssetKey, parseAssetKey, canonicalizeKey, validateAssetKey
│   ├── asset-fingerprint.ts          ← assetFingerprint (deterministic canonical string of canonicalized descriptor)
│   ├── alias-resolution.ts           ← slugify, matchAlias, resolveAlias
│   ├── lineage.ts                    ← inferEdgeType, topoSortLineage, explainLineageEdge
│   ├── quality-rules.ts              ← QualityRuleType, compileQualityRule, scoreQualityTier, DIMENSION_TO_RULES
│   ├── classification.ts             ← PII_PATTERNS, classifyColumn, classifyColumns
│   └── glossary.ts                   ← GlossaryTerm, TermLink (types only)
├── mappings/
│   ├── index.ts                      ← barrel
│   ├── postgres-types.ts             ← POSTGRES_TO_CANON, mapPostgresType, mapPostgresColumn
│   ├── type-compat.ts                ← TYPE_COMPAT_MATRIX, getCompatLevel, isCompatible, requiresTransform
│   └── csv-types.ts                  ← inferCsvColumnType
├── registries/
│   ├── index.ts                      ← barrel
│   ├── entity-registry.ts            ← ENTITY_CONTRACT_REGISTRY
│   └── capability-registry.ts        ← CAPABILITY_CATALOG (moved from types/capability.ts)
└── schemas/
    └── lite-meta.ts                  ← [NEW] assetKeySchema, qualityRuleSchema, qualityDimensionSchema
```

---

## 6. Registries

### 6.1 Entity Contract Registry

```typescript
// src/registries/entity-registry.ts
/**
 * Registry of entity contracts. Supports partial entries in v1 (Phase 2 adds mandatory coverage).
 * Services using entities must define contracts here for audit/compliance.
 */
export const ENTITY_CONTRACT_REGISTRY: Partial<Record<EntityType, EntityContract>> = {
  INVOICE: {
    entityType: 'INVOICE',
    states: ['draft', 'approved', 'posted', 'voided'],
    transitions: [
      { from: 'draft', to: 'approved', requiredCapability: 'finance:invoice:approve' },
      { from: 'approved', to: 'posted', requiredCapability: 'finance:journal:post' },
      { from: 'posted', to: 'voided', requiredCapability: 'finance:invoice:void' },
    ],
  },
  // Phase 2: mandatory coverage for all EntityTypes
} satisfies Partial<Record<EntityType, EntityContract>>;
```

**Registry invariant (R1):** `satisfies Partial<Record<...>>` enforces: every key that exists must have a valid contract; missing keys are allowed in v1.

### 6.2 Capability Catalog

Already exists in `types/capability.ts` — will be re-exported from `registries/capability-registry.ts` for logical grouping. No code changes, just re-exports.

### 6.3 Quality Rule Dimension Mapping

```typescript
// src/lite-meta/quality-rules.ts
export const DIMENSION_TO_RULES: Record<QualityDimension, QualityRuleType[]> = {
  completeness: ['not_null'],
  validity:     ['regex', 'enum_set', 'range'],
  uniqueness:   ['unique'],
  consistency:  ['fk_exists', 'sum_matches_total', 'debits_equal_credits'],
  accuracy:     ['range', 'regex', 'enum_set'],
};
```

### 6.4 Postgres Type Mapping (V1 Mappings)

```typescript
// src/mappings/postgres-types.ts

/**
 * V1 deterministic mappings from Postgres types to Canon DataTypes.
 * These mappings are data-driven and used by mapPostgresType(), mapPostgresColumn(),
 * validation rules, and tests.
 */
export const POSTGRES_TO_CANON: Record<string, DataType> = {
  // Text types
  text: 'long_text',
  varchar: 'short_text',
  'character varying': 'short_text',
  char: 'short_text',
  character: 'short_text',
  name: 'short_text',
  citext: 'long_text',

  // Numeric types
  int2: 'integer',
  int4: 'integer',
  int8: 'integer',
  smallint: 'integer',
  integer: 'integer',
  bigint: 'integer',
  float4: 'decimal',
  float8: 'decimal',
  real: 'decimal',
  'double precision': 'decimal',
  numeric: 'decimal',
  money: 'decimal',
  serial: 'integer',
  bigserial: 'integer',
  smallserial: 'integer',

  // Boolean
  bool: 'boolean',
  boolean: 'boolean',

  // Date/Time
  date: 'date',
  timestamp: 'datetime',
  'timestamp without time zone': 'datetime',
  'timestamp with time zone': 'datetime',
  timestamptz: 'datetime',
  time: 'short_text',
  'time without time zone': 'short_text',
  'time with time zone': 'short_text',
  timetz: 'short_text',
  interval: 'short_text',

  // JSON
  json: 'json',
  jsonb: 'json',

  // Binary
  bytea: 'binary',

  // UUID
  uuid: 'entity_ref',

  // Array
  'text[]': 'multi_select',
  'varchar[]': 'multi_select',
  'integer[]': 'json',
  'int4[]': 'json',
  'jsonb[]': 'json',

  // Geometric (GIS)
  point: 'json',
  line: 'json',
  lseg: 'json',
  box: 'json',
  path: 'json',
  polygon: 'json',
  circle: 'json',

  // Network
  inet: 'short_text',
  cidr: 'short_text',
  macaddr: 'short_text',
  macaddr8: 'short_text',

  // Range types
  int4range: 'json',
  int8range: 'json',
  numrange: 'json',
  tsrange: 'json',
  tstzrange: 'json',
  daterange: 'json',

  // Search
  tsvector: 'long_text',
  tsquery: 'short_text',

  // Other
  xml: 'long_text',
  bit: 'short_text',
  'bit varying': 'short_text',
  varbit: 'short_text',
  oid: 'integer',
  regclass: 'short_text',
  regtype: 'short_text',
};
```

---

## 7. LiteMetadata

LiteMetadata is Canon's metadata catalog layer. It provides asset identification, alias resolution, quality rules, lineage, column classification, and a glossary. All functions are pure — no I/O, no database.

### 7.1 Asset Key System

Asset keys are dot-delimited identifiers that uniquely identify any metadata asset.

**Asset Key Grammar (V1):**

All keys follow strict segment-count rules per prefix:

| Prefix | Format | Segment Count | Example |
|--------|--------|---------------|---------|
| `db.rec` | `db.rec.<system>.<schema>.<table>` | Exactly 5 | `db.rec.afenda.public.invoices` |
| `db.field` | `db.field.<system>.<schema>.<table>.<column>` | Exactly 6 | `db.field.afenda.public.invoices.total_amount` |
| `db.bo` | `db.bo.<module>.<name>` | Exactly 4 | `db.bo.finance.invoice` |
| `db.view` | `db.view.<module>.<name>` | Exactly 4 | `db.view.finance.invoice_list` |
| `db.pipe` | `db.pipe.<name>` | Exactly 3 | `db.pipe.daily_gl_sync` |
| `db.report` | `db.report.<module>.<name>` | Exactly 4 | `db.report.finance.aging_report` |
| `db.api` | `db.api.<module>.<name>` | Exactly 4 | `db.api.finance.invoice_create` |
| `db.policy` | `db.policy.<module>.<name>` | Exactly 4 | `db.policy.finance.sox_302` |
| `metric:` | `metric:<fqn>` | At least 2 (dot-delimited parts) | `metric:finance.revenue.monthly` |

**Segment Definitions:**

- `<system>` = **logical source system identifier** (e.g., `afenda`, `shopify`, `xero`, `sap`). NOT environment (prod/staging/dev) — environment belongs to DB connection metadata, not the asset key.
- `<schema>` = PostgreSQL schema name (e.g., `public`, `afenda_erp`, `staging`)
- `<table>` = table name or business object name
- `<column>` = column name
- `<module>` = logical business domain (e.g., `finance`, `supply_chain`, `crm`)
- `<name>` = identifier within that module
- `<fqn>` = dot-delimited fully qualified name (e.g., `finance.revenue.monthly`)

**Segment Character Rules:**

- Each segment: lowercase `[a-z0-9_\-\/{}]` only
- Forbidden in segments: `.` `:` (reserved as delimiters)
- Uppercase input is canonicalized to lowercase during normalization
- Empty segments are rejected (e.g., `db.rec..public.invoices` is invalid)

**Keyspace Grammar Version:**

```typescript
// src/constants.ts
export const CANON_KEYSPACE_VERSION = 1 as const;
```

- **KV1 invariant:** Every valid asset key under version 1 starts with `db.` (record, field, BO, view, pipe, report, api, policy) or `metric:` (KPI). No other prefixes are valid.
- If v2 introduces bare prefixes (`bo:invoice`, `rec:invoices`), a `CANON_KEYSPACE_VERSION = 2` is declared. Version negotiation is a v2 concern; v1 code never sees v2 keys.

```typescript
// src/lite-meta/asset-keys.ts

/**
 * Asset key prefix type; enforces V1 grammar
 */
export type AssetKeyPrefix = 'db.rec' | 'db.field' | 'db.bo' | 'db.view' | 'db.pipe' | 'db.report' | 'db.api' | 'db.policy' | 'metric:';

/**
 * Prefix specification for V1 grammar enforcement.
 * Used by buildAssetKey, parseAssetKey, validateAssetKey.
 * 
 * `afterPrefixMin/Max`: Number of dot-delimited segments AFTER the prefix.
 * For `db.rec`: prefix is "db.rec" (2 tokens), afterPrefixMin=3 means 3 more tokens (system.schema.table).
 * For `metric:`: prefix is "metric:" (literal colon), afterPrefixMin=1 means 1+ dot-delimited tokens.
 * 
 * For `db.*` prefixes: split on '.' to get prefix + segments.
 * For `metric:`: split on ':' to get prefix, then split remainder on '.'.
 */
export const ASSET_KEY_PREFIX_SPECS: Record<AssetKeyPrefix, {
  afterPrefixMin: number;
  afterPrefixMax?: number;  // undefined = no max
  description?: string;
}> = {
  'db.rec': { afterPrefixMin: 3, afterPrefixMax: 3, description: 'Database record type (system.schema.table)' },
  'db.field': { afterPrefixMin: 4, afterPrefixMax: 4, description: 'Database field (system.schema.table.column)' },
  'db.bo': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'Business object (module.name)' },
  'db.view': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'UI view (module.name)' },
  'db.pipe': { afterPrefixMin: 1, afterPrefixMax: 1, description: 'Pipeline/process (name)' },
  'db.report': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'Report/KPI (module.name)' },
  'db.api': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'API contract (module.name)' },
  'db.policy': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'Governance policy (module.name)' },
  'metric:': { afterPrefixMin: 1, description: 'KPI/metric (dot-delimited after colon)' },
};

export function buildAssetKey(prefix: AssetKeyPrefix, ...segments: string[]): string;

// Canonicalize: may throw on structural issues (empty segments, double dots)
export function canonicalizeKey(key: string): string;

// Parse: never throws — always returns ParsedAssetKey with {prefix, segments, valid, errors}
export function parseAssetKey(key: string): ParsedAssetKey;

// Validate: thin wrapper around parseAssetKey, never throws
export function validateAssetKey(key: string): { valid: boolean; errors: string[] };

// Analyze: combining parse + derive in one pass (efficiency helper)
export function analyzeAssetKey(key: string): {
  parsed: ParsedAssetKey;
  derivedType: MetaAssetType | null;  // null if key doesn't derive a type
};

export interface ParsedAssetKey {
  prefix: AssetKeyPrefix | null;  // null if structural parse fails
  segments: string[];              // always present, even if invalid
  valid: boolean;                  // true iff everything passes
  errors: string[];                // structural + validation errors
}
```

**Parse Implementation Contract:**

- `parseAssetKey(key)` is the **single source of truth** for asset key parsing (structural + validation in one pass).
- **Two-phase**: (1) structural (split by delimiter; may fail with `prefix: null`) — never throws; (2) validation (segment count + character rules) — never throws
- **Never throw** — always return `ParsedAssetKey` with errors populated, even if `valid=false`
- `validateAssetKey(key)` is a **thin wrapper**: `parseAssetKey(key).{valid, errors}` — no duplicate logic
- `canonicalizeKey(key)` **may throw** on structural issues (empty segments, `..`); throws early to fail fast on garbage input
- `analyzeAssetKey(key)` **never throws** — combines parsing + type derivation to avoid double-parsing in services

**Strict-mode pattern** (for callers):
1. Try `canonicalizeKey(key)` — throws if malformed (fail fast)
2. Then `parseAssetKey(key)` — get full validation info
3. Check `parsed.valid` — decide next action

**Key invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| K1 | `parseAssetKey(buildAssetKey(prefix, ...segments))` returns the same prefix + segments | Round-trip |
| K2 | `canonicalizeKey(canonicalizeKey(key)) === canonicalizeKey(key)` | Idempotence |
| K3 | Segment count AFTER prefix must match `ASSET_KEY_PREFIX_SPECS[prefix].{afterPrefixMin,afterPrefixMax}` | Segment validation |
| K4 | Each segment matches `[a-z0-9_\-\/{}]`; no empty segments; prefer lowercase | Character validation |
| K5 | No `.` or `:` allowed inside segments (reserved delimiters). For `metric:` keys: remainder must be non-empty and contain no additional `:` | Delimiter enforcement |
| K6 | `db.*` keys must not contain `:` anywhere (`:` is metric-exclusive delimiter) | Prefix-namespace integrity |
| K7 | `/` supports hierarchy (e.g., `db.view.finance/ar.list`); `{}` supports templating (e.g., `db.pipe.sync_{source}`) — both design-time only | Semantic allowances |
| K8 | `parseAssetKey(key)` always returns `ParsedAssetKey` with `{ prefix, segments, valid, errors }` even if invalid; never throws | Two-phase parsing |
| K9 | `validateAssetKey()` is wrapper around `parseAssetKey()` — same validation logic, zero drift | No duplicate logic |

### 7.2 Asset Descriptor

```typescript
export interface AssetDescriptor {
  // ── Identity Aspect ──
  assetKey: string;                    // e.g. "db.rec.afenda.public.invoices"
  assetType: MetaAssetType;           // enum: table, column, view, pipeline, report, api, business_object, policy, metric
  displayName: string;                 // human-readable
  description?: string;

  // ── Ownership Aspect ──
  owner?: string;                      // team or user
  steward?: string;                    // data steward

  // ── Classification Aspect ──
  classification?: MetaClassification; // pii, financial, internal, public
  tags?: string[];                     // free-form tags

  // ── Quality Aspect ──
  qualityTier?: MetaQualityTier;       // gold, silver, bronze

  // ── Lineage Aspect ──
  upstream?: string[];                 // asset keys this derives from
  downstream?: string[];               // asset keys that derive from this

  // ── Glossary Aspect ──
  glossaryTerms?: string[];            // linked glossary term IDs
}
```

**AssetType Derivation Rule (Locked invariant):**

The `assetType` field MUST be derivable from the `assetKey` prefix. This prevents contradictions (e.g., key says `db.field...` but `assetType: 'table'`).

| Asset Key Prefix | Required `assetType` | Notes |
|---|---|---|
| `db.rec` | `table` | Database record type (PK = system+schema+table) |
| `db.field` | `column` | Database field/column |
| `db.bo` | `business_object` | Business concept (Invoice, Customer, etc.) |
| `db.view` | `view` | UI view or materialized view |
| `db.pipe` | `pipeline` | Data pipeline or process |
| `db.report` | `report` | Report or static dashboard |
| `db.api` | `api` | API contract or endpoint |
| `db.policy` | `policy` | Governance policy (SOX, approval rule, etc.) |
| `metric:` | `metric` | KPI or metric |

**Why aspects?** Each group of fields (identity, ownership, classification, quality, lineage, glossary) maps to one conceptual aspect (P6). This mirrors DataHub's aspect model:

| Aspect | DataHub Equivalent | Canon Fields |
|--------|-------------------|-------------|
| Identity | `DatasetKey` + `DatasetProperties` | `assetKey`, `assetType`, `displayName`, `description` |
| Ownership | `Ownership` | `owner`, `steward` |
| Classification | `GlobalTags` + `GlossaryTerms` | `classification`, `tags` |
| Quality | N/A (custom) | `qualityTier` |
| Lineage | `UpstreamLineage` | `upstream`, `downstream` |
| Glossary | `GlossaryTerms` | `glossaryTerms` |

However, Canon keeps these as flat fields on one interface (not separate runtime objects) because:
- Canon is a type library, not a database
- Flat fields are simpler for TypeScript inference
- No runtime cost for aspect grouping

**Validation invariants:** 

```typescript
// Single source of truth for assetType derivation
export function deriveAssetTypeFromKey(key: string): MetaAssetType | null {
  // Parse key, extract prefix, return corresponding assetType
  // Returns null if key is malformed
}

export function assertAssetTypeMatchesKey(key: string, assetType: MetaAssetType): void {
  // Throws if key prefix does not match assetType
  // E.g., key='db.field...' with assetType='table' throws
  // Used as service-layer gate on every create/update
}
```

Service layer calls `assertAssetTypeMatchesKey()` on every write to `meta_assets`.

### 7.3 Alias Resolution

Multi-tenant, deterministic alias resolution with full trace:

```typescript
export interface AliasCandidate {
  aliasValue: string;        // e.g. "Kundenrechnung"
  targetAssetKey: string;    // e.g. "db.bo.finance.invoice"
  scopeType: MetaAliasScopeType;  // org, team, role, user, locale, app_area
  scopeValue: string;        // e.g. "de-CH"
  priority: number;          // higher wins
}

/**
 * Machine-readable tie-breaking weights for alias resolution.
 * Higher score = higher specificity (tighter scope).
 * Used in D22 tie-breaking: (1) highest candidate.priority, (2) highest scope specificity, (3) lexical targetAssetKey.
 */
export const ALIAS_SCOPE_SPECIFICITY: Record<MetaAliasScopeType, number> = {
  user: 60,        // user-specific aliases win
  role: 50,        // role-level aliases
  team: 40,        // team-level aliases
  org: 30,         // organization-level aliases
  locale: 20,      // locale-level aliases
  app_area: 10,    // app-area-level aliases (least specific)
};

export interface AliasMatch {
  candidate: AliasCandidate;
  score: number;             // 0.0–1.0
  matchType: 'exact' | 'slug' | 'synonym' | 'fuzzy';
}

export interface ResolutionRule {
  name: string;
  priority: number;
  matchFn: (input: string, candidate: AliasCandidate) => AliasMatch | null;
}

export interface ResolutionContext {
  orgId: string;
  userId: string;
  roles: string[];
  locale: string;
  appArea?: string;
}

export interface AliasTrace {
  step: number;
  ruleName: string;
  candidatesTested: number;
  winner: AliasMatch | null;
  elapsed: number;  // ms
}

export interface ResolutionResult {
  winner: AliasMatch | null;
  trace: AliasTrace[];
  allMatches: AliasMatch[];
}
```

```typescript
export function slugify(input: string): string;
export function matchAlias(
  input: string,
  candidates: AliasCandidate[],
  opts?: { fuzzy?: boolean }
): AliasMatch[];

export function resolveAlias(
  matches: AliasMatch[],
  rules: ResolutionRule[],
  ctx: ResolutionContext,
  opts?: { minConfidence?: number }
): ResolutionResult;
```

**Alias invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| A1 | `resolveAlias(same inputs)` always returns the same winner + trace | Determinism |
| A2 | `slugify(slugify(x)) === slugify(x)` | Idempotence |
| A3 | Fuzzy matching disabled unless `{ fuzzy: true }` | Opt-in safety |
| A4 | `resolveAlias()` produces identical result even if `matches` input order is randomized | Input ordering independence |

**`resolveAlias()` strict mode:**

When `minConfidence` is set:
- Matches scoring below `minConfidence` are filtered out before winner selection
- If no match survives, `winner` is `null` and the trace explains why
- The migration pipeline SHOULD set `minConfidence: 0.8` to prevent low-confidence aliases from silently entering the system
- The admin debugger UI may set `minConfidence: 0` for exploration

### 7.4 Lineage

Design-time lineage (v1). Instance lineage (doc → mutation → posting) deferred to v2.

```typescript
export interface LineageEdge {
  fromAssetKey: string;
  toAssetKey: string;
  edgeType: MetaEdgeType;  // ingests, transforms, serves, derives, posts_to, affects
  metadata?: Record<string, unknown>;
}

/**
 * Validate that a lineage edge references valid asset keys (L0 invariant).
 * Prevents garbage edges from entering storage.
 */
export function validateLineageEdge(edge: LineageEdge): {
  valid: boolean;
  errors: string[];
};

export function topoSortLineage(edges: LineageEdge[]): {
  sorted: string[];  // topologically sorted asset keys
  cycles: string[][];  // all cycles detected
};

/**
 * Infer edge type and return confidence + reasoning.
 * For v1, confidence is typically 1.0 (obvious cases) or 0.6 (ambiguous cases).
 * Call this to avoid blindly trusting inference.
 */
export function inferEdgeType(from: ParsedAssetKey, to: ParsedAssetKey): {
  edgeType: MetaEdgeType;
  confidence: number;  // 1.0 = certain (ex: field→field is 'transforms'); 0.6 = ambiguous (ex: record→record could be 'ingests' or 'derives')
  reason: string;  // explanation for confidence level
};

export function explainLineageEdge(edge: LineageEdge): string;
```

**Lineage invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| L0 | `validateLineageEdge()` ensures both `fromAssetKey` and `toAssetKey` pass `validateAssetKey()` | Edge validation |
| L1 | `topoSortLineage()` detects and returns all cycles | Cycle detection |
| L2 | `inferEdgeType(...).confidence` is explicit; 1.0 = certain, 0.6 = ambiguous | Confidence tracking |

### 7.5 Quality Rules

Two-layer quality model: executable rules (data engineering) + business dimensions (stakeholders).

```typescript
export type QualityRuleType =
  | 'not_null' | 'unique' | 'range' | 'regex'
  | 'fk_exists' | 'enum_set'
  | 'sum_matches_total' | 'debits_equal_credits';

export interface QualityRule {
  ruleType: QualityRuleType;
  targetAssetKey: string;
  config: Record<string, unknown>;
  severity: 'error' | 'warning' | 'info';
}

export interface QualityPlan {
  assetKey: string;
  rules: QualityRule[];
}

export interface QualityCheckResult {
  rule: QualityRule;
  passed: boolean;
  failedCount?: number;
  totalCount?: number;
  checkedAt: string;  // ISO 8601
}

export type QualityDimension =
  | 'completeness' | 'validity' | 'uniqueness' | 'consistency' | 'accuracy';

export function compileQualityRule(rule: QualityRule): {
  sqlTemplate?: string;       // structural template (e.g., 'NOT_NULL({columnRef})'), not executable SQL
  templateParams?: Record<string, unknown>;  // parameters to substitute into template
  validate?: (value: unknown) => boolean;  // for in-memory rules
};

export function scoreQualityTier(results: QualityCheckResult[]): MetaQualityTier;
```

**Quality invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| Q1 | `qualityRuleSchema.parse(rule)` rejects invalid configs | Schema validation |
| Q2 | `scoreQualityTier(same results)` always returns the same tier | Determinism |
| Q3 | `compileQualityRule()` returns SQL only for field-level targets | SQL scope |

### 7.2.1 Asset Key Grammar Details

**Prefix tokenization:**
- `db.*` prefixes: split on `.` character. Prefix is first 2 tokens (e.g., `db.rec`), remainder is segments. Example: `db.rec.system.public.invoices` → prefix=`db.rec`, segments=`['system', 'public', 'invoices']`
- `metric:` prefix: colon-delimited. Prefix is `metric:`, remainder (after `:`) is dot-split segments. Example: `metric:finance.revenue` → prefix=`metric:`, segments=`['finance', 'revenue']`

**Charset specifics:**
- **Allowed in segments:** lowercase `a-z`, digits `0-9`, underscore `_`, hyphen `-`, forward slash `/`, braces `{}`. Example: `db.view.finance_ar/invoices.list` is valid (hierarchy) and `db.pipe.sync_{source}_{target}` is valid (template).
- **Disallowed:** uppercase letters (canonicalize first), `.` `:` (delimiters), spaces, `@` `#` `$` `%` `&` etc.
- **Empty segments rejected:** `db.rec.system..invoices` → invalid (double dot)
- **Trailing delimiters rejected:** `db.rec.system.public.invoices.` → invalid

**Canonicalization is non-auto-correcting:**
- Input: `db.REC.System.Public.INVOICES` → lowercase + trim → `db.rec.system.public.invoices` → validate
- Input: `db.rec.system..invoices` → structural error → throw (never auto-repair)
- Input: `  db.rec.system.public.invoices  ` → trim → `db.rec.system.public.invoices` → validate

### 7.6 Column Classification

```typescript
export interface PIIPattern {
  fieldNamePattern: RegExp;
  classification: MetaClassification;
  confidence: number;
}

export const PII_PATTERNS: PIIPattern[] = [
  { fieldNamePattern: /email/i, classification: 'pii', confidence: 0.95 },
  { fieldNamePattern: /ssn|social_security/i, classification: 'pii', confidence: 0.99 },
  { fieldNamePattern: /phone|mobile|tel/i, classification: 'pii', confidence: 0.9 },
  { fieldNamePattern: /address|street|city|zip|postal/i, classification: 'pii', confidence: 0.85 },
  { fieldNamePattern: /salary|wage|compensation/i, classification: 'financial', confidence: 0.9 },
  { fieldNamePattern: /revenue|profit|loss|balance/i, classification: 'financial', confidence: 0.85 },
  { fieldNamePattern: /password|secret|token|api_key/i, classification: 'pii', confidence: 0.99 },
];

export function classifyColumn(
  fieldName: string,
  sampleValues?: unknown[]
): { classification: MetaClassification; confidence: number } | null;

export function classifyColumns(
  columns: Array<{ name: string; sampleValues?: unknown[] }>
): Map<string, { classification: MetaClassification; confidence: number }>;
```

**Classification invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| C1 | `classifyColumn('email', [])` returns `pii` | Pattern matching |
| C2 | `classifyColumn('xyzzy_random_col', [])` returns `null` | Unknown → null |

### 7.7 Glossary

Types only in v1. No functions.

```typescript
export interface GlossaryTerm {
  termId: string;
  name: string;
  definition: string;
  owner?: string;
  relatedTerms?: string[];  // other termIds
}

export interface TermLink {
  termId: string;
  assetKey: string;
  confidence: number;
}
```

---

## 8. Mappings

### 8.1 Postgres Type Mapping

```typescript
// src/mappings/postgres-types.ts

interface MapPostgresColumnInput {
  columnName: string;
  udtName: string;       // pg type from information_schema
  isNullable: boolean;
  characterMaximumLength?: number;
  numericPrecision?: number;
  numericScale?: number;
}

interface MapPostgresColumnOutput {
  canonType: DataType;
  isRequired: boolean;
  maxLength?: number;
  precision?: number;
  scale?: number;
  confidence?: number;  // 1.0 = exact, <1.0 = lossy/narrowing (NEW)
  notes?: string;       // explanation if lossy or narrowed (NEW)
}

export function mapPostgresType(
  pgType: string,
  meta?: { maxLength?: number },
  opts?: { mode?: 'strict' | 'loose' }
): {
  canonType: DataType;
  confidence: number;   // 1.0 = lossless, <1.0 = lossy mapping
  notes?: string;       // e.g., "timestamp→datetime preserves semantics"
};

export function mapPostgresColumn(input: MapPostgresColumnInput): MapPostgresColumnOutput;

/**
 * Normalize Postgres types before mapping.
 * Handles arrays (_text, text[]), domains, composite types, and user-defined types.
 * Returns normalized base type suitable for mapPostgresType().
 */
export function normalizePgType(pgType: string): {
  baseType: string;     // e.g., "text" (stripped from "_text" or "text[]")
  isArray: boolean;     // true if original was array
  isDomain: boolean;    // true if resolved from domain definition
  isComposite: boolean; // true if composite/record type
};
```

**Mapping rules:**

| Rule | Behavior |
|------|----------|
| `varchar(n)` where n ≤ 255 | `short_text` |
| `varchar(n)` where n > 255 | `long_text` |
| `text` | `long_text` |
| `numeric(p,s)` where s > 0 | `decimal` |
| `numeric(p,0)` or `integer` | `integer` |
| `timestamp`/`timestamptz` | `datetime` |
| `jsonb` | `json` |
| `uuid` | `entity_ref` (confidence: 0.7–0.95 depending on reference metadata availability) |
| `bytea` | `binary` |
| Domains | Resolve to base type if schema provided; otherwise strict throws. (M2 — no silent fallback.) |
| Composite/user-defined types | Strict throws. Loose maps to `json` with confidence 0.4. |
| Unknown type (strict mode) | **Throws** `UnknownPostgresTypeError` |
| Unknown type (loose mode) | Returns `short_text` with warning |

**Mapping invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| M1 | Every known Postgres type maps to a Canon `DataType` | Full coverage |
| M2 | Strict mode throws on unknown types; never silent fallback | Strict enforcement |
| M3 | Confidence values follow `CONFIDENCE_SEMANTICS` contract (1.0=lossless, 0.9–0.99=semantic, 0.7–0.89=narrowing, <0.7=lossy) | Confidence tracking |

### 8.2 CSV Type Inference

```typescript
// src/mappings/csv-types.ts

export function inferCsvColumnType(
  values: string[],
  opts?: { sampleSize?: number }
): {
  canonType: DataType;
  confidence: number;   // 0.0–1.0 based on sample certainty
  notes?: string;       // e.g., "inferred from N samples"
};
```

Infers Canon `DataType` from a sample of CSV column values:
- All integers → `integer`
- All numbers → `decimal`
- All ISO dates → `date`
- All `true`/`false` → `boolean`
- Mixed → `short_text` (default safe fallback)

### 8.3 Type Compatibility Matrix

```typescript
// src/mappings/type-compat.ts

export type CompatLevel = 'exact' | 'widening' | 'narrowing' | 'lossy' | 'incompatible';

/**
 * Confidence contract for type mappings and type inference.
 * Used by mapPostgresType(), inferCsvColumnType(), and similar mapping functions.
 */
export const CONFIDENCE_SEMANTICS = {
  // 1.0 = lossless and semantically equivalent
  EXACT: 1.0,
  // 0.9–0.99 = semantically equivalent but representation differs
  // (ex: timestamptz→datetime both preserve full precision, just different timezone handling)
  SEMANTIC_EQUIV: 0.95,
  // 0.7–0.89 = narrowing or depends on external metadata
  // (ex: uuid→entity_ref if no target reference metadata; numeric(p,s)→integer loses precision)
  NARROWING_WITH_METADATA: 0.8,
  // <0.7 = lossy fallback / informational mapping
  // (ex: composite type→json; unknown type→short_text in loose mode)
  LOSSY_FALLBACK: 0.4,
} as const;

export const TYPE_COMPAT_MATRIX: Record<DataType, Record<DataType, CompatLevel>> = {
  short_text: {
    short_text: 'exact',
    long_text: 'widening',
    integer: 'narrowing',
    decimal: 'narrowing',
    boolean: 'narrowing',
    date: 'narrowing',
    json: 'widening',
    file: 'incompatible',
    single_select: 'narrowing',
    multi_select: 'incompatible',
    url: 'narrowing',
    rich_text: 'widening',
    currency: 'narrowing',
    formula: 'incompatible',
    relation: 'incompatible',
  },
  // ... all 15 DataType × DataType combinations
};

export function getCompatLevel(from: DataType, to: DataType): CompatLevel;
export function isCompatible(from: DataType, to: DataType): boolean;    // exact | widening
export function requiresTransform(from: DataType, to: DataType): boolean;  // narrowing | lossy
```

**Compatibility invariants:**

| ID | Invariant | Test |
|----|-----------|------|
| TC1 | `getCompatLevel(T, T) === 'exact'` for all T | Self-compat |
| TC2 | If A→B is `widening`, then B→A is `narrowing` or `lossy` | Symmetry |

---

## 9. Validators

### 9.1 Custom Field Value Validator (existing)

```typescript
// src/validators/custom-field-value.ts (already exists)
export function validateFieldValue(
  value: unknown,
  dataType: DataType,
  config?: Record<string, unknown>
): FieldValidationResult;
```

### 9.2 Asset Key Validator (new, in lite-meta)

```typescript
// src/lite-meta/asset-keys.ts
export function validateAssetKey(key: string): {
  valid: boolean;
  errors: string[];
};
```

Validates:
- Key starts with recognized prefix (`db.rec`, `db.field`, `db.bo`, `db.view`, `db.pipe`, `db.report`, `db.api`, `db.policy`, or `metric:`)
- Segment count matches `ASSET_KEY_PREFIX_SPECS[prefix].{minSegments,maxSegments}`
- No empty segments
- Each segment matches regex `[a-z0-9_\-\/{}]` (alphanumeric, underscore, hyphen, forward slash, braces; lowercase only)
- Forbidden in segments: `.` `:` (reserved as delimiters)

---

## 10. Enums

22 enum files in `src/enums/`. All use `as const` arrays exported as tuples, with Zod schemas derived via `z.enum()`.

**Metadata enums (6 files, existing):**

- `meta-asset-type.ts` — `MetaAssetType`
- `meta-edge-type.ts` — `MetaEdgeType`
- `meta-alias-scope-type.ts` — `MetaAliasScopeType`
- `meta-alias-target-type.ts` — `MetaAliasTargetType`
- `meta-classification.ts` — `MetaClassification`
- `meta-quality-tier.ts` — `MetaQualityTier`

**Additions (next step):**

**`meta-asset-type.ts` — add 3 values:**

```typescript
// Before: ['table', 'column', 'view', 'pipeline', 'report', 'api']
// After:
export const META_ASSET_TYPES = [
  'table', 'column', 'view', 'pipeline', 'report', 'api',
  'business_object', 'policy', 'metric',
] as const;
```

Interpretation mapping:
- `table` = record type (keep as-is)
- `column` = field (keep as-is)
- `view` = UI view (keep as-is)
- `pipeline` = process (keep as-is)
- `report` = report/KPI (keep as-is)
- `api` = API contract (keep as-is)
- `business_object` = NEW — "Invoice", "Customer" as business concepts
- `policy` = NEW — SOX controls, approval rules, governance
- `metric` = NEW — KPIs and metrics (paired with `metric:` asset key prefix)

**`meta-edge-type.ts` — add 2 values:**

```typescript
// Before: ['ingests', 'transforms', 'serves', 'derives']
// After:
export const META_EDGE_TYPES = [
  'ingests', 'transforms', 'serves', 'derives',
  'posts_to', 'affects',
] as const;
```

- `posts_to` = document → ledger posting (ERP-specific)
- `affects` = transaction → stock/AR/AP/GL impact (ERP-specific)

**All other enums: unchanged.**

- `META_ALIAS_TARGET_TYPES` = `['asset', 'custom_field', 'metric', 'view_field', 'enum_value']` — unchanged
- `META_CLASSIFICATIONS` = `['pii', 'financial', 'internal', 'public']` — unchanged
- `META_QUALITY_TIERS` = `['gold', 'silver', 'bronze']` — unchanged
- `META_ALIAS_SCOPE_TYPES` = `['org', 'team', 'role', 'user', 'locale', 'app_area']` — unchanged

---

## 11. Types

13 type files. All remain in `src/types/`. No changes to existing interfaces.

When `registries/` module is created, the types continue to be exported from `src/types/` for backward compatibility. Registry files import from types; the barrel re-exports both.

---

## 12. Zod Schemas (Zod v4)

Canon pins **Zod v4** (`~4.3.6` via pnpm catalog). All schemas MUST use Zod v4 idioms.

### 12.1 Zod v4 Conventions for Canon

| v3 Pattern (banned) | v4 Replacement | Why |
|---------------------|---------------|-----|
| `z.string().uuid()` | `z.uuid()` | Top-level form is tree-shakable, more concise |
| `z.string().email()` | `z.email()` | Same — subclass, not refinement |
| `z.string().regex(re, 'msg')` | `z.string().regex(re, { error: 'msg' })` | Unified `error` param replaces `message` |
| `.refine(fn, { message })` | `.check(z.refine(fn, { error }))` | v4 check API, unified error param |
| `z.nativeEnum(E)` | `z.enum(tuple)` from `as const` array | Canon uses const tuple arrays (e.g., `META_ASSET_TYPES = [...] as const`), never TS enums. `z.enum()` operates on tuple types, not TS enum values. This ensures tree-shakeability and determinism. |
| `.merge(other)` | `.extend(other.shape)` | `.merge()` deprecated; `.extend()` has 100× fewer tsc instantiations |
| `.strict()` | `z.strictObject({})` | Method deprecated; use factory |
| `.passthrough()` | `z.looseObject({})` | Method deprecated; use factory |
| `.describe('...')` | `.meta({ description: '...' })` | `.describe()` deprecated; `.meta()` feeds `z.toJSONSchema()` |
| `z.record(z.string())` | `z.record(z.string(), z.unknown())` | Single-arg `z.record()` dropped in v4 |
| `z.ZodTypeAny` | `z.ZodType` | `ZodTypeAny` removed |
| `.regex(re, 'YYYY-MM-DD')` | `z.iso.date()` | Built-in ISO date validator replaces custom regex |
| `z.toJSONSchema()` with separate package | `z.toJSONSchema()` from zod built-in | Use Zod v4 built-in; no `zod-to-json-schema` npm package needed |

### 12.2 Schema Registry & Metadata

Canon uses `z.globalRegistry` + `.meta()` to attach machine-readable metadata to every exported schema. This metadata flows into `z.toJSONSchema()` for non-TS consumers.

```typescript
import { z } from 'zod';

export const assetKeySchema = z.string().min(3)
  .check(z.refine(
    (key) => validateAssetKey(key).valid,
    { error: 'Invalid asset key format' }
  ))
  .meta({ id: 'AssetKey', description: 'Dot-delimited metadata asset key' });
```

### 12.3 Shared Utilities

Extract duplicated schemas into a shared module:

**New file:** `src/schemas/json-value.ts`

```typescript
import { z } from 'zod';

/** Recursive JSON value — shared across audit.ts, mutation.ts */
export const jsonValueSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(), z.number(), z.boolean(), z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);
```

### 12.4 Updated Schema Files

9 existing schema files + 2 new files (`json-value.ts`, `lite-meta.ts`).

**New file:** `src/schemas/lite-meta.ts`

```typescript
import { z } from 'zod';
import { validateAssetKey } from '../lite-meta/asset-keys';

export const assetKeySchema = z.string().min(3)
  .check(z.refine(
    (key) => validateAssetKey(key).valid,
    { error: 'Invalid asset key format' }
  ))
  .meta({ id: 'AssetKey', description: 'Dot-delimited metadata asset key' });

export const qualityRuleTypeSchema = z.enum([
  'not_null', 'unique', 'range', 'regex', 'fk_exists', 'enum_set',
  'sum_matches_total', 'debits_equal_credits',
]).meta({ id: 'QualityRuleType', description: 'Executable quality check type' });

export const qualityRuleSchema = z.object({
  ruleType: qualityRuleTypeSchema,
  targetAssetKey: assetKeySchema,
  config: z.record(z.string(), z.unknown()),   // v4: two-arg z.record
  severity: z.enum(['error', 'warning', 'info']),
}).meta({ id: 'QualityRule', description: 'Executable data quality rule' });

export const qualityDimensionSchema = z.enum([
  'completeness', 'validity', 'uniqueness', 'consistency', 'accuracy',
]).meta({ id: 'QualityDimension', description: 'Business-level quality dimension' });
```

### 12.5 JSON Schema Generation (build-time)

`z.toJSONSchema()` is built into Zod v4 — no separate `zod-to-json-schema` package needed:

```typescript
// scripts/gen-json-schemas.ts (NOT Canon runtime code)
import { z } from 'zod';
import * as canon from 'afenda-canon';

for (const schema of [canon.qualityRuleSchema, canon.receiptSchema, canon.mutationSpecSchema]) {
  const meta = z.globalRegistry.get(schema);
  const jsonSchema = z.toJSONSchema(schema, { target: 'draft-2020-12' });
  writeFileSync(`dist/schemas/${meta?.id ?? 'unknown'}.json`, JSON.stringify(jsonSchema, null, 2));
}
```

### 12.6 v4 Performance Wins

| Metric | v3 | v4 | Impact on Canon |
|--------|----|----|----------------|
| String parse | baseline | **14× faster** | Asset key validation throughput |
| Object parse | baseline | **6.5× faster** | `qualityRuleSchema.parse()`, `mutationSpecSchema.parse()` |
| `tsc` instantiations | ~25k per object | **~175** | Faster CI type-check |
| Bundle (gzip) | 12.5kb | **5.4kb** | Smaller bundles for consumers |

---

## 13. Dependencies

| Dependency | Type | Version | Purpose |
|-----------|------|---------|--------|
| `zod` | Runtime | `~4.3.6` (catalog) | Schema validation, type inference, JSON Schema generation |

**That's it.** Zero workspace dependencies. Canon is pure Layer 1 Foundation.

Zod v4 is pinned via `pnpm-workspace.yaml` catalog. Canon uses `z.toJSONSchema()` (built-in) instead of a separate `zod-to-json-schema` package.

| Dev Dependency | Purpose |
|----------------|---------|
| `afenda-eslint-config` | Lint rules |
| `afenda-typescript-config` | TS config |
| `typescript` | Compiler |
| `tsup` | Bundler |
| `vitest` | Testing |

---

## 14. DB Alignment

Canon defines the model; DB stores instances. These tables are the runtime counterparts:

| Canon Concept | DB Table | Relationship |
|---------------|----------|-------------|
| Asset keys + descriptors | `meta_assets` | Canon validates keys; DB stores rows |
| Lineage edges | `meta_lineage_edges` | Canon infers edge types; DB stores edges |
| Quality rules | `meta_quality_checks` | Canon compiles rules; DB stores definitions + results |
| Alias sets | `meta_alias_sets` | Canon defines scope types; DB stores sets |
| Aliases | `meta_aliases` | Canon resolves; DB stores candidates |
| Resolution rules | `meta_alias_resolution_rules` | Canon scores; DB stores priorities |
| Value aliases | `meta_value_aliases` | Canon matches; DB stores translations |
| Glossary terms | `meta_semantic_terms` | Canon defines shape; DB stores terms |
| Term-asset links | `meta_term_links` | Canon links; DB stores associations |

### DB Alignment Rules

| ID | Rule | Detail |
|----|------|--------|
| DB1 | Canon never imports a DB client | No `pg`, no `drizzle`, no `kysely` |
| DB2 | DB migrations reference Canon enums/types | `MetaAssetType` values become CHECK constraints |
| DB3 | Service layer calls Canon validators before DB writes | `validateAssetKey()` gate |
| DB4 | DB CHECK constraints mirror Canon validation | When key grammar is stable, add `CHECK (asset_key ~ '^db\.\|^metric:')` |
| DB5 | Canonicalize before validate before store | Service layer calls `canonicalizeKey()` then `validateAssetKey()` on every write. Only the canonicalized value is stored. |

---

## 15. Consumer Integration

### How Layer 2 packages consume Canon:

```typescript
// business-domain/accounting/src/some-service.ts
import {
  buildAssetKey,
  validateAssetKey,
  canonicalizeKey,
  mapPostgresType,
  classifyColumn,
  scoreQualityTier,
  type AssetDescriptor,
  type QualityRule,
  type ParsedAssetKey,
} from 'afenda-canon';

// Use Canon functions in service logic
const key = buildAssetKey('db.rec', 'afenda', 'public', 'invoices');
const canonical = canonicalizeKey(key);
const validation = validateAssetKey(canonical);

if (!validation.valid) {
  throw new Error(`Invalid asset key: ${validation.errors.join(', ')}`);
}
```

### Import rules:

| Consumer Layer | Can Import | Cannot Import |
|---------------|-----------|---------------|
| Layer 2 (Domain) | `afenda-canon` types, schemas, functions | Canon internals (no deep imports) |
| Layer 3 (App) | `afenda-canon` types, schemas, functions | Canon internals |
| Layer 1 (other Foundation) | `afenda-canon` types only | Canon functions that imply domain knowledge |

---

## 16. Phasing

### Phase 1 — Foundation (current)

- [x] 22 enum files
- [x] 13 type files
- [x] 9 schema files
- [x] 1 validator file
- [x] `json-value.ts` shared schema
- [x] Zod v4 migration (source code)
- [ ] `lite-meta/` module (7 files)
- [ ] `mappings/` module (3 files + index)
- [ ] `registries/` module (2 files + index)
- [ ] `schemas/lite-meta.ts`
- [ ] `constants.ts` (CANON_LAYER_RULES, CANON_KEYSPACE_VERSION)
- [ ] Barrel update

### Phase 2 — Service Integration

- [ ] Service-layer gate (canonicalize-first + validate)
- [ ] DB CHECK constraints for asset keys
- [ ] Quality rule execution pipeline

### Phase 3 — Instance Lineage (v2)

- [ ] Instance lineage: doc → mutation → posting
- [ ] OpenLineage bridge (tools/)
- [ ] Schema evolution tracking via fingerprint diffs

---

## 17. Testing & Invariants

### Unit Tests (Vitest)

| Test | Invariant |
|------|-----------|
| Key round-trip | `parseAssetKey(buildAssetKey(...))` identity |
| Key canonicalization | idempotent |
| Key segment validation | reject segments with `.` or `:` inside |
| Fingerprint stability | same descriptor → same hash |
| Alias resolution determinism | same inputs → same winner + trace |
| Alias slugify idempotence | `slugify(slugify(x)) === slugify(x)` |
| Quality rule schema validation | reject invalid configs |
| Quality tier scoring determinism | same results → same tier |
| Lineage cycle detection | detect and return cycles |
| Postgres type coverage | every known pg type maps to a Canon DataType |
| Postgres strict mode | unknown type → throws, never silent fallback |
| Type compat symmetry | if A→B is widening, B→A is narrowing |
| Fuzzy alias disabled by default | `matchAlias(x, candidates)` returns no fuzzy matches unless `{ fuzzy: true }` |

### Integration Tests (DB)

| Test | What It Validates |
|------|-------------------|
| DB constraints align with Canon validators | Insert invalid keys → expect reject |
| Tenant isolation | Org A cannot read Org B metadata |
| Ingest idempotency | Run twice → no duplicates, stable fingerprints |
| Alias CHECK constraints | Target key format matches Canon grammar |

### Acceptance Checklist — v1.0 Definition

Phase 1 is complete when all 5 items pass (DB constraints, instance lineage, etc. are Phase 2+):

1. **Asset keys** — `buildAssetKey()`, `parseAssetKey()`, `canonicalizeKey()`, `validateAssetKey()` work deterministically with full test coverage (K1–K5 invariants) ✅
2. **Zod v4 schemas** — `assetKeySchema`, `qualityRuleSchema`, `qualityDimensionSchema` all use v4 idioms + `z.toJSONSchema()` export works ✅
3. **Type mappings** — `mapPostgresType()` strict/loose + confidence + `normalizePgType()` for arrays/domains — tests pass (M1–M2 invariants) ✅
4. **Alias resolution** — `resolveAlias()` deterministic with trace, `minConfidence` filtering, tie-breaks (D22 + D22.1) — tests pass (A1–A2) ✅
5. **Import guardrails** — `dependency-cruiser` blocks deep imports, depcruise config enforces "`zod` only" runtime dep ✅

---

## 18. Locked Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| **D1** | **Canon has zero workspace dependencies.** | Canon is Layer 1 Foundation. It provides types/schemas/enums to everyone. If it depended on other workspace packages, it would create circular dependencies or layer violations. The only runtime dep is `zod`. |
| **D2** | **Canon defines the metadata model; DB stores instances.** | Canon owns the shape (types, schemas, validation rules). The database owns the data (rows, indexes, constraints). Canon never imports `pg` or `drizzle`. The service layer bridges them. |
| **D3** | **Quality rules use a two-layer model.** | Layer 1: Executable rule types (`not_null`, `unique`, `range`, `regex`, `fk_exists`, `enum_set`, `sum_matches_total`, `debits_equal_credits`). Layer 2: Business dimensions (`completeness`, `validity`, `uniqueness`, `consistency`, `accuracy`). `DIMENSION_TO_RULES` maps between them. This resolves the fragmented `QualityRule` definitions across `mdm` and `data-governance`. |
| **D4** | **Asset keys use `db.*` prefixes.** | All database-origin assets use `db.rec.`, `db.field.`, `db.bo.`, etc. This avoids conflict with future non-DB sources (e.g., `api.*`, `file.*`). KPIs use `metric:` prefix (separate namespace). |
| **D5** | **Alias resolution is deterministic + traceable.** | Every resolution produces a `ResolutionResult` with traces showing which rules fired, what candidates were tested, and why the winner won. This is mandatory for audit compliance and debugging. |
| **D6** | **Backward compatibility via re-exports.** | Move files into `registries/`, `lite-meta/`, `mappings/`. Keep re-exports from original locations (`types/action.ts`, etc.). Zero breaking changes for existing consumers. |
| **D7** | **Design-time lineage in v1. Instance lineage in v2.** | Instance lineage (doc → mutation → posting) requires integration with `mutation_batches`, `audit_logs`, `entity_versions`. Defer to v2 to keep v1 scope manageable. |
| **D8** | **KPI keys must use `metric:` prefix. Never `db.metric.`.** | Prevents dual-format drift. `metric:` has its own DB CHECK constraint (`LIKE 'metric:%'`). All KPI/report metric keys use this format exclusively. |
| **D9** | **Postgres mapping defaults to strict mode.** | Migration pipelines must fail loudly on unknown Postgres types. Loose mode (fallback to `short_text`) is opt-in for exploration/preview UIs only. |
| **D10** | **Fuzzy alias matching is opt-in, dependency-free.** | v1 ships exact/slug/synonym only by default. Fuzzy (Levenshtein) is behind `{ fuzzy: true }` flag and implemented internally — no external deps. |
| **D11** | **Service-layer enforcement until DB CHECK exists.** | `meta_assets.asset_key` has no DB CHECK constraint yet. Service layer must call `validateAssetKey()` on every write. DB constraint added when key grammar is proven stable. |
| **D12** | **OSS alignment is structural, never imported.** | Canon aligns vocabulary/schemas with GE, Soda, OpenLineage, OPA. These tools run in services/tools/CI — never as Canon runtime deps. |
| **D13** | **Zod v4 idioms mandatory.** | All new Canon schemas use v4 APIs: `z.uuid()`, `.meta()`, `.check()`, `{ error }` param, `z.toJSONSchema()`. Prefer `.meta()` for JSON-schema-friendly metadata. Avoid v3 patterns: `.merge()`, `.strict()`, single-arg `z.record()`, `z.nativeEnum()`. Existing code migrated incrementally. |
| **D14** | **Keyspace grammar is versioned.** | `CANON_KEYSPACE_VERSION = 1` tracks the key grammar format. If v2 introduces `bo:` / `rec:` bare prefixes, version 1 keys remain valid under version 1 rules. Services store the version alongside assets. |
| **D15** | **Canonicalize-then-validate-then-store.** | All writes to `meta_assets` must: (1) `canonicalizeKey(key)`, (2) `validateAssetKey(canonicalized)`, (3) store only the canonicalized value. Prevents case drift (`db.bo.Finance.Invoice` vs `db.bo.finance.invoice`). |
| **D16** | **Strict mode is default everywhere.** | `mapPostgresType()`, `parseAssetKey()`, and `resolveAlias()` default to strict behavior: throw on unknown types, reject malformed keys, return `null` below `minConfidence`. Loose/lenient modes are opt-in for exploration only. If a service calls a function without options, it gets strict. |
| **D16.1** | **Parsing API consistency: never throws on validation, throws on structure.** | `validateAssetKey(key)` always returns `{ valid, errors }`, never throws. `parseAssetKey(key)` with `{ mode: 'strict' }` throws only on malformed keys (structural issues), not validation failures. `mapPostgresType(type, {}, { mode: 'strict' })` throws on unknown types. Callers can rely on return type to know if exceptions are possible. |
| **D18** | **`metric` is a first-class MetaAssetType** | KPI/metric keys use `metric:` prefix AND `assetType: 'metric'`. This unifies the model and allows metrics to be queried alongside other asset types. |
| **D19** | **Public API stability contract.** | Only export from `src/index.ts` (no deep imports allowed; enforced by dependency-cruiser). Exported symbol names are stable within major version. Deprecations are additive (old name re-exported, new name introduced). Breaking changes only on major semver bump. |
| **D17** | **Directory names stay: `lite-meta/`, `mappings/`, `validators/`.** | Considered `metadata/`, `adapters/`, `rules/`. Current names are already in code, docs, CI scripts, and dependency-cruiser rules. Renaming creates churn with zero functional benefit. If needed, we can add import aliases in the barrel. |
| **D20** | **Canonicalization is pure, non-auto-correcting.** | `canonicalizeKey(key)` performs: (1) trim whitespace, (2) lowercase, (3) rejects `..` (double dots), (4) rejects empty segments. Does NOT rewrite underscores, hyphens, slashes, or braces. Ensures determinism: no silent "auto-correction" surprises. |
| **D21** | **`assetFingerprint()` returns canonical string (pure, no crypto imports).** | Input is `JSON.stringify(descriptor)` with sorted keys + sorted arrays. Output is deterministic string. Cryptographic hashing (SHA-256) happens in **tools/** or service layer, not Canon. Keeps Canon portable and dependency-light. |
| **D22** | **`resolveAlias()` has explicit tie-break rules.** | If two matches score identically: (1) higher `candidate.priority` wins; (2) more specific scope wins (user > role > team > org > locale > app_area); (3) lexically first `targetAssetKey`; (4) lexically first `aliasValue`. Determinism guaranteed — no non-determinism from candidate reordering. |
| **D22.1** | **Synonym resolution is caller-driven, not a Canon responsibility.** | Synonyms are alias candidates with `matchType='synonym'` provided by the caller. Canon applies the same matching/scoring rules. No hardcoded synonym lookup tables in Canon. This prevents catalog product leakage into the Foundation layer. |
| **D23** | **Canon never ships "executors."** | Canon compiles, infers, plans, and validates. It **never** executes: no SQL, network calls, file I/O, env reads, time/random generation. Keeps Canon pure, testable, and portable to edge/browser. |

## 18.6 Public API Governance Contract (v1 Stability Lock)

Canon's public API is exposed through `src/index.ts` (barrel re-export). This section defines the stability contract and governance rules for v1 and beyond.

### Public API Export Rules

1. **No Deep Imports.** Consumers import only from `afenda-canon`, never from `afenda-canon/src/types/`, `afenda-canon/lite-meta/`, or similar. Rule enforced by dependency-cruiser CI.
   - ✅ Allowed: `import { buildAssetKey } from 'afenda-canon'`
   - ❌ Forbidden: `import { buildAssetKey } from 'afenda-canon/src/lite-meta/asset-keys'`

2. **Export Stability Within Major Version.** v1 exports are stable. Exported symbols (types, functions, enums, constants) cannot be removed during v1.
   - ✅ Allowed: Add new export, deprecate old name (re-export both)
   - ❌ Forbidden: Remove exported symbol, rename without re-export, change signature

3. **New Asset Key Prefixes Require Full Spec Entry.** Any new prefix (e.g., `api.`, `file.`) cannot be coded without:
   - Entry in `ASSET_KEY_PREFIX_SPECS` (with `afterPrefixMin/afterPrefixMax`)
   - Corresponding `MetaAssetType` enum value
   - `deriveAssetTypeFromKey()` mapping (updated + tested)
   - `assertAssetTypeMatchesKey()` validation (updated + tested)
   - Section §7.1 documentation update
   - Unit tests covering the new prefix

4. **Breaking Changes Only on Major Semver Bump.** v1 → v2 can remove/rename. v1.0 → v1.1 cannot.

### Governance Checklist for Contributors

Before merging changes to Canon:

- [ ] All exports defined in `src/index.ts`? If new: documented + tested?
- [ ] Deep import checks pass (`dependency-cruiser`)?
- [ ] No unused exports in index (audit quarterly)?
- [ ] New prefix? All 6 requirements from rule #3 satisfied?
- [ ] Type changes? Backward-compatible with v1.0 consumers?
- [ ] Test coverage ≥95% on new code?
- [ ] Zod v4 idioms used (no v3 patterns)?

---

## 18.5 Structural Tweaks: Anti-Drift Patterns (v1 Implementation)

Two structural improvements beyond core decisions — these prevent drift between docs, code, tests, and CI:

### A) Data-Driven Prefix Specifications

**Problem fixed:** Asset key grammar described in docs (~7.1) but validation rules scattered across `buildAssetKey()`, `parseAssetKey()`, `validateAssetKey()`, and tests. Drift risk: developers update one place and forget others.

**Solution:** Single source of truth — `ASSET_KEY_PREFIX_SPECS` constant in `src/lite-meta/asset-keys.ts`:

```typescript
export const ASSET_KEY_PREFIX_SPECS: Record<AssetKeyPrefix, {
  afterPrefixMin: number;
  afterPrefixMax: number;
  description?: string;
}> = {
  'db.rec': { afterPrefixMin: 3, afterPrefixMax: 3, description: 'system.schema.table' },
  'db.field': { afterPrefixMin: 4, afterPrefixMax: 4, description: 'system.schema.table.column' },
  'db.bo': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'module.name' },
  'db.view': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'module.name' },
  'db.pipe': { afterPrefixMin: 1, afterPrefixMax: 1, description: 'name' },
  'db.report': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'module.name' },
  'db.api': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'module.name' },
  'db.policy': { afterPrefixMin: 2, afterPrefixMax: 2, description: 'module.name' },
  'metric:': { afterPrefixMin: 1, description: 'dot-delimited after colon' },
};
```

**Used by:**
- `buildAssetKey()` — enforces segment count before joining
- `parseAssetKey()` — validates segment count after splitting
- `validateAssetKey()` — checks against spec
- Tests — iterate over specs to generate test cases (round-trip, invalid counts, etc.)
- Documentation — table in §7.1 derived from spec

**Anti-drift benefit:** Single edit to spec auto-updates validation, tests, and docs. CI catches mismatches.

### B) Confidence Tracking in Type Mappings

**Problem fixed:** `mapPostgresType()` and `inferCsvColumnType()` returned opaque `DataType` values. Code using these functions had no way to know if a mapping was lossless or lossy.

Example: `timestamp` → `datetime` (lossless), but `uuid` → `entity_ref` (narrowing if no reference metadata). Calling code didn't know which was which.

**Solution:** Return `{ canonType, confidence, notes }` from type mappings:

```typescript
export function mapPostgresType(pgType: string, meta?, opts?): {
  canonType: DataType;
  confidence: number;   // 1.0 = lossless, <1.0 = lossy
  notes?: string;       // e.g., "timestamp→datetime preserves semantics"
};
```

**Confidence levels:**
- `1.0` — exact, lossless (e.g., `text` → `long_text`)
- `>0.8` — widening or semantic-preserving (e.g., `timestamp` → `datetime` with full precision)
- `0.5–0.8` — narrowing but survivable (e.g., `uuid` → `entity_ref` with no target enum)
- `<0.5` — lossy, should warn (e.g., `interval` → `short_text` loses structure)

**Used by:**
- Service layer — calls `mapPostgresType()` and flags `confidence < 1.0` for manual review
- UI explorers — shows `[⚠ 60% confidence]` badge next to mapped fields
- Strict-mode migrations — can reject `confidence < 0.9` outright
- Tests — verify correct confidence for known mappings

**Anti-drift benefit:** Confidence becomes part of the contract, not optional. If someone adds a new Postgres type and forgets to set confidence, the interface enforces it.

---

## 18.7 CI Guardrails: Dependency & Portability Enforcement

### Dependency Restrictions (dependency-cruiser)

Canon is portable (Node/browser/edge) and lightweight (`zod` only).

```json
{
  "dependency-cruiser": {
    "disallow": [
      {
        "comment": "No workspace dependencies (Canon is Layer 1 Foundation)",
        "from": { "path": "^src/" },
        "to": { "reachable": true, "dependencyTypes": ["npm-local"] }
      },
      {
        "comment": "No built-in Node modules (guarantees edge/browser portability)",
        "from": { "path": "^src/" },
        "to": { "matchesModulePattern": "^node:" }
      },
      {
        "comment": "Only zod as runtime dependency",
        "from": { "path": "^src/" },
        "to": { 
          "module": "^(?!zod$).*",
          "dependencyTypes": ["npm"]
        }
      }
    ]
  }
}
```

**Why no Node built-ins?**
- `assetFingerprint()` must NOT import `node:crypto` — keeps implementation pure and portable
- Cryptographic hashing (SHA-256) is **service-layer responsibility** (tools/, delivery layer, NOT Canon)
- Ensures Canon runs in Cloudflare Workers, browser, edge compute, Node equally

**Why no workspace dependencies?**
- Canon is Layer 1 Foundation. It depended on other workspace packages, it would create circular deps or violate the layer model.
- Single purpose: provide metadata model + validation rules that everything else depends on.

---

## 19. Shippable Implementation Plan

The no-drift implementation sequence. Each step is independently shippable and testable.

### Step 1 — Canon Foundations (pure functions + tests)

Create these files exactly as specified in §5:
```

```
src/lite-meta/asset-keys.ts          ← buildAssetKey, parseAssetKey, canonicalizeKey, validateAssetKey
src/lite-meta/asset-fingerprint.ts   ← assetFingerprint (deterministic SHA-256 of canonicalized descriptor fields)
src/lite-meta/alias-resolution.ts    ← slugify, matchAlias, resolveAlias
src/lite-meta/lineage.ts             ← inferEdgeType, topoSortLineage, explainLineageEdge
src/lite-meta/quality-rules.ts       ← QualityRuleType, compileQualityRule, scoreQualityTier, DIMENSION_TO_RULES
src/lite-meta/classification.ts      ← PII_PATTERNS, classifyColumn, classifyColumns
src/lite-meta/glossary.ts            ← GlossaryTerm, TermLink (types only)
src/lite-meta/index.ts               ← barrel
src/mappings/postgres-types.ts       ← POSTGRES_TO_CANON, mapPostgresType, mapPostgresColumn
src/mappings/type-compat.ts          ← TYPE_COMPAT_MATRIX, getCompatLevel, isCompatible, requiresTransform
src/mappings/csv-types.ts            ← inferCsvColumnType
src/mappings/index.ts                ← barrel
src/schemas/json-value.ts             ← shared jsonValueSchema (deduplicated from audit.ts + mutation.ts)
src/schemas/lite-meta.ts             ← assetKeySchema, qualityRuleSchema, qualityDimensionSchema (Zod v4 idioms)
```

**Required tests (Vitest, minimum):**

| Test File | What It Covers |
|-----------|----------------|
| `asset-keys.test.ts` | K1 round-trip, K2 idempotence, K3 (segment count per prefix), K4 (character validation), K5 (delimiter enforcement), invalid key rejection |
| `asset-fingerprint.test.ts` | Deterministic hash: same descriptor (different insertion order) → same hash. F2 field-order independence. |
| `alias-resolution.test.ts` | A1 determinism, A2 slugify idempotence, trace completeness, fuzzy opt-in |
| `lineage.test.ts` | L1 cycle detection, topoSort ordering, edge inference |
| `quality-rules.test.ts` | Q1 schema validation, Q2 scoring determinism, Q3 SQL only for field targets |
| `classification.test.ts` | C1 pattern matching, null for unknown columns |
| `postgres-types.test.ts` | M1 full coverage, M2 strict mode throws on unknown |
| `type-compat.test.ts` | Symmetry (widening↔narrowing), self-compat is exact |
| `export-surface.test.ts` | Export snapshot — prevents accidental removal of public API symbols |
| `prefix-spec-consistency.test.ts` | Prefix specs in code match documentation (§7.1) and are used consistently |

### Step 2 — Enum Extensions (additive only)

Two files:

- `src/enums/meta-asset-type.ts` — append `'business_object', 'policy', 'metric'`
- `src/enums/meta-edge-type.ts` — append `'posts_to', 'affects'`

No renames. No removals. Zod schemas auto-update via `z.enum(META_ASSET_TYPES)`.

### Step 3 — Barrel Update

Update `src/index.ts` to add new export sections:

```typescript
// ── LiteMetadata ──
export {
  buildAssetKey, parseAssetKey, canonicalizeKey, validateAssetKey,
  assetFingerprint,
  slugify, matchAlias, resolveAlias,
  inferEdgeType, topoSortLineage, explainLineageEdge,
  compileQualityRule, scoreQualityTier, DIMENSION_TO_RULES,
  classifyColumn, classifyColumns, PII_PATTERNS,
} from './lite-meta/index.js';

// ── LiteMetadata Types ──
export type {
  AssetKeyPrefix, ParsedAssetKey, AssetDescriptor,
  LineageEdge, QualityRule, QualityPlan, QualityCheckResult,
  QualityRuleType, QualityDimension,
  AliasCandidate, AliasMatch, ResolutionRule, ResolutionContext, ResolutionResult,
  GlossaryTerm, TermLink, PIIPattern,
} from './lite-meta/index.js';

// ── Source Type Mappings ──
export {
  POSTGRES_TO_CANON, mapPostgresType, mapPostgresColumn,
  inferCsvColumnType,
  TYPE_COMPAT_MATRIX, getCompatLevel, isCompatible, requiresTransform,
} from './mappings/index.js';

// ── LiteMetadata Schemas ──
export {
  assetKeySchema, qualityRuleTypeSchema, qualityRuleSchema, qualityDimensionSchema,
} from './schemas/lite-meta.js';
```

All existing exports remain untouched. Zero breaking changes.

### Step 4 — Service-Layer Gate (enforce without DB migration)

In the runtime service that writes `meta_assets` / `meta_aliases` / `meta_quality_checks`:

1. Call `canonicalizeKey()` **then** `validateAssetKey()` before inserting into `meta_assets`
2. **Store only the canonicalized value** — never the raw input. This prevents `db.bo.Finance.Invoice` vs `db.bo.finance.invoice` drift.
3. Call `qualityRuleSchema.parse()` before inserting into `meta_quality_checks`
4. Call `mapPostgresType(pgType, meta, { mode: 'strict' })` in migration pipelines
5. Call `parseAssetKey(key)` with strict mode — throws on malformed keys, never returns partial results
6. Call `resolveAlias(matches, rules, ctx, { minConfidence: 0.8 })` in migration — returns `null` + trace below threshold

This provides DB-level safety without altering the database schema.

---

## 20. CI Guardrails

### Required CI Jobs

```yaml
# In turbo.json or CI pipeline
canon:typecheck:   tsc --noEmit -p packages/canon/tsconfig.json
canon:test:        vitest run --project canon
canon:lint:        eslint packages/canon/src/
canon:depcruise:   depcruise packages/canon/src --config .dependency-cruiser.cjs
```

### Dependency Guard (script)

Add a CI check that fails if Canon gains any workspace dependency:

```bash
# scripts/check-canon-deps.sh
DEPS=$(jq -r '.dependencies // {} | keys[] | select(startswith("afenda-"))' packages/canon/package.json)
if [ -n "$DEPS" ]; then
  echo "ERROR: Canon must not depend on workspace packages. Found: $DEPS"
  exit 1
fi
```

**Rule:** No new Canon runtime dependencies beyond `zod`. CI fails if anyone adds workspace imports or new runtime deps.

### Dependency Guard (dependency-cruiser)

In addition to the script above, `dependency-cruiser` provides **graph-level** enforcement:

**Config:** `.dependency-cruiser.cjs` (workspace root)

| Rule | Severity | What It Catches |
|------|----------|----------------|
| `canon-no-workspace-imports` | error | Canon importing any `packages/`, `business-domain/`, `apps/`, `tools/` |
| `canon-only-zod-runtime` | error | Canon importing any npm package beyond `zod` |
| `no-layer2-into-layer1` | error | Any Layer 1 package importing from Layer 2 or Layer 3 |
| `no-canon-circular` | error | Circular imports within Canon source |
| `canon-lite-meta-no-registry-import` | error | `lite-meta/` importing from `registries/` (wrong direction) |
| `canon-mappings-no-registry-import` | error | `mappings/` importing from `registries/` (wrong direction) |
| `canon-enums-no-internal-import` | error | `enums/` importing from higher-level modules |

**Internal module dependency direction (enforced):**

```
enums/ ← types/ ← schemas/
  ↑        ↑         ↑
lite-meta/ ← mappings/
  ↑
registries/   (registries may import lite-meta, not reverse)
  ↑
validators/
  ↑
index.ts (barrel)
```

**Install:** `pnpm add -Dw dependency-cruiser`
**Run:** `pnpm depcruise packages/canon/src --config .dependency-cruiser.cjs`
**Supplements:** `tools/scripts/validate-deps.ts` (existing layer-boundary + cycle detection at package level)

### Invariant Test Coverage

All invariants listed in §17 must have corresponding test cases. A missing invariant test is a CI failure.

Minimum coverage targets for `src/lite-meta/` and `src/mappings/`:
- Statement coverage: ≥ 90%
- Branch coverage: ≥ 85%

### Recommended Additional Tools (CI/Dev, NOT Canon deps)

| Tool | Purpose | Where It Runs |
|------|---------|---------------|
| `dependency-cruiser` | Graph-level import enforcement | CI + pre-commit |
| `knip` | Detect unused exports/files in Canon | CI (weekly) |
| `madge` | Quick circular dependency visualization | Dev |
| `TypeDoc` | Generate Canon API docs from TSDoc | CI → docs site |
| `zod-to-json-schema` | Publish Canon schemas as JSON Schema contracts | Build step |

---

## 21. OSS Alignment Reference

Canon's LiteMetadata is designed standalone, but its concepts are **deliberately aligned** with mature OSS standards so future integrations are painless. None of these tools are Canon dependencies — they inform vocabulary and schema design.

### 21.1 QualityRule Alignment — Great Expectations / Soda Core

Canon's `QualityRuleType` vocabulary maps directly to Great Expectations (GE) expectation names and Soda Core check syntax. This ensures teams familiar with these tools can adopt Canon rules without relearning.

| Canon `QualityRuleType` | GE Expectation | Soda Check | Canon Config Example |
|------------------------|----------------|------------|---------------------|
| `not_null` | `expect_column_values_to_not_be_null` | `missing_count(col) = 0` | `{}` |
| `unique` | `expect_column_values_to_be_unique` | `duplicate_count(col) = 0` | `{}` |
| `range` | `expect_column_values_to_be_between` | `min(col) >= X`, `max(col) <= Y` | `{ min: 0, max: 999999 }` |
| `regex` | `expect_column_values_to_match_regex` | `invalid_count(col) = 0` (with regex) | `{ pattern: "^[A-Z]{2}\\d+$" }` |
| `fk_exists` | `expect_column_values_to_be_in_set` (+ query) | `reference(col, other_table, other_col)` | `{ refTable: "customers", refColumn: "id" }` |
| `enum_set` | `expect_column_values_to_be_in_set` | `valid_count(col) > 0` (with valid values) | `{ allowedValues: ["active", "inactive"] }` |
| `sum_matches_total` | custom (multi-column) | `sum(lines.amount) = header.total` | `{ sumColumn: "line_amount", totalColumn: "header_total" }` |
| `debits_equal_credits` | custom (domain) | `sum(debits) = sum(credits)` | `{ debitColumn: "debit", creditColumn: "credit" }` |

#### QualityDimension → GE Suite Mapping

| Canon `QualityDimension` | Typical GE Suite Name | Composed of Canon Rules |
|--------------------------|----------------------|------------------------|
| `completeness` | "Completeness Suite" | `not_null` |
| `accuracy` | "Accuracy Suite" | `range`, `regex`, `enum_set` |
| `consistency` | "Consistency Suite" | `fk_exists`, `sum_matches_total` |
| `validity` | "Validity Suite" | `regex`, `enum_set`, `range` |
| `uniqueness` | "Uniqueness Suite" | `unique` |

#### QualityCheckResult → GE/Soda Result Mapping

```typescript
// Canon QualityCheckResult maps to:
// GE:   ExpectationValidationResult { success, result: { observed_value, element_count, ... } }
// Soda: CheckResult { outcome: pass|fail, diagnostics: { value, fail_count, ... } }

export interface QualityCheckResult {
  rule: QualityRule;
  passed: boolean;                    // GE: success, Soda: outcome === 'pass'
  failedCount?: number;               // GE: result.unexpected_count, Soda: diagnostics.fail_count
  totalCount?: number;                // GE: result.element_count, Soda: diagnostics.row_count
  checkedAt: string;                  // ISO 8601
}
```

**Integration path (v2+):** A `tools/quality-runner` can execute Canon-compiled `QualityPlan` SQL templates, then format results as either Canon `QualityCheckResult` or GE `ExpectationValidationResult` for teams that use GE dashboards.

### 21.2 Lineage Alignment — OpenLineage Standard

Canon's lineage model aligns with [OpenLineage](https://openlineage.io) concepts. This ensures a future bridge to Marquez, Airflow, dbt, or any OpenLineage-compatible system.

#### Concept Mapping

| OpenLineage Concept | Canon Equivalent | Notes |
|--------------------|-----------------|-------|
| **Namespace** | Asset key prefix (`db.rec.afenda.public`) | System + schema identifier |
| **Dataset** | Asset with type `table` or `business_object` | `meta_assets` row |
| **Job** | Asset with type `pipeline` | Process asset |
| **Run** | Not in v1 (design-time only) | v2: instance lineage will add Run concept |
| **RunEvent** | Not in v1 | v2: mutation receipt + audit log = run event |
| **InputDataset** | `fromAssetKey` in `LineageEdge` | Source side of edge |
| **OutputDataset** | `toAssetKey` in `LineageEdge` | Target side of edge |
| **DatasetFacet** | Asset descriptor fields (classification, tier, tags) | Metadata facets |
| **SchemaDatasetFacet** | Field-level assets (`db.field.*`) | Column-level lineage |

#### Edge Type Mapping

| Canon `MetaEdgeType` | OpenLineage Equivalent | Direction |
|---------------------|----------------------|----------|
| `ingests` | InputDataset → OutputDataset (ETL job) | source → target |
| `transforms` | Job with InputDataset → OutputDataset | pipeline → output |
| `serves` | OutputDataset consumed by downstream | dataset → consumer |
| `derives` | ColumnLineageDatasetFacet | field → derived field |
| `posts_to` | *No OL equivalent* (ERP-specific) | document → ledger |
| `affects` | *No OL equivalent* (ERP-specific) | transaction → impact |

#### Future OpenLineage Bridge (v2)

```typescript
// tools/lineage-bridge/openlineage-emitter.ts (NOT in Canon)
import type { LineageEdge, ParsedAssetKey } from 'afenda-canon';

export interface OpenLineageEvent {
  eventType: 'START' | 'RUNNING' | 'COMPLETE' | 'FAIL';
  eventTime: string;
  producer: string;
  job: { namespace: string; name: string };
  inputs: Array<{ namespace: string; name: string; facets?: Record<string, unknown> }>;
  outputs: Array<{ namespace: string; name: string; facets?: Record<string, unknown> }>;
  run: { runId: string; facets?: Record<string, unknown> };
}

export function canonEdgeToOpenLineage(
  edge: LineageEdge,
  runId: string
): OpenLineageEvent;
  // Maps Canon lineage edge to OpenLineage run event.
  // Lives in tools/, not Canon. Canon stays pure.
```

### 21.3 Metadata Catalog Patterns — OpenMetadata / DataHub

Canon borrows **structural patterns** from these catalogs without importing their code:

| Pattern | Source | How Canon Uses It |
|---------|--------|------------------|
| Asset-as-entity with typed keys | OpenMetadata | `AssetDescriptor` + `buildAssetKey()` |
| Glossary → asset linking | OpenMetadata | `GlossaryTerm` + `TermLink` |
| Quality tiers (Gold/Silver/Bronze) | OpenMetadata | `MetaQualityTier` + `scoreQualityTier()` |
| Aspects-as-metadata-facets | DataHub | Asset descriptor fields map to facets |
| Schema versioning events | DataHub | v2: schema evolution tracking via fingerprint diffs |
| Minimal catalog UI | Amundsen | Keeps LiteMetadata "Lite" — no overbuild |

### 21.4 Policy Evaluation — OPA / Casbin Reference

Canon owns the **policy model** (types, metadata, capability keys). Runtime policy evaluation lives outside Canon:

```
┌─────────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Canon (Layer 1)    │     │  Service Layer   │     │  Policy Engine   │
│                     │     │  (Layer 2/3)     │     │  (external)      │
│  PolicyDecision     │────▶│  Reads policy    │────▶│  OPA / Casbin    │
│  CapabilityKey      │     │  metadata from   │     │  evaluates       │
│  FieldRules         │     │  meta_assets     │     │  runtime access  │
│  classification     │     │  (DB Layer 1)    │     │  decisions       │
└─────────────────────┘     └──────────────────┘     └──────────────────┘
```

| Concept | Canon Owns | Runtime Evaluator |
|---------|-----------|-------------------|
| Capability keys | `CapabilityKey` type + `CAPABILITY_CATALOG` | OPA rego policy / Casbin model |
| Field-level access | `FieldRules` type | OPA field-level rego |
| Classification gates | `MetaClassification` enum | Casbin ABAC matcher |
| Lifecycle transitions | `EntityContract` transitions | Service layer + OPA |

**Integration path:** Store `policy` assets in `meta_assets`. Export capability definitions as OPA `data.capabilities` or Casbin policy CSV. Canon compiles the model; external engines evaluate at runtime.

### 21.5 Documentation & Schema Generation

**Note:** `zod-to-json-schema` npm package is **not recommended** — use Zod v4's built-in `z.toJSONSchema()` instead.

| Tool | What It Generates | How To Run |
| **TypeDoc** | HTML API docs from Canon TSDoc comments | `typedoc --entryPoints packages/canon/src/index.ts --out docs/canon-api` |
| **Zod v4 `z.toJSONSchema()`** | JSON Schema from Canon Zod schemas | Build step: `z.toJSONSchema(schema, { target: 'draft-2020-12' })` |
| **ts-json-schema-generator** | JSON Schema from Canon TS interfaces (optional) | Use only for non-Zod interfaces; prefer `z.toJSONSchema()` for Zod schemas |

Published artifacts:
- `dist/schemas/*.json` — JSON Schema for each Canon Zod schema (for non-TS consumers)
- `docs/canon-api/` — Browsable API documentation

---

## 22. ERP UI Surfaces

Canon is a **pure-function library** — it never renders UI. However, any ERP front-end that consumes Canon metadata should expose these five UI surfaces. This section defines **what data each surface needs** and which Canon functions supply it.

### 22.1 Business Object Explorer

**Purpose:** Drill from Business Object → Records → Fields with full metadata context.

```
┌─────────────────────────────────────────────┐
│ Business Objects  (asset_type = 'business_object')    │
│  ● Invoice    ● Customer    ● PurchaseOrder │
│                                             │
│  ▼ Invoice                                  │
│    Records: AR_INVOICES, AP_INVOICES        │
│    ▼ AR_INVOICES                            │
│      Fields:  invoice_id (int8, PII:no)     │
│               customer_ref (text, PII:yes)  │
│               total_amount (numeric)        │
│      Quality: Gold ★★★                     │
│      Lineage: ← sales.orders (derives)     │
└─────────────────────────────────────────────┘
```

**Canon functions consumed:**

| Step | Canon Function | Returns |
|------|---------------|---------|
| List BOs | `parseAssetKey()` filter on `assetType === 'business_object'` | BO asset keys |
| BO → Records | Lineage query: edges where `source = bo_key` and `type = 'derives'` | Record keys |
| Record → Fields | `parseAssetKey()` filter on `assetType === 'column'` where parent = record | Field descriptors |
| Field classification | `classifyColumn(fieldName, sampleValues)` | PII/financial/internal/public |
| Quality tier | `scoreQualityTier(checkResults)` | Gold/Silver/Bronze |
| Lineage context | `topoSortLineage(edges)` + `explainLineageEdge(edge)` | Upstream/downstream with explanation |

### 22.2 Policy & Capability Inspector

**Purpose:** From any asset, show linked policies → required capabilities → role context.

```
┌─────────────────────────────────────────────┐
│ Asset: db.bo.finance.invoice                │
│                                             │
│  Linked Policies (asset_type = 'policy'):   │
│    ● SOX-302 Sign-off                       │
│    ● Data Retention 7yr                     │
│                                             │
│  ▼ SOX-302 Sign-off                        │
│    Required Capabilities:                   │
│      ● finance:journal:approve (Role: CFO)  │
│      ● finance:invoice:void   (Role: AP-Mgr)│
│    Classification: financial                │
│    Quality Tier: Gold (mandatory)           │
└─────────────────────────────────────────────┘
```

**Canon data flow:**

| What | Source |
|------|--------|
| Asset → policies | Lineage edges where `type = 'affects'` and target `assetType = 'policy'` |
| Policy → capabilities | `CAPABILITY_CATALOG` entries linked via `CapabilityKey` |
| Capability → roles | `CapabilityKey` parsed → module + resource + action; role mapping from service layer |
| Classification | `AssetDescriptor.classification` field |
| Quality mandate | Policy metadata declares min tier |

### 22.3 Alias Resolution Debugger

**Purpose:** Input a term → see the winning alias + full resolution trace + scoring breakdown. Allow pinning.

```
┌─────────────────────────────────────────────┐
│ Input: "Kundenrechnung"                     │
│                                             │
│ Resolution Trace:                           │
│   1. Exact:  no match                       │
│   2. Slug:   "kundenrechnung" → no match    │
│   3. Synonym: "Kundenrechnung" →            │
│       → db.bo.finance.invoice               │
│       Score: 0.92  Scope: locale:de-CH      │
│       Rule: synonym-match (priority: 2)     │
│   4. Fuzzy:  skipped (not enabled)          │
│                                             │
│ Winner: db.bo.finance.invoice (score: 0.92) │
│ [ Pin this alias ]  [ Show all candidates ] │
└─────────────────────────────────────────────┘
```

**Canon functions consumed:**

| Step | Function | Returns |
|------|---------|---------|
| Resolve | `resolveAlias(matches, rules, ctx, { minConfidence: 0.8 })` | Winner + trace array |
| Trace display | `AliasTrace` (from trace array) | Step-by-step resolution path |
| Slugify input | `slugify(input)` | Normalized form |
| Pin action | Service layer writes to `meta_aliases` with `pinned: true` | N/A (outside Canon) |

### 22.4 Quality Board

**Purpose:** Dashboard showing Gold/Silver/Bronze tiers per asset with drill-down to failing checks.

```
┌─────────────────────────────────────────────┐
│ Quality Board                               │
│                                             │
│ ★★★ Gold (12 assets)                       │
│   db.rec.finance.ar_invoices                │
│   db.rec.hr.employees                       │
│                                             │
│ ★★☆ Silver (8 assets)                      │
│   db.rec.sales.orders  ⚠ 2 failing checks  │
│     ▼ Failing:                              │
│       not_null on customer_id (ERROR)       │
│       range on total_amount (WARNING)       │
│                                             │
│ ★☆☆ Bronze (3 assets)                      │
│   db.rec.legacy.imports  ⚠ 5 failing       │
└─────────────────────────────────────────────┘
```

**Canon functions consumed:**

| Step | Function | Purpose |
|------|---------|---------|
| Score assets | `scoreQualityTier(results)` | Assigns Gold/Silver/Bronze per asset |
| List checks per asset | `compileQualityRule(rule)` | Returns executable check + metadata |
| Dimension breakdown | `DIMENSION_TO_RULES` mapping | Groups checks by completeness/validity/etc. |
| Rule validation | `qualityRuleSchema.parse(rule)` | Rejects invalid rule definitions |

### 22.5 Posting / Impact Map

**Purpose:** Visualize `posts_to` and `affects` edge types — ERP-specific lineage showing which documents post to which ledgers and what they impact.

```
┌───────────────────────────────────────────────────┐
│ Posting Map: Invoice                              │
│                                                   │
│  ┌──────────┐  posts_to   ┌──────────┐           │
│  │ Invoice  │────────────▶│ AR Ledger│           │
│  │ (BO)     │             │ (Record) │           │
│  └──────────┘             └──────────┘           │
│       │                        │                  │
│       │ affects                │ affects          │
│       ▼                        ▼                  │
│  ┌──────────┐             ┌──────────┐           │
│  │ Revenue  │             │ Cash     │           │
│  │ (GL)     │             │ (GL)     │           │
│  └──────────┘             └──────────┘           │
│                                                   │
│ Impact Analysis:                                  │
│   Voiding this invoice affects:                   │
│     • AR balance (direct)                         │
│     • Revenue recognition (derived)               │
│     • Cash forecast (2nd-order)                   │
└───────────────────────────────────────────────────┘
```

**Canon functions consumed:**

| Step | Function | Purpose |
|------|---------|---------|
| Get posting edges | `inferEdgeType()` with `posts_to` filter | Direct document → ledger links |
| Get impact edges | `inferEdgeType()` with `affects` filter | Transaction → impact links |
| Topological order | `topoSortLineage(edges)` | Ordered impact chain |
| Edge explanation | `explainLineageEdge(edge)` | Human-readable edge description |
| Cycle detection | `topoSortLineage()` returns cycles | Highlights circular impacts |

### 22.6 UI Surface Rules

1. **Canon never imports a UI framework.** These surfaces are specifications, not components.
2. **All data flows through Canon pure functions.** UI reads from service layer; service layer calls Canon for validation/resolution/scoring.
3. **Every surface must show provenance.** Quality tier → show which checks pass/fail. Alias → show resolution trace. Lineage → show edge type + explanation.
4. **Pinning / write-back always goes through the canonicalize-first gate** (D15).
5. **New surfaces must be proposed as an amendment** to this section before implementation.

---

## Appendix: Comparison with OpenMetadata

| Dimension | OpenMetadata | Canon LiteMetadata | Winner |
|-----------|-------------|-------------------|--------|
| BusinessObject as first-class | No (tables only) | Yes (`business_object` asset type) | **Canon** |
| Policy as first-class | No (tags only) | Yes (`policy` asset type, tied to capabilities) | **Canon** |
| Multi-tenant / RLS | No (single-tenant) | Yes (every table org-scoped with RLS) | **Canon** |
| Deployment | Java + Elasticsearch + Airflow | Embedded Node.js — zero infrastructure | **Canon** |
| Compile-time type safety | No (REST API) | Yes (TypeScript + Zod) | **Canon** |
| Deterministic alias resolution with trace | No | Yes (scored + traceable + auditable) | **Canon** |
| Posting lineage (ERP) | No | `posts_to` + `affects` edge types | **Canon** |
| Audit/evidence-ready | Partial | Yes (fingerprints, receipts, evidence IDs) | **Canon** |
| Connector ecosystem | 80+ data sources | Postgres + CSV (v1), extensible | **OpenMetadata** |
| Visual lineage explorer | Yes (rich UI) | No (API only in v1) | **OpenMetadata** |
| Community/ecosystem | Large OSS community | Internal | **OpenMetadata** |
| Query-level lineage | Yes | No (design-time only in v1) | **OpenMetadata** |

**Conclusion:** Canon LiteMetadata is **better for ERP** in governance, multi-tenancy, and business semantics. OpenMetadata is better for broad data platform discovery. They serve different purposes.
