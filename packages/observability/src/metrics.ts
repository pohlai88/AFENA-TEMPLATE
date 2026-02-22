/**
 * Custom metrics collection for afenda
 *
 * @module metrics
 */

import { metrics, type Meter, type Counter, type Histogram } from '@opentelemetry/api';
import { createLogger } from 'afenda-logger';
import type { MetricLabels } from './types';

const logger = createLogger({ name: 'observability:metrics' });

// Default meter
let defaultMeter: Meter;

// Metric registries
const counters = new Map<string, Counter>();
const histograms = new Map<string, Histogram>();

/**
 * Initialize the default meter
 */
function getMeter(name = 'afenda-metrics'): Meter {
  if (!defaultMeter) {
    defaultMeter = metrics.getMeter(name);
  }
  return defaultMeter;
}

/**
 * Get or create a counter metric
 *
 * @example
 * ```ts
 * const counter = getCounter('orders.processed');
 * counter.add(1, { status: 'success', region: 'us-east-1' });
 * ```
 */
export function getCounter(name: string, description?: string): Counter {
  let counter = counters.get(name);

  if (!counter) {
    const meter = getMeter();
    counter = meter.createCounter(name, {
      description: description || name,
    });
    counters.set(name, counter);
    logger.debug({ name }, 'Created counter metric');
  }

  return counter;
}

/**
 * Get or create a histogram metric
 *
 * @example
 * ```ts
 * const histogram = getHistogram('order.processing.duration');
 * histogram.record(1250, { region: 'us-east-1', status: 'success' });
 * ```
 */
export function getHistogram(name: string, description?: string): Histogram {
  let histogram = histograms.get(name);

  if (!histogram) {
    const meter = getMeter();
    histogram = meter.createHistogram(name, {
      description: description || name,
    });
    histograms.set(name, histogram);
    logger.debug({ name }, 'Created histogram metric');
  }

  return histogram;
}

/**
 * Increment a counter by 1
 *
 * @example
 * ```ts
 * incrementCounter('api.requests', { route: '/users', method: 'GET' });
 * ```
 */
export function incrementCounter(name: string, labels?: MetricLabels): void {
  const counter = getCounter(name);
  counter.add(1, labels);
}

/**
 * Add a value to a counter
 *
 * @example
 * ```ts
 * addToCounter('orders.total_value', 99.99, { currency: 'USD' });
 * ```
 */
export function addToCounter(name: string, value: number, labels?: MetricLabels): void {
  const counter = getCounter(name);
  counter.add(value, labels);
}

/**
 * Record a value in a histogram
 *
 * @example
 * ```ts
 * recordMetric('http.request.duration', 250, { route: '/api/users' });
 * ```
 */
export function recordMetric(name: string, value: number, labels?: MetricLabels): void {
  const histogram = getHistogram(name);
  histogram.record(value, labels);
}

/**
 * Measure the duration of an async operation
 *
 * @example
 * ```ts
 * const result = await measureDuration('db.query.users', async () => {
 *   return await db.users.findMany();
 * }, { operation: 'findMany' });
 * ```
 */
export async function measureDuration<T>(
  metricName: string,
  fn: () => Promise<T>,
  labels?: MetricLabels,
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    recordMetric(metricName, duration, { ...labels, status: 'success' });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    recordMetric(metricName, duration, { ...labels, status: 'error' });
    throw error;
  }
}

/**
 * Common application metrics
 */
export const AppMetrics = {
  /**
   * Record HTTP request metrics
   */
  httpRequest: (duration: number, options: { method: string; route: string; status: number }) => {
    recordMetric('http.request.duration', duration, {
      method: options.method,
      route: options.route,
      status: options.status.toString(),
    });
    incrementCounter('http.requests.total', {
      method: options.method,
      route: options.route,
      status: options.status.toString(),
    });
  },

  /**
   * Record database query metrics
   */
  dbQuery: (duration: number, options: { operation: string; table?: string; success: boolean }) => {
    recordMetric('db.query.duration', duration, {
      operation: options.operation,
      table: options.table || 'unknown',
      status: options.success ? 'success' : 'error',
    });
    incrementCounter('db.queries.total', {
      operation: options.operation,
      table: options.table || 'unknown',
      status: options.success ? 'success' : 'error',
    });
  },

  /**
   * Record cache operations
   */
  cacheOperation: (options: { operation: 'hit' | 'miss' | 'set'; key?: string }) => {
    incrementCounter('cache.operations', {
      operation: options.operation,
      key: options.key || 'unknown',
    });
  },

  /**
   * Record business metrics
   */
  businessEvent: (eventName: string, labels?: MetricLabels) => {
    incrementCounter(`business.events.${eventName}`, labels);
  },

  /**
   * Record error occurrences
   */
  error: (errorType: string, labels?: MetricLabels) => {
    incrementCounter('errors.total', {
      type: errorType,
      ...labels,
    });
  },
} as const;

/**
 * Create a custom meter for a specific subsystem
 *
 * @example
 * ```ts
 * const orderMeter = createMeter('afenda-orders');
 * const orderCounter = orderMeter.createCounter('orders.processed');
 * ```
 */
export function createMeter(name: string): Meter {
  return metrics.getMeter(name);
}
