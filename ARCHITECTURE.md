# AFENDA-NEXUS Architecture

**A Layered ERP System with Strict Dependency Rules**

---

## Table of Contents

- [Architecture Principles](#architecture-principles)
- [4-Layer Architecture](#4-layer-architecture)
- [Layer 0: Configuration](#layer-0-configuration)
- [Layer 1: Foundation](#layer-1-foundation)
- [Layer 2: Domain Services](#layer-2-domain-services)
- [Layer 3: Application](#layer-3-application)
- [Dependency Rules](#dependency-rules)
- [Package Standards](#package-standards)

---

## Architecture Principles

### 1. Strict Layered Architecture

**Bottom-up dependency flow only.** Lower layers have zero knowledge of upper layers.

### 2. Single Responsibility

Each package owns one coherent domain. Large packages are split into focused sub-domains.

### 3. Explicit Dependencies

All dependencies declared in `package.json`. No implicit coupling through file system access.

### 4. Zero Circular Dependencies

The dependency graph is a DAG (Directed Acyclic Graph). Circular dependencies are architectural violations.

### 5. Public API Boundary

Packages only access others through `src/index.ts` exports. Internal modules are private.

---

## 4-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Application Orchestration                         │
│  ┌─────────┐  ┌──────────────┐                              │
│  │  crud   │  │ observability│  Orchestrates business flows │
│  └─────────┘  └──────────────┘  Enforces policies           │
└─────────────────────────────────────────────────────────────┘
                           ↑ depends on
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Domain Services                                    │
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐         │
│  │ workflow │ │ accounting│ │   crm   │ │ search   │  ...    │
│  └──────────┘ └──────────┘ └─────────┘ └──────────┘         │
│  Business logic, domain rules, calculations                 │
└─────────────────────────────────────────────────────────────┘
                           ↑ depends on
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Foundation                                        │
│  ┌────────┐  ┌──────────┐  ┌────────┐  ┌────┐             │
│  │ canon  │  │ database │  │ logger │  │ ui │             │
│  └────────┘  └──────────┘  └────────┘  └────┘             │
│  Types, schemas, data access, observability                │
└─────────────────────────────────────────────────────────────┘
                           ↑ depends on
┌─────────────────────────────────────────────────────────────┐
│  Layer 0: Configuration                                     │
│  ┌──────────────┐  ┌──────────────────┐                    │
│  │ eslint-config│  │ typescript-config│                    │
│  └──────────────┘  └──────────────────┘                    │
│  Shared tooling configuration                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 0: Configuration

**Purpose:** Shared tooling and build configuration  
**Dependencies:** None (foundation of the monorepo)  
**Location:** `packages/eslint-config`, `packages/typescript-config`

### Packages

| Package             | Purpose                                                    |
| ------------------- | ---------------------------------------------------------- |
| `eslint-config`     | ESLint rules for TypeScript, React, Next.js                |
| `typescript-config` | TypeScript compiler configurations (strict, base, library) |

**Rules:**

- ❌ Cannot depend on any workspace packages
- ✅ Only external npm dependencies allowed (ESLint plugins, etc.)

---

## Layer 1: Foundation

**Purpose:** Core primitives, types, schemas, and data access  
**Dependencies:** Layer 0 only  
**Location:** `packages/canon`, `packages/database`, `packages/logger`, `packages/ui`

### `canon` - The Metadata Catalog

**Definition:** The system's schema of schemas — a self-describing metadata registry that defines every entity, action, field type, capability, type mapping, and business asset.

> Canon defines the model and rules; Database stores instances; Tools reconcile.

**Exports:**

- Registries: entity metadata, action verbs/families, capability catalog, entity contracts
- LiteMetadata: asset key grammar, alias resolution, quality rules, lineage helpers, PII classification, glossary types, asset fingerprinting
- Mappings: Postgres → Canon type mapping, CSV type inference, type compatibility matrix
- Validators: field value validation (17 DataTypes), type config validation
- Enums: 23 cross-cutting vocabulary enums with Zod schemas
- Types: ActionType, EntityRef, MutationSpec, Receipt, PolicyDecision, AuditLogEntry, etc.

**Function:**

- Prevents type duplication across packages (ubiquitous language)
- Provides deterministic metadata operations (alias resolution, quality scoring, key parsing)
- Powers migration with type mapping and PII detection
- Enables type-safe, audit-grade metadata governance

**Features:**

- Zero workspace dependencies — only `zod` for schema validation
- Pure functions only — no database reads, no side effects
- Business-first asset model (BusinessObject + Policy as first-class concepts)
- Two-layer quality model: business dimensions compile into executable rules

**Example:**

```typescript
// Metadata operations (pure functions)
import { buildAssetKey, classifyColumn, mapPostgresType } from 'afenda-canon';
import { matchAlias, resolveAlias, slugify } from 'afenda-canon';
import { compileQualityRule, scoreQualityTier } from 'afenda-canon';
import type { ActionType, EntityRef, CapabilityKey } from 'afenda-canon';

// Entity data types come from DATABASE, not Canon
import type { Contact, Invoice } from 'afenda-database';
```

**Critical Rule:** ❌ Canon NEVER imports from business domains (Layer 2) or applications (Layer 3).

> Full architecture: see `packages/canon/canon.architecture.md`

---

### `database` - Data Access Layer

**Definition:** Database schema definitions and ORM configuration using Drizzle.

**Exports:**

- 150+ Drizzle table schemas (invoices, payments, customers, etc.)
- Schema helpers (baseEntity, docEntity, erpEntity)
- Database instances (db, dbRo, getDb)
- Drizzle operators (eq, and, or, sql, etc.)
- Governance rules (tenant policy, company-scope allowlist)

**Function:**

- Provides the data model for the entire system
- Enforces database constraints and indexes
- Enables type-safe database queries

**Features:**

- Migration scripts with Drizzle Kit
- Code generator for new entities
- RLS (Row Level Security) helpers
- Connection pooling with Neon

**Example:**

```typescript
// packages/database/src/schema/invoices.ts
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { baseEntity } from './helpers/base-entity';

export const invoices = pgTable('invoices', {
  ...baseEntity, // id, orgId, createdAt, updatedAt, deletedAt
  docNumber: text('doc_number').notNull(),
  customerId: text('customer_id').notNull(),
  totalMinor: integer('total_minor').notNull(),
  currency: text('currency').notNull().default('USD'),
});

// Usage in domain services
import { invoices } from 'afenda-database';
import { eq } from 'drizzle-orm';

const invoice = await db.select().from(invoices).where(eq(invoices.id, id));
```

**Critical Rule:** ❌ Database contains schemas only. No business logic allowed.

---

### `logger` - Observability

**Definition:** Centralized structured logging using Pino.

**Exports:**

- Configured logger instance
- Log level management
- Performance-optimized JSON logging

**Function:**

- Provides consistent logging across all packages
- Enables log aggregation and monitoring

**Example:**

```typescript
import { logger } from 'afenda-logger';

logger.info({ customerId, amount }, 'Processing payment');
logger.error({ error, context }, 'Payment failed');
```

---

### `ui` - Component Library

**Definition:** Shared React component library based on shadcn/ui.

**Exports:**

- 60+ reusable components (Button, Dialog, Table, etc.)
- Headless UI primitives (Radix UI)
- Hooks and utilities
- Design tokens

**Function:**

- Ensures UI consistency across applications
- Accelerates frontend development

---

## Layer 2: Domain Services

**Purpose:** Business logic, domain rules, calculations  
**Dependencies:** Layer 0 + Layer 1 only  
**Location:** `packages/workflow`, `business-domain/*` (130 packages; 37 implemented)

### Core Domain Services (packages/)

#### `workflow` - Business Process Engine

**Definition:** Rules engine for orchestrating business processes.

**Function:**

- Rule registry and evaluation
- Condition/action DSL
- Database-backed rule loading (cached)
- V2 envelope generator with DAG validation
- Edit window enforcement
- Workflow execution tracking

**Dependencies:** `afenda-canon`, `afenda-database`

**Example Use Cases:**

- Auto-approve invoices under $10,000
- Send notification when payment is overdue
- Trigger workflow when inventory drops below reorder point

---

> **Note:** The `advisory` package (analytics & forecasting) has been removed. Database tables `advisories` and `advisory_evidence` are retained for a future advisory module; no current consumer. No migration to drop until product decision.

---

### Business Domain Packages (business-domain/)

**130 domain-specific packages** (37 implemented, 93 planned) implementing focused business logic.

#### Financial Management

- `accounting` - Tax, FX, depreciation, revenue recognition
- `fx-management` - Foreign exchange, hedge accounting
- `consolidation` - Multi-level consolidation, eliminations
- `tax-engine` - Tax compliance, VAT/GST
- `treasury` - Cash management, forecasting
- `fixed-assets` - Asset lifecycle, depreciation
- `revenue-recognition` - ASC 606/IFRS 15

#### Procurement & Supply Chain

- `procurement` - Requisition, RFQ, contracts
- `purchasing` - Purchase orders
- `inventory` - Stock management, lot tracking
- `warehouse` - Location, picking, packing
- `receiving` - Goods receipt

#### Order-to-Cash

- `crm` - Customer management, pricing
- `sales` - Quote-to-order
- `shipping` - Fulfillment
- `receivables` - Invoicing, collections

#### Manufacturing

- `production` - Work orders, BOM
- `quality-mgmt` - Inspection, NCR
- `plm` - Product lifecycle

#### Human Resources

- `hr-core` - Employee master
- `payroll` - Payroll processing
- `time-attendance` - Timesheets, PTO

**And 90+ more...**

### Domain Package Example

```typescript
// business-domain/accounting/src/services/tax-calculation.ts
import type { TaxRate } from 'afenda-canon';

export function calculateTax(amountMinor: number, rate: number): number {
  if (amountMinor < 0) {
    throw new Error('Amount must be non-negative');
  }
  if (rate < 0 || rate > 1) {
    throw new Error('Rate must be between 0 and 1');
  }

  return Math.round(amountMinor * rate);
}

// business-domain/accounting/src/index.ts
export { calculateTax } from './services/tax-calculation';
export type { TaxRate } from 'afenda-canon'; // Re-export types
```

**Dependencies Allowed:**

- ✅ `afenda-canon` (types)
- ✅ `afenda-database` (schemas)
- ✅ `afenda-logger` (logging)
- ✅ `drizzle-orm` (queries)
- ✅ External npm (lodash, date-fns, etc.)

**Dependencies Forbidden:**

- ❌ Other business-domain packages (no cross-domain deps)
- ❌ `afenda-crud` (Layer 3 - upper layer)
- ❌ Local type definitions (use canon)

---

## Layer 3: Application

**Purpose:** Orchestration, policy enforcement, API handlers  
**Dependencies:** All layers (0, 1, 2)  
**Location:** `packages/crud`, `packages/observability`

### `crud` - Application Orchestrator

**Definition:** The orchestration layer that coordinates domain services.

**Function:**

- Entity lifecycle management (create, read, update, delete)
- Policy enforcement (permissions, field-level access)
- Transaction coordination
- Event publishing
- Audit logging
- Multi-domain orchestration

**Dependencies:**

- Layer 1: `afenda-canon`, `afenda-database`, `afenda-logger`
- Layer 2: `afenda-workflow`, `afenda-accounting`, `afenda-crm`, etc.

**Example:**

```typescript
// packages/crud/src/handlers/invoices.ts
import { calculateTax } from 'afenda-accounting';
import { checkCreditLimit } from 'afenda-crm';
import { invoices } from 'afenda-database';
import { logger } from 'afenda-logger';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function createInvoice(db: NeonHttpDatabase, orgId: string, data: InvoiceInput) {
  // 1. Domain logic: Check credit (crm)
  await checkCreditLimit(db, orgId, data.customerId, data.totalMinor);

  // 2. Domain logic: Calculate tax (accounting)
  const taxMinor = calculateTax(data.subtotalMinor, data.taxRate);

  // 3. Data persistence
  const [invoice] = await db
    .insert(invoices)
    .values({
      orgId,
      customerId: data.customerId,
      subtotalMinor: data.subtotalMinor,
      taxMinor,
      totalMinor: data.subtotalMinor + taxMinor,
    })
    .returning();

  // 4. Observability
  logger.info({ invoiceId: invoice.id }, 'Invoice created');

  return invoice;
}
```

**Key Principle:** CRUD orchestrates domain services. It does NOT implement business logic.

**Business Logic Lives In:**

- `calculateTax()` → `afenda-accounting` (Layer 2)
- `checkCreditLimit()` → `afenda-crm` (Layer 2)

**CRUD Responsibilities:**

- Coordinate calls to domain services
- Manage database transactions
- Enforce policies
- Log events

---

### `observability` - Monitoring

**Definition:** System-wide observability and telemetry.

**Function:**

- Performance metrics
- Health checks
- OpenTelemetry integration
- Error tracking

---

## Dependency Rules

### Visual Dependency Flow

```
┌─────────┐
│  crud   │  Layer 3: Can import from all lower layers
└────┬────┘
     │
     ├──→ workflow, accounting, crm... (Layer 2) ✅
     ├──→ canon, database, logger, ui (Layer 1) ✅
     └──→ eslint-config, typescript-config (Layer 0) ✅

┌────────────┐
│ accounting │  Layer 2: Can ONLY import from Layer 0 & 1
└──────┬─────┘
       │
       ├──→ canon, database, logger (Layer 1) ✅
       └──→ typescript-config (Layer 0) ✅

       ❌ CANNOT import from crud (Layer 3)
       ❌ CANNOT import from other Layer 2 (crm, inventory...)

┌─────────┐
│  canon  │  Layer 1: Can ONLY import from Layer 0 + external
└────┬────┘
     │
     ├──→ typescript-config (Layer 0) ✅
     └──→ zod (external npm) ✅

     ❌ CANNOT import from any business-domain
     ❌ CANNOT import from crud

┌────────────────┐
│ eslint-config  │  Layer 0: No workspace dependencies
└────────────────┘

     ❌ CANNOT import from ANY workspace package
     ✅ ONLY external npm packages
```

### Dependency Matrix

| Package Type                | Can Import From   | Forbidden                        |
| --------------------------- | ----------------- | -------------------------------- |
| **Layer 3**                 |                   |                                  |
| crud, observability         | Layers 0, 1, 2    | -                                |
| **Layer 2**                 |                   |                                  |
| workflow, search, migration | Layers 0, 1       | Layer 2 (other domains), Layer 3 |
| business-domain/\*          | Layers 0, 1       | Layer 2 (other domains), Layer 3 |
| **Layer 1**                 |                   |                                  |
| canon                       | Layer 0 + Zod     | Layers 1, 2, 3                   |
| database                    | Layer 0 + Drizzle | Layers 1, 2, 3                   |
| logger                      | Layer 0 + Pino    | Layers 1, 2, 3                   |
| ui                          | Layer 0 + React   | Layers 1, 2, 3                   |
| **Layer 0**                 |                   |                                  |
| eslint-config               | External npm only | All workspace packages           |
| typescript-config           | External npm only | All workspace packages           |

---

## Package Standards

### Directory Structure

```
business-domain/my-domain/
├── src/
│   ├── index.ts              # ✅ Public API - ONLY file that exports
│   ├── services/             # Business logic functions
│   │   ├── service-a.ts
│   │   └── service-b.ts
│   └── __tests__/            # Tests in dedicated subdirectory
│       └── service-a.test.ts
├── package.json              # All dependencies explicitly declared
├── tsconfig.json             # composite: true (library package)
├── tsconfig.build.json       # composite: false (tsup escape hatch)
├── tsup.config.ts            # tsconfig: './tsconfig.build.json'
├── eslint.config.js          # Extends workspace config
├── README.md                 # Required documentation
└── vitest.config.ts          # Test configuration
```

### package.json Template (Layer 2 Domain)

```json
{
  "name": "afenda-my-domain",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint src"
  },
  "dependencies": {
    "afena-canon": "workspace:*",
    "afena-database": "workspace:*",
    "afena-logger": "workspace:*"
  },
  "devDependencies": {
    "afena-typescript-config": "workspace:*",
    "drizzle-orm": "catalog:",
    "tsup": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

### tsconfig.json (Library Package)

```jsonc
{
  "extends": "afena-typescript-config/base.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": false,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*", "**/*.spec.*"],
}
```

### tsconfig.build.json (tsup Escape Hatch)

Required because tsup DTS generation is incompatible with `composite: true`.

```jsonc
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": false,
    "incremental": false,
    "tsBuildInfoFile": null,
  },
}
```

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  tsconfig: './tsconfig.build.json', // ALWAYS this, never ./tsconfig.json
  external: ['afena-canon', 'afena-database', 'afena-logger', 'drizzle-orm'],
});
```

### src/index.ts Pattern

```typescript
// ✅ CORRECT - Export public API only
export { calculateTax } from './services/tax-calculation';
export { lookupFxRate } from './services/fx-lookup';

// ✅ Re-export types from canon (for convenience)
export type { TaxRate, FxRate } from 'afenda-canon';

// ❌ NEVER export internal utilities
// export { helperFunction } from './utils/helpers';  // NO!
```

---

## Development Workflow

### 1. Add Types to Canon

```typescript
// packages/canon/src/types/accounting.ts
export interface TaxRate {
  taxCode: string;
  rate: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

// packages/canon/src/index.ts
export type { TaxRate } from './types/accounting';
```

### 2. Add Database Schema

```typescript
// packages/database/src/schema/tax-rates.ts
import { pgTable, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { baseEntity } from './helpers/base-entity';

export const taxRates = pgTable('tax_rates', {
  ...baseEntity,
  taxCode: text('tax_code').notNull(),
  rate: numeric('rate', { precision: 10, scale: 6 }).notNull(),
  effectiveFrom: timestamp('effective_from').notNull(),
});

// packages/database/src/index.ts
export { taxRates } from './schema/tax-rates';
```

### 3. Implement Domain Business Logic

```typescript
// business-domain/accounting/src/services/tax-calculation.ts
import type { TaxRate } from 'afenda-canon';

export function calculateTax(amountMinor: number, rate: number): number {
  return Math.round(amountMinor * rate);
}

// business-domain/accounting/src/index.ts
export { calculateTax } from './services/tax-calculation';
```

### 4. Use in CRUD (orchestration)

```typescript
// packages/crud/src/handlers/invoices.ts
import { calculateTax } from 'afenda-accounting';

const taxMinor = calculateTax(data.subtotalMinor, 0.0825);
```

---

## Validation

### Check Dependencies

```bash
# Validate no circular dependencies
pnpm run validate:deps

# Check layer violations
pnpm run lint:ci
```

### Build & Test

```bash
# Build all packages
pnpm build

# Test all packages
pnpm test

# Type-check all packages
pnpm type-check
```

---

## Summary

### 4-Layer Architecture

1. **Layer 0 (Configuration)** - eslint-config, typescript-config
2. **Layer 1 (Foundation)** - canon, database, logger, ui
3. **Layer 2 (Domain Services)** - workflow, search, migration, business-domain/\* (130 pkgs)
4. **Layer 3 (Application)** - crud, observability

### Key Rules

| Layer | Exports               | Imports From       | Never Imports From     |
| ----- | --------------------- | ------------------ | ---------------------- |
| **0** | Config                | External npm only  | Any workspace pkg      |
| **1** | Types, schemas, utils | Layer 0 + external | Layers 1, 2, 3         |
| **2** | Business logic        | Layers 0, 1        | Other Layer 2, Layer 3 |
| **3** | Orchestration         | Layers 0, 1, 2     | -                      |

### Critical Patterns

**Canon (Layer 1):**

- ✅ Exports types, enums, schemas
- ❌ Never imports from business domains

**Database (Layer 1):**

- ✅ Exports table schemas
- ❌ Never contains business logic

**Business Domains (Layer 2):**

- ✅ Import types from canon
- ✅ Import schemas from database
- ❌ Never import from other domains
- ❌ Never import from crud

**CRUD (Layer 3):**

- ✅ Orchestrates domain services
- ✅ Imports from all lower layers
- ❌ Never implements business logic

### Benefits

- ✅ Zero circular dependencies
- ✅ Clean separation of concerns
- ✅ Independent domain development
- ✅ Type safety across the system
- ✅ Scalable to 1000+ packages

---

**Last Updated:** February 20, 2026  
**Version:** 2.1 (Package Standards Corrected)
