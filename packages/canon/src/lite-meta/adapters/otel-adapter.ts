/**
 * OpenTelemetry Adapter for LiteMeta Instrumentation
 * 
 * Optional adapter that maps instrumentation hooks to OpenTelemetry spans and metrics.
 * Tree-shakeable - only included if imported.
 * 
 * @example
 * ```typescript
 * import { trace, metrics } from '@opentelemetry/api';
 * import { createOtelAdapter } from 'afena-canon/lite-meta/adapters/otel-adapter';
 * 
 * const tracer = trace.getTracer('lite-meta');
 * const meter = metrics.getMeter('lite-meta');
 * const hooks = createOtelAdapter({ tracer, meter });
 * setInstrumentationHooks(hooks);
 * ```
 */

import type {
  CacheContext,
  CallContext,
  CallEndContext,
  ErrorContext,
  InstrumentationHooks,
} from '../hooks/instrumentation';

/**
 * OpenTelemetry Tracer interface (minimal subset)
 */
export interface OtelTracer {
  startSpan(name: string, options?: OtelSpanOptions): OtelSpan;
}

/**
 * OpenTelemetry Span interface (minimal subset)
 */
export interface OtelSpan {
  setAttribute(key: string, value: string | number | boolean): void;
  setAttributes(attributes: Record<string, string | number | boolean>): void;
  setStatus(status: { code: OtelSpanStatusCode; message?: string }): void;
  recordException(exception: Error): void;
  end(endTime?: number): void;
}

/**
 * OpenTelemetry Span options
 */
export interface OtelSpanOptions {
  attributes?: Record<string, string | number | boolean>;
  startTime?: number;
}

/**
 * OpenTelemetry Span status codes
 */
export enum OtelSpanStatusCode {
  UNSET = 0,
  OK = 1,
  ERROR = 2,
}

/**
 * OpenTelemetry Meter interface (minimal subset)
 */
export interface OtelMeter {
  createCounter(name: string, options?: OtelMetricOptions): OtelCounter;
  createHistogram(name: string, options?: OtelMetricOptions): OtelHistogram;
}

/**
 * OpenTelemetry Counter interface
 */
export interface OtelCounter {
  add(value: number, attributes?: Record<string, string | number | boolean>): void;
}

/**
 * OpenTelemetry Histogram interface
 */
export interface OtelHistogram {
  record(value: number, attributes?: Record<string, string | number | boolean>): void;
}

/**
 * OpenTelemetry Metric options
 */
export interface OtelMetricOptions {
  description?: string;
  unit?: string;
}

/**
 * OTel adapter options
 */
export interface OtelAdapterOptions {
  /**
   * OpenTelemetry tracer for creating spans
   */
  tracer?: OtelTracer;

  /**
   * OpenTelemetry meter for recording metrics
   */
  meter?: OtelMeter;

  /**
   * Whether to create spans for function calls (default: true)
   */
  enableTracing?: boolean;

  /**
   * Whether to record metrics (default: true)
   */
  enableMetrics?: boolean;

  /**
   * Service name for span attributes (default: 'lite-meta')
   */
  serviceName?: string;
}

/**
 * Create OpenTelemetry adapter for instrumentation hooks
 * 
 * @param options - Adapter options with tracer and/or meter
 * @returns Instrumentation hooks that emit OTel spans and metrics
 */
export function createOtelAdapter(
  options: OtelAdapterOptions
): InstrumentationHooks {
  const {
    tracer,
    meter,
    enableTracing = true,
    enableMetrics = true,
    serviceName = 'lite-meta',
  } = options;

  // Create metrics if meter provided
  const callDurationHistogram = meter && enableMetrics
    ? meter.createHistogram('lite_meta.call.duration', {
      description: 'Duration of function calls',
      unit: 'ms',
    })
    : null;

  const callCounter = meter && enableMetrics
    ? meter.createCounter('lite_meta.call.count', {
      description: 'Number of function calls',
    })
    : null;

  const cacheCounter = meter && enableMetrics
    ? meter.createCounter('lite_meta.cache.operations', {
      description: 'Number of cache operations',
    })
    : null;

  // Store active spans by call context
  const activeSpans = new WeakMap<CallContext, OtelSpan>();

  return {
    onCallStart: (context: CallContext) => {
      if (!tracer || !enableTracing) return;

      const span = tracer.startSpan(`lite-meta.${context.functionName}`, {
        attributes: {
          'service.name': serviceName,
          'function.name': context.functionName,
          ...context.metadata as Record<string, string | number | boolean>,
        },
        startTime: context.startTime,
      });

      activeSpans.set(context, span);
    },

    onCallEnd: (context: CallEndContext) => {
      // End span if exists
      if (tracer && enableTracing) {
        const span = activeSpans.get(context);
        if (span) {
          span.setAttributes({
            'function.duration': context.duration,
            'function.success': context.success,
          });

          if (context.success) {
            span.setStatus({ code: OtelSpanStatusCode.OK });
          } else {
            const status: { code: OtelSpanStatusCode; message?: string } = {
              code: OtelSpanStatusCode.ERROR,
            };
            if (context.error?.message) {
              status.message = context.error.message;
            }
            span.setStatus(status);
            if (context.error) {
              span.recordException(context.error);
            }
          }

          span.end();
          activeSpans.delete(context);
        }
      }

      // Record metrics
      if (enableMetrics) {
        const attributes = {
          'function.name': context.functionName,
          'function.success': context.success.toString(),
        };

        callDurationHistogram?.record(context.duration, attributes);
        callCounter?.add(1, attributes);
      }
    },

    onError: (context: ErrorContext) => {
      // Errors are already recorded in onCallEnd via span.recordException
      // This hook is for additional error tracking if needed
      if (enableMetrics && callCounter) {
        callCounter.add(1, {
          'function.name': context.functionName,
          'error.type': context.error.name,
        });
      }
    },

    onCacheHit: (context: CacheContext) => {
      if (enableMetrics && cacheCounter) {
        cacheCounter.add(1, {
          'cache.name': context.cacheName,
          'cache.operation': 'hit',
        });
      }
    },

    onCacheMiss: (context: CacheContext) => {
      if (enableMetrics && cacheCounter) {
        cacheCounter.add(1, {
          'cache.name': context.cacheName,
          'cache.operation': 'miss',
        });
      }
    },

    onCacheSet: (context: CacheContext) => {
      if (enableMetrics && cacheCounter) {
        cacheCounter.add(1, {
          'cache.name': context.cacheName,
          'cache.operation': 'set',
        });
      }
    },

    onCacheEvict: (context: CacheContext) => {
      if (enableMetrics && cacheCounter) {
        cacheCounter.add(1, {
          'cache.name': context.cacheName,
          'cache.operation': 'evict',
        });
      }
    },

    onCacheClear: (context: CacheContext) => {
      if (enableMetrics && cacheCounter) {
        cacheCounter.add(1, {
          'cache.name': context.cacheName,
          'cache.operation': 'clear',
        });
      }
    },
  };
}

/**
 * Create metrics-only OTel adapter (no tracing)
 * 
 * Useful when you only want metrics without the overhead of spans.
 * 
 * @param meter - OpenTelemetry meter
 * @param serviceName - Service name for attributes
 * @returns Metrics-only instrumentation hooks
 */
export function createMetricsOnlyOtelAdapter(
  meter: OtelMeter,
  serviceName = 'lite-meta'
): InstrumentationHooks {
  return createOtelAdapter({
    meter,
    enableTracing: false,
    enableMetrics: true,
    serviceName,
  });
}

/**
 * Create tracing-only OTel adapter (no metrics)
 * 
 * Useful when you only want distributed tracing without metrics.
 * 
 * @param tracer - OpenTelemetry tracer
 * @param serviceName - Service name for span attributes
 * @returns Tracing-only instrumentation hooks
 */
export function createTracingOnlyOtelAdapter(
  tracer: OtelTracer,
  serviceName = 'lite-meta'
): InstrumentationHooks {
  return createOtelAdapter({
    tracer,
    enableTracing: true,
    enableMetrics: false,
    serviceName,
  });
}
