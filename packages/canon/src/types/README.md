# Canon Types

**The single source of truth for all TypeScript types, branded IDs, and capability definitions in the Afena system.**

## Overview

Canon types provides the foundational type system for the entire Afena monorepo. It follows the principle of being **deterministic metadata, not a framework** — pure types and functions with zero runtime dependencies beyond Zod.

### Architecture Position

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon ← YOU ARE HERE, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

## Core Modules

### 1. Branded IDs (`ids.ts`)

Type-safe UUID identifiers that prevent accidental mixing at compile time.

```typescript
import { asEntityId, tryAsEntityId, isEntityId } from 'afenda-canon';

// Strict branding (throws CanonValidationError)
const entityId = asEntityId('123e4567-e89b-12d3-a456-426614174000');

// Safe branding (returns undefined on invalid)
const maybeId = tryAsEntityId(userInput);

// Type guard
if (isEntityId(value)) {
  // value is EntityId
}
```

**Available Types:**
- `EntityId` - Generic entity identifier
- `OrgId` - Organization identifier
- `UserId` - User identifier
- `BatchId` - Mutation batch identifier
- `MutationId` - Mutation identifier
- `AuditLogId` - Audit log identifier

**Functions for each type:**
- `asX(value)` - Strict branding, throws on invalid
- `tryAsX(value)` - Safe branding, returns `undefined` on invalid
- `isX(value)` - Type guard

### 2. Result Types (`result.ts`)

Railway-oriented programming pattern for explicit error handling.

```typescript
import { ok, err, errSingle, type CanonResult } from 'afenda-canon';

function parseConfig(input: string): CanonResult<Config> {
  try {
    const config = JSON.parse(input);
    return ok(config);
  } catch (error) {
    return errSingle('INVALID_FORMAT', 'Invalid JSON');
  }
}

const result = parseConfig(data);
if (result.ok) {
  console.log(result.value); // Type: Config
} else {
  console.error(result.issues); // Type: CanonIssue[]
}
```

**Issue Codes (14 well-known):**
```typescript
CANON_ISSUE_CODES = [
  'REQUIRED', 'INVALID_TYPE', 'INVALID_ENUM', 'INVALID_UUID',
  'INVALID_FORMAT', 'TOO_SHORT', 'TOO_LONG', 'OUT_OF_RANGE',
  'INVALID_EMAIL', 'INVALID_URL', 'INVALID_PHONE',
  'DUPLICATE', 'NOT_FOUND', 'CONFLICT'
]
```

Custom codes are allowed but should follow `UPPER_SNAKE_CASE`.

### 3. Capability System (`capability/`)

Modular capability definition system split into focused modules:

```
capability/
├── kinds.ts          - CapabilityKind enum (mutation, read, search, etc.)
├── domains.ts        - Business domains and namespaces
├── verbs.ts          - Governed verb sets per kind
├── parser.ts         - Key parsing and validation
├── rbac.ts           - RBAC tier and scope derivation
├── vis-policy.ts     - Visibility enforcement policy
└── catalog.ts        - Complete capability catalog (tree-shakeable)
```

**Usage:**

```typescript
import {
  parseCapabilityKey,
  validateCapabilityKey,
  inferKindFromVerb,
  CAPABILITY_CATALOG,
} from 'afenda-canon';

// Parse capability key
const parsed = parseCapabilityKey('contacts.create');
// { shape: 'domain', ns: null, domain: 'contacts', verb: 'create' }

// Validate (throws on invalid)
const validated = validateCapabilityKey('contacts.create');

// Infer kind from verb
const kind = inferKindFromVerb('create'); // 'mutation'

// Access catalog
const descriptor = CAPABILITY_CATALOG['contacts.create'];
console.log(descriptor.rbacTier); // 'editor'
console.log(descriptor.rbacScope); // 'write'
```

**Key Formats:**
- `domain.verb` - e.g., `contacts.create`
- `namespace.verb` - e.g., `auth.sign_in`
- `namespace.domain.verb` - e.g., `admin.custom_fields.define`

### 4. Error Types (`errors.ts`)

Structured error classes for Canon validation and parsing.

```typescript
import { CanonValidationError, CanonParseError } from 'afenda-canon';

throw new CanonValidationError(
  'Invalid UUID format',
  'INVALID_UUID',
  'entityId',
  { expected: 'RFC 4122 UUID', received: value }
);
```

## Stability Contracts

### API Stability

All exported types and functions are **API-stable**. Breaking changes will be:
1. Announced in advance
2. Deprecated with migration path
3. Only removed in major versions

### Deterministic Output

All functions returning arrays/maps have **stable ordering**:
- `CAPABILITY_KINDS` - Always same order
- `RBAC_TIERS` - Hierarchical order (public → system)
- `CAPABILITY_CATALOG` - Deterministic iteration
- No environment dependencies (no `Date.now()`, `Math.random()`)

Verified by `deterministic-output.test.ts` (16 tests).

### Issue Code Stability

`CanonIssue.code` values are **API-stable**:
- Well-known codes never change meaning
- Custom codes allowed for forward compatibility
- `details` is always JSON-serializable `Record<string, unknown>`
- `path` is always readonly `(string | number)[]`

## Best Practices

### 1. Use Branded IDs at Boundaries

```typescript
// ✅ Good - Brand at API boundary
export async function getContact(id: string) {
  const entityId = asEntityId(id); // Validate early
  return db.query.contacts.findFirst({ where: eq(contacts.id, entityId) });
}

// ❌ Bad - String soup
export async function getContact(id: string) {
  return db.query.contacts.findFirst({ where: eq(contacts.id, id) });
}
```

### 2. Use Safe Variants for Optional Validation

```typescript
// ✅ Good - Use tryAs* for optional IDs
const maybeOrgId = tryAsOrgId(headers.get('x-org-id'));
if (maybeOrgId) {
  // Use orgId
}

// ❌ Bad - Try/catch for control flow
try {
  const orgId = asOrgId(headers.get('x-org-id'));
} catch {
  // Handle missing
}
```

### 3. Return CanonResult Instead of Throwing

```typescript
// ✅ Good - Explicit error handling
function validateInput(data: unknown): CanonResult<ValidData> {
  if (!data.email) {
    return errSingle('REQUIRED', 'Email is required', ['email']);
  }
  return ok(data as ValidData);
}

// ❌ Bad - Throwing for expected failures
function validateInput(data: unknown): ValidData {
  if (!data.email) {
    throw new Error('Email is required');
  }
  return data as ValidData;
}
```

### 4. Use Well-Known Issue Codes

```typescript
// ✅ Good - Use well-known codes
return errSingle('INVALID_EMAIL', 'Invalid email format', ['email']);

// ⚠️ Acceptable - Custom code (UPPER_SNAKE_CASE)
return errSingle('CUSTOM_BUSINESS_RULE', 'Custom validation failed');

// ❌ Bad - Arbitrary strings
return errSingle('invalid-email', 'Invalid email format');
```

## Testing

The types directory has **127 comprehensive tests** across 5 test suites:

- `ids.test.ts` (28 tests) - Branded ID validation
- `result.test.ts` (22 tests) - Result type behavior
- `api-surface.test.ts` (5 tests) - API stability guard
- `deterministic-output.test.ts` (16 tests) - Determinism verification
- `capability.test.ts` (56 tests) - Capability logic

Run tests:
```bash
pnpm test src/types/__tests__
```

## Migration from Monolithic capability.ts

The capability system was split into 7 focused modules for better maintainability. **All existing imports continue to work** via the façade re-export:

```typescript
// ✅ Still works (backward compatible)
import { CAPABILITY_CATALOG } from 'afenda-canon';

// ✅ Recommended (tree-shakeable)
import { CAPABILITY_CATALOG } from 'afenda-canon/types/capability/catalog';
```

The façade (`capability.ts`) will be removed in v2.0 with advance notice.

## Architecture Rules

### ✅ Allowed Dependencies
- External npm packages (zod)
- Node.js built-ins

### ❌ Forbidden Dependencies
- `afenda-database` (Layer 1, same layer)
- `afenda-workflow` (Layer 2, upper layer)
- `business-domain/*` (Layer 2, upper layer)
- `afenda-crud` (Layer 3, upper layer)

**Rule:** Canon is Layer 1 Foundation. It cannot depend on same or upper layers.

## Contributing

When adding new types:

1. **Add to appropriate module** - Don't create new top-level files
2. **Export from barrel** - Update `types/index.ts`
3. **Add tests** - Maintain 100% coverage for logic
4. **Update this README** - Document new APIs
5. **Run gates** - Ensure API surface and determinism tests pass

### Adding New Capability

```typescript
// 1. Add to catalog.ts
export const CAPABILITY_CATALOG = {
  // ... existing
  'new_domain.new_verb': {
    key: 'new_domain.new_verb',
    intent: 'Description of what this does',
    scope: 'org',
    status: 'active',
    entities: ['new_domain'],
    tags: ['category'],
  },
};

// 2. Add domain to domains.ts (if new)
export const CAPABILITY_DOMAINS = [
  // ... existing
  'new_domain',
] as const;

// 3. Add verb to verbs.ts (if new)
export const CAPABILITY_VERBS = {
  mutation: [
    // ... existing
    'new_verb',
  ],
  // ... other kinds
};

// 4. Tests will automatically validate the new capability
```

## License

Internal use only - Afena Enterprise System.

---

**Last Updated:** Feb 18, 2026  
**Maintainer:** Canon Team  
**Test Coverage:** 127/127 tests passing ✅
