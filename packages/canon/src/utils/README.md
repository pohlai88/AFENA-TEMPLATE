# Canon Utils

**Location:** `packages/canon/src/utils`  
**Purpose:** Utility functions and helpers used across Canon

---

## Overview

This directory contains utility functions that support Canon's core functionality. These are pure, reusable functions that don't fit into other specific categories.

---

## Key Files

### Caching

- **`cache.ts`** - LRU cache implementation
  - Generic LRU cache with configurable size
  - Used by lite-meta and mappings for performance
  - Pure functional interface
  - No side effects

---

## Usage

### LRU Cache

```typescript
import { createLRUCache } from 'afenda-canon/utils';

// Create cache with max 100 entries
const cache = createLRUCache<string, ParsedAssetKey>(100);

// Set value
cache.set('key', value);

// Get value
const value = cache.get('key');

// Check if key exists
const exists = cache.has('key');

// Clear cache
cache.clear();

// Get cache size
const size = cache.size();
```

---

## Design Principles

1. **Pure Functions** - No side effects, deterministic
2. **Type Safe** - Strong TypeScript types
3. **Reusable** - Generic implementations
4. **Performance** - Optimized for common use cases
5. **Zero Dependencies** - No external dependencies

---

## Related

- [../lite-meta/README.md](../lite-meta/README.md) - Uses cache for asset key parsing
- [../mappings/README.md](../mappings/README.md) - Uses cache for type mappings
- [Main README](../../README.md) - Package overview
