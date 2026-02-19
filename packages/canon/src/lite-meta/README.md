# Canon LiteMetadata

**Location:** `packages/canon/src/lite-meta`  
**Purpose:** Lightweight metadata system for asset discovery, type mapping, and data lineage

---

## Overview

LiteMetadata provides a pure, deterministic metadata system for managing database schemas, data types, and asset relationships. It enables type-safe metadata operations without requiring a full metadata database.

---

## Directory Structure

```
lite-meta/
├── core/              # Core metadata functions (asset keys, type configs)
├── types/             # TypeScript type definitions
├── adapters/          # Adapters for different data sources
├── batch/             # Batch processing utilities
├── cache/             # LRU caching for performance
├── hooks/             # Lifecycle hooks for metadata operations
├── resilience/        # Error handling and retry logic
└── index.ts           # Barrel exports
```

---

## Key Concepts

### Asset Keys

Asset keys uniquely identify metadata assets using a hierarchical format:

```
{assetType}.{scope}.{org}.{schema}.{table}[.{column}]
```

**Examples:**
- `db.rec.afenda.public.invoices` - Table asset
- `db.rec.afenda.public.invoices.total_amount` - Column asset
- `api.endpoint.afenda.v1.invoices` - API endpoint asset

### Type Configs

Type configurations define metadata for data types:

```typescript
{
  canonType: 'string',
  constraints: {
    maxLength: 255,
    pattern: '^[A-Za-z0-9]+$'
  },
  classification: 'pii',
  semanticTerm: 'email_address'
}
```

---

## Core Functions

### Asset Key Operations

```typescript
import { 
  buildAssetKey, 
  parseAssetKey, 
  validateAssetKey 
} from 'afenda-canon';

// Build asset key
const key = buildAssetKey({
  assetType: 'db.rec',
  org: 'afenda',
  schema: 'public',
  table: 'invoices',
  column: 'total_amount'
});

// Parse asset key
const parsed = parseAssetKey(key);
console.log(parsed.table); // 'invoices'

// Validate asset key
const isValid = validateAssetKey(key);
```

### Type Mapping

```typescript
import { 
  mapPostgresType, 
  inferCsvColumnType,
  TYPE_COMPAT_MATRIX 
} from 'afenda-canon';

// Map PostgreSQL type to Canon type
const canonType = mapPostgresType('varchar(255)');
// Returns: { canonType: 'string', constraints: { maxLength: 255 } }

// Infer CSV column type
const inferredType = inferCsvColumnType(['123', '456', '789']);
// Returns: 'integer'

// Check type compatibility
const compatible = TYPE_COMPAT_MATRIX.string.includes('text');
```

### Classification

```typescript
import { classifyColumn, PII_PATTERNS } from 'afenda-canon';

// Classify column based on name and sample data
const classification = classifyColumn('email', ['user@example.com']);
// Returns: 'pii'

// Check if column matches PII patterns
const isPII = PII_PATTERNS.some(pattern => pattern.test('email_address'));
```

---

## Adapters

### Database Adapters

- **PostgreSQL** - Extract metadata from PostgreSQL schemas
- **MySQL** - Extract metadata from MySQL schemas
- **CSV** - Infer metadata from CSV files

### Usage

```typescript
import { PostgresMetadataAdapter } from 'afenda-canon';

const adapter = new PostgresMetadataAdapter(connectionString);
const metadata = await adapter.extractMetadata('public');
```

---

## Batch Processing

Process multiple assets efficiently:

```typescript
import { batchProcessAssets } from 'afenda-canon';

const results = await batchProcessAssets(assetKeys, {
  concurrency: 10,
  retryAttempts: 3,
  onProgress: (completed, total) => {
    console.log(`${completed}/${total} processed`);
  }
});
```

---

## Caching

LRU caching for performance optimization:

```typescript
import { assetKeyCache, typeDerivationCache } from 'afenda-canon';

// Cache is automatic and transparent
const parsed = parseAssetKey(key); // Cached after first call

// Clear cache if needed
assetKeyCache.clear();
typeDerivationCache.clear();
```

---

## Lineage Tracking

Track data lineage and dependencies:

```typescript
import { inferEdgeType, topoSortLineage } from 'afenda-canon';

// Infer relationship type between assets
const edgeType = inferEdgeType(sourceAsset, targetAsset);
// Returns: 'derives_from' | 'transforms' | 'aggregates' | etc.

// Topologically sort lineage graph
const sorted = topoSortLineage(lineageGraph);
```

---

## Design Principles

1. **Pure Functions** - All operations are deterministic and side-effect-free
2. **Type Safety** - Strong TypeScript types throughout
3. **Performance** - LRU caching for frequently accessed metadata
4. **Extensibility** - Adapter pattern for different data sources
5. **Zero Dependencies** - No external dependencies beyond Zod

---

## Related

- [../mappings/README.md](../mappings/README.md) - Type mapping utilities
- [../types/README.md](../types/README.md) - TypeScript type definitions
- [Main README](../../README.md) - Package overview
