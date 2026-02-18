# Migration Guide: Canon Optimization (Phases 1-3)

This guide covers breaking changes and new features introduced in Canon optimization phases 1-3.

---

## Phase 1: Foundation

### Breaking Change: Branded ID Types

**What changed:** ID types are now branded for compile-time safety.

**Before:**
```typescript
function processEntity(entityId: string, orgId: string) {
  // Can accidentally swap these - no compile error ❌
}
```

**After:**
```typescript
import { EntityId, OrgId, asEntityId, asOrgId } from 'afenda-canon/types';

function processEntity(entityId: EntityId, orgId: OrgId) {
  // Swapping these = compile error ✅
}

// Brand at boundaries
const entityId = asEntityId(uuidString);
const orgId = asOrgId(orgUuidString);
```

**Mechanical fix:**
1. Import branded types: `import { EntityId, OrgId, ... } from 'afenda-canon/types'`
2. Update function signatures: `string` → `EntityId`
3. Brand at boundaries: `asEntityId(value)` when receiving UUIDs from external sources

**Available branded types:**
- `EntityId` - Entity identifiers
- `OrgId` - Organization identifiers  
- `UserId` - User identifiers
- `BatchId` - Mutation batch identifiers
- `MutationId` - Mutation identifiers
- `AuditLogId` - Audit log identifiers

---

### Breaking Change: CanonResult Error Envelope

**What changed:** Public APIs now return `CanonResult<T>` instead of throwing.

**Before:**
```typescript
try {
  const result = someCanonFunction(input);
  // use result
} catch (error) {
  // handle error
}
```

**After:**
```typescript
import { CanonResult } from 'afenda-canon/types';

const result: CanonResult<MyType> = someCanonFunction(input);

if (result.ok) {
  // use result.value (type: MyType)
  console.log(result.value);
} else {
  // handle result.issues (type: CanonIssue[])
  result.issues.forEach(issue => {
    console.error(`${issue.code}: ${issue.message}`);
    if (issue.path) {
      console.error(`  at: ${issue.path.join('.')}`);
    }
  });
}
```

**Mechanical fix:**
1. Remove try/catch blocks around Canon function calls
2. Check `result.ok` instead of catching exceptions
3. Access `result.value` on success or `result.issues` on failure

**Helper functions:**
```typescript
import { ok, err, errSingle, createIssue } from 'afenda-canon/types';

// Create success result
return ok(myValue);

// Create error with multiple issues
return err([issue1, issue2]);

// Create error with single issue (convenience)
return errSingle('VALIDATION_FAILED', 'Invalid input', ['field', 'name']);

// Create individual issues
const issue = createIssue('REQUIRED', 'Field is required', ['email']);
```

---

### New: Schema Composition Helpers

**What's new:** Reusable schema helpers for common patterns.

```typescript
import { withMeta, primitives, createEnumSchema } from 'afenda-canon/schemas';

// Add metadata to any schema
const userSchema = withMeta(
  z.object({ name: z.string() }),
  { id: 'User', description: 'User profile' }
);

// Use pre-validated primitives
const emailSchema = primitives.email;
const urlSchema = primitives.url;
const timestampSchema = primitives.timestamp;

// Create enum with metadata
const statusSchema = createEnumSchema(
  ['active', 'inactive', 'pending'],
  'Status',
  'User account status'
);
```

---

## Phase 2: Performance (No Breaking Changes)

Caching is automatic and transparent. No code changes required.

**What changed:**
- `parseAssetKey()` results are cached (LRU, 1000 entries)
- `deriveAssetTypeFromKey()` results are cached (LRU, 500 entries)
- Expected cache hit rate: >70% for typical workloads

**Optional:** Clear cache if needed:
```typescript
import { assetKeyCache, typeDerivationCache } from 'afenda-canon';

// Clear specific caches
assetKeyCache.clear();
typeDerivationCache.clear();

// Check cache stats (if instrumented)
console.log(assetKeyCache.size()); // Current entries
```

---

## Phase 3: Schema Ergonomics

### New: Input vs Canonical Schemas

**What's new:** Separate schemas for external inputs vs internal values.

**When to use:**
- **Input schemas** (`*InputSchema`): Forms, env vars, query params, external data
- **Canonical schemas** (base schema): Internal storage, database values, API responses

**Example:**
```typescript
import { assetKeyInputSchema, assetKeySchema } from 'afenda-canon/schemas';

// External input - normalizes automatically (trim + lowercase)
const userInput = assetKeyInputSchema.parse(formData.assetKey);
// Input: "  DB.REC.AFENDA.PUBLIC.INVOICES  "
// Result: "db.rec.afenda.public.invoices"

// Internal validation - strict, no normalization
const dbValue = assetKeySchema.parse(row.asset_key);
// Must already be canonical format
```

**Pattern:**
```typescript
// At API boundary (external → internal)
const canonicalKey = assetKeyInputSchema.parse(req.body.key);

// Store in database
await db.insert({ asset_key: canonicalKey });

// Read from database (already canonical)
const row = await db.select();
const validated = assetKeySchema.parse(row.asset_key);
```

---

### New: Numeric Coercion

**What changed:** Numeric fields now accept strings and coerce to numbers.

**Before:**
```typescript
const config = { maxLength: 255 }; // Must be number
```

**After:**
```typescript
const config = { maxLength: "255" }; // Works! Coerced to number
```

**Benefit:** Forms and environment variables work seamlessly:
```typescript
// From environment variable
const config = {
  maxLength: process.env.MAX_LENGTH, // String "255" → Number 255
  precision: process.env.PRECISION,   // String "18" → Number 18
};

// From form input
const formConfig = {
  maxLength: formData.get('maxLength'), // String → Number
};
```

**Applies to:** All numeric fields in `TYPE_CONFIG_SCHEMAS` (maxLength, precision, scale, min, max, maxSelections, maxBytes, etc.)

---

## Phase 4: Package Exports (Tree-Shaking)

### New: Subpath Imports

**What's new:** Import from specific subpaths for better tree-shaking.

**Recommended import paths:**
```typescript
// ✅ Metadata parsing
import { parseAssetKey, validateAssetKey } from 'afenda-canon/lite-meta';

// ✅ Schemas
import { assetKeySchema, entityRefSchema } from 'afenda-canon/schemas';

// ✅ Branded types
import { EntityId, asEntityId, ok, err } from 'afenda-canon/types';

// ✅ Type mappings
import { mapPostgresType, inferCsvColumnType } from 'afenda-canon/mappings';

// ✅ Common quickstart (main barrel - includes most frequently used exports)
import { parseAssetKey, assetKeySchema, EntityId } from 'afenda-canon';
```

**Why subpath imports?**
- **Smaller bundles:** Only import what you need
- **Faster builds:** Better tree-shaking
- **Clearer intent:** Explicit about which module you're using

**Backward compatibility:** Main barrel (`afenda-canon`) still works for common imports.

---

## Summary of Changes

| Phase | Change | Breaking? | Action Required |
|-------|--------|-----------|-----------------|
| **Phase 1** | Branded ID types | ✅ Yes | Update type signatures, brand at boundaries |
| **Phase 1** | CanonResult envelope | ✅ Yes | Replace try/catch with result.ok checks |
| **Phase 1** | Schema helpers | ❌ No | Optional - use for convenience |
| **Phase 2** | LRU caching | ❌ No | Automatic - no changes needed |
| **Phase 3** | Input schemas | ❌ No | Optional - use for external inputs |
| **Phase 3** | Numeric coercion | ❌ No | Automatic - strings now work |
| **Phase 4** | Subpath imports | ❌ No | Optional - improves tree-shaking |

---

## Need Help?

- **Type errors with branded IDs?** Make sure to use `asEntityId()` etc. at boundaries
- **CanonResult confusion?** Check `result.ok` first, then access `.value` or `.issues`
- **Import errors?** Try subpath imports: `afenda-canon/types`, `afenda-canon/schemas`, etc.
- **Tree-shaking not working?** Use subpath imports instead of main barrel

For more examples, see the test files in `src/__tests__/` and `src/*/__ tests__/`.
