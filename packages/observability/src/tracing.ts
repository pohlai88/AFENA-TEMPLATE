/**
 * OpenTelemetry tracing utilities for afenda
 *
 * @module tracing
 */

import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import {
  SEMRESATTRS_SERVICE_NAME as ATTR_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION as ATTR_SERVICE_VERSION,
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT as ATTR_DEPLOYMENT_ENVIRONMENT,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  trace,
  type Tracer,
  type Span,
  SpanStatusCode,
  context,
  type Context,
} from '@opentelemetry/api';
import { createLogger } from 'afenda-logger';
import type { TracingConfig, SpanAttributes } from './types';

const logger = createLogger({ name: 'observability:tracing' });

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry tracing
 *
 * @example
 * ```ts
 * await initializeTracing({
 *   serviceName: 'afenda-web',
 *   serviceVersion: '0.1.0',
 *   environment: 'production',
 *   otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
 * });
 * ```
 */
export async function initializeTracing(config: TracingConfig): Promise<void> {
  if (sdk) {
    logger.warn('Tracing already initialized, skipping');
    return;
  }

  try {
    const {
      serviceName,
      serviceVersion,
      environment,
      otlpEndpoint,
      otlpHeaders,
      samplingRate = environment === 'production' ? 0.1 : 1.0,
      autoInstrumentation = true,
    } = config;

    const resource = new Resource({
      [ATTR_SERVICE_NAME]: serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
      [ATTR_DEPLOYMENT_ENVIRONMENT]: environment,
    });

    const traceExporter = otlpEndpoint
      ? new OTLPTraceExporter({
          url: `${otlpEndpoint}/v1/traces`,
          headers: otlpHeaders || {},
        })
      : undefined;

    sdk = new NodeSDK({
      resource,
      traceExporter,
      instrumentations: autoInstrumentation
        ? [
            getNodeAutoInstrumentations({
              '@opentelemetry/instrumentation-fs': { enabled: false },
            }),
          ]
        : [],
      // Note: Sampling can be configured via OTEL_TRACES_SAMPLER env vars
    });

    await sdk.start();

    logger.info({
      service: serviceName,
      version: serviceVersion,
      environment,
      samplingRate,
      exporterEnabled: !!otlpEndpoint,
    }, 'OpenTelemetry tracing initialized');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      try {
        await sdk?.shutdown();
        logger.info('OpenTelemetry SDK shut down successfully');
      } catch (error) {
        logger.error({ error }, 'Error shutting down OpenTelemetry SDK');
      }
    });
  } catch (error) {
    logger.error({ error }, 'Failed to initialize OpenTelemetry tracing');
    throw error;
  }
}

/**
 * Get the current tracer
 */
export function getTracer(name?: string): Tracer {
  return trace.getTracer(name || 'afenda-default');
}

/**
 * Get the currently active span
 */
export function getCurrentSpan(): Span | undefined {
  return trace.getActiveSpan();
}

/**
 * Create a span and automatically handle its lifecycle
 *
 * @example
 * ```ts
 * const tracer = getTracer('my-service');
 * const result = await createSpan(tracer, 'process-order', async (span) => {
 *   span.setAttribute('order.id', orderId);
 *   return await processOrder(orderId);
 * });
 * ```
 */
export async function createSpan<T>(
  tracer: Tracer,
  spanName: string,
  fn: (span: Span) => Promise<T>,
  attributes?: SpanAttributes,
): Promise<T> {
  const span = tracer.startSpan(spanName);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }

  try {
    const result = await context.with(trace.setSpan(context.active(), span), () => fn(span));
    span.setStatus({ code: SpanStatusCode.OK });
    return result;
  } catch (error) {
    span.recordException(error as Error);
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  } finally {
    span.end();
  }
}

/**
 * Add attributes to the current active span
 */
export function addSpanAttributes(attributes: SpanAttributes): void {
  const span = getCurrentSpan();
  if (span) {
    Object.entries(attributes).forEach(([key, value]) => {
      span.setAttribute(key, value);
    });
  }
}

/**
 * Add an event to the current active span
 */
export function addSpanEvent(name: string, attributes?: SpanAttributes): void {
  const span = getCurrentSpan();
  span?.addEvent(name, attributes);
}

/**
 * Trace a database query automatically
 */
export async function traceQuery<T>(
  queryName: string,
  fn: () => Promise<T>,
  attributes?: SpanAttributes,
): Promise<T> {
  const tracer = getTracer('afenda-database');
  return createSpan(tracer, `db.query.${queryName}`, fn, {
    'db.system': 'postgresql',
    ...attributes,
  });
}

/**
 * Higher-order function to wrap async functions with tracing
 *
 * @example
 * ```ts
 * export const GET = withTracing('api.users.list', async (request) => {
 *   const users = await db.query(...);
 *   return Response.json(users);
 * });
 * ```
 */
export function withTracing<TArgs extends unknown[], TReturn>(
  spanName: string,
  fn: (...args: TArgs) => Promise<TReturn>,
  attributes?: SpanAttributes,
): (...args: TArgs) => Promise<TReturn> {
  const tracer = getTracer();

  return async (...args: TArgs): Promise<TReturn> => {
    return createSpan(tracer, spanName, () => fn(...args), attributes);
  };
}

/**
 * Shutdown the OpenTelemetry SDK
 * Called automatically on SIGTERM
 */
export async function shutdownTracing(): Promise<void> {
  if (sdk) {
    await sdk.shutdown();
    sdk = null;
    logger.info('OpenTelemetry SDK shutdown complete');
  }
}
