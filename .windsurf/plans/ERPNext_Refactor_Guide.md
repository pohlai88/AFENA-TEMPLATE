# ERPNext Refactor — Implementation Guide

**Last Updated:** 2026-02-16  
**Status:** Setup Domain 27/27 ✅ | Projects Domain 13/14 ✅ | See domain strategy docs for details

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Implementation Status](#implementation-status)
4. [File Locations](#file-locations)
5. [Adoption Workflow](#adoption-workflow)
6. [Commands Reference](#commands-reference)
7. [Adopted Entities](#adopted-entities)
8. [Next Steps](#next-steps)

---

## 🚀 Quick Start

### Adapter Build (Recommended — Full Pipeline)

Run all output adapters in the correct order for Setup and Projects consistency:

```bash
pnpm adapter:build
```

Or equivalently:

```bash
pnpm afena meta emit-all
```

**Execution order:** db:barrel → handler-emit → bff-emit → registry-emit → form-config-emit → schema-validate

**Options:**
- `--skip-barrel` — Skip db:barrel when schema unchanged
- `--skip-schema-validate` — Skip schema-validate for faster iteration
- `--entity <name>` — Run handler/bff for specific entity only
- `--dry-run` — Preview without writing files

### Individual Adapter Commands

```bash
pnpm afena meta handler-emit    # CRUD handlers
pnpm afena meta bff-emit        # Server actions
pnpm afena meta registry-emit   # ENTITY_TYPES, HANDLER_REGISTRY, nav
pnpm afena meta schema-validate # Drift reports
```

---

## 🏗️ Architecture Overview

### Design Principles

1. **Headless IR** — Pipeline produces canonical IR (Intermediate Representation)
2. **Output Adapters** — Schema/Handler/Registry/BFF/API as strategies (GoF pattern)
3. **Domain Layout** — Virtual first (domain field in spec); emit into domain subdirs
4. **Lock Model** — Protect spine entities; allow UI mining on locked tables

### Adoption Levels

| Level        | Behavior                                       | Use Case                          |
| ------------ | ---------------------------------------------- | --------------------------------- |
| `reference`  | Spec only; no codegen                          | Metadata coverage without runtime |
| `ui-mine`    | Form/columns config only                       | Locked tables (spine entities)    |
| `adopt`      | Full runtime: handler + registry + UI + schema | New entities ready for production |
| `adopt-lite` | Runtime without DB changes                     | Existing tables, new handlers     |

### Architecture Flow

```
LocalEntitySpec (JSON)
    ↓
Canonical IR
    ↓
┌─────────────┬──────────────┬─────────────┬──────────────┬─────────────┐
│ Schema      │ Handler      │ BFF         │ Registry     │ API         │
│ Adapter     │ Adapter      │ Adapter     │ Adapter      │ Adapter     │
└─────────────┴──────────────┴─────────────┴──────────────┴─────────────┘
    ↓              ↓              ↓              ↓              ↓
Drizzle      Entity        Server      ENTITY_TYPES    Generic
Schema       Handlers      Actions                     Routes
```

---

## ✅ Implementation Status

### Completed Components

| Component             | Status      | Location                                               |
| --------------------- | ----------- | ------------------------------------------------------ |
| **HandlerAdapter**    | ✅ Complete | `tools/afena-cli/src/meta/adapter/handler-emit.ts`     |
| **BFFAdapter**        | ✅ Complete | `tools/afena-cli/src/meta/adapter/bff-emit.ts`         |
| **RegistryAdapter**   | ✅ Complete | `tools/afena-cli/src/meta/adapter/registry-emit.ts`    |
| **SchemaAdapter**     | ✅ Complete | `tools/afena-cli/src/meta/adapter/schema-validate.ts`  |
| **FormConfigAdapter** | ✅ Complete | `tools/afena-cli/src/meta/adapter/form-config-emit.ts` |
| **APIAdapter**        | ✅ Complete | Generic routes at `/api/entities/[entityType]`         |

### Metrics

| Metric                   | Count                   | Status       |
| ------------------------ | ----------------------- | ------------ |
| Total specs              | 511                     | ✅ Complete  |
| Adopted entities         | 9                       | ✅ Complete  |
| Generated handlers       | 9                       | ✅ Complete  |
| Generated BFF actions    | 8                       | ✅ Complete  |
| Database tables          | 8 new + 128 existing    | ✅ Complete  |
| Manual handlers (locked) | 2 (contacts, companies) | ✅ Protected |

---

## 📁 File Locations

### Specs & Configuration

```
packages/canon/src/
├── specs/
│   ├── entities/                    # SSOT specs (adoptable entities)
│   │   ├── video-settings.spec.json
│   │   ├── support-settings.spec.json
│   │   ├── service-level-agreements.spec.json
│   │   ├── issue-types.spec.json
│   │   ├── crm-settings.spec.json
│   │   └── account-categories.spec.json
│   └── reference/
│       └── erpnext/                 # UI-mined specs (locked entities)
│
└── adapters/erpnext/
    ├── adoption/
    │   └── adopted.entities.json    # ✅ Human gate SSOT
    └── locks/
        ├── locks.db+ui.json         # ✅ Fully locked (contacts, companies)
        ├── locks.db.json            # ✅ 62 spine entities
        ├── adoptable.allowlist.json # ✅ Collision permission
        └── adoptable.denylist.json  # ✅ Empty
```

### Generated Code

```
packages/crud/src/
├── handlers/
│   ├── contacts.ts                  # Manual (locked)
│   ├── companies.ts                 # Manual (locked)
│   ├── video-settings.ts            # Manual (pre-existing)
│   └── generated/
│       ├── setup/
│       │   └── video-settings.ts    # ✅ Generated
│       ├── support/
│       │   ├── support-settings.ts  # ✅ Generated
│       │   ├── service-level-agreements.ts  # ✅ Generated
│       │   └── issue-types.ts       # ✅ Generated
│       ├── crm/
│       │   └── crm-settings.ts      # ✅ Generated
│       └── accounts/
│           └── account-categories.ts # ✅ Generated
└── mutate.ts                        # ✅ Auto-wired registry
```

```
apps/web/app/
├── actions/
│   ├── contacts.ts                  # Manual (locked)
│   ├── companies.ts                 # Manual (locked)
│   ├── video-settings.ts            # Manual (pre-existing)
│   └── generated/
│       ├── support-settings.ts      # ✅ Generated
│       ├── support-settings.capabilities.ts
│       ├── service-level-agreements.ts  # ✅ Generated
│       ├── service-level-agreements.capabilities.ts
│       ├── issue-types.ts           # ✅ Generated
│       ├── issue-types.capabilities.ts
│       ├── crm-settings.ts          # ✅ Generated
│       ├── crm-settings.capabilities.ts
│       ├── account-categories.ts    # ✅ Generated
│       └── account-categories.capabilities.ts
```

```
packages/database/src/schema/
├── contacts.ts                      # Manual (locked)
├── companies.ts                     # Manual (locked)
├── video-settings.ts                # Manual (pre-existing)
├── support-settings.ts              # ✅ Created
├── service-level-agreements.ts      # ✅ Created
├── issue-types.ts                   # ✅ Created
├── crm-settings.ts                  # ✅ Created
├── account-categories.ts            # ✅ Created
└── index.ts                         # ✅ Auto-updated
```

### Adapter Build Orchestrator

**Command:** `pnpm adapter:build` or `pnpm afena meta emit-all`

Runs all output adapters in the correct order to maintain consistency for Setup and Projects domains:

1. **db:barrel** — Schema index + TABLE_REGISTRY (required before handler-emit)
2. **handler-emit** — CRUD handlers
3. **bff-emit** — Server actions
4. **registry-emit** — ENTITY_TYPES, HANDLER_REGISTRY, nav-config
5. **form-config-emit** — Form + columns config
6. **schema-validate** — Drift reports (validation gate)

**When to run:** After adding entities to `adopted.entities.json`, schema changes, or to refresh all generated code.

### CLI Tools

```
tools/afena-cli/src/capability/adapter/
├── templates/
│   ├── handler.template.ts          # ✅ Handler code generation template
│   └── bff.template.ts              # ✅ BFF action generation template
├── emit-all.ts                      # ✅ Adapter build orchestrator
├── handler-emit.ts                  # ✅ HandlerAdapter implementation
├── bff-emit.ts                      # ✅ BFFAdapter implementation
├── registry-emit.ts                 # ✅ RegistryAdapter implementation
├── schema-validate.ts               # ✅ SchemaAdapter implementation
├── form-config-emit.ts              # ✅ FormConfigAdapter implementation
└── utils.ts                         # ✅ Shared utilities
```

---

## 🔄 Adoption Workflow

### Step 1: Identify Candidate Entity

Use the candidates command to find suitable entities:

```bash
pnpm afena:dev meta candidates
```

**Criteria for good candidates:**

- No table collisions
- Simple config or master data (avoid `kind=doc` for first pilots)
- Few fields
- No complex dependencies
- Not in `locks.db.json` or `locks.db+ui.json`

### Step 2: Update Spec with Adoption Level

Edit the spec file: `packages/canon/src/specs/entities/<entity-type>.spec.json`

```json
{
  "entityType": "example-entity",
  "kind": "config",
  "adoptionLevel": "adopt",
  "domain": "setup",
  "table": {
    "name": "example_entity",
    ...
  },
  ...
}
```

### Step 3: Create Database Schema (if new table)

Create schema file: `packages/database/src/schema/<entity-type>.ts`

```typescript
import { desc, sql } from 'drizzle-orm';
import { check, index, pgTable, text } from 'drizzle-orm/pg-core';
import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

export const exampleEntity = pgTable(
  'example_entity',
  {
    ...erpEntityColumns,
    // Add entity-specific fields
  },
  (table) => [
    index('example_entity_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id),
    ),
    check('example_entity_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type ExampleEntity = typeof exampleEntity.$inferSelect;
export type NewExampleEntity = typeof exampleEntity.$inferInsert;
```

Export in `packages/database/src/schema/index.ts`:

```typescript
export * from './example-entity';
```

### Step 4: Generate Migration

```bash
cd packages/database
pnpm drizzle-kit generate
```

### Step 5: Run Migration

```bash
cd packages/database
pnpm db:migrate
```

### Step 6: Add to Adoption Config

Edit: `packages/canon/src/adapters/erpnext/adoption/adopted.entities.json`

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-02-16",
  "entities": {
    "video-settings": "adopt",
    "support-settings": "adopt",
    "example-entity": "adopt"
  }
}
```

### Step 7: Generate Handler

```bash
pnpm afena:dev meta handler-emit --entity example-entity
```

**Output:** `packages/crud/src/handlers/generated/<domain>/<entity-type>.ts`

### Step 8: Generate BFF Actions

```bash
pnpm afena:dev meta bff-emit --entity example-entity
```

**Output:** `apps/web/app/actions/generated/<entity-type>.ts`

### Step 9: Update Registry

```bash
pnpm afena:dev meta registry-emit
```

**Output:** Updates `ENTITY_TYPES` in generated registry files

### Step 10: Validate Build

```bash
pnpm --filter afena-crud run build
pnpm --filter afena-canon run build
```

---

## 📚 Commands Reference

### Meta Pipeline Commands

| Command                 | Description                | Output                     |
| ----------------------- | -------------------------- | -------------------------- |
| `afena meta scan`       | Ingest refactor canon      | `.afena/meta/raw/`         |
| `afena meta transform`  | Transform to canonical IR  | `.afena/meta/ir/`          |
| `afena meta analyze`    | Analyze collisions, locks  | `.afena/meta/analyze.json` |
| `afena meta candidates` | Ranked adoption candidates | Console output             |
| `afena meta validate`   | Contract + drift checks    | Validation report          |

### Adapter Commands

| Command                       | Description             | Output                                         |
| ----------------------------- | ----------------------- | ---------------------------------------------- |
| `afena meta emit-all`         | **Adapter build** — Run all adapters in order. Use for Setup/Projects consistency. | All adapter outputs |
| `afena meta schema-validate`  | Validate schema vs spec | `.afena/meta/reports/schema-drift.<entity>.md` |
| `afena meta handler-emit`     | Generate CRUD handlers  | `packages/crud/src/handlers/generated/`        |
| `afena meta bff-emit`         | Generate server actions | `apps/web/app/actions/generated/`              |
| `afena meta registry-emit`    | Generate registries     | `packages/canon/src/entity.generated.ts`       |
| `afena meta form-config-emit` | Generate form configs   | `apps/web/entity-config/generated/`            |

### Command Options

```bash
# Generate for specific entity
afena meta handler-emit --entity video-settings

# Dry run (preview without writing)
afena meta handler-emit --dry-run

# Validate all specs (not just adopted)
afena meta schema-validate --validate-all
```

---

## 📊 Adopted Entities

### Currently Adopted (12 entities)

| Entity                     | Domain   | Kind   | Status     |
| -------------------------- | -------- | ------ | ---------- |
| `video-settings`           | setup    | config | ✅ Adopted |
| `support-settings`         | support  | config | ✅ Adopted |
| `service-level-agreements` | support  | master | ✅ Adopted |
| `issue-types`              | support  | master | ✅ Adopted |
| `crm-settings`             | crm      | config | ✅ Adopted |
| `account-categories`       | accounts | master | ✅ Adopted |
| `delivery-settings`        | stock    | config | ✅ Adopted |
| `projects-settings`        | projects | config | ✅ Adopted |
| `project-types`            | projects | master | ✅ Adopted |
| `project-templates`        | projects | master | ✅ Adopted |
| `project-template-tasks`   | projects | master | ✅ Adopted |
| `project-users`            | projects | master | ✅ Adopted |
| `project-updates`          | projects | doc    | ✅ Adopted |
| `pos-settings`             | selling  | config | ✅ Adopted |

### Locked Entities (Do Not Adopt)

**Full Lock (db+ui):** 2 entities

- `contacts` — Manual handler, manual BFF
- `companies` — Manual handler, manual BFF

**DB Lock (ui-mine allowed):** 62 spine entities

- `addresses`, `assets`, `boms`, `items`, `sales-orders`, `purchase-orders`, etc.
- See: `packages/canon/src/adapters/erpnext/locks/locks.db.json`

### Ready for Adoption

Top candidates from `pnpm afena:dev meta candidates`:

| Entity                                 | Score | Domain | Kind   | Notes                |
| -------------------------------------- | ----- | ------ | ------ | -------------------- |
| **currency-exchange-settings-details** | 125   | setup  | config | No links, few fields |
| **incoming-call-settings**             | 125   | setup  | config | No links, few fields |
| **item-variant-settings**              | 125   | setup  | config | No links, few fields |
| **plaid-settings**                     | 125   | setup  | config | No links, few fields |
| **subscription-settings**              | 125   | setup  | config | No links, few fields |
| **voice-call-settings**                | 125   | setup  | config | No links, few fields |

---

## 🎯 Next Steps

### Immediate (This Week)

1. **Adopt 3-5 more entities** from ready list
   - `issue-priority`, `issue`, `call-log`
   - Run full adoption workflow for each

2. **Generate UI pages** for adopted entities
   - Create list/detail/edit pages
   - Use existing patterns from contacts/companies

3. **Integration testing**
   - Test CRUD operations for all adopted entities
   - Verify lifecycle methods for doc entities

### Short Term (Next 2 Weeks)

4. **UI Mining** for locked entities
   - Extract field metadata from spine entities
   - Generate form configs for `items`, `sales-orders`, `boms`
   - Output to `specs/reference/erpnext/`

5. **Form Config Adapter enhancement**
   - Auto-generate form configurations
   - Support field dependencies and validations

6. **Documentation**
   - API documentation for adopted entities
   - User guides for new features

### Medium Term (Next Month)

7. **Adopt 10-15 more entities**
   - Focus on config and master data
   - Avoid complex doc entities initially

8. **Performance optimization**
   - Optimize generated handlers
   - Add caching where appropriate

9. **Testing infrastructure**
   - Unit tests for generated handlers
   - Integration tests for full CRUD flow
   - E2E tests for UI pages

---

## 🔒 Invariants & Rules

### INVARIANT-HANDLER-01

Only emit handlers for `adoptionLevel: "adopt"` entities

### INVARIANT-HANDLER-02

Skip entities in `locks.db+ui.json` or `locks.db.json`

### INVARIANT-HANDLER-03

Validate table exists in TABLE_REGISTRY before generating

### INVARIANT-BFF-01

Only emit BFF actions for `adoptionLevel: "adopt"` entities

### INVARIANT-BFF-02

Skip if manual action file exists in `app/actions/`

### INVARIANT-REGISTRY-01

Registry derives from `adopted.entities.json` only, not from spec `adoptionLevel`

### INVARIANT-SCHEMA-01

Schema validation only for `adoptionLevel ∈ {ui-mine, adopt, adopt-lite}` unless `--validate-all`

### INVARIANT-ADOPT-01

Non-adopted entities must not appear in: ENTITY_TYPES, HANDLER_REGISTRY, nav, routes

### INVARIANT-LOCK-01

Entities in lock files cannot be in adopted list (unless `--break-glass`)

---

## 🛠️ Troubleshooting

### Handler Generation Fails

**Error:** "Table not in TABLE_REGISTRY"

**Solution:**

1. Verify table exists in `packages/database/src/schema/`
2. Check table is exported in `packages/database/src/schema/index.ts`
3. Run `pnpm --filter afena-database run build`

### BFF Generation Skips Entity

**Error:** "Manual action file exists"

**Solution:**

- This is expected behavior (INVARIANT-BFF-02)
- Remove manual file if you want auto-generation
- Or keep manual file and skip BFF generation

### Build Errors After Generation

**Error:** Type errors in generated code

**Solution:**

1. Run `pnpm --filter afena-crud run build` to check errors
2. Verify spec has correct field types
3. Regenerate with `--entity <name>` flag

---

## 📖 Additional Resources

### Related Documentation

- [ERPNext Full Refactor Plan](./erpnext_full_refactor_plan_7acd4d62.plan.md) - Detailed architectural plan
- [Implementation Summary](./.windsurf/plans/IMPLEMENTATION_SUMMARY.md) - Phase 1 & 2 completion summary

### Key Concepts

- **Headless IR** - Intermediate representation decoupled from output format
- **Output Adapters** - Strategy pattern for different code generation targets
- **Adoption Levels** - Controlled progression from metadata to runtime
- **Lock Model** - Protection for ratified spine entities

### Design Patterns Used

- **Strategy Pattern** - Each adapter is a strategy
- **Template Method** - Common pipeline steps with adapter customization
- **Adapter Pattern** - Next.js adapter adapts canonical output to App Router

---

**Last Updated:** 2026-02-16  
**Maintained By:** Development Team  
**Status:** Living Document - Updated as implementation progresses. Adapter build orchestrator (`pnpm adapter:build`) added for Setup/Projects consistency.
