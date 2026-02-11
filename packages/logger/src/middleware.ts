import type { NextRequest } from 'next/server';
import type { Logger } from 'pino';
import { createRequestLogger, logRequest } from './logger';

// Simple UUID generator for Edge Runtime
function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface RequestWithLogger extends NextRequest {
  logger: Logger;
  requestId: string;
  startTime: number;
  request: NextRequest
}

export function createRequestLoggerMiddleware(baseLogger: Logger) {
  return function requestLoggerMiddleware(
    request: NextRequest
  ): { requestId: string; logger: Logger; startTime: number } {
    const requestId = request.headers.get('x-request-id') || randomUUID();
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

    return {
      requestId,
      logger,
      startTime,
    };
  };
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

export function createLoggingMiddleware(baseLogger: Logger) {
  const requestLogger = createRequestLoggerMiddleware(baseLogger);

  return {
    onRequest: (request: NextRequest) => {
      return requestLogger(request);
    },
    onResponse: (
      context: ReturnType<typeof requestLogger>,
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
  };
}
