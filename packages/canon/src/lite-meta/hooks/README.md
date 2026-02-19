# Instrumentation Hooks

Lightweight callback-based instrumentation system for LiteMeta with **zero overhead when disabled**.

## Features

- **Zero Overhead**: No performance impact when hooks are not set
- **Type-Safe**: Full TypeScript support with typed contexts
- **Error-Safe**: All hooks swallow errors to prevent breaking application
- **Flexible**: Support for function calls, errors, and cache operations
- **Decorators**: `@Instrumented()` decorator and `withInstrumentation()` wrapper

## Quick Start

```typescript
import { setInstrumentationHooks } from 'afena-canon/lite-meta';

// Enable instrumentation
setInstrumentationHooks({
  onCallStart: (ctx) => console.log(`Starting ${ctx.functionName}`),
  onCallEnd: (ctx) => console.log(`Finished ${ctx.functionName} in ${ctx.duration}ms`),
  onCacheHit: (ctx) => console.log(`Cache hit: ${ctx.cacheName}[${ctx.key}]`),
});

// Your code automatically emits events
parseAssetKey('db.rec.mydb.public.users'); // Emits call start/end + cache events
```

## Available Hooks

### Function Call Hooks

**`onCallStart(context: CallContext)`**
- Called when a function starts execution
- Context includes: `functionName`, `args`, `startTime`, `metadata`

**`onCallEnd(context: CallEndContext)`**
- Called when a function completes (success or failure)
- Context includes: `functionName`, `duration`, `success`, `result`/`error`

**`onError(context: ErrorContext)`**
- Called when an error occurs
- Context includes: `error`, `functionName`, `args`, `timestamp`

### Cache Operation Hooks

**`onCacheHit(context: CacheContext)`**
- Called on cache hit
- Context includes: `operation: 'hit'`, `key`, `cacheName`

**`onCacheMiss(context: CacheContext)`**
- Called on cache miss
- Context includes: `operation: 'miss'`, `key`, `cacheName`, optional `metadata.reason`

**`onCacheSet(context: CacheContext)`**
- Called when value is set in cache
- Context includes: `operation: 'set'`, `key`, `cacheName`, optional `metadata.size`

**`onCacheEvict(context: CacheContext)`**
- Called when value is evicted from cache
- Context includes: `operation: 'evict'`, `key`, `cacheName`

**`onCacheClear(context: CacheContext)`**
- Called when cache is cleared
- Context includes: `operation: 'clear'`, `cacheName`

## Usage Examples

### Basic Logging

```typescript
import { setInstrumentationHooks } from 'afena-canon/lite-meta';

setInstrumentationHooks({
  onCallEnd: (ctx) => {
    if (!ctx.success) {
      console.error(`Failed: ${ctx.functionName}`, ctx.error);
    }
  },
  onError: (ctx) => {
    console.error(`Error in ${ctx.functionName}:`, ctx.error.message);
  },
});
```

### Performance Monitoring

```typescript
setInstrumentationHooks({
  onCallEnd: (ctx) => {
    if (ctx.duration > 100) {
      console.warn(`Slow call: ${ctx.functionName} took ${ctx.duration}ms`);
    }
  },
});
```

### Cache Monitoring

```typescript
let cacheHits = 0;
let cacheMisses = 0;

setInstrumentationHooks({
  onCacheHit: () => cacheHits++,
  onCacheMiss: () => cacheMisses++,
});

// Later: check hit rate
const hitRate = cacheHits / (cacheHits + cacheMisses);
console.log(`Cache hit rate: ${(hitRate * 100).toFixed(2)}%`);
```

### Function Wrapper

```typescript
import { withInstrumentation } from 'afena-canon/lite-meta';

const myFunction = (x: number, y: number) => x + y;

// Wrap with instrumentation
const instrumented = withInstrumentation('myFunction', myFunction);

// Now emits events when called
const result = instrumented(2, 3);
```

### Decorator (Experimental)

```typescript
import { Instrumented } from 'afena-canon/lite-meta';

class Calculator {
  @Instrumented('multiply')
  multiply(x: number, y: number): number {
    return x * y;
  }
}

// Method calls now emit instrumentation events
const calc = new Calculator();
calc.multiply(3, 4); // Emits onCallStart and onCallEnd
```

## Integration with Adapters

For production use, integrate with logging/metrics libraries using adapters:

```typescript
import { createPinoAdapter } from 'afena-canon/lite-meta/adapters/pino-adapter';
import { createOtelAdapter } from 'afena-canon/lite-meta/adapters/otel-adapter';
import pino from 'pino';
import { trace, metrics } from '@opentelemetry/api';

// Option 1: Pino Logger
const logger = pino();
setInstrumentationHooks(createPinoAdapter(logger, {
  callEndLevel: 'debug',
  slowCallThreshold: 100, // Only log calls >100ms
}));

// Option 2: OpenTelemetry
const tracer = trace.getTracer('lite-meta');
const meter = metrics.getMeter('lite-meta');
setInstrumentationHooks(createOtelAdapter({ tracer, meter }));
```

See [adapters/README.md](../adapters/README.md) for more details.

## API Reference

### Hook Management

**`setInstrumentationHooks(hooks: InstrumentationHooks | null)`**
- Set global instrumentation hooks
- Pass `null` to disable instrumentation

**`getInstrumentationHooks(): InstrumentationHooks | null`**
- Get current instrumentation hooks

**`clearInstrumentationHooks()`**
- Clear all instrumentation hooks (same as `setInstrumentationHooks(null)`)

**`isInstrumentationEnabled(): boolean`**
- Check if instrumentation is currently enabled

### Context Types

**`CallContext`**
```typescript
interface CallContext {
  functionName: string;
  args: unknown[];
  startTime: number;
  metadata?: Record<string, unknown>;
}
```

**`CallEndContext`**
```typescript
interface CallEndContext extends CallContext {
  duration: number;
  success: boolean;
  result?: unknown;
  error?: Error;
}
```

**`ErrorContext`**
```typescript
interface ErrorContext {
  error: Error;
  functionName: string;
  args: unknown[];
  timestamp: number;
  metadata?: Record<string, unknown>;
}
```

**`CacheContext`**
```typescript
interface CacheContext {
  operation: 'hit' | 'miss' | 'set' | 'evict' | 'clear';
  key: string;
  cacheName: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}
```

## Performance

### Zero Overhead When Disabled

When hooks are not set, instrumentation has **near-zero overhead**:

```typescript
// Baseline: No hooks
for (let i = 0; i < 10000; i++) {
  parseAssetKey('db.rec.test.public.users');
}
// Duration: ~50ms

// With hooks disabled (same performance)
clearInstrumentationHooks();
for (let i = 0; i < 10000; i++) {
  parseAssetKey('db.rec.test.public.users');
}
// Duration: ~50ms (no overhead)

// With hooks enabled
setInstrumentationHooks({ onCallStart: () => {} });
for (let i = 0; i < 10000; i++) {
  parseAssetKey('db.rec.test.public.users');
}
// Duration: ~55ms (minimal overhead)
```

### Best Practices

1. **Use Adapters**: Use pre-built adapters (Pino, OTel) instead of custom hooks
2. **Filter Events**: Only log what you need (e.g., errors and slow calls)
3. **Avoid Heavy Operations**: Keep hook implementations lightweight
4. **Disable in Production**: Consider disabling detailed instrumentation in production

## Error Handling

All hooks **automatically swallow errors** to prevent breaking your application:

```typescript
setInstrumentationHooks({
  onCallStart: () => {
    throw new Error('Hook error'); // Swallowed - app continues
  },
});

// Your code still works
parseAssetKey('db.rec.test.public.users'); // No error thrown
```

## Testing

Instrumentation hooks are fully tested with 34 comprehensive tests covering:
- Hook management (enable/disable/clear)
- All event types (call start/end, errors, cache operations)
- Error handling (swallowing hook errors)
- Zero overhead verification
- Function wrappers and decorators

See `__tests__/instrumentation.test.ts` for examples.

## See Also

- [Adapters README](../adapters/README.md) - Pre-built integrations
- [Phase 2 Documentation](../PHASE_2_COMPLETE.md) - Complete observability guide
- [Cache Module](../cache/README.md) - Enhanced LRU cache with hooks
