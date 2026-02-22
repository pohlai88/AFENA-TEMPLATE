# ADR-003: TypeScript Strict Mode

**Status**: Accepted  
**Date**: 2025-11-15  
**Deciders**: Engineering Team  
**Technical Story**: TypeScript configuration and type safety standards

## Context

We needed to decide on TypeScript configuration that balances:

- Type safety and bug prevention
- Developer productivity
- Code maintainability
- Learning curve for new team members

TypeScript offers a spectrum from permissive to strict:

- **Permissive**: `allowJs`, minimal type checking
- **Standard**: `strict: true` preset
- **Strictest**: `strict: true` + additional strict flags

## Decision

We will use the **strictest possible TypeScript configuration** across all packages.

### Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

### Key Flags Enabled

1. **`noUncheckedIndexedAccess`**: Arrays and objects return `T | undefined`
2. **`exactOptionalPropertyTypes`**: `{ prop?: string }` cannot accept `undefined`
3. **`noPropertyAccessFromIndexSignature`**: Forces bracket notation for index signatures

## Consequences

### Positive

✅ **Catch bugs at compile time**: Prevents runtime errors like "Cannot read property of undefined"  
✅ **Better refactoring**: Type errors immediately highlighted when changing code  
✅ **Self-documenting code**: Type signatures serve as inline documentation  
✅ **IDE support**: Excellent autocomplete and inline error detection  
✅ **Reduced testing burden**: Type system catches entire classes of bugs

### Negative

⚠️ **More verbose code**: Requires explicit type annotations and null checks  
⚠️ **Learning curve**: Team needs to learn strict TypeScript patterns  
⚠️ **Initial migration pain**: Existing code required significant changes  
⚠️ **Slower initial development**: More time spent satisfying type checker

### Neutral

ℹ️ **Long-term productivity**: Slower at first, faster over time due to fewer bugs  
ℹ️ **Incremental adoption**: Can use `// @ts-expect-error` with comments for exceptions

## Code Examples

### Array Access (noUncheckedIndexedAccess)

```typescript
// ❌ Without flag - potential runtime error
const users = ['Alice', 'Bob'];
const firstUser = users[0]; // Type: string
console.log(firstUser.toUpperCase()); // May crash if empty array

// ✅ With flag - safe
const users = ['Alice', 'Bob'];
const firstUser = users[0]; // Type: string | undefined
if (firstUser) {
  console.log(firstUser.toUpperCase()); // Safe!
}
```

### Optional Properties (exactOptionalPropertyTypes)

```typescript
interface User {
  name: string;
  email?: string; // Optional
}

// ❌ Without flag - allows undefined
const user: User = { name: 'Alice', email: undefined }; // Allowed

// ✅ With flag - forces omission
const user: User = { name: 'Alice' }; // email must be omitted, not undefined
```

### Index Signatures (noPropertyAccessFromIndexSignature)

```typescript
interface Data {
  [key: string]: number;
}

const data: Data = { count: 42 };

// ❌ Without flag - allows dot notation
const count = data.count; // Allowed but unsafe

// ✅ With flag - forces bracket notation
const count = data['count']; // Required, more explicit
```

## Migration Strategy

1. **Enable gradually**: Start with `strict: true`, add flags incrementally
2. **Fix package by package**: Migrate one package at a time
3. **Use `// @ts-expect-error`**: Temporarily suppress errors with explanation
4. **Update patterns**: Adopt null-safe patterns (optional chaining, nullish coalescing)

## Best Practices

### Null Safety

```typescript
// Use optional chaining
user?.profile?.email;

// Use nullish coalescing
const name = user.name ?? 'Anonymous';

// Type guards
if (user !== null && user !== undefined) {
  console.log(user.name);
}
```

### Array Access

```typescript
// Always check array bounds
const firstItem = array[0];
if (firstItem !== undefined) {
  processItem(firstItem);
}

// Or use array methods
array.forEach((item) => processItem(item)); // Safe
```

### Object Properties

```typescript
// Use bracket notation for dynamic keys
const value = obj[dynamicKey]; // Type: T | undefined

// Use type guards
if (key in obj) {
  const value = obj[key]; // Type narrowed
}
```

## Alternatives Considered

### Standard Strict Mode (strict: true only)

- ✅ Simpler, less verbose
- ❌ Doesn't catch index access errors
- ❌ Allows `undefined` in optional properties
- **Rejected**: Leaves too many potential bugs

### Permissive Configuration

- ✅ Fastest development
- ❌ Minimal type safety
- ❌ Runtime errors in production
- **Rejected**: Defeats purpose of TypeScript

### Gradual Typing (allowJs)

- ✅ Easy migration path
- ❌ Mixed type safety across codebase
- ❌ Confusing for team
- **Rejected**: We're starting from scratch, no need for gradual migration

## References

- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [noUncheckedIndexedAccess Discussion](https://github.com/microsoft/TypeScript/pull/39560)
