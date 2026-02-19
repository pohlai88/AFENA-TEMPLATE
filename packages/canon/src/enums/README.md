# Canon Enums

Enterprise-grade enum definitions with **metadata-first SSOT architecture**, zero-duplication helpers, and O(1) validation.

## Architecture

All 24 enums in Canon follow a consistent **Single Source of Truth (SSOT)** pattern:

- **Metadata is SSOT** - Labels, descriptions, and business context defined once
- **Zero Duplication** - Shared `enum-kit` utilities eliminate repeated helper logic
- **O(1) Performance** - Set-based validation for fast runtime checks
- **Type Safety** - Complete TypeScript coverage with `satisfies` constraints
- **Semantic Tokens** - Framework-agnostic tone values (not hardcoded colors)

## Quick Start

### Basic Usage

```typescript
import { DOC_STATUSES, DocStatus, docStatusSchema } from '@afena/canon';

// Type-safe constant
const status: DocStatus = 'draft';

// Runtime validation with Zod
const result = docStatusSchema.safeParse(userInput);
if (result.success) {
  console.log(result.data); // typed as DocStatus
}
```

### Validation Helpers

```typescript
import { isValidDocStatus, assertDocStatus } from '@afena/canon';

// Type guard (O(1) via Set)
function processStatus(value: unknown) {
  if (isValidDocStatus(value)) {
    // value is now typed as DocStatus
    return value;
  }
  throw new Error('Invalid status');
}

// Assertion helper
function requireStatus(value: unknown): DocStatus {
  assertDocStatus(value); // throws TypeError if invalid
  return value; // now typed as DocStatus
}
```

### Labels & Metadata

```typescript
import { 
  getDocStatusLabel, 
  getDocStatusMeta, 
  DOC_STATUS_LABELS 
} from '@afena/canon';

// Get label (derived from metadata)
const label = getDocStatusLabel('draft'); // 'Draft'

// Or use labels map directly
const label2 = DOC_STATUS_LABELS.draft; // 'Draft'

// Get full metadata
const meta = getDocStatusMeta('draft');
console.log(meta);
// {
//   label: 'Draft',
//   description: 'Initial state; fully editable.',
//   tone: 'neutral',
//   editable: true,
//   terminal: false,
//   sortOrder: 1
// }
```

### Semantic Helpers

Enums with business logic provide semantic subsets and predicates:

```typescript
import { 
  isTerminalDocStatus, 
  isEditableDocStatus,
  TERMINAL_DOC_STATUSES 
} from '@afena/canon';

// Predicate (O(1) via Set)
if (isTerminalDocStatus(status)) {
  // No further transitions allowed
  console.log('Document is in terminal state');
}

if (isEditableDocStatus(status)) {
  // User can modify document
  showEditButton();
}

// Access subset values
console.log(TERMINAL_DOC_STATUSES.values); // ['cancelled', 'amended']
console.log(TERMINAL_DOC_STATUSES.has('draft')); // false (O(1))
```

### Advanced: Enum Kit

All enums expose their complete kit for advanced usage:

```typescript
import { docStatusKit } from '@afena/canon';

// Access all helpers via kit
docStatusKit.isValid(value);
docStatusKit.assert(value);
docStatusKit.getLabel('draft');
docStatusKit.getMeta('draft');

// Utility methods
docStatusKit.getActive();  // Non-deprecated values
docStatusKit.getSorted();  // Sorted by sortOrder
docStatusKit.valueSet;     // Set for O(1) checks
```

## Available Enums

### Lifecycle Enums (2)

**DocStatus** - Document lifecycle states
- Subsets: `TERMINAL_DOC_STATUSES`, `EDITABLE_DOC_STATUSES`, `ACTIVE_DOC_STATUSES`
- Predicates: `isTerminalDocStatus()`, `isEditableDocStatus()`, `isActiveDocStatus()`

**PaymentStatus** - Payment lifecycle states
- Subsets: `UNPAID_PAYMENT_STATUSES`, `PAID_PAYMENT_STATUSES`, `TERMINAL_PAYMENT_STATUSES`
- Predicates: `isUnpaidPaymentStatus()`, `isPaidPaymentStatus()`, `isTerminalPaymentStatus()`, `requiresActionPaymentStatus()`

### Action Enums (2)

**AuthVerb** - Authorization verbs with action families
- Subsets: `CRUD_AUTH_VERBS`, `LIFECYCLE_AUTH_VERBS`, `RECOVERY_AUTH_VERBS`
- Predicates: `isCrudAuthVerb()`, `isLifecycleAuthVerb()`, `isRecoveryAuthVerb()`

**UpdateMode** - Document update modes
- Values: `edit`, `correct`, `amend`, `adjust`, `reassign`

### Hierarchical Enums (3)

**AuthScope** - Authorization scopes with hierarchy levels
- Subsets: `HIERARCHICAL_AUTH_SCOPES`
- Predicates: `isHierarchicalAuthScope()`
- Metadata: Includes `level` property (1-4)

**AuthScopeType** - Entity types for scoping
**MetaAliasScopeType** - Alias scope types

### Complex Enums (9)

**DataType** - Field data types with categories
- Subsets: `NUMERIC_DATA_TYPES`, `TEXT_DATA_TYPES`, `TEMPORAL_DATA_TYPES`, `REFERENCE_DATA_TYPES`
- Predicates: `isNumericDataType()`, `isTextDataType()`, `isTemporalDataType()`, `isReferenceDataType()`, `requiresValidation()`

**Channel** - Communication channels
- Subsets: `SYSTEM_CHANNELS`, `USER_CHANNELS`
- Predicates: `isSystemChannel()`, `isUserChannel()`, `isAutomatedChannel()`

**ContactType** - Contact categories
- Subsets: `BUSINESS_CONTACT_TYPES`, `INTERNAL_CONTACT_TYPES`, `PROSPECT_CONTACT_TYPES`
- Predicates: `isBusinessContact()`, `isInternalContact()`, `isProspectContact()`

**FieldSource**, **FieldSourceType**, **FxSource**, **GovernorPreset**, **MetaAssetType**, **MetaEdgeType**

### Simple Enums (8)

**StorageMode**, **SiteType**, **UomType**, **ViewType**, **MetaClassification**, **MetaQualityTier**, **MetaAliasTargetType**

## Creating Custom Enums

Use the shared `enum-kit` utilities to create new enums following the SSOT pattern:

```typescript
import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from '@afena/canon';

// 1. Define values and schema
export const MY_STATUSES = ['pending', 'active', 'archived'] as const;
export type MyStatus = (typeof MY_STATUSES)[number];
export const myStatusSchema = z.enum(MY_STATUSES);

// 2. Define metadata (SSOT)
export const MY_STATUS_METADATA = {
  pending: {
    label: 'Pending',
    description: 'Awaiting activation',
    tone: 'warning',
    sortOrder: 1,
  },
  active: {
    label: 'Active',
    description: 'Currently active',
    tone: 'success',
    sortOrder: 2,
  },
  archived: {
    label: 'Archived',
    description: 'No longer active',
    tone: 'neutral',
    sortOrder: 3,
  },
} as const satisfies Record<MyStatus, BaseEnumMetadata>;

// 3. Create enum kit
export const myStatusKit = createEnumKit(
  MY_STATUSES,
  myStatusSchema,
  MY_STATUS_METADATA
);

// 4. Export standard helpers
export const {
  isValid: isValidMyStatus,
  assert: assertMyStatus,
  getLabel: getMyStatusLabel,
  getMeta: getMyStatusMeta,
  labels: MY_STATUS_LABELS,
} = myStatusKit;

// 5. Optional: Add semantic subsets
export const ACTIVE_STATUSES = createSubset(['pending', 'active'] as const);
export const isActiveStatus = (s: MyStatus) => ACTIVE_STATUSES.has(s);
```

## Metadata Schema

### Base Metadata

All enums must provide these fields:

```typescript
interface BaseEnumMetadata {
  label: string;           // Human-readable label for UI
  description: string;     // Business context description
  tone?: Tone;            // Semantic tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger'
  sortOrder?: number;     // Sort order for UI lists (lower = earlier)
  deprecated?: boolean;   // Deprecation flag
  replacedBy?: string;    // Replacement value if deprecated
  since?: string;         // Version/date when deprecated
}
```

### Extended Metadata

Enums can extend base metadata with domain-specific fields:

```typescript
// Example: DocStatus extends with lifecycle properties
interface DocStatusMetadata extends BaseEnumMetadata {
  terminal: boolean;   // No further transitions possible
  editable: boolean;   // Document can be edited
}

// Example: DataType extends with validation properties
interface DataTypeMetadata extends BaseEnumMetadata {
  category: 'text' | 'numeric' | 'temporal' | 'reference' | 'structured' | 'binary';
  requiresValidation: boolean;
}
```

## Performance

### O(1) Validation

All validation uses precomputed Sets for constant-time lookups:

```typescript
// Traditional approach (O(n))
const isValid = (value: string) => VALUES.includes(value); // ❌ Slow

// Enum kit approach (O(1))
const valueSet = new Set(VALUES);
const isValid = (value: string) => valueSet.has(value);    // ✅ Fast
```

### Benchmark Results

- **10,000 validations**: < 10ms
- **Set creation overhead**: Negligible (done once at module load)
- **Memory overhead**: ~40 bytes per enum value

## Type Safety

### Completeness Checks

The `satisfies` operator ensures metadata covers all enum values:

```typescript
export const METADATA = {
  value1: { label: '...', description: '...' },
  value2: { label: '...', description: '...' },
  // TypeScript error if any value is missing!
} as const satisfies Record<EnumType, MetadataType>;
```

### Destructuring Safety

All helpers are closure-based (no `this` usage) for safe destructuring:

```typescript
const { isValid, assert, getLabel } = docStatusKit;

// All work without context
isValid('draft');     // ✅ Works
assert('draft');      // ✅ Works
getLabel('draft');    // ✅ Works
```

## UI Integration

### Semantic Tones

Use `tone` for framework-agnostic theming:

```typescript
const meta = getDocStatusMeta(status);

// Map to your UI framework
const colorMap = {
  neutral: 'gray',
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
};

const color = colorMap[meta.tone ?? 'neutral'];
```

### Dropdown Options

Generate dropdown options from metadata:

```typescript
import { docStatusKit } from '@afena/canon';

const options = docStatusKit.getSorted().map(value => ({
  value,
  label: docStatusKit.getLabel(value),
  description: docStatusKit.getMeta(value).description,
}));
```

### Status Badges

```typescript
function StatusBadge({ status }: { status: DocStatus }) {
  const meta = getDocStatusMeta(status);
  
  return (
    <Badge tone={meta.tone}>
      {meta.label}
    </Badge>
  );
}
```

## Testing

### Table-Driven Tests

All enums are tested with a single table-driven test suite:

```typescript
// See __tests__/enum-kit.test.ts
const enumDescriptors = [
  { name: 'DocStatus', kit: docStatusKit, invalidSamples: [...] },
  { name: 'PaymentStatus', kit: paymentStatusKit, invalidSamples: [...] },
  // ... all 24 enums
];

// One test suite validates all enums
describe('Enum Kit - Standard Behavior', () => {
  enumDescriptors.forEach(({ name, kit, invalidSamples }) => {
    describe(name, () => {
      it('isValid returns true for all declared values', () => { ... });
      it('metadata covers all values', () => { ... });
      // ... standard tests
    });
  });
});
```

### Semantic Tests

Enums with subsets have additional semantic tests:

```typescript
// See __tests__/doc-status.semantic.test.ts
describe('DocStatus - Semantic Helpers', () => {
  it('terminal subset matches metadata.terminal flag', () => {
    TERMINAL_DOC_STATUSES.values.forEach(status => {
      expect(DOC_STATUS_METADATA[status].terminal).toBe(true);
    });
  });
});
```

## Migration Guide

### From Old Pattern

```typescript
// OLD: Manual duplication
export const DOC_STATUSES = ['draft', 'active'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
export const docStatusSchema = z.enum(DOC_STATUSES);

// Manual labels (drift risk!)
export const DOC_STATUS_LABELS = {
  draft: 'Draft',
  active: 'Active',
};

// Manual validation (O(n))
export function isValidDocStatus(value: unknown): value is DocStatus {
  return typeof value === 'string' && DOC_STATUSES.includes(value as DocStatus);
}
```

```typescript
// NEW: SSOT with enum-kit
export const DOC_STATUSES = ['draft', 'active'] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];
export const docStatusSchema = z.enum(DOC_STATUSES);

// Metadata is SSOT (labels derived)
export const DOC_STATUS_METADATA = {
  draft: { label: 'Draft', description: '...', tone: 'neutral' },
  active: { label: 'Active', description: '...', tone: 'success' },
} as const satisfies Record<DocStatus, BaseEnumMetadata>;

// Kit provides all helpers (O(1))
export const docStatusKit = createEnumKit(DOC_STATUSES, docStatusSchema, DOC_STATUS_METADATA);
export const { isValid: isValidDocStatus, labels: DOC_STATUS_LABELS } = docStatusKit;
```

## Benefits

### Zero Drift

- ✅ Labels derived from metadata (one place to update)
- ✅ Type-safe completeness checks prevent missing values
- ✅ Shared utilities eliminate copy/paste errors

### Performance

- ✅ O(1) validation via Set (vs O(n) with `.includes()`)
- ✅ Labels computed once (not per call)
- ✅ Subsets precomputed for fast membership checks

### Developer Experience

- ✅ IntelliSense shows rich documentation
- ✅ Type guards enable safe runtime validation
- ✅ Consistent API across all 24 enums
- ✅ Destructuring-safe helpers

### Maintainability

- ✅ Add new enum = add 1 line to test descriptor
- ✅ Consistent pattern = easy to understand
- ✅ Semantic tokens = no UI framework coupling
- ✅ Metadata extensions = flexible without breaking base

## Architecture Decisions

### Why Metadata-First?

**Problem:** Maintaining labels separately from metadata causes drift.

```typescript
// ❌ Drift risk - labels and metadata maintained separately
const LABELS = { draft: 'Draft' };
const METADATA = { draft: { label: 'Draft Document' } }; // Different!
```

**Solution:** Derive labels from metadata (SSOT).

```typescript
// ✅ Zero drift - labels derived from metadata
const METADATA = { draft: { label: 'Draft', description: '...' } };
const LABELS = Object.fromEntries(
  Object.entries(METADATA).map(([k, v]) => [k, v.label])
);
```

### Why Set-Based Validation?

**Performance:** O(1) vs O(n) for large enums.

```typescript
// Benchmark: 10,000 validations
// .includes(): ~15ms (O(n))
// Set.has():   ~2ms  (O(1))
```

### Why No `this` Usage?

**Destructuring Safety:** Avoid binding issues.

```typescript
// ❌ Breaks when destructured
const kit = {
  values: [...],
  isValid(v) { return this.values.includes(v); } // 'this' breaks
};
const { isValid } = kit;
isValid('draft'); // ❌ Error: Cannot read 'values' of undefined

// ✅ Works when destructured
const values = [...];
const kit = {
  values,
  isValid: (v) => values.includes(v), // Closure, no 'this'
};
const { isValid } = kit;
isValid('draft'); // ✅ Works
```

## Related Documentation

- [Canon Package README](../../README.md) - Package overview
- [Types Documentation](../types/README.md) - Type definitions
- [Schemas Documentation](../schemas/README.md) - Zod schemas

## Contributing

When adding new enums:

1. Follow the SSOT pattern (use `createEnumKit`)
2. Add metadata with `satisfies` constraint
3. Export standard helpers via destructuring
4. Add to barrel exports in `index.ts`
5. Add to test descriptor in `__tests__/enum-kit.test.ts`
6. Add semantic tests if enum has subsets
7. Update this README with the new enum

## License

Part of the Afena Canon package. See root LICENSE file.
