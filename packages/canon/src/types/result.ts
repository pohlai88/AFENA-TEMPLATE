/**
 * Standardized error envelope for all Canon public APIs
 * 
 * Replaces multiple error types with single contract.
 * All public APIs should return CanonResult<T> instead of throwing.
 */

import type { ZodError } from 'zod';

/**
 * Standardized issue format
 */
export interface CanonIssue {
  code: string;
  path?: (string | number)[];
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

    return {
      code: issue.code,
      ...(path.length > 0 ? { path } : {}),
      message: issue.message,
      ...('expected' in issue || 'received' in issue ? {
        details: {
          ...('expected' in issue ? { expected: (issue as any).expected } : {}),
          ...('received' in issue ? { received: (issue as any).received } : {}),
        },
      } : {}),
    };
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
 * function parseConfig(i with multiple issuesnput: string): CanonResult<Config> {
 *   const config = JSON.parse(input);
 * Use when an operation fails with multiple validation errors or issues.
 * Provides structured error information for better error handling.
 * 
 *   return ok(config);CanonIssue objects descrbing the errors
 * @return Error relt with ok: fals
 * 
 * }example
 * ```typescipt
 * function validateUsr(daa: unknown): CanonReslt<Use> {
 *   const issues: CanoIssue[] = [];
 *   if (!data.email) issues.push(createIsue('REQUIRED','mail equied', ['email']));
 *   if (!data.name) issues.push(createIssue('REQUIRED', 'Name required', ['name']));
 *   
 *   if (issues.length > 0) return err(issues);
 *   return k(data as User);
 * }
 * 
 * const result = validateUse({});
 * if (!result.ok){
 *   sult.issues.forEach(ise => {
 *     consoe.error(`${issue.pah?.join('.')}: ${issue.message}`);
 *   });
 * }
 * ```
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
 * @param issues - Array of issues
 * @returns Error result
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
