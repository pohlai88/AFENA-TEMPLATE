/**
 * Typed Error Taxonomy for LiteMeta
 * 
 * Structured error types with context for better error handling and debugging.
 */

/**
 * Base error class for all LiteMeta errors
 */
export abstract class LiteMetaError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Invalid asset key format
 */
export class InvalidAssetKeyError extends LiteMetaError {
  constructor(key: string, reason: string, context?: Record<string, unknown>) {
    super(
      `Invalid asset key "${key}": ${reason}`,
      'INVALID_ASSET_KEY',
      { key, reason, ...context }
    );
  }
}

/**
 * Asset type mismatch
 */
export class AssetTypeMismatchError extends LiteMetaError {
  constructor(
    expected: string,
    actual: string,
    key: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Asset type mismatch for "${key}": expected ${expected}, got ${actual}`,
      'ASSET_TYPE_MISMATCH',
      { expected, actual, key, ...context }
    );
  }
}

/**
 * Classification failed
 */
export class ClassificationError extends LiteMetaError {
  constructor(
    columnName: string,
    reason: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Classification failed for column "${columnName}": ${reason}`,
      'CLASSIFICATION_FAILED',
      { columnName, reason, ...context }
    );
  }
}

/**
 * Batch operation failed
 */
export class BatchOperationError extends LiteMetaError {
  constructor(
    operation: string,
    failedCount: number,
    totalCount: number,
    context?: Record<string, unknown>
  ) {
    super(
      `Batch ${operation} failed: ${failedCount}/${totalCount} items failed`,
      'BATCH_OPERATION_FAILED',
      { operation, failedCount, totalCount, ...context }
    );
  }
}

/**
 * Cache operation failed
 */
export class CacheError extends LiteMetaError {
  constructor(
    operation: string,
    cacheName: string,
    reason: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Cache ${operation} failed for "${cacheName}": ${reason}`,
      'CACHE_ERROR',
      { operation, cacheName, reason, ...context }
    );
  }
}

/**
 * Validation failed
 */
export class ValidationError extends LiteMetaError {
  constructor(
    field: string,
    value: unknown,
    reason: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Validation failed for field "${field}": ${reason}`,
      'VALIDATION_FAILED',
      { field, value, reason, ...context }
    );
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends LiteMetaError {
  constructor(
    setting: string,
    reason: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Configuration error for "${setting}": ${reason}`,
      'CONFIGURATION_ERROR',
      { setting, reason, ...context }
    );
  }
}

/**
 * Type guard to check if error is a LiteMeta error
 */
export function isLiteMetaError(error: unknown): error is LiteMetaError {
  return error instanceof LiteMetaError;
}

/**
 * Type guard to check if error is a specific LiteMeta error type
 */
export function isErrorType<T extends LiteMetaError>(
  error: unknown,
  ErrorClass: new (...args: any[]) => T
): error is T {
  return error instanceof ErrorClass;
}

/**
 * Extract error context safely
 */
export function getErrorContext(error: unknown): Record<string, unknown> {
  if (isLiteMetaError(error)) {
    return error.context ?? {};
  }
  return {};
}

/**
 * Format error for logging
 */
export function formatError(error: unknown): string {
  if (isLiteMetaError(error)) {
    return JSON.stringify(error.toJSON(), null, 2);
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack}`;
  }

  return String(error);
}

/**
 * Create a user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  if (isLiteMetaError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}
