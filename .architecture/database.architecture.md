# Afena Database Layer — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-13T07:32:16Z. Do not edit — regenerate instead.
> **Package:** `afena-database` (`packages/database`)
> **Purpose:** Drizzle ORM schema definitions, dual RW/RO compute, migration management, and schema governance.

---

## 1. Architecture Overview

Neon Postgres with Drizzle ORM. Two connection singletons: `db` (RW) and `dbRo` (RO read replica).
All domain tables use `baseEntityColumns` or `erpEntityColumns` helpers. Custom fields are
JSONB + typed index (no DDL migrations for user-defined fields).

Schema governance: 8-rule lint, entity generator script, LiteMetadata registry.

---

## 2. Key Design Decisions

- **Dual compute**: `DATABASE_URL` (RW) + `DATABASE_URL_RO` (RO, optional fallback)
- **Write safety**: 3 layers — export naming (`dbRo`), ESLint rules (INVARIANT-RO), DB role
- **RLS**: Every domain table has `org_id` + `enableRLS` + `tenantPolicy`
- **Column helpers**: `baseEntityColumns` (all entities), `erpEntityColumns` (ERP axis keys), `docEntityColumns` (document lifecycle)
- **Custom fields**: `custom_fields` meta → `custom_data` JSONB + `custom_field_values` typed index
- **Triggers**: `set_updated_at` in public schema, `search_vector` tsvector triggers per entity

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 59 |
| **Test files** | 2 |
| **Source directories** | helpers, schema, scripts |

```
packages/database/src/
├── helpers/
├── schema/
├── scripts/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `db` | `./db` |
| `dbRo` | `./db` |
| `getDb` | `./db` |
| `tenantPolicy` | `./helpers/tenant-policy` |
| `ownerPolicy` | `./helpers/tenant-policy` |
| `baseEntityColumns` | `./helpers/base-entity` |
| `erpEntityColumns` | `./helpers/erp-entity` |
| `docEntityColumns` | `./helpers/doc-entity` |
| `erpIndexes` | `./helpers/standard-indexes` |
| `docIndexes` | `./helpers/standard-indexes` |
| `moneyMinor` | `./helpers/field-types` |
| `currencyCode` | `./helpers/field-types` |
| `fxRate` | `./helpers/field-types` |
| `baseAmountMinor` | `./helpers/field-types` |
| `moneyDocumentColumns` | `./helpers/field-types` |
| `qty` | `./helpers/field-types` |
| `uomRef` | `./helpers/field-types` |
| `statusColumn` | `./helpers/field-types` |
| `emailColumn` | `./helpers/field-types` |
| `phoneColumn` | `./helpers/field-types` |
| `addressJsonb` | `./helpers/field-types` |
| `tagsArray` | `./helpers/field-types` |
| `docNumber` | `./helpers/field-types` |
| `companyRef` | `./helpers/field-types` |
| `siteRef` | `./helpers/field-types` |
| `contactRef` | `./helpers/field-types` |
| `eq` | `drizzle-orm` |
| `and` | `drizzle-orm` |
| `or` | `drizzle-orm` |
| `sql` | `drizzle-orm` |
| `desc` | `drizzle-orm` |
| `asc` | `drizzle-orm` |
| `like` | `drizzle-orm` |
| `ilike` | `drizzle-orm` |
| `inArray` | `drizzle-orm` |
| `notInArray` | `drizzle-orm` |
| `isNull` | `drizzle-orm` |
| `isNotNull` | `drizzle-orm` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `DbInstance` | `./db` |

---

## 5. Dependencies

### Internal (workspace)

- `afena-eslint-config`
- `afena-typescript-config`

### External

| Package | Version |
| ------- | ------- |
| `@neondatabase/serverless` | `^1.0.0` |
| `drizzle-orm` | `^0.44.0` |

---

## 6. Database Tables

- `advisories`
- `advisory_evidence`
- `api_keys`
- `audit_logs`
- `communications`
- `companies`
- `contacts`
- `currencies`
- `custom_field_sync_queue`
- `custom_field_values`
- `custom_fields`
- `entity_attachments`
- `entity_versions`
- `entity_view_fields`
- `entity_views`
- `meta_alias_resolution_rules`
- `meta_alias_sets`
- `meta_aliases`
- `meta_assets`
- `meta_lineage_edges`
- `meta_quality_checks`
- `meta_semantic_terms`
- `meta_term_links`
- `meta_value_aliases`
- `migration_checkpoints`
- `migration_conflict_resolutions`
- `migration_conflicts`
- `migration_jobs`
- `migration_lineage`
- `migration_merge_explanations`
- `migration_quarantine`
- `migration_reports`
- `migration_row_snapshots`
- `mutation_batches`
- `number_sequences`
- `org_usage_daily`
- `r2_files`
- `role_permissions`
- `roles`
- `sites`
- `uom`
- `uom_conversions`
- `user_roles`
- `user_scopes`
- `users`
- `workflow_executions`
- `workflow_rules`

---

## 7. Invariants

- `ACC-05`
- `INVARIANT-P01`
- `INVARIANT-P02`
- `INVARIANT-P03`
- `K-08`
- `K-11`
- `K-14`
- `OPS-01`
- `OPS-02`

---

## Design Patterns Detected

- **Observer**
- **Registry**

---

## Cross-References

- [`db.schema.governance.md`](./db.schema.governance.md)
- [`multitenancy.architecture.md`](./multitenancy.architecture.md)
