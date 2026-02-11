import pino, { type Logger } from 'pino';

import { getConfig } from './config';

import type { LogContext, ChildLoggerOptions, RequestLoggerOptions } from './types';

let instance: Logger | null = null;

export function createLogger(context?: LogContext): Logger {
  if (instance && !context) {
    return instance;
  }

  const config = getConfig();
  const baseContext = {
    environment: process.env.NODE_ENV ?? 'development',
    ...context,
  };

  const logger = pino(
    {
      ...config,
      base: {
        ...config.base,
        ...baseContext,
      },
    },
    pino.destination(1)
  );

  instance ??= logger;

  return logger;
}

export function getLogger(): Logger {
  instance ??= createLogger();
  return instance;
}

export function createChildLogger(
  parent: Logger,
  options: ChildLoggerOptions
): Logger {
  return parent.child(options);
}

export function createRequestLogger(
  parent: Logger,
  options: RequestLoggerOptions
): Logger {
  const { requestId, ...context } = options;

  return parent.child({
    requestId,
    ...context,
  });
}

export function logRequest(
  logger: Logger,
  options: RequestLoggerOptions & { error?: Error }
): void {
  const {
    requestId,
    method,
    url,
    statusCode,
    responseTime,
    userAgent,
    ip,
    error,
    ...context
  } = options;

  const logData = {
    requestId,
    method,
    url,
    statusCode,
    responseTime,
    userAgent,
    ip,
    ...context,
  };

  if (error) {
    logger.error(
      {
        ...logData,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      'Request failed'
    );
  } else if (statusCode && statusCode >= 400) {
    logger.warn(logData, 'Request completed with warning');
  } else {
    logger.info(logData, 'Request completed');
  }
}

export function logPerformance(
  logger: Logger,
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>
): void {
  logger.info(
    {
      operation,
      duration,
      ...metadata,
    },
    `Performance: ${operation}`
  );
}

export function logError(
  logger: Logger,
  error: Error,
  context?: Record<string, unknown>
): void {
  logger.error(
    {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    },
    error.message || 'An error occurred'
  );
}

export function withLogger<T extends Record<string, unknown>>(
  obj: T,
  logger?: Logger
): T & { logger: Logger } {
  return {
    ...obj,
    logger: logger ?? getLogger(),
  };
}
