import { runWithContext } from './context';
import { createRequestLogger, logRequest } from './logger';

import type { RequestContext } from './types';
import type { Logger } from 'pino';

/** Minimal request shape — avoids coupling to a specific `next` package instance. */
interface MiddlewareRequest {
  readonly method: string;
  readonly url: string;
  readonly headers: { get(name: string): string | null };
}

// Simple UUID generator for Edge Runtime
function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface RequestWithLogger extends MiddlewareRequest {
  logger: Logger;
  requestId: string;
  startTime: number;
  request: MiddlewareRequest;
}

export interface MiddlewareContext {
  requestId: string;
  logger: Logger;
  startTime: number;
  alsContext: RequestContext;
}

export function createRequestLoggerMiddleware(baseLogger: Logger, service = 'web') {
  return function requestLoggerMiddleware(
    request: MiddlewareRequest
  ): MiddlewareContext {
    const requestId = request.headers.get('x-request-id') ?? randomUUID();
    const startTime = Date.now();

    const userAgent = request.headers.get('user-agent');
    const forwardedFor = request.headers.get('x-forwarded-for');

    const logOptions: Parameters<typeof createRequestLogger>[1] = {
      requestId,
      method: request.method,
      url: request.url,
    };

    if (userAgent) {
      logOptions.userAgent = userAgent;
    }

    if (forwardedFor) {
      logOptions.ip = forwardedFor;
    }

    const logger = createRequestLogger(baseLogger, logOptions);

    const alsContext: RequestContext = {
      request_id: requestId,
      service,
    };

    return {
      requestId,
      logger,
      startTime,
      alsContext,
    };
  };
}

/**
 * Run a callback within the ALS request context established by the middleware.
 * All logs emitted inside `fn` will automatically include request_id, service, etc.
 */
export function runInRequestContext<T>(
  ctx: MiddlewareContext,
  fn: () => T
): T {
  return runWithContext(ctx.alsContext, fn);
}

export function logResponse(
  logger: Logger,
  requestId: string,
  startTime: number,
  method: string,
  url: string,
  statusCode: number,
  error?: Error
): void {
  const responseTime = Date.now() - startTime;

  const logData: Parameters<typeof logRequest>[1] = {
    requestId,
    method,
    url,
    statusCode,
    responseTime,
  };

  if (error !== undefined) {
    logData.error = error;
  }

  logRequest(logger, logData);
}

export function createLoggingMiddleware(baseLogger: Logger, service = 'web') {
  const requestLogger = createRequestLoggerMiddleware(baseLogger, service);

  return {
    onRequest: (request: MiddlewareRequest) => {
      return requestLogger(request);
    },
    onResponse: (
      context: MiddlewareContext,
      method: string,
      url: string,
      statusCode: number,
      error?: Error
    ) => {
      logResponse(
        context.logger,
        context.requestId,
        context.startTime,
        method,
        url,
        statusCode,
        error
      );
    },
    runInContext: <T>(context: MiddlewareContext, fn: () => T): T => {
      return runInRequestContext(context, fn);
    },
  };
}
