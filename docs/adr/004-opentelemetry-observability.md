# ADR-004: OpenTelemetry for Observability

**Status**: Accepted  
**Date**: 2026-02-17  
**Deciders**: Engineering Team  
**Technical Story**: Observability stack implementation (Phase 2)

## Context

We needed an observability solution that provides:
- **Distributed tracing** across services and functions
- **Custom metrics** for business and application monitoring
- **Error tracking** with context and debugging information
- **Vendor flexibility** to avoid lock-in
- **Production readiness** with minimal performance overhead

Requirements:
- Works with serverless/edge deployments (Next.js, Vercel)
- Low overhead (< 5% performance impact)
- Open standards to avoid vendor lock-in
- Rich ecosystem and tooling
- Cost-effective at scale

## Decision

We will use **OpenTelemetry** for distributed tracing and metrics, **Sentry** for error tracking, and build a unified observability package (`afenda-observability`).

### Architecture

```
Application Code
      ↓
afenda-observability (abstraction layer)
      ↓
   ┌──┴──┐
   ↓     ↓
OpenTelemetry  Sentry
   ↓            ↓
OTLP Export   Sentry.io
   ↓
Lightstep/Honeycomb/etc.
```

### Components

1. **OpenTelemetry SDK**: Auto-instrumentation + manual spans
2. **OTLP Exporter**: Send traces/metrics to any OTLP-compatible backend
3. **Sentry SDK**: Error tracking and performance monitoring
4. **Correlation IDs**: Request tracing via AsyncLocalStorage
5. **Health Checks**: K8s-compatible readiness/liveness probes

## Consequences

### Positive

✅ **Vendor flexibility**: OTLP export works with 20+ observability platforms  
✅ **Open standard**: OpenTelemetry is industry-standard, CNCF project  
✅ **Rich instrumentation**: Auto-instruments HTTP, database, frameworks  
✅ **Production-ready**: Used by Google, Microsoft, AWS, etc.  
✅ **Cost control**: Configurable sampling (10% in prod = 90% cost reduction)  
✅ **Unified interface**: Single API for all observability needs  
✅ **Best-of-breed**: OpenTelemetry for traces, Sentry for errors  

### Negative

⚠️ **Learning curve**: Team needs to learn OpenTelemetry concepts  
⚠️ **Initial overhead**: Setup complexity vs. simple logger  
⚠️ **Node.js-specific**: Auto-instrumentation only works server-side  
⚠️ **Bundle size**: Adds ~2MB to server bundle (not edge-compatible)  

### Neutral

ℹ️ **Platform choice**: Team can choose any OTLP-compatible backend  
ℹ️ **Gradual adoption**: Can enable/disable via environment variables  

## Implementation Details

### Package Structure

```typescript
// packages/observability/src/
├── tracing.ts       // OpenTelemetry tracing
├── metrics.ts       // Custom metrics
├── health.ts        // Health checks
├── sentry.ts        // Sentry integration
├── correlation.ts   // Correlation ID propagation
└── index.ts         // Unified exports
```

### Auto-Initialization

```typescript
// apps/web/instrumentation.ts (Next.js)
import { initializeObservability } from 'afenda-observability';

export async function register() {
  await initializeObservability({
    tracing: {
      serviceName: 'afenda-web',
      otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
    },
  });
}
```

### Usage Patterns

```typescript
// Tracing
import { withTracing } from 'afenda-observability/tracing';

export const GET = withTracing('api.users.list', async () => {
  return Response.json(await db.query.users.findMany());
});

// Metrics
import { incrementCounter } from 'afenda-observability/metrics';

incrementCounter('orders.created', { region: 'us-east-1' });

// Error tracking
import { captureException } from 'afenda-observability/sentry';

try {
  await processOrder(orderId);
} catch (error) {
  captureException(error, { orderId });
  throw error;
}
```

## Sampling Strategy

### Development
- **100% sampling**: See every trace for debugging
- **Environment**: `OTEL_TRACES_SAMPLER=always_on`

### Production
- **10% sampling**: Balance cost and visibility
- **Environment**: `OTEL_TRACES_SAMPLER=parentbased_traceidratio`, `OTEL_TRACES_SAMPLER_ARG=0.1`

### High Traffic
- **1% sampling**: For very high-volume endpoints
- **Environment**: `OTEL_TRACES_SAMPLER_ARG=0.01`

## Platform Recommendations

### For Traces & Metrics
1. **Lightstep** - Best UI, 100GB/month free
2. **Honeycomb** - Purpose-built for OTEL, 20M events/month free
3. **Grafana Cloud** - Full stack, Prometheus + Tempo + Loki
4. **New Relic** - Established player, good free tier

### For Errors
- **Sentry** - Industry standard, 5K errors/month free

## Alternatives Considered

### Datadog
- ✅ All-in-one platform
- ❌ Expensive at scale ($15+/host/month)
- ❌ Proprietary agent and API
- **Rejected**: Vendor lock-in, high cost

### AWS X-Ray
- ✅ Native AWS integration
- ❌ AWS-only (no local dev, other clouds)
- ❌ Limited features vs. OpenTelemetry
- **Rejected**: Too limiting, AWS lock-in

### Application Insights (Azure)
- ✅ Good Azure integration
- ❌ Azure-only
- ❌ Less mature OTLP support
- **Rejected**: Azure lock-in

### Jaeger (self-hosted)
- ✅ Free, open source
- ❌ Operational burden
- ❌ No managed offering
- ❌ Limited query capabilities
- **Rejected**: Too much ops work for lean team

### Custom Logging Only
- ✅ Simple, no dependencies
- ❌ No distributed tracing
- ❌ No performance profiling
- ❌ Difficult to correlate across services
- **Rejected**: Insufficient for production debugging

## Migration Path

### Phase 1: Infrastructure (Complete)
- ✅ Create `afenda-observability` package
- ✅ OpenTelemetry SDK integration
- ✅ Sentry integration
- ✅ Health check endpoints

### Phase 2: Instrumentation (In Progress)
- ⏳ Add tracing to API routes
- ⏳ Database query tracing
- ⏳ Custom business metrics

### Phase 3: Alerting
- 🔜 Error rate alerts
- 🔜 Latency alerts
- 🔜 Custom business metric alerts

## Cost Optimization

### Techniques
1. **Sampling**: 10% sampling = 90% cost reduction
2. **Attribute filtering**: Remove high-cardinality attributes
3. **Span selection**: Don't trace utility functions
4. **Retention**: Keep traces 7-30 days max

### Estimated Costs (10K requests/day)
- **Lightstep**: Free tier covers fully
- **Honeycomb**: Free tier covers fully
- **Sentry**: Free tier covers ~150 errors/day, paid $26/month for 10K

## References

- [OpenTelemetry Documentation](https://opentelemetry.io/docs/)
- [OTLP Specification](https://opentelemetry.io/docs/specs/otlp/)
- [Sentry Node SDK](https://docs.sentry.io/platforms/node/)
- [afenda Observability Guide](../OBSERVABILITY.md)
