/**
 * Validation Core Types
 * 
 * Pure functional validation types with structured error reporting.
 * All validators are deterministic and side-effect free.
 */

import type { EntityType } from '../../types/entity';

/**
 * Validation issue severity
 */
export type ValidationSeverity = 'error' | 'warn';

/**
 * Structured validation issue with machine-readable code
 */
export interface ValidationIssue {
  /**
   * Machine-readable error code (e.g., 'VAL_STRING_TOO_LONG')
   */
  code: string;

  /**
   * Field path where issue occurred (e.g., ['customFields', 'phone'])
   */
  path: (string | number)[];

  /**
   * Issue severity
   */
  severity: ValidationSeverity;

  /**
   * Additional parameters for error context (e.g., { max: 50, actual: 72 })
   */
  params?: Record<string, unknown>;
}

/**
 * Validation result with optional warnings
 * 
 * - ok: true + issues: [] = success
 * - ok: true + issues: [warnings] = success with warnings
 * - ok: false + issues: [errors] = failure
 */
export type ValidationResult<T> =
  | { ok: true; value: T; issues?: ValidationIssue[] }
  | { ok: false; issues: ValidationIssue[] };

/**
 * Validation context for tracking field path and entity metadata
 */
export interface ValidationContext {
  /**
   * Entity type being validated (or 'unknown' for generic validation)
   */
  entityType: EntityType | 'unknown';

  /**
   * Current field path (e.g., ['customFields', 'email'])
   */
  fieldPath: (string | number)[];

  /**
   * Validation mode
   */
  mode: 'create' | 'update' | 'import' | 'system';

  /**
   * Additional metadata for context-aware validation
   */
  metadata?: Record<string, unknown>;
}

/**
 * Pure validator function
 * 
 * Takes unknown value and context, returns typed result.
 * Must be deterministic and side-effect free.
 */
export type Validator<T> = (
  value: unknown,
  context: ValidationContext
) => ValidationResult<T>;

/**
 * Validator with normalization
 * 
 * Returns normalized value on success.
 */
export type NormalizingValidator<T> = Validator<T>;

/**
 * Type guard for ValidationResult success
 */
export function isOk<T>(result: ValidationResult<T>): result is { ok: true; value: T; issues?: ValidationIssue[] } {
  return result.ok;
}

/**
 * Type guard for ValidationResult failure
 */
export function isError<T>(result: ValidationResult<T>): result is { ok: false; issues: ValidationIssue[] } {
  return !result.ok;
}

/**
 * Extract value from successful result
 * @throws Error if result is not ok
 */
export function unwrap<T>(result: ValidationResult<T>): T {
  if (result.ok) {
    return result.value;
  }
  throw new Error(`Validation failed: ${result.issues.map(i => i.code).join(', ')}`);
}

/**
 * Extract value from result or return default
 */
export function unwrapOr<T>(result: ValidationResult<T>, defaultValue: T): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}
