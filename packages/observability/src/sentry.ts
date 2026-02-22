/**
 * Sentry integration for error tracking and performance monitoring
 *
 * @module sentry
 */

import * as Sentry from '@sentry/node';
import { createLogger } from 'afenda-logger';
import type { SentryConfig } from './types';

const logger = createLogger({ name: 'observability:sentry' });

let initialized = false;

/**
 * Initialize Sentry error tracking
 *
 * @example
 * ```ts
 * initializeSentry({
 *   dsn: process.env.SENTRY_DSN!,
 *   environment: process.env.NODE_ENV || 'development',
 *   tracesSampleRate: 0.1,
 *   profilesSampleRate: 0.1,
 * });
 * ```
 */
export function initializeSentry(config: SentryConfig): void {
  if (initialized) {
    logger.warn('Sentry already initialized, skipping');
    return;
  }

  if (!config.dsn) {
    logger.warn('Sentry DSN not provided, skipping initialization');
    return;
  }

  try {
    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      release: config.release,
      debug: config.debug || false,

      // Performance monitoring
      tracesSampleRate: config.tracesSampleRate ?? 0.1,
      profilesSampleRate: config.profilesSampleRate ?? 0.1,

      // Integrations
      integrations: [
        Sentry.httpIntegration(),
        Sentry.nativeNodeFetchIntegration(),
        Sentry.nodeContextIntegration(),
      ],

      // Sampling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeSend(event: any, hint: any) {
        // Filter out specific errors if needed
        if (event.exception?.values?.[0]?.type === 'DatabaseConnectionError') {
          // Log but don't send to Sentry to avoid noise
          logger.warn({
            error: hint.originalException,
          }, 'Database connection error filtered from Sentry');
          return null;
        }
        return event;
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeSendTransaction(event: any) {
        // Filter out health check transactions
        if (event.transaction?.includes('/health') || event.transaction?.includes('/ready')) {
          return null;
        }
        return event;
      },
    } as any);

    initialized = true;

    logger.info({
      environment: config.environment,
      tracesSampleRate: config.tracesSampleRate,
    }, 'Sentry initialized');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Sentry');
  }
}

/**
 * Capture an exception in Sentry
 *
 * @example
 * ```ts
 * try {
 *   await processOrder(orderId);
 * } catch (error) {
 *   captureException(error, { orderId, userId });
 *   throw error;
 * }
 * ```
 */
export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (!initialized) return;

  Sentry.captureException(error, {
    extra: context,
  } as any);
}

/**
 * Capture a message in Sentry
 *
 * @example
 * ```ts
 * captureMessage('Unusual activity detected', 'warning', { userId, activityType });
 * ```
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: Record<string, unknown>,
): void {
  if (!initialized) return;

  Sentry.captureMessage(message, {
    level,
    extra: context,
  } as any);
}

/**
 * Set user context for error tracking
 *
 * @example
 * ```ts
 * setUser({ id: userId, email: user.email, username: user.name });
 * ```
 */
export function setUser(user: { id: string; email?: string; username?: string } | null): void {
  if (!initialized) return;
  Sentry.setUser(user);
}

/**
 * Set tags for error grouping
 *
 * @example
 * ```ts
 * setTags({ tenant: 'acme-corp', feature: 'orders' });
 * ```
 */
export function setTags(tags: Record<string, string>): void {
  if (!initialized) return;
  Sentry.setTags(tags);
}

/**
 * Add breadcrumb for error context
 *
 * @example
 * ```ts
 * addBreadcrumb('User clicked checkout button', 'user', { cartItems: 3 });
 * ```
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, unknown>,
): void {
  if (!initialized) return;

  Sentry.addBreadcrumb({
    message,
    category,
    data,
    timestamp: Date.now() / 1000,
  } as any);
}

/**
 * Wrap an async function to automatically capture errors
 *
 * @example
 * ```ts
 * export const GET = withSentry(async (request) => {
 *   const data = await fetchData();
 *   return Response.json(data);
 * });
 * ```
 */
export function withSentry<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        captureException(error);
      }
      throw error;
    }
  };
}

/**
 * Flush Sentry events (useful for serverless/edge functions)
 *
 * @example
 * ```ts
 * await flushSentry(2000);
 * ```
 */
export async function flushSentry(timeout = 2000): Promise<boolean> {
  if (!initialized) return true;
  return Sentry.flush(timeout);
}

/**
 * Start a Sentry transaction (for performance monitoring)
 *
 * @example
 * ```ts
 * const transaction = startTransaction('process-order', 'task');
 * try {
 *   await processOrder(orderId);
 *   transaction.setStatus('ok');
 * } catch (error) {
 *   transaction.setStatus('internal_error');
 *   throw error;
 * } finally {
 *   transaction.finish();
 * }
 * ```
 * 
 * @deprecated Sentry v8 removed startTransaction. Use automatic instrumentation or Sentry.startSpan() instead.
 */
export function startTransaction(name: string, op: string) {
  // Sentry v8 SDK removed startTransaction
  // Use startSpan as a compatibility wrapper
  let spanRef: any;
  Sentry.startSpan({ name, op }, () => {
    spanRef = Sentry.getActiveSpan();
  });
  return spanRef || { finish: () => { }, setStatus: () => { } };
}

/**
 * Export Sentry namespace for advanced usage
 */
export { Sentry };

