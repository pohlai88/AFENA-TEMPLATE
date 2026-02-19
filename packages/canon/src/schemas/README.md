# Canon Schemas

**Location:** `packages/canon/src/schemas`  
**Purpose:** Zod validation schemas for all Canon types

---

## Overview

This directory contains Zod schemas for runtime validation of Canon types. Every TypeScript type in Canon has a corresponding Zod schema for input validation, API contracts, and data integrity.

---

## Key Files

### Core Schemas

- **`branded.ts`** - Branded ID schemas (EntityId, OrgId, UserId, etc.)
- **`fields.ts`** - Common field schemas (id, slug, timestamps, version, audit, pagination)
- **`entity.ts`** - Entity type and reference schemas
- **`action.ts`** - Action type schemas
- **`receipt.ts`** - Mutation receipt schemas
- **`mutation.ts`** - Mutation specification schemas
- **`audit.ts`** - Audit log entry schemas
- **`envelope.ts`** - Action envelope schemas

### Specialized Schemas

- **`data-types.ts`** - Data type schemas for metadata system
- **`lite-meta.ts`** - LiteMetadata schemas (asset keys, type configs, etc.)
- **`capability.ts`** - Capability descriptor and exception schemas
- **`error-codes.ts`** - Error code enum schemas
- **`json-value.ts`** - JSON value schemas

### Utilities

- **`builders.ts`** - Schema composition helpers (withMeta, createEnumSchema)
- **`helpers.ts`** - Validation helpers and utilities
- **`safe-parse.ts`** - Safe parsing utilities with error handling
- **`cache.ts`** - Schema caching for performance

### Catalog

- **`catalog/`** - Schema catalog system for runtime discovery
  - `index.ts` - Frozen catalog of all schemas
  - `types.ts` - Catalog type definitions
  - `discovery.ts` - Pure discovery functions
  - `openapi.ts` - OpenAPI seed extraction

---

## Usage

### Basic Validation

```typescript
import { entityIdSchema, invoiceSchema } from 'afenda-canon';

// Validate a single field
const entityId = entityIdSchema.parse(uuid);

// Validate a complex object
const invoice = invoiceSchema.parse(data);
```

### Schema Catalog

```typescript
import { getSchema, findSchemas, CANON_SCHEMAS } from 'afenda-canon';

// Get schema by ID
const schema = getSchema('canon.branded.entityId');

// Find schemas by category
const branded = findSchemas({ category: 'branded' });

// Find schemas by tags
const identifiers = findSchemas({ tags: ['identifier'] });
```

### Schema Composition

```typescript
import { withMeta, createEnumSchema } from 'afenda-canon';

// Add metadata to any schema
const userSchema = withMeta(
  z.object({ name: z.string() }),
  { id: 'User', description: 'User profile' }
);

// Create enum with metadata
const statusSchema = createEnumSchema(
  ['active', 'inactive', 'pending'],
  'Status',
  'User account status'
);
```

---

## Schema Categories

| Category | Count | Purpose |
|----------|-------|---------|
| **branded** | 6 | Branded ID types for compile-time safety |
| **field** | 13 | Common field patterns (id, slug, timestamps, etc.) |
| **entity** | 2 | Entity type and reference schemas |
| **validation** | 7 | Action types, error codes, receipt status |
| **api** | 2 | API response and receipt schemas |
| **internal** | 7 | Mutation specs, JSON values, audit logs |

---

## Design Principles

1. **Type-Schema Parity** - Every TypeScript type has a matching Zod schema
2. **Runtime Safety** - All external inputs validated via schemas
3. **Zero Dependencies** - Only depends on Zod (no workspace deps)
4. **Pure Functions** - All schema builders are deterministic
5. **Tree-Shakeable** - Individual schemas can be imported separately

---

## Related

- [../types/README.md](../types/README.md) - TypeScript type definitions
- [../enums/README.md](../enums/README.md) - Enum definitions
- [Main README](../../README.md) - Package overview
