/**
 * afenda Observability Package
 *
 * Enterprise-grade observability utilities including:
 * - OpenTelemetry distributed tracing
 * - Custom metrics collection
 * - Health checks and readiness probes
 * - Sentry error tracking
 * - Correlation ID propagation
 *
 * @packageDocumentation
 */

// Tracing
export {
  initializeTracing,
  getTracer,
  getCurrentSpan,
  createSpan,
  addSpanAttributes,
  addSpanEvent,
  traceQuery,
  withTracing,
  shutdownTracing,
} from './tracing';

// Metrics
export {
  getCounter,
  getHistogram,
  incrementCounter,
  addToCounter,
  recordMetric,
  measureDuration,
  AppMetrics,
  createMeter,
} from './metrics';

// Health
export {
  createHealthCheck,
  HealthChecks,
  getUptime,
  getSystemInfo,
} from './health';

// Sentry
export {
  initializeSentry,
  captureException,
  captureMessage,
  setUser,
  setTags,
  addBreadcrumb,
  withSentry,
  flushSentry,
  startTransaction,
  Sentry,
} from './sentry';

// Correlation
export {
  getCorrelationId,
  setCorrelationId,
  extractCorrelationId,
  runWithCorrelationId,
  correlationMiddleware,
  addCorrelationHeader,
  fetchWithCorrelation,
  withCorrelation,
} from './correlation';

// Types
export type {
  TracingConfig,
  SentryConfig,
  MetricLabels,
  HealthCheckResult,
  HealthCheckStatus,
  HealthCheckConfig,
  CorrelationIdConfig,
  SpanAttributes,
} from './types';

/**
 * Initialize full observability stack
 *
 * @example
 * ```ts
 * import { initializeObservability } from 'afenda-observability';
 *
 * await initializeObservability({
 *   tracing: {
 *     serviceName: 'afenda-web',
 *     serviceVersion: '0.1.0',
 *     environment: 'production',
 *     otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
 *   },
 *   sentry: {
 *     dsn: process.env.SENTRY_DSN!,
 *     environment: 'production',
 *     tracesSampleRate: 0.1,
 *   },
 * });
 * ```
 */
export async function initializeObservability(config: {
  tracing?: Parameters<typeof import('./tracing').initializeTracing>[0];
  sentry?: Parameters<typeof import('./sentry').initializeSentry>[0];
}): Promise<void> {
  const promises: Promise<void>[] = [];

  if (config.tracing) {
    const { initializeTracing } = await import('./tracing');
    promises.push(initializeTracing(config.tracing));
  }

  if (config.sentry) {
    const { initializeSentry } = await import('./sentry');
    initializeSentry(config.sentry);
  }

  await Promise.all(promises);
}
