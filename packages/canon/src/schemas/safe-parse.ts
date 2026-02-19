/**
 * Type-Safe Parse Wrappers
 * 
 * Provides enhanced error handling for Zod schema validation
 * with structured error types and better developer experience.
 * 
 * @module schemas/safe-parse
 */

import { z } from 'zod';

import { type SchemaErrorCode, isSchemaErrorCode } from './error-codes';

/**
 * Parse result discriminated union
 * 
 * Use this instead of Zod's SafeParseReturnType for better type inference.
 */
export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: SchemaValidationError };

/**
 * Structured schema validation error
 * 
 * Extends Error with Zod issues and optional error code.
 * Provides better debugging and logging capabilities.
 */
export class SchemaValidationError extends Error {
  constructor(
    public readonly code: SchemaErrorCode | string,
    public readonly issues: z.ZodIssue[],
    public readonly path?: (string | number)[]
  ) {
    super(`Schema validation failed: ${code}`);
    this.name = 'SchemaValidationError';

    // Maintain proper stack trace for V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SchemaValidationError);
    }
  }

  /**
   * Get human-readable error message
   * 
   * Formats all issues into a readable string.
   */
  toReadableString(): string {
    const issueMessages = this.issues.map(issue => {
      const path = issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
      return `${path}${issue.message}`;
    });
    return issueMessages.join('; ');
  }

  /**
   * Get first error message
   * 
   * Useful for displaying a single error to users.
   */
  getFirstMessage(): string {
    return this.issues[0]?.message || 'Validation failed';
  }
}

/**
 * Extract error code from Zod error
 * 
 * Attempts to find a CANON_ prefixed error code in the issues.
 * Falls back to generic code if none found.
 */
function extractErrorCode(error: z.ZodError): SchemaErrorCode | string {
  for (const issue of error.issues) {
    if (issue.code === z.ZodIssueCode.custom && issue.message.startsWith('CANON_')) {
      const match = issue.message.match(/^(CANON_[A-Z_]+)/);
      if (match?.[1] && isSchemaErrorCode(match[1])) {
        return match[1];
      }
    }
  }
  return 'VALIDATION_FAILED';
}

/**
 * Safe parse with structured error handling
 * 
 * Wraps Zod's safeParse with enhanced error types.
 * Use this for all schema validation in application code.
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns ParseResult with typed success/error
 * 
 * @example
 * ```typescript
 * const result = safeParse(entityIdSchema, input);
 * if (!result.success) {
 *   logger.error('Validation failed', { 
 *     code: result.error.code,
 *     message: result.error.getFirstMessage()
 *   });
 *   return;
 * }
 * // result.data is now typed as EntityId
 * ```
 */
export function safeParse<T>(
  schema: z.ZodType<T>,
  data: unknown
): ParseResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return result;
  }

  const firstPath = result.error.issues[0]?.path;
  const filteredPath = firstPath?.filter((p): p is string | number =>
    typeof p === 'string' || typeof p === 'number'
  );

  return {
    success: false,
    error: new SchemaValidationError(
      extractErrorCode(result.error),
      result.error.issues,
      filteredPath
    ),
  };
}

/**
 * Parse with exception throwing
 * 
 * Throws SchemaValidationError on failure.
 * Use when you want exceptions instead of result types.
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 * @throws {SchemaValidationError} If validation fails
 */
export function parseOrThrow<T>(
  schema: z.ZodType<T>,
  data: unknown
): T {
  const result = safeParse(schema, data);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}
