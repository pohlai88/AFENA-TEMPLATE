/**
 * Issue Builder Helper
 * 
 * Canonical issue builder to eliminate repetition and drift.
 * All validators should use this to create issues.
 */

import type { ValidationCode } from './codes';
import type { ValidationContext, ValidationIssue, ValidationSeverity } from './types';

/**
 * Create a validation issue with consistent structure
 * 
 * @param code - Machine-readable error code
 * @param context - Validation context (provides path)
 * @param params - Additional parameters for error context
 * @param severity - Issue severity (default: 'error')
 * @returns Structured validation issue
 */
export function issue(
  code: ValidationCode,
  context: ValidationContext,
  params?: Record<string, unknown>,
  severity: ValidationSeverity = 'error'
): ValidationIssue {
  return {
    code,
    path: context.fieldPath,
    severity,
    ...(params !== undefined ? { params } : {}),
  };
}

/**
 * Create an error issue (shorthand)
 */
export function error(
  code: ValidationCode,
  context: ValidationContext,
  params?: Record<string, unknown>
): ValidationIssue {
  return issue(code, context, params, 'error');
}

/**
 * Create a warning issue (shorthand)
 */
export function warn(
  code: ValidationCode,
  context: ValidationContext,
  params?: Record<string, unknown>
): ValidationIssue {
  return issue(code, context, params, 'warn');
}

/**
 * Create a success result
 */
export function ok<T>(value: T, warnings?: ValidationIssue[]) {
  return warnings && warnings.length > 0
    ? { ok: true as const, value, issues: warnings }
    : { ok: true as const, value };
}

/**
 * Create a failure result
 */
export function fail(issues: ValidationIssue[]) {
  return { ok: false as const, issues };
}
