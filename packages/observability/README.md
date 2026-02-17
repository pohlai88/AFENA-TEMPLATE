# @afenda/observability

Enterprise-grade observability stack for afenda applications.

## Features

- 🔍 **OpenTelemetry Tracing** - Distributed tracing with OTLP export
- 📊 **Custom Metrics** - Application metrics and business KPIs
- 🏥 **Health Checks** - Readiness and liveness probes
- 🐛 **Sentry Integration** - Error tracking and performance monitoring
- 🔗 **Correlation IDs** - Request tracing across services
- ⚡ **Auto-instrumentation** - Automatic HTTP, database, and framework
  instrumentation

## Installation

```bash
pnpm add afenda-observability
```

## Quick Start

### 1. Initialize OpenTelemetry (instrumentation.ts)

```typescript
import { initializeTracing } from "afenda-observability/tracing";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await initializeTracing({
      serviceName: "afenda-web",
      serviceVersion: "0.1.0",
      environment: process.env.NODE_ENV || "development",
      otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    });
  }
}
```

### 2. Add Custom Spans

```typescript
import { trace } from "@opentelemetry/api";
import { createSpan } from "afenda-observability/tracing";

const tracer = trace.getTracer("my-service");

export async function processOrder(orderId: string) {
  return createSpan(tracer, "process-order", async (span) => {
    span.setAttribute("order.id", orderId);

    // Your business logic
    const result = await database.processOrder(orderId);

    span.setAttribute("order.status", result.status);
    return result;
  });
}
```

### 3. Record Custom Metrics

```typescript
import { incrementCounter, recordMetric } from "afenda-observability/metrics";

// Counter
incrementCounter("orders.processed", { status: "success" });

// Histogram
recordMetric("order.processing.duration", 1250, { region: "us-east-1" });

// Gauge
recordMetric("queue.size", 42, { queue: "orders" });
```

### 4. Health Checks

```typescript
import { createHealthCheck } from "afenda-observability/health";

export const healthCheck = createHealthCheck({
  name: "my-service",
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
import { initializeSentry } from "afenda-observability";

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
import { context, SpanStatusCode, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("advanced-service");

export async function complexOperation() {
  const span = tracer.startSpan("complex-operation");

  try {
    span.setAttribute("user.id", userId);
    span.addEvent("operation.started");

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
import { traceQuery } from "afenda-observability/tracing";

export async function findUser(id: string) {
  return traceQuery("db.users.findById", async () => {
    return db.users.findById(id);
  }, {
    "db.operation": "SELECT",
    "db.table": "users",
    "user.id": id,
  });
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
