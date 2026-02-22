# Optional Adapters

Tree-shakeable adapters for integrating LiteMeta with external services. Only included in your bundle if imported.

## Available Adapters

- **Pino** - Logger integration
- **OpenTelemetry** - Distributed tracing and metrics
- **Redis** - Distributed cache (L2)

## Pino Adapter

Integrate LiteMeta instrumentation with Pino logger.

### Installation

```bash
pnpm add pino
```

### Basic Usage

```typescript
import pino from 'pino';
import { setInstrumentationHooks } from 'afena-canon/lite-meta';
import { createPinoAdapter } from 'afena-canon/lite-meta/adapters/pino-adapter';

const logger = pino();
const hooks = createPinoAdapter(logger);
setInstrumentationHooks(hooks);

// All LiteMeta operations now log to Pino
parseAssetKey('db.rec.mydb.public.users');
```

### Configuration Options

```typescript
const hooks = createPinoAdapter(logger, {
  // Log levels for different event types
  callStartLevel: 'trace',  // 'trace' | 'debug' | 'info'
  callEndLevel: 'debug',    // 'trace' | 'debug' | 'info'
  errorLevel: 'error',      // 'error' | 'warn'
  cacheLevel: 'trace',      // 'trace' | 'debug'

  // Security: Log function arguments/results
  logArgs: false,           // WARNING: May log sensitive data
  logResults: false,        // WARNING: May log sensitive data

  // Performance: Only log slow calls
  slowCallThreshold: 100,   // Only log calls >100ms (undefined = log all)
});
```

### Minimal Adapter (Production)

For production, use the minimal adapter that only logs errors and slow calls:

```typescript
import { createMinimalPinoAdapter } from 'afena-canon/lite-meta/adapters/pino-adapter';

const hooks = createMinimalPinoAdapter(logger, 100); // Only log calls >100ms or errors
setInstrumentationHooks(hooks);
```

### Example Output

```json
{
  "level": 30,
  "time": 1708300800000,
  "function": "parseAssetKey",
  "duration": 2.5,
  "success": true,
  "msg": "Call completed: parseAssetKey (2.50ms)"
}
```

## OpenTelemetry Adapter

Integrate LiteMeta with OpenTelemetry for distributed tracing and metrics.

### Installation

```bash
pnpm add @opentelemetry/api @opentelemetry/sdk-node
```

### Basic Usage

```typescript
import { trace, metrics } from '@opentelemetry/api';
import { setInstrumentationHooks } from 'afena-canon/lite-meta';
import { createOtelAdapter } from 'afena-canon/lite-meta/adapters/otel-adapter';

const tracer = trace.getTracer('lite-meta');
const meter = metrics.getMeter('lite-meta');

const hooks = createOtelAdapter({ tracer, meter });
setInstrumentationHooks(hooks);

// All LiteMeta operations now emit spans and metrics
parseAssetKey('db.rec.mydb.public.users');
```

### Configuration Options

```typescript
const hooks = createOtelAdapter({
  tracer,                    // OpenTelemetry tracer (optional)
  meter,                     // OpenTelemetry meter (optional)
  enableTracing: true,       // Enable distributed tracing
  enableMetrics: true,       // Enable metrics collection
  serviceName: 'lite-meta',  // Service name for span attributes
});
```

### Metrics-Only Adapter

For scenarios where you only want metrics without tracing overhead:

```typescript
import { createMetricsOnlyOtelAdapter } from 'afena-canon/lite-meta/adapters/otel-adapter';

const hooks = createMetricsOnlyOtelAdapter(meter);
setInstrumentationHooks(hooks);
```

### Tracing-Only Adapter

For scenarios where you only want distributed tracing:

```typescript
import { createTracingOnlyOtelAdapter } from 'afena-canon/lite-meta/adapters/otel-adapter';

const hooks = createTracingOnlyOtelAdapter(tracer);
setInstrumentationHooks(hooks);
```

### Metrics Collected

- **`lite_meta.call.duration`** (histogram) - Function call duration in milliseconds
- **`lite_meta.call.count`** (counter) - Number of function calls
- **`lite_meta.cache.operations`** (counter) - Cache operations (hit/miss/set/evict/clear)

### Span Attributes

- `service.name` - Service name (default: 'lite-meta')
- `function.name` - Function being called
- `function.duration` - Call duration in milliseconds
- `function.success` - Whether call succeeded

## Redis Adapter

Implement distributed cache (L2) using Redis or Valkey.

### Installation

```bash
pnpm add ioredis
```

### Basic Usage

```typescript
import { Redis } from 'ioredis';
import { TieredCache, assetKeyCache } from 'afena-canon/lite-meta';
import { createRedisAdapter } from 'afena-canon/lite-meta/adapters/redis-adapter';

const redis = new Redis();
const redisCache = createRedisAdapter(redis, {
  prefix: 'litemeta:',
  defaultTtlSeconds: 3600,
});

// Use with TieredCache for L1 (memory) + L2 (Redis)
const tiered = new TieredCache(assetKeyCache, redisCache);

// Now cache operations use both L1 and L2
await tiered.get('key');  // Checks L1, then L2
await tiered.set('key', 'value');  // Writes to both L1 and L2
```

### Configuration Options

```typescript
const redisCache = createRedisAdapter(redis, {
  prefix: 'litemeta:',              // Key prefix for namespacing
  defaultTtlSeconds: 3600,          // Default TTL (undefined = no expiration)
  serialize: JSON.stringify,        // Custom serializer
  deserialize: JSON.parse,          // Custom deserializer
  throwOnError: false,              // Fail-open by default (swallow errors)
});
```

### Safe Redis Adapter

For shared Redis instances, use the safe adapter that only clears keys with the specified prefix:

```typescript
import { createSafeRedisAdapter } from 'afena-canon/lite-meta/adapters/redis-adapter';

const redisCache = createSafeRedisAdapter(redis, {
  prefix: 'litemeta:',
});

// clear() only removes keys matching 'litemeta:*'
await redisCache.clear();
```

### Compressed Redis Adapter

For large values, use compression to reduce Redis memory usage:

```typescript
import { createCompressedRedisAdapter } from 'afena-canon/lite-meta/adapters/redis-adapter';
import { gzipSync, gunzipSync } from 'zlib';

const redisCache = createCompressedRedisAdapter(
  redis,
  (data) => gzipSync(data),      // Compress function
  (data) => gunzipSync(data).toString(),  // Decompress function
  { prefix: 'litemeta:' }
);
```

### TieredCache Pattern

The recommended pattern is L1 (memory) + L2 (Redis):

```typescript
import { TieredCache, assetKeyCache, typeDerivationCache } from 'afena-canon/lite-meta';
import { createRedisAdapter } from 'afena-canon/lite-meta/adapters/redis-adapter';

const redis = new Redis();
const redisCache = createRedisAdapter(redis, { prefix: 'litemeta:' });

// Create tiered caches
const tieredAssetKeyCache = new TieredCache(assetKeyCache, redisCache);
const tieredTypeCache = new TieredCache(typeDerivationCache, redisCache);

// Use tiered caches in your application
// Reads: Check L1 first, then L2, populate L1 on L2 hit
// Writes: Write to both L1 and L2 (write-through)
```

## Adapter Comparison

| Feature | Pino | OpenTelemetry | Redis |
|---------|------|---------------|-------|
| **Purpose** | Logging | Tracing + Metrics | Distributed Cache |
| **Overhead** | Low | Medium | Low |
| **Production Ready** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Tree-Shakeable** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Zero Dependencies** | ❌ No (pino) | ❌ No (@opentelemetry/api) | ❌ No (ioredis) |

## Multiple Adapters

You can combine multiple adapters by merging their hooks:

```typescript
import { setInstrumentationHooks } from 'afena-canon/lite-meta';
import { createPinoAdapter } from 'afena-canon/lite-meta/adapters/pino-adapter';
import { createOtelAdapter } from 'afena-canon/lite-meta/adapters/otel-adapter';

const pinoHooks = createMinimalPinoAdapter(logger, 100);
const otelHooks = createMetricsOnlyOtelAdapter(meter);

// Combine hooks
setInstrumentationHooks({
  ...pinoHooks,
  ...otelHooks,
});

// Now both Pino and OTel receive events
```

## Custom Adapters

Create your own adapter by implementing the `InstrumentationHooks` interface:

```typescript
import type { InstrumentationHooks } from 'afena-canon/lite-meta';

const customHooks: InstrumentationHooks = {
  onCallEnd: (ctx) => {
    // Send to your custom monitoring service
    fetch('https://api.example.com/metrics', {
      method: 'POST',
      body: JSON.stringify({
        function: ctx.functionName,
        duration: ctx.duration,
        success: ctx.success,
      }),
    });
  },
};

setInstrumentationHooks(customHooks);
```

## Performance Considerations

1. **Pino**: Minimal overhead (~5-10% with default config)
2. **OpenTelemetry**: Medium overhead (~10-20% with tracing enabled)
3. **Redis**: Minimal overhead (async operations, fail-open)

### Best Practices

- Use minimal adapters in production (errors + slow calls only)
- Disable detailed tracing in high-throughput scenarios
- Use Redis for distributed caching across multiple instances
- Monitor adapter performance with the adapters themselves

## Error Handling

All adapters are designed to **fail-open**:

- Pino: Errors in logging don't break application
- OpenTelemetry: Errors in span creation don't break application
- Redis: Connection errors don't break application (cache misses)

## Testing

Adapters can be tested by mocking the underlying services:

```typescript
import { vi } from 'vitest';
import { createPinoAdapter } from 'afena-canon/lite-meta/adapters/pino-adapter';

const mockLogger = {
  trace: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

const hooks = createPinoAdapter(mockLogger);
setInstrumentationHooks(hooks);

// Test that logging works
parseAssetKey('db.rec.test.public.users');
expect(mockLogger.debug).toHaveBeenCalled();
```

## See Also

- [Hooks README](../hooks/README.md) - Instrumentation system
- [Phase 2 Documentation](../PHASE_2_COMPLETE.md) - Complete observability guide
- [Cache Module](../cache/README.md) - Enhanced LRU cache
