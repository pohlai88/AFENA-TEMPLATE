# afenda-observability

**Layer 3: Application** • **Role:** Telemetry & Monitoring

OpenTelemetry tracing, metrics, health checks, and Sentry integration for AFENDA-NEXUS.

---

## 📐 Architecture Role

**Layer 3** in the 4-layer architecture:

```
Layer 3: Application (crud, observability ← YOU ARE HERE)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config)
```

**Purpose:**
- Provides distributed tracing (OpenTelemetry)
- Records metrics and KPIs
- Monitors health and liveness
- Integrates error tracking (Sentry)

**Observes, Does Not Control:** This package instruments but does not modify business logic.

---

## ✅ What This Package Does

### 1. Distributed Tracing

```typescript
import { trace } from '@opentelemetry/api';
import { createSpan } from 'afenda-observability/tracing';

const tracer = trace.getTracer('my-service');

export async function processOrder(orderId: string) {
  return createSpan(tracer, 'process-order', async (span) => {
    span.setAttribute('order.id', orderId);
    const result = await database.processOrder(orderId);
    span.setAttribute('order.status', result.status);
    return result;
  });
}
```

### 2. Metrics & KPIs

```typescript
import { incrementCounter, recordMetric } from 'afenda-observability/metrics';

// Counter
incrementCounter('orders.processed', { status: 'success' });

// Histogram
recordMetric('order.processing.duration', 1250, { region: 'us-east-1' });

// Gauge
recordMetric('queue.size', 42, { queue: 'orders' });
```

### 3. Health Checks

```typescript
import { createHealthCheck } from 'afenda-observability/health';

export const healthCheck = createHealthCheck({
  name: 'afenda-web',
  checks: {
    database: async () => {
      const isHealthy = await db.ping();
      return { healthy: isHealthy };
    },
    cache: async () => {
      const isHealthy = await redis.ping();
      return { healthy: isHealthy };
    },
  },
});

// API route
export async function GET() {
  const health = await healthCheck.check();
  return Response.json(health, { status: health.healthy ? 200 : 503 });
}
```

### 4. Error Tracking (Sentry)

```typescript
import { initializeSentry } from 'afenda-observability';

initializeSentry({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Import from crud | Instrument crud externally |
| Implement business logic | Only instrument/observe |
| Modify data | Read-only observation |
| Import from business domains | Instrument domains externally |

---

## 📦 What This Package Exports

### Tracing

- `initializeTracing(config)` — Initialize OpenTelemetry SDK
- `createSpan(tracer, name, fn)` — Create and auto-close span
- `getCurrentSpan()` — Get active span from context
- `addSpanAttribute(key, value)` — Add attribute to current span
- `withTracing(name, fn)` — Higher-order function to wrap with tracing

### Metrics

- `incrementCounter(name, labels)` — Increment counter metric
- `recordMetric(name, value, labels)` — Record histogram/gauge
- `createMeter(name)` — Create custom meter

### Health

- `createHealthCheck(config)` — Create health check instance
- `registerHealthCheck(name, fn)` — Register custom check

### Sentry

- `initializeSentry(config)` — Initialize Sentry SDK
- `captureException(error, context)` — Manually capture exceptions
- `captureMessage(message, level)` — Capture messages

---

## 📖 Usage Examples

### Initialize OpenTelemetry

```typescript
// instrumentation.ts
import { initializeTracing } from 'afenda-observability/tracing';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await initializeTracing({
      serviceName: 'afenda-web',
      serviceVersion: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    });
  }
}
```

### Trace API Route (Next.js)

```typescript
import { trace } from '@opentelemetry/api';
import { withTracing } from 'afenda-observability/tracing';

export const GET = withTracing('api.users.list', async (request) => {
  const span = trace.getActiveSpan();
  span?.setAttribute('http.route', '/api/users');

  const users = await db.query.users.findMany();
  return Response.json(users);
});
```

### Trace Database Queries

```typescript
import { traceQuery } from 'afenda-observability/tracing';

export async function findUser(id: string) {
  return traceQuery(
    'db.users.findById',
    async () => {
      return db.query.users.findFirst({ where: eq(users.id, id) });
    },
    {
      'db.operation': 'SELECT',
      'db.table': 'users',
      'user.id': id,
    },
  );
}
```

---

## 🔗 Dependencies

### Workspace Dependencies

**NONE** — Layer 3 packages do not depend on each other.

### External Dependencies

- `@opentelemetry/api` — OpenTelemetry API
- `@opentelemetry/sdk-node` — OpenTelemetry SDK
- `@sentry/node` — Sentry error tracking

### Who Depends on This Package

- ✅ `apps/web` — Instruments API routes
- ✅ Background jobs — Traces async tasks
- ✅ CLI tools — Monitors admin scripts

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - External npm (@opentelemetry/*, @sentry/*)
  - Node.js built-ins

❌ FORBIDDEN:
  - afenda-crud (Layer 3, same layer)
  - business-domain/* (Layer 2, lower layer)
  - afenda-workflow (Layer 2, lower layer)
  - afenda-database (Layer 1, creates coupling)
```

**Rule:** Layer 3 packages are isolated. They observe externally, not internally.

---

## 📜 Scripts

```bash
pnpm build       # Build package
pnpm dev         # Watch mode
pnpm type-check  # TypeScript check
pnpm lint        # ESLint
pnpm lint:fix    # ESLint with auto-fix
```

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Import from CRUD

**❌ WRONG:**

```typescript
import { mutate } from 'afenda-crud'; // FORBIDDEN!
```

**Why:** Observability and CRUD are both Layer 3 (same layer). No cross-imports.

**✅ CORRECT:**

```typescript
// Instrument CRUD externally in apps/web
import { mutate } from 'afenda-crud';
import { createSpan } from 'afenda-observability';

createSpan(tracer, 'mutate', async () => {
  return mutate(ctx, entityType, verb, input);
});
```

---

### 🔒 Rule 2: NEVER Import Business Logic

**❌ WRONG:**

```typescript
import { calculateTax } from 'afenda-accounting'; // FORBIDDEN!
```

**Why:** Observability is Layer 3, accounting is Layer 2. Coupling creates dependencies.

**✅ CORRECT:**

```typescript
// Instrument accounting externally
import { calculateTax } from 'afenda-accounting';
import { createSpan } from 'afenda-observability';

createSpan(tracer, 'calculate-tax', async () => {
  return calculateTax(amount, rate);
});
```

---

### 🔒 Rule 3: Observe, Don't Modify

**❌ WRONG:**

```typescript
export function traceMutation(ctx, entityType, verb, input) {
  // ❌ Modifying input!
  input.tracedAt = new Date();
  return mutate(ctx, entityType, verb, input);
}
```

**Why:** Observability should be transparent, not invasive.

**✅ CORRECT:**

```typescript
export function traceMutation(ctx, entityType, verb, input) {
  return createSpan(tracer, 'mutate', async (span) => {
    span.setAttribute('entity.type', entityType);
    span.setAttribute('mutation.verb', verb);
    // ✅ Read-only observation
    return mutate(ctx, entityType, verb, input);
  });
}
```

---

### 🔒 Rule 4: Sample Smartly to Control Costs

**❌ WRONG:**

```typescript
// 100% sampling in production
await initializeTracing({
  serviceName: 'afenda-web',
  tracesSampleRate: 1.0, // ❌ Expensive!
});
```

**Why:** OTLP data costs money. Sample 10% in production, 100% in dev.

**✅ CORRECT:**

```typescript
await initializeTracing({
  serviceName: 'afenda-web',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

---

### 🔒 Rule 5: Always Close Spans

**❌ WRONG:**

```typescript
const span = tracer.startSpan('operation');
await performWork();
// ❌ Forgot to close span!
```

**Why:** Unclosed spans cause memory leaks.

**✅ CORRECT:**

```typescript
const span = tracer.startSpan('operation');
try {
  await performWork();
} finally {
  span.end(); // ✅ Always close
}

// Or use helper:
createSpan(tracer, 'operation', async (span) => {
  await performWork(); // Auto-closed
});
```

---

### 🚨 Validation Commands

```bash
# Type-check
pnpm type-check

# Lint
pnpm lint:ci

# Build
pnpm build
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 3 (Application) |
| **What does it export?** | Tracing, metrics, health checks, Sentry integration |
| **What does it import?** | Only external npm (OpenTelemetry, Sentry) |
| **Who imports it?** | apps/web, background jobs, CLI tools |
| **Can it import from crud?** | ❌ NO (same layer) |
| **Can it import from domains?** | ❌ NO (lower layer, creates coupling) |
| **Can it modify data?** | ❌ NO (observe only) |
| **What sample rate in prod?** | 10% (to control costs) |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [packages/crud/README.md](../crud/README.md) - Application orchestration
- [OpenTelemetry Docs](https://opentelemetry.io/docs/) - Official OTEL docs
- [Sentry Node SDK](https://docs.sentry.io/platforms/node/) - Sentry docs

---

## Environment Variables

```bash
# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.lightstep.com:443
OTEL_EXPORTER_OTLP_HEADERS=lightstep-access-token=YOUR_TOKEN
OTEL_SERVICE_NAME=afenda-web
OTEL_SERVICE_VERSION=0.1.0
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1

# Sentry
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Correlation
ENABLE_CORRELATION_IDS=true
CORRELATION_ID_HEADER=x-correlation-id
```

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)

## Quick Start

### 1. Initialize OpenTelemetry (instrumentation.ts)

```typescript
import { initializeTracing } from 'afenda-observability/tracing';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await initializeTracing({
      serviceName: 'afenda-web',
      serviceVersion: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    });
  }
}
```

### 2. Add Custom Spans

```typescript
import { trace } from '@opentelemetry/api';
import { createSpan } from 'afenda-observability/tracing';

const tracer = trace.getTracer('my-service');

export async function processOrder(orderId: string) {
  return createSpan(tracer, 'process-order', async (span) => {
    span.setAttribute('order.id', orderId);

    // Your business logic
    const result = await database.processOrder(orderId);

    span.setAttribute('order.status', result.status);
    return result;
  });
}
```

### 3. Record Custom Metrics

```typescript
import { incrementCounter, recordMetric } from 'afenda-observability/metrics';

// Counter
incrementCounter('orders.processed', { status: 'success' });

// Histogram
recordMetric('order.processing.duration', 1250, { region: 'us-east-1' });

// Gauge
recordMetric('queue.size', 42, { queue: 'orders' });
```

### 4. Health Checks

```typescript
import { createHealthCheck } from 'afenda-observability/health';

export const healthCheck = createHealthCheck({
  name: 'my-service',
  checks: {
    database: async () => {
      const isHealthy = await db.ping();
      return { healthy: isHealthy };
    },
    cache: async () => {
      const isHealthy = await redis.ping();
      return { healthy: isHealthy };
    },
  },
});

// In your API route
export async function GET() {
  const health = await healthCheck.check();
  return Response.json(health, { status: health.healthy ? 200 : 503 });
}
```

### 5. Sentry Integration

```typescript
import { initializeSentry } from 'afenda-observability';

initializeSentry({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
});
```

## Configuration

### Environment Variables

```bash
# OpenTelemetry
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.lightstep.com:443
OTEL_EXPORTER_OTLP_HEADERS=lightstep-access-token=YOUR_TOKEN
OTEL_SERVICE_NAME=afenda-web
OTEL_SERVICE_VERSION=0.1.0
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1

# Sentry
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Correlation
ENABLE_CORRELATION_IDS=true
CORRELATION_ID_HEADER=x-correlation-id
```

### Advanced Tracing

```typescript
import { context, SpanStatusCode, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('advanced-service');

export async function complexOperation() {
  const span = tracer.startSpan('complex-operation');

  try {
    span.setAttribute('user.id', userId);
    span.addEvent('operation.started');

    const result = await performWork();

    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    });
    throw error;
  } finally {
    span.end();
  }
}
```

## API Reference

### Tracing

- `initializeTracing(config)` - Initialize OpenTelemetry SDK
- `createSpan(tracer, name, fn)` - Create and auto-close span
- `getCurrentSpan()` - Get active span from context
- `addSpanAttribute(key, value)` - Add attribute to current span

### Metrics

- `incrementCounter(name, labels)` - Increment counter metric
- `recordMetric(name, value, labels)` - Record histogram/gauge
- `createMeter(name)` - Create custom meter

### Health

- `createHealthCheck(config)` - Create health check instance
- `registerHealthCheck(name, fn)` - Register custom check

## Best Practices

1. **Name Spans Consistently**: Use kebab-case: `user-login`, `order-process`
2. **Add Context**: Always add relevant attributes (user.id, entity.type)
3. **Sample Intelligently**: Use 10% sampling in production, 100% in dev
4. **Monitor Costs**: OTLP data can be expensive, tune sampling rates
5. **Correlation IDs**: Always propagate correlation IDs in headers

## Integration Examples

### Next.js API Route

```typescript
import { trace } from '@opentelemetry/api';
import { withTracing } from 'afenda-observability/tracing';

export const GET = withTracing('api.users.list', async (request) => {
  const span = trace.getActiveSpan();
  span?.setAttribute('http.route', '/api/users');

  const users = await db.query(...);
  return Response.json(users);
});
```

### Database Query Tracing

```typescript
import { traceQuery } from 'afenda-observability/tracing';

export async function findUser(id: string) {
  return traceQuery(
    'db.users.findById',
    async () => {
      return db.users.findById(id);
    },
    {
      'db.operation': 'SELECT',
      'db.table': 'users',
      'user.id': id,
    },
  );
}
```

## Troubleshooting

### No traces appearing

1. Check `OTEL_EXPORTER_OTLP_ENDPOINT` is set
2. Verify network connectivity to OTLP collector
3. Check sampling rate is > 0
4. Look for errors in logs

### High memory usage

1. Reduce sampling rate
2. Limit span attribute size
3. Check for span leaks (unclosed spans)

## Resources

- [OpenTelemetry Docs](https://opentelemetry.io/docs/)
- [Sentry Node SDK](https://docs.sentry.io/platforms/node/)
- [afenda Observability Guide](../../docs/OBSERVABILITY.md)

## License

MIT
