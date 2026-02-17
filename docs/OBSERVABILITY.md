# Observability Guide

## Overview

afenda implements enterprise-grade observability using:

- **OpenTelemetry** - Distributed tracing and instrumentation
- **Sentry** - Error tracking and performance monitoring
- **Custom Metrics** - Business and application metrics
- **Health Checks** - Readiness and liveness probes
- **Correlation IDs** - Request tracing across services

## Architecture

```
┌─────────────────┐
│  Application    │
│   (Next.js)     │
└────────┬────────┘
         │
         ├─────► OpenTelemetry (Traces)
         │         └─► OTLP Collector
         │              └─► Lightstep/Honeycomb/etc.
         │
         ├─────► Sentry (Errors & Performance)
         │         └─► Sentry.io
         │
         ├─────► Logger (Structured Logs)
         │         └─► Pino → stdout/file
         │
         └─────► Metrics (Custom)
                   └─► OTLP Collector
                        └─► Prometheus/etc.
```

## Quick Start

### 1. Environment Setup

Copy `.env.example` and configure observability variables:

```bash
# OpenTelemetry (optional - disable for local dev)
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.lightstep.com:443
OTEL_EXPORTER_OTLP_HEADERS={"lightstep-access-token":"YOUR_TOKEN"}
OTEL_SERVICE_NAME=afenda-web
OTEL_SERVICE_VERSION=0.1.0
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1

# Sentry (optional)
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

### 2. Instrumentation

The observability stack is automatically initialized in `apps/web/instrumentation.ts` when the Next.js app starts.

### 3. Health Checks

Health check endpoints are automatically available:

- `GET /api/health` - Full health status (all checks)
- `GET /api/ready` - Readiness probe (critical checks)
- `GET /api/alive` - Liveness probe (process alive)

### 4. Using in Code

#### Add Custom Spans

```typescript
import { withTracing } from 'afenda-observability/tracing';

export const GET = withTracing('api.users.list', async (request) => {
  const users = await db.query.users.findMany();
  return Response.json(users);
});
```

#### Record Metrics

```typescript
import { incrementCounter, recordMetric } from 'afenda-observability/metrics';

// Count events
incrementCounter('orders.created', { region: 'us-east-1' });

// Record durations
recordMetric('order.processing.duration', 1250, { status: 'success' });
```

#### Track Errors

```typescript
import { captureException, addBreadcrumb } from 'afenda-observability/sentry';

try {
  addBreadcrumb('Starting order processing', 'process', { orderId });
  await processOrder(orderId);
} catch (error) {
  captureException(error, { orderId, userId });
  throw error;
}
```

## Integration with Existing Systems

### Logger Integration

The Pino logger automatically includes correlation IDs:

```typescript
import { createLogger } from 'afenda-logger';
import { getCorrelationId } from 'afenda-observability/correlation';

const logger = createLogger({ name: 'my-service' });

export async function handler(request: Request) {
  const correlationId = getCorrelationId();
  logger.info('Processing request', { correlationId, userId });
  // correlationId is automatically propagated
}
```

### Database Queries

Wrap database queries for automatic tracing:

```typescript
import { traceQuery } from 'afenda-observability/tracing';

export async function findUser(id: string) {
  return traceQuery(
    'users.findById',
    async () => {
      return db.query.users.findFirst({ where: eq(users.id, id) });
    },
    { 'user.id': id },
  );
}
```

### API Routes

Use built-in wrappers for automatic instrumentation:

```typescript
import { withTracing } from 'afenda-observability/tracing';
import { withCorrelation } from 'afenda-observability/correlation';
import { AppMetrics } from 'afenda-observability/metrics';

export const GET = withTracing('api.orders.list', async (request) => {
  const startTime = Date.now();

  try {
    const orders = await db.query.orders.findMany();

    AppMetrics.httpRequest(Date.now() - startTime, {
      method: 'GET',
      route: '/api/orders',
      status: 200,
    });

    return Response.json(orders);
  } catch (error) {
    AppMetrics.httpRequest(Date.now() - startTime, {
      method: 'GET',
      route: '/api/orders',
      status: 500,
    });
    throw error;
  }
});
```

## Observability Platforms

### Recommended Platforms

1. **Lightstep (Traces & Metrics)**
   - Excellent OpenTelemetry support
   - Great UI and query capabilities
   - Free tier: 100GB/month

2. **Honeycomb (Traces & Logs)**
   - Purpose-built for OpenTelemetry
   - Powerful query language
   - Free tier: 20M events/month

3. **Sentry (Errors & Performance)**
   - Best-in-class error tracking
   - Performance monitoring
   - Free tier: 5K errors/month

4. **Grafana Cloud (Metrics & Logs)**
   - Full observability stack
   - Prometheus + Loki + Tempo
   - Free tier: 50GB logs, 10K series

### Configuration Examples

#### Lightstep

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.lightstep.com:443
OTEL_EXPORTER_OTLP_HEADERS={"lightstep-access-token":"YOUR_TOKEN"}
```

#### Honeycomb

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://api.honeycomb.io:443
OTEL_EXPORTER_OTLP_HEADERS={"x-honeycomb-team":"YOUR_API_KEY"}
```

#### New Relic

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net:443
OTEL_EXPORTER_OTLP_HEADERS={"api-key":"YOUR_LICENSE_KEY"}
```

## Best Practices

### 1. Sampling Strategy

**Development**: 100% sampling
```bash
OTEL_TRACES_SAMPLER=always_on
```

**Production**: 10% sampling (adjust based on traffic)
```bash
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1
```

**High-traffic**: 1% sampling
```bash
OTEL_TRACES_SAMPLER_ARG=0.01
```

### 2. Span Naming

Use consistent, hierarchical names:

✅ **Good**:
- `api.users.create`
- `db.query.users.insert`
- `service.email.send`

❌ **Bad**:
- `createUser`
- `queryDB`
- `emailService`

### 3. Attributes

Add context to spans:

```typescript
span.setAttribute('user.id', userId);
span.setAttribute('tenant.id', tenantId);
span.setAttribute('http.method', 'POST');
span.setAttribute('http.route', '/api/orders');
span.setAttribute('db.operation', 'INSERT');
span.setAttribute('db.table', 'orders');
```

### 4. Metrics

Use appropriate metric types:

- **Counter**: Cumulative values (requests, errors, events)
- **Histogram**: Distributions (latency, request size, duration)
- **Gauge**: Point-in-time values (queue size, active connections)

```typescript
// Counter
incrementCounter('http.requests.total', { method: 'GET', status: '200' });

// Histogram
recordMetric('http.request.duration', 150, { route: '/api/users' });

// Gauge (use histogram for now, OpenTelemetry Metrics API evolving)
recordMetric('queue.size', 42, { queue: 'orders' });
```

### 5. Error Tracking

Always capture errors with context:

```typescript
try {
  await processPayment(orderId, amount);
} catch (error) {
  captureException(error, {
    orderId,
    amount,
    userId,
    paymentMethod: 'stripe',
  });
  throw error;
}
```

### 6. Correlation IDs

Propagate correlation IDs across service boundaries:

```typescript
import { fetchWithCorrelation } from 'afenda-observability/correlation';

// Automatically includes x-correlation-id header
const response = await fetchWithCorrelation('https://api.example.com/users');
```

## Troubleshooting

### No traces appearing

1. **Check OTLP endpoint**: Verify `OTEL_EXPORTER_OTLP_ENDPOINT` is correct
2. **Check network**: Ensure outbound HTTPS on port 443 is allowed
3. **Check sampling**: Verify `OTEL_TRACES_SAMPLER_ARG` > 0
4. **Check logs**: Look for initialization errors in console

### High memory usage

1. **Reduce sampling rate**: Lower `OTEL_TRACES_SAMPLER_ARG`
2. **Limit span attributes**: Keep attributes < 1KB each
3. **Check for span leaks**: Ensure all spans are closed

### Sentry quota exceeded

1. **Adjust sample rate**: Lower `SENTRY_TRACES_SAMPLE_RATE`
2. **Filter noisy errors**: Update `beforeSend` in `sentry.ts`
3. **Set rate limits**: Configure in Sentry dashboard

### Health checks failing

1. **Check database connection**: Verify `DATABASE_URL`
2. **Increase timeout**: Adjust timeout in health check config
3. **Check dependencies**: Ensure Redis, external APIs are accessible

## Monitoring Dashboards

### Key Metrics to Track

**Application Performance**:
- Request rate (requests/sec)
- Error rate (% of requests)
- P50, P95, P99 latency
- Apdex score

**Database**:
- Query duration (P95, P99)
- Connection pool utilization
- Slow query count
- Database errors

**Business Metrics**:
- Orders created
- User signups
- Revenue processed
- API usage by tenant

**Infrastructure**:
- Memory usage (heap, RSS)
- CPU utilization
- Event loop lag
- Active connections

### Example Queries

**Lightstep** (OpenTelemetry):
```
span.operation = "api.orders.create"
AND http.status_code >= 500
```

**Honeycomb**:
```
WHERE http.route = "/api/orders"
GROUP BY http.status_code
CALCULATE COUNT
```

**Sentry** (Discover):
```sql
event.type:transaction
transaction:/api/*
http.status_code:>=500
```

## Cost Optimization

### 1. Sampling

Most cost-effective lever:
- **10% sampling** = 90% cost reduction
- **1% sampling** = 99% cost reduction

Still provides statistical significance for anomaly detection.

### 2. Attribute Filtering

Remove high-cardinality attributes:

```typescript
// ❌ Avoid: unique per request
span.setAttribute('request.id', uuid());

// ✅ Better: bounded cardinality
span.setAttribute('http.route', '/api/users');
span.setAttribute('http.method', 'GET');
```

### 3. Span Selection

Don't trace every function:

✅ **Trace**:
- API endpoints
- Database queries
- External API calls
- Critical business logic

❌ **Skip**:
- Utility functions
- Getters/setters
- Simple validators
- Health check endpoints

### 4. Retention

Configure shorter retention for high-volume data:
- **Traces**: 7-30 days
- **Metrics**: 90 days
- **Logs**: 7-14 days

## Resources

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [Sentry Node SDK](https://docs.sentry.io/platforms/node/)
- [Observability Package README](../packages/observability/README.md)
- [afenda Testing Guide](./TESTING.md)

---

**Questions?** Check the main [README](../README.md) or ask in the team Slack channel.
