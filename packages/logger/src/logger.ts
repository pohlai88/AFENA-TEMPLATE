import pino, { type Logger } from 'pino';

import { getConfig } from './config';
import { bindLogger } from './context';

import type {
  AuditLogContext,
  ChildLoggerOptions,
  ComponentName,
  LogContext,
  RequestLoggerOptions,
} from './types';

// ---------------------------------------------------------------------------
// Base singleton
// ---------------------------------------------------------------------------
let instance: Logger | null = null;

/**
 * Create (or return cached) base Pino instance.
 * Pass optional `context` to add static fields to every log line.
 */
export function createLogger(context?: LogContext): Logger {
  if (instance && !context) {
    return instance;
  }

  const config = getConfig();
  const baseContext = {
    environment: process.env.NODE_ENV ?? 'development',
    ...context,
  };

  const pinoOpts: pino.LoggerOptions = {
    name: config.name ?? config.base?.service ?? 'afenda',
    level: config.level ?? 'info',
    timestamp: config.timestamp !== false ? pino.stdTimeFunctions.isoTime : false,
    depthLimit: 5,
    edgeLimit: 100,
    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
    base: {
      ...config.base,
      ...baseContext,
    },
    ...(config.redact && { redact: config.redact }),
  };

  const logger = config.transport
    ? pino(pinoOpts, pino.transport(config.transport))
    : pino(pinoOpts, pino.destination(1));

  instance ??= logger;

  return logger;
}

// ---------------------------------------------------------------------------
// ALS-aware logger accessor
// ---------------------------------------------------------------------------

/**
 * Returns a logger bound to the current ALS request context.
 * If no ALS context exists, returns the base singleton.
 */
export function getLogger(): Logger {
  instance ??= createLogger();
  return bindLogger(instance);
}

// ---------------------------------------------------------------------------
// Child logger factories
// ---------------------------------------------------------------------------

/** Create a child logger scoped to a CRUD-SAP component. */
export function createComponentLogger(parent: Logger, component: ComponentName): Logger {
  return parent.child({ component });
}

/** Create a child logger for audit channel with stable schema. */
export function createAuditLogger(parent: Logger, ctx: Omit<AuditLogContext, 'channel'>): Logger {
  return parent.child({ channel: 'audit' as const, ...ctx });
}

// ---------------------------------------------------------------------------
// Backward-compatible helpers
// ---------------------------------------------------------------------------

export function createChildLogger(parent: Logger, options: ChildLoggerOptions): Logger {
  return parent.child(options);
}

export function createRequestLogger(parent: Logger, options: RequestLoggerOptions): Logger {
  const { requestId, ...context } = options;

  return parent.child({
    requestId,
    ...context,
  });
}

export function logRequest(
  logger: Logger,
  options: RequestLoggerOptions & { error?: Error },
): void {
  const { requestId, method, url, statusCode, responseTime, userAgent, ip, error, ...context } =
    options;

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
    logger.error({ ...logData, err: error }, 'Request failed');
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
  metadata?: Record<string, unknown>,
): void {
  logger.info(
    {
      operation,
      duration,
      ...metadata,
    },
    `Performance: ${operation}`,
  );
}

export function logError(logger: Logger, error: Error, context?: Record<string, unknown>): void {
  logger.error(
    {
      err: error,
      ...context,
    },
    error.message || 'An error occurred',
  );
}

export function withLogger<T extends Record<string, unknown>>(
  obj: T,
  logger?: Logger,
): T & { logger: Logger } {
  return {
    ...obj,
    logger: logger ?? getLogger(),
  };
}

/**
 * Flush any buffered log lines to the destination.
 * Call this in shutdown handlers to prevent losing the last few log lines.
 */
export function flushLogger(): void {
  if (instance) {
    instance.flush();
  }
}
