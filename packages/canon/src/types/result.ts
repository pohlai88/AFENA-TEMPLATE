/**
 * Standardized error envelope for all Canon public APIs
 * 
 * Replaces multiple error types with single contract.
 * All public APIs should return CanonResult<T> instead of throwing.
 */

import type { ZodError } from 'zod';

/**
 * Well-known Canon issue codes (core set)
 * 
 * Stability Contract: These codes are API-stable.
 * Custom codes are allowed but should follow UPPER_SNAKE_CASE.
 */
export const CANON_ISSUE_CODES = [
  'REQUIRED',
  'INVALID_TYPE',
  'INVALID_ENUM',
  'INVALID_UUID',
  'INVALID_FORMAT',
  'TOO_SHORT',
  'TOO_LONG',
  'OUT_OF_RANGE',
  'INVALID_EMAIL',
  'INVALID_URL',
  'INVALID_PHONE',
  'DUPLICATE',
  'NOT_FOUND',
  'CONFLICT',
] as const;

export type WellKnownIssueCode = (typeof CANON_ISSUE_CODES)[number];

/**
 * Issue code type (allows custom codes for forward compatibility)
 * 
 * Use well-known codes when possible. Custom codes should be UPPER_SNAKE_CASE.
 */
export type CanonIssueCode = WellKnownIssueCode | (string & {});

/**
 * Standardized issue format
 * 
 * Stability Contract:
 * - `code` must be stable; treat as API
 * - `path` is readonly array of string | number
 * - `details` is JSON-serializable (Record<string, unknown>)
 */
export interface CanonIssue {
  code: CanonIssueCode;
  path?: readonly (string | number)[];
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Result type for Canon operations (Railway-oriented programming)
 */
export type CanonResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: CanonIssue[] };

/**
 * Convert Zod error to Canon issues
 * 
 * @param error - Zod validation error
 * @returns Array of Canon issues
 */
export function zodErrorToCanonIssues(error: ZodError): CanonIssue[] {
  return error.issues.map(issue => {
    // Filter out symbols from path (PropertyKey[] -> (string | number)[])
    const path = issue.path.filter((p): p is string | number => typeof p !== 'symbol');

    const baseIssue: CanonIssue = {
      code: issue.code,
      message: issue.message,
      ...(path.length > 0 ? { path } : {}),
    };

    // Safe extraction without typing all Zod variants
    const details: Record<string, unknown> = {};
    if ('expected' in issue && issue.expected !== undefined) {
      details.expected = issue.expected;
    }
    if ('received' in issue && issue.received !== undefined) {
      details.received = issue.received;
    }

    if (Object.keys(details).length > 0) {
      return { ...baseIssue, details };
    }

    return baseIssue;
  });
}

/**
 * Create a single Canon issue
 * 
 * @param code - Error code (e.g., 'INVALID_TYPE', 'STRING_TOO_LONG')
 * @param message - Human-readable error message
 * @param path - Optional path to the field that failed
 * @param details - Optional additional details
 * @returns Canon issue
 */
export function createIssue(
  code: string,
  message: string,
  path?: (string | number)[],
  details?: Record<string, unknown>
): CanonIssue {
  return {
    code,
    message,
    ...(path ? { path } : {}),
    ...(details ? { details } : {}),
  };
}

/**
 * Create a success result
 * 
 * Use for successful operations in public APIs. Wraps the return value
 * in a standardized envelope for consistent error handling.
 * 
 * @param value - The successful result value
 * @returns Success result with ok: true
 * 
 * @example
 * ```typescript
 * function parseConfig(input: string): CanonResult<Config> {
 *   const config = JSON.parse(input);
 *   return ok(config);
 * }
 * 
 * const result = parseConfig('{"key": "value"}');
 * if (result.ok) {
 *   console.log(result.value); // Type: Config
 * }
 * ```
 */
export function ok<T>(value: T): CanonResult<T> {
  return { ok: true, value };
}

/**
 * Create an error result
 * 
 * Use when an operation fails with multiple validation errors or issues.
 * Provides structured error information for better error handling.
 * 
 * **Stability Contract:**
 * - `CanonIssue.code` must be stable; treat as API
 * - `CanonIssue.details` is JSON-serializable (Record<string, unknown>)
 * - `CanonIssue.path` is readonly array of string | number
 * 
 * @param issues - Array of CanonIssue objects describing the errors
 * @returns Error result with ok: false
 * 
 * @example
 * ```typescript
 * function validateUser(data: unknown): CanonResult<User> {
 *   const issues: CanonIssue[] = [];
 *   if (!data.email) issues.push(createIssue('REQUIRED', 'Email required', ['email']));
 *   if (!data.name) issues.push(createIssue('REQUIRED', 'Name required', ['name']));
 *   
 *   if (issues.length > 0) return err(issues);
 *   return ok(data as User);
 * }
 * 
 * const result = validateUser({});
 * if (!result.ok) {
 *   result.issues.forEach(issue => {
 *     console.error(`${issue.path?.join('.')}: ${issue.message}`);
 *   });
 * }
 * ```
 */
export function err<T>(issues: CanonIssue[]): CanonResult<T> {
  return { ok: false, issues };
}

/**
 * Create an error result from a single issue
 * 
 * @param code - Error code
 * @param message - Error message
 * @param path - Optional path
 * @param details - Optional details
 * @returns Error result
 */
export function errSingle<T>(
  code: string,
  message: string,
  path?: (string | number)[],
  details?: Record<string, unknown>
): CanonResult<T> {
  return { ok: false, issues: [createIssue(code, message, path, details)] };
}
