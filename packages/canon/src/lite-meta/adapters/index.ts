/**
 * Optional Adapters Module
 * 
 * Tree-shakeable adapters for integrating LiteMeta with external services.
 * Only included in bundle if imported.
 * 
 * Available adapters:
 * - Pino: Logger integration
 * - OpenTelemetry: Distributed tracing and metrics
 * - Redis: Distributed cache (L2)
 */

// Pino adapter
export {
  createPinoAdapter,
  createMinimalPinoAdapter,
  type PinoLogger,
  type PinoAdapterOptions,
} from './pino-adapter';

// OpenTelemetry adapter
export {
  createOtelAdapter,
  createMetricsOnlyOtelAdapter,
  createTracingOnlyOtelAdapter,
  OtelSpanStatusCode,
  type OtelTracer,
  type OtelSpan,
  type OtelSpanOptions,
  type OtelMeter,
  type OtelCounter,
  type OtelHistogram,
  type OtelMetricOptions,
  type OtelAdapterOptions,
} from './otel-adapter';

// Redis adapter
export {
  createRedisAdapter,
  createSafeRedisAdapter,
  createCompressedRedisAdapter,
  type RedisClient,
  type RedisAdapterOptions,
} from './redis-adapter';
