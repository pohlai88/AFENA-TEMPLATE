/**
 * Safe Wrapper Functions
 * 
 * Provides *Safe() versions of core functions that:
 * - Never throw errors (return Result type instead)
 * - Enforce CPU budgets
 * - Provide structured error information
 */

import type { MetaClassification } from '../../enums/meta-classification';
import type { ParsedAssetKey } from '../core';
import { classifyColumns, parseAssetKey } from '../core';
import { BudgetExceededError, CpuBudgetTracker, DEFAULT_BUDGETS } from './cpu-budget';
import { ClassificationError, InvalidAssetKeyError, isLiteMetaError } from './errors';

/**
 * Result type for safe operations
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Safe version of parseAssetKey
 * 
 * Never throws - returns Result type instead.
 * Enforces CPU budget for protection against malicious input.
 * 
 * @param key - Asset key to parse
 * @param budget - Optional CPU budget (defaults to 'fast')
 * @returns Result with parsed components or error
 * 
 * @example
 * ```typescript
 * const result = parseAssetKeySafe('db.rec.mydb.public.users');
 * if (result.ok) {
 *   console.log(result.value.assetType); // 'table'
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
export function parseAssetKeySafe(
  key: string,
  budget = DEFAULT_BUDGETS.fast
): Result<ParsedAssetKey, InvalidAssetKeyError | BudgetExceededError> {
  try {
    const tracker = new CpuBudgetTracker({
      ...budget,
      operationName: 'parseAssetKey',
    });

    // Check budget before parsing
    tracker.check();

    const result = parseAssetKey(key);

    // Check budget after parsing
    tracker.check();

    return { ok: true, value: result };
  } catch (error) {
    // Convert to structured error
    if (error instanceof BudgetExceededError) {
      return { ok: false, error };
    }

    if (isLiteMetaError(error)) {
      return { ok: false, error: error as InvalidAssetKeyError };
    }

    // Wrap unknown errors
    return {
      ok: false,
      error: new InvalidAssetKeyError(
        key,
        error instanceof Error ? error.message : String(error)
      ),
    };
  }
}

/**
 * Safe version of classifyColumns
 * 
 * Never throws - returns Result type instead.
 * Enforces CPU budget for protection against large datasets.
 * 
 * @param columns - Columns to classify
 * @param budget - Optional CPU budget (defaults to 'normal')
 * @returns Result with classifications or error
 * 
 * @example
 * ```typescript
 * const result = classifyColumnsSafe([
 *   { name: 'email', sampleValues: ['user@example.com'] },
 * ]);
 * if (result.ok) {
 *   const classification = result.value.get('email');
 *   console.log(classification?.classification); // 'email'
 * } else {
 *   console.error(result.error.message);
 * }
 * ```
 */
export function classifyColumnsSafe(
  columns: Array<{ name: string; sampleValues?: unknown[] }>,
  budget = DEFAULT_BUDGETS.normal
): Result<
  Map<string, { classification: MetaClassification; confidence: number }>,
  ClassificationError | BudgetExceededError
> {
  try {
    const tracker = new CpuBudgetTracker({
      ...budget,
      operationName: 'classifyColumns',
    });

    // Check budget before classification
    tracker.check();

    const result = classifyColumns(columns);

    // Check budget after classification
    tracker.check();

    return { ok: true, value: result };
  } catch (error) {
    // Convert to structured error
    if (error instanceof BudgetExceededError) {
      return { ok: false, error };
    }

    if (isLiteMetaError(error)) {
      return { ok: false, error: error as ClassificationError };
    }

    // Wrap unknown errors
    return {
      ok: false,
      error: new ClassificationError(
        'unknown',
        error instanceof Error ? error.message : String(error)
      ),
    };
  }
}

/**
 * Unwrap a Result, throwing if error
 * 
 * @param result - Result to unwrap
 * @returns Value if ok
 * @throws Error if not ok
 */
export function unwrap<T, E extends Error>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
}

/**
 * Unwrap a Result, returning default value if error
 * 
 * @param result - Result to unwrap
 * @param defaultValue - Default value to return if error
 * @returns Value if ok, default value if error
 */
export function unwrapOr<T, E extends Error>(
  result: Result<T, E>,
  defaultValue: T
): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Map a Result value
 * 
 * @param result - Result to map
 * @param fn - Function to apply to value
 * @returns New Result with mapped value
 */
export function mapResult<T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.ok) {
    return { ok: true, value: fn(result.value) };
  }
  return result;
}

/**
 * Chain Result operations
 * 
 * @param result - Result to chain
 * @param fn - Function that returns a new Result
 * @returns New Result
 */
export function andThen<T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

/**
 * Check if Result is ok
 */
export function isOk<T, E extends Error>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

/**
 * Check if Result is error
 */
export function isError<T, E extends Error>(
  result: Result<T, E>
): result is { ok: false; error: E } {
  return !result.ok;
}
