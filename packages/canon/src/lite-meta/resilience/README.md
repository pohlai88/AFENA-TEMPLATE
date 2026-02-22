# Resilience Module

Enterprise-grade resilience features for LiteMeta with CPU budgets, typed errors, and safe wrappers.

## Features

- **CPU Budget Enforcement**: Hard limits on iterations, time, and memory
- **Typed Error Taxonomy**: Structured errors with context for better debugging
- **Safe Wrappers**: Result type pattern that never throws
- **100% Tested**: 101 comprehensive tests

## Quick Start

```typescript
import { parseAssetKeySafe, withBudget, DEFAULT_BUDGETS } from 'afena-canon/lite-meta';

// Safe wrapper - never throws
const result = parseAssetKeySafe('db.rec.test.public.users');
if (result.ok) {
  console.log(result.value.prefix); // 'db.rec'
} else {
  console.error(result.error.message);
}

// CPU budget enforcement
withBudget((tracker) => {
  for (const item of largeDataset) {
    tracker.check(); // Throws if budget exceeded
    processItem(item);
  }
}, DEFAULT_BUDGETS.normal);
```

## CPU Budget System

### Overview

Prevents runaway operations by enforcing hard limits on:
- **Iterations**: Maximum number of loop iterations
- **Time**: Maximum execution time in milliseconds
- **Memory**: Maximum memory usage in bytes (approximate)

### Basic Usage

```typescript
import { CpuBudgetTracker, withBudget } from 'afena-canon/lite-meta';

// Manual tracking
const tracker = new CpuBudgetTracker({
  maxIterations: 1000,
  maxTimeMs: 5000,
  operationName: 'processData',
});

for (const item of items) {
  tracker.check(); // Throws BudgetExceededError if limit exceeded
  processItem(item);
}

// Helper function
const result = withBudget((tracker) => {
  // Your operation here
  return processLargeDataset(data);
}, {
  maxIterations: 10000,
  maxTimeMs: 5000,
});
```

### Default Budgets

```typescript
import { DEFAULT_BUDGETS } from 'afena-canon/lite-meta';

// Fast operations (< 100ms)
DEFAULT_BUDGETS.fast = {
  maxIterations: 1000,
  maxTimeMs: 100,
  maxMemoryBytes: 10 * 1024 * 1024, // 10MB
};

// Normal operations (< 1s)
DEFAULT_BUDGETS.normal = {
  maxIterations: 10000,
  maxTimeMs: 1000,
  maxMemoryBytes: 50 * 1024 * 1024, // 50MB
};

// Slow operations (< 5s)
DEFAULT_BUDGETS.slow = {
  maxIterations: 50000,
  maxTimeMs: 5000,
  maxMemoryBytes: 100 * 1024 * 1024, // 100MB
};

// Batch operations (< 30s)
DEFAULT_BUDGETS.batch = {
  maxIterations: 100000,
  maxTimeMs: 30000,
  maxMemoryBytes: 500 * 1024 * 1024, // 500MB
};
```

### Statistics

```typescript
const tracker = new CpuBudgetTracker();

// ... perform operations ...

const stats = tracker.getStats();
console.log(stats);
// {
//   iterations: 150,
//   elapsedMs: 45.2,
//   memoryBytes: 1024000,
//   limits: {
//     maxIterations: 10000,
//     maxTimeMs: 5000,
//     maxMemoryBytes: 104857600
//   }
// }
```

## Typed Error Taxonomy

### Overview

Structured error types with context for better error handling and debugging.

### Available Error Types

```typescript
import {
  InvalidAssetKeyError,
  AssetTypeMismatchError,
  ClassificationError,
  BatchOperationError,
  CacheError,
  ValidationError,
  ConfigurationError,
} from 'afena-canon/lite-meta';

// Invalid asset key
throw new InvalidAssetKeyError('invalid.key', 'missing segments', {
  userId: '123',
});

// Asset type mismatch
throw new AssetTypeMismatchError('table', 'column', 'db.rec.test.public.users');

// Classification failed
throw new ClassificationError('email', 'pattern not found');

// Batch operation failed
throw new BatchOperationError('parse', 5, 100);

// Cache error
throw new CacheError('get', 'assetKeyCache', 'connection timeout');

// Validation error
throw new ValidationError('email', 'invalid@', 'invalid format');

// Configuration error
throw new ConfigurationError('maxSize', 'must be positive');
```

### Error Handling

```typescript
import { isLiteMetaError, isErrorType, getErrorContext } from 'afena-canon/lite-meta';

try {
  parseAssetKey(key);
} catch (error) {
  // Check if it's a LiteMeta error
  if (isLiteMetaError(error)) {
    console.log(error.code); // 'INVALID_ASSET_KEY'
    console.log(error.context); // { key, reason, ... }
  }

  // Check specific error type
  if (isErrorType(error, InvalidAssetKeyError)) {
    console.log('Invalid key:', error.context?.key);
  }

  // Get context safely
  const context = getErrorContext(error);
  console.log(context);
}
```

### Error Formatting

```typescript
import { formatError, getUserMessage } from 'afena-canon/lite-meta';

try {
  // ... operation ...
} catch (error) {
  // Detailed format for logging
  console.error(formatError(error));

  // User-friendly message
  res.status(400).json({ message: getUserMessage(error) });
}
```

## Safe Wrappers

### Overview

Provides `*Safe()` versions of core functions that:
- **Never throw** - return Result type instead
- **Enforce CPU budgets** - protect against malicious input
- **Provide structured errors** - typed error information

### Result Type

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

### parseAssetKeySafe

```typescript
import { parseAssetKeySafe } from 'afena-canon/lite-meta';

const result = parseAssetKeySafe('db.rec.test.public.users');

if (result.ok) {
  console.log(result.value.prefix); // 'db.rec'
  console.log(result.value.segments); // ['test', 'public', 'users']
} else {
  console.error(result.error.message);
}

// With custom budget
const result2 = parseAssetKeySafe('key', {
  maxIterations: 100,
  maxTimeMs: 50,
});
```

### classifyColumnsSafe

```typescript
import { classifyColumnsSafe } from 'afena-canon/lite-meta';

const result = classifyColumnsSafe([
  { name: 'email', sampleValues: ['user@example.com'] },
  { name: 'phone', sampleValues: ['555-1234'] },
]);

if (result.ok) {
  const emailClass = result.value.get('email');
  console.log(emailClass?.classification); // 'pii'
} else {
  console.error(result.error.message);
}
```

### Result Utilities

```typescript
import { unwrap, unwrapOr, mapResult, andThen } from 'afena-canon/lite-meta';

// Unwrap (throws if error)
const value = unwrap(result);

// Unwrap with default
const value = unwrapOr(result, 'default');

// Map result value
const mapped = mapResult(result, (parsed) => parsed.prefix);

// Chain operations
const chained = andThen(result, (parsed) => {
  if (parsed.valid) {
    return { ok: true, value: parsed.prefix };
  }
  return { ok: false, error: new Error('invalid') };
});
```

## Integration Examples

### API Endpoint with Safe Wrappers

```typescript
import { parseAssetKeySafe, unwrapOr } from 'afena-canon/lite-meta';

app.get('/api/assets/:key', (req, res) => {
  const result = parseAssetKeySafe(req.params.key);

  if (result.ok) {
    res.json({
      prefix: result.value.prefix,
      segments: result.value.segments,
      valid: result.value.valid,
    });
  } else {
    res.status(400).json({
      error: result.error.message,
      code: result.error.code,
    });
  }
});
```

### Batch Processing with CPU Budget

```typescript
import { withBudget, DEFAULT_BUDGETS } from 'afena-canon/lite-meta';

function processBatch(items: string[]) {
  return withBudget((tracker) => {
    const results = [];
    
    for (const item of items) {
      tracker.check(); // Enforce budget
      results.push(processItem(item));
    }
    
    return results;
  }, DEFAULT_BUDGETS.batch);
}
```

### Error Recovery Pattern

```typescript
import { parseAssetKeySafe, mapResult, unwrapOr } from 'afena-canon/lite-meta';

function getAssetPrefix(key: string): string {
  const result = parseAssetKeySafe(key);
  const prefix = mapResult(result, (parsed) => parsed.prefix);
  return unwrapOr(prefix, 'unknown');
}
```

## Performance

### CPU Budget Overhead

- **Disabled**: 0% overhead (no budget checks)
- **Enabled**: ~1-2% overhead per check
- **Recommendation**: Check every 100-1000 iterations for minimal impact

### Safe Wrapper Overhead

- **parseAssetKeySafe**: ~5% overhead vs parseAssetKey
- **classifyColumnsSafe**: ~5% overhead vs classifyColumns
- **Recommendation**: Use in API endpoints and user-facing code

## Best Practices

### 1. Use Appropriate Budgets

```typescript
// Fast operations (< 100ms)
parseAssetKeySafe(key, DEFAULT_BUDGETS.fast);

// Normal operations (< 1s)
classifyColumnsSafe(columns, DEFAULT_BUDGETS.normal);

// Batch operations (< 30s)
processBatch(items, DEFAULT_BUDGETS.batch);
```

### 2. Check Budget Strategically

```typescript
// ✅ Good: Check every N iterations
for (let i = 0; i < items.length; i++) {
  if (i % 100 === 0) tracker.check();
  processItem(items[i]);
}

// ❌ Bad: Check every iteration (high overhead)
for (const item of items) {
  tracker.check();
  processItem(item);
}
```

### 3. Use Safe Wrappers in APIs

```typescript
// ✅ Good: Safe wrapper in API endpoint
app.post('/api/parse', (req, res) => {
  const result = parseAssetKeySafe(req.body.key);
  // Handle result...
});

// ❌ Bad: Throwing in API endpoint
app.post('/api/parse', (req, res) => {
  try {
    const parsed = parseAssetKey(req.body.key);
    // ...
  } catch (error) {
    // Error handling...
  }
});
```

### 4. Provide Context in Errors

```typescript
// ✅ Good: Include context
throw new InvalidAssetKeyError(key, 'missing segments', {
  userId: req.user.id,
  timestamp: Date.now(),
  source: 'api',
});

// ❌ Bad: No context
throw new Error('Invalid key');
```

## Testing

The resilience module is fully tested with 101 comprehensive tests:
- CPU Budget: 33 tests
- Error Taxonomy: 33 tests
- Safe Wrappers: 35 tests

See `__tests__/` directory for examples.

## See Also

- [Phase 3 Documentation](../PHASE_3_COMPLETE.md) - Complete resilience guide
- [Hooks Module](../hooks/README.md) - Instrumentation system
- [Cache Module](../cache/README.md) - Enhanced LRU cache
