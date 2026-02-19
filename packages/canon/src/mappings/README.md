# Canon Mappings

**Location:** `packages/canon/src/mappings`  
**Purpose:** Type mapping utilities for converting between different type systems

---

## Overview

This directory provides type mapping functions for converting between PostgreSQL, CSV, and Canon type systems. It includes compatibility matrices, type inference, and validation utilities.

---

## Key Files

### Type Mapping

- **`postgres-types.ts`** - PostgreSQL to Canon type mappings
  - Maps PostgreSQL types (varchar, integer, timestamp, etc.) to Canon types
  - Extracts constraints (length, precision, scale)
  - Handles array types and custom types

- **`csv-types.ts`** - CSV column type inference
  - Infers types from CSV data samples
  - Detects numeric, date, boolean, and string types
  - Handles null values and mixed types

- **`type-compat.ts`** - Type compatibility matrix
  - Defines which types can be safely converted
  - Provides compatibility scoring
  - Supports bidirectional type checking

### Utilities

- **`registry.ts`** - Type mapping registry
  - Centralized registry of all type mappings
  - Lookup functions for quick access
  - Extensible for custom type systems

- **`cache.ts`** - Type mapping cache
  - LRU cache for frequently used mappings
  - Performance optimization
  - Configurable cache size

- **`policy.ts`** - Type mapping policies
  - Defines rules for type conversions
  - Handles edge cases and special scenarios
  - Configurable strictness levels

- **`reason-codes.ts`** - Mapping failure reason codes
  - Standardized error codes for mapping failures
  - Human-readable error messages
  - Debugging support

- **`telemetry.ts`** - Mapping telemetry
  - Performance metrics
  - Usage statistics
  - Error tracking

- **`warnings.ts`** - Type mapping warnings
  - Non-fatal warnings for lossy conversions
  - Precision loss detection
  - Data truncation warnings

---

## Usage

### PostgreSQL Type Mapping

```typescript
import { mapPostgresType, POSTGRES_TO_CANON } from 'afenda-canon';

// Map PostgreSQL type to Canon type
const result = mapPostgresType('varchar(255)');
console.log(result.canonType); // 'string'
console.log(result.constraints.maxLength); // 255

// Direct lookup
const canonType = POSTGRES_TO_CANON['integer'];
console.log(canonType); // 'integer'
```

### CSV Type Inference

```typescript
import { inferCsvColumnType, inferBatchCsvTypes } from 'afenda-canon';

// Infer single column type
const type = inferCsvColumnType(['123', '456', '789']);
console.log(type); // 'integer'

// Infer multiple columns
const types = inferBatchCsvTypes({
  id: ['1', '2', '3'],
  name: ['Alice', 'Bob', 'Charlie'],
  amount: ['10.50', '20.75', '30.00']
});
console.log(types); // { id: 'integer', name: 'string', amount: 'decimal' }
```

### Type Compatibility

```typescript
import { TYPE_COMPAT_MATRIX, isCompatible } from 'afenda-canon';

// Check compatibility
const compatible = isCompatible('string', 'text');
console.log(compatible); // true

// Get compatibility score
const score = TYPE_COMPAT_MATRIX.getScore('integer', 'bigint');
console.log(score); // 0.9 (high compatibility)
```

### Type Mapping Registry

```typescript
import { registerTypeMapping, getTypeMapping } from 'afenda-canon';

// Register custom mapping
registerTypeMapping('custom_type', {
  canonType: 'string',
  constraints: { maxLength: 100 }
});

// Retrieve mapping
const mapping = getTypeMapping('custom_type');
```

---

## Type Systems

### PostgreSQL Types

Supported PostgreSQL types:
- **Numeric:** smallint, integer, bigint, decimal, numeric, real, double precision
- **String:** char, varchar, text
- **Date/Time:** date, time, timestamp, timestamptz, interval
- **Boolean:** boolean
- **Binary:** bytea
- **JSON:** json, jsonb
- **Arrays:** Any type with [] suffix
- **UUID:** uuid

### Canon Types

Canonical type system:
- **string** - Text data
- **integer** - Whole numbers
- **decimal** - Decimal numbers
- **boolean** - True/false values
- **date** - Date values
- **timestamp** - Date and time values
- **json** - JSON data
- **binary** - Binary data
- **uuid** - UUID values

### CSV Types

Inferred from data:
- **integer** - Whole numbers
- **decimal** - Decimal numbers
- **boolean** - true/false, yes/no, 1/0
- **date** - ISO date strings
- **timestamp** - ISO datetime strings
- **string** - Default fallback

---

## Design Principles

1. **Deterministic** - Same input always produces same output
2. **Cached** - Frequently used mappings are cached
3. **Extensible** - Easy to add new type systems
4. **Type Safe** - Strong TypeScript types throughout
5. **Performance** - Optimized for high-volume operations

---

## Related

- [../lite-meta/README.md](../lite-meta/README.md) - Metadata system using type mappings
- [../types/README.md](../types/README.md) - TypeScript type definitions
- [Main README](../../README.md) - Package overview
