/**
 * Pino Logger Adapter for LiteMeta Instrumentation
 * 
 * Optional adapter that maps instrumentation hooks to Pino logger.
 * Tree-shakeable - only included if imported.
 * 
 * @example
 * ```typescript
 * import pino from 'pino';
 * import { createPinoAdapter } from 'afena-canon/lite-meta/adapters/pino-adapter';
 * 
 * const logger = pino();
 * const hooks = createPinoAdapter(logger);
 * setInstrumentationHooks(hooks);
 * ```
 */

import type {
  InstrumentationHooks,
  CallContext,
  CallEndContext,
  CacheContext,
  ErrorContext,
} from '../hooks/instrumentation';

/**
 * Pino logger interface (minimal subset)
 * Allows any Pino-compatible logger
 */
export interface PinoLogger {
  trace(obj: object, msg?: string): void;
  debug(obj: object, msg?: string): void;
  info(obj: object, msg?: string): void;
  warn(obj: object, msg?: string): void;
  error(obj: object, msg?: string): void;
}

/**
 * Pino adapter options
 */
export interface PinoAdapterOptions {
  /**
   * Log level for call start events (default: 'trace')
   */
  callStartLevel?: 'trace' | 'debug' | 'info';

  /**
   * Log level for call end events (default: 'debug')
   */
  callEndLevel?: 'trace' | 'debug' | 'info';

  /**
   * Log level for error events (default: 'error')
   */
  errorLevel?: 'error' | 'warn';

  /**
   * Log level for cache events (default: 'trace')
   */
  cacheLevel?: 'trace' | 'debug';

  /**
   * Whether to log function arguments (default: false)
   * WARNING: May log sensitive data
   */
  logArgs?: boolean;

  /**
   * Whether to log function results (default: false)
   * WARNING: May log sensitive data
   */
  logResults?: boolean;

  /**
   * Minimum duration (ms) to log slow calls (default: undefined)
   * Only logs calls that exceed this duration
   */
  slowCallThreshold?: number;
}

/**
 * Create Pino adapter for instrumentation hooks
 * 
 * @param logger - Pino logger instance
 * @param options - Adapter options
 * @returns Instrumentation hooks that log to Pino
 */
export function createPinoAdapter(
  logger: PinoLogger,
  options: PinoAdapterOptions = {}
): InstrumentationHooks {
  const {
    callStartLevel = 'trace',
    callEndLevel = 'debug',
    errorLevel = 'error',
    cacheLevel = 'trace',
    logArgs = false,
    logResults = false,
    slowCallThreshold,
  } = options;

  return {
    onCallStart: (context: CallContext) => {
      const logData: Record<string, unknown> = {
        function: context.functionName,
        ...(logArgs ? { args: context.args } : {}),
        ...context.metadata,
      };

      logger[callStartLevel](logData, `Call started: ${context.functionName}`);
    },

    onCallEnd: (context: CallEndContext) => {
      // Skip if below slow call threshold
      if (slowCallThreshold && context.duration < slowCallThreshold) {
        return;
      }

      const logData: Record<string, unknown> = {
        function: context.functionName,
        duration: context.duration,
        success: context.success,
        ...(logResults && context.success ? { result: context.result } : {}),
        ...context.metadata,
      };

      const level = context.success ? callEndLevel : errorLevel;
      const msg = context.success
        ? `Call completed: ${context.functionName} (${context.duration.toFixed(2)}ms)`
        : `Call failed: ${context.functionName} (${context.duration.toFixed(2)}ms)`;

      logger[level](logData, msg);
    },

    onError: (context: ErrorContext) => {
      const logData: Record<string, unknown> = {
        function: context.functionName,
        error: {
          name: context.error.name,
          message: context.error.message,
          stack: context.error.stack,
        },
        ...(logArgs ? { args: context.args } : {}),
        ...context.metadata,
      };

      logger[errorLevel](logData, `Error in ${context.functionName}: ${context.error.message}`);
    },

    onCacheHit: (context: CacheContext) => {
      const logData: Record<string, unknown> = {
        cache: context.cacheName,
        key: context.key,
        operation: 'hit',
        ...context.metadata,
      };

      logger[cacheLevel](logData, `Cache hit: ${context.cacheName}[${context.key}]`);
    },

    onCacheMiss: (context: CacheContext) => {
      const logData: Record<string, unknown> = {
        cache: context.cacheName,
        key: context.key,
        operation: 'miss',
        ...context.metadata,
      };

      logger[cacheLevel](logData, `Cache miss: ${context.cacheName}[${context.key}]`);
    },

    onCacheSet: (context: CacheContext) => {
      const logData: Record<string, unknown> = {
        cache: context.cacheName,
        key: context.key,
        operation: 'set',
        ...context.metadata,
      };

      logger[cacheLevel](logData, `Cache set: ${context.cacheName}[${context.key}]`);
    },

    onCacheEvict: (context: CacheContext) => {
      const logData: Record<string, unknown> = {
        cache: context.cacheName,
        key: context.key,
        operation: 'evict',
        ...context.metadata,
      };

      logger[cacheLevel](logData, `Cache evict: ${context.cacheName}[${context.key}]`);
    },

    onCacheClear: (context: CacheContext) => {
      const logData: Record<string, unknown> = {
        cache: context.cacheName,
        operation: 'clear',
        ...context.metadata,
      };

      logger[cacheLevel](logData, `Cache clear: ${context.cacheName}`);
    },
  };
}

/**
 * Create minimal Pino adapter (only errors and slow calls)
 * 
 * Useful for production environments where you only want critical logs.
 * 
 * @param logger - Pino logger instance
 * @param slowCallThreshold - Minimum duration (ms) to log (default: 100)
 * @returns Minimal instrumentation hooks
 */
export function createMinimalPinoAdapter(
  logger: PinoLogger,
  slowCallThreshold = 100
): InstrumentationHooks {
  return {
    onCallEnd: (context: CallEndContext) => {
      if (!context.success || context.duration >= slowCallThreshold) {
        const logData: Record<string, unknown> = {
          function: context.functionName,
          duration: context.duration,
          success: context.success,
        };

        const level = context.success ? 'warn' : 'error';
        const msg = context.success
          ? `Slow call: ${context.functionName} (${context.duration.toFixed(2)}ms)`
          : `Failed call: ${context.functionName}`;

        logger[level](logData, msg);
      }
    },

    onError: (context: ErrorContext) => {
      logger.error(
        {
          function: context.functionName,
          error: {
            name: context.error.name,
            message: context.error.message,
            stack: context.error.stack,
          },
        },
        `Error in ${context.functionName}: ${context.error.message}`
      );
    },
  };
}
