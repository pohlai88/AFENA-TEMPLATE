/**
 * Correlation ID utilities for request tracing
 *
 * @module correlation
 */

import { createLogger } from 'afenda-logger';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import type { CorrelationIdConfig } from './types';

const logger = createLogger({ name: 'observability:correlation' });

// AsyncLocalStorage for correlation context
const correlationStorage = new AsyncLocalStorage<Map<string, string>>();

const DEFAULT_HEADER_NAME = 'x-correlation-id';

/**
 * Generate a new correlation ID
 */
function generateCorrelationId(): string {
  return randomUUID();
}

/**
 * Get the current correlation ID from context
 *
 * @example
 * ```ts
 * const correlationId = getCorrelationId();
 * logger.info('Processing request', { correlationId });
 * ```
 */
export function getCorrelationId(): string | undefined {
  const store = correlationStorage.getStore();
  return store?.get('correlationId');
}

/**
 * Set correlation ID in current context
 *
 * @example
 * ```ts
 * setCorrelationId('abc-123-def-456');
 * ```
 */
export function setCorrelationId(id: string): void {
  const store = correlationStorage.getStore();
  if (store) {
    store.set('correlationId', id);
  }
}

/**
 * Extract correlation ID from request headers
 *
 * @example
 * ```ts
 * const correlationId = extractCorrelationId(request.headers, {
 *   headerName: 'x-request-id',
 *   generateIfMissing: true,
 * });
 * ```
 */
export function extractCorrelationId(
  headers: Headers | Record<string, string | string[] | undefined>,
  config?: CorrelationIdConfig,
): string {
  const headerName = config?.headerName || DEFAULT_HEADER_NAME;
  const generateIfMissing = config?.generateIfMissing ?? true;
  const generator = config?.generator || generateCorrelationId;

  let correlationId: string | undefined;

  if (headers instanceof Headers) {
    correlationId = headers.get(headerName) || undefined;
  } else {
    const value = headers[headerName];
    correlationId = Array.isArray(value) ? value[0] : value;
  }

  if (!correlationId && generateIfMissing) {
    correlationId = generator();
    logger.debug({ correlationId }, 'Generated new correlation ID');
  }

  return correlationId || generator();
}

/**
 * Run a function within a correlation context
 *
 * @example
 * ```ts
 * await runWithCorrelationId('abc-123', async () => {
 *   // All code here has access to correlation ID
 *   const id = getCorrelationId(); // 'abc-123'
 *   await processRequest();
 * });
 * ```
 */
export async function runWithCorrelationId<T>(
  correlationId: string,
  fn: () => Promise<T>,
): Promise<T> {
  const store = new Map<string, string>();
  store.set('correlationId', correlationId);

  return correlationStorage.run(store, fn);
}

/**
 * Middleware factory for Next.js API routes
 *
 * @example
 * ```ts
 * // middleware.ts
 * import { correlationMiddleware } from 'afenda-observability/correlation';
 *
 * export const middleware = correlationMiddleware();
 * ```
 */
export function correlationMiddleware(config?: CorrelationIdConfig) {
  return async function middleware(request: Request): Promise<Response | void> {
    const correlationId = extractCorrelationId(request.headers, config);

    return runWithCorrelationId(correlationId, async () => {
      // Continue with request processing
      // The correlation ID is now available via getCorrelationId()
      return undefined;
    });
  };
}

/**
 * Add correlation ID to response headers
 *
 * @example
 * ```ts
 * const response = Response.json(data);
 * return addCorrelationHeader(response);
 * ```
 */
export function addCorrelationHeader(
  response: Response,
  correlationId?: string,
  headerName = DEFAULT_HEADER_NAME,
): Response {
  const id = correlationId || getCorrelationId();

  if (id) {
    response.headers.set(headerName, id);
  }

  return response;
}

/**
 * Wrap a fetch request to propagate correlation ID
 *
 * @example
 * ```ts
 * const response = await fetchWithCorrelation('https://api.example.com/users');
 * ```
 */
export async function fetchWithCorrelation(
  url: string | URL | Request,
  init?: RequestInit,
  headerName = DEFAULT_HEADER_NAME,
): Promise<Response> {
  const correlationId = getCorrelationId();

  const headers = new Headers(init?.headers);

  if (correlationId) {
    headers.set(headerName, correlationId);
  }

  return fetch(url, {
    ...init,
    headers,
  });
}

/**
 * Higher-order function to wrap async functions with correlation context
 *
 * @example
 * ```ts
 * const processOrder = withCorrelation(async (orderId: string) => {
 *   const correlationId = getCorrelationId();
 *   logger.info('Processing order', { orderId, correlationId });
 *   // ...
 * });
 * ```
 */
export function withCorrelation<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    const existingId = getCorrelationId();

    if (existingId) {
      // Already in correlation context
      return fn(...args);
    }

    // Create new correlation context
    const correlationId = generateCorrelationId();
    return runWithCorrelationId(correlationId, () => fn(...args));
  };
}
