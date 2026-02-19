/**
 * Validator Composition Primitives
 * 
 * Pure functional composition for building complex validators from simple rules.
 * All functions are deterministic and side-effect free.
 */

import type { ValidationContext, ValidationIssue, ValidationResult, Validator } from './types';

/**
 * Compose validators in sequence (pipeline)
 * Each validator receives the output of the previous validator.
 * Stops on first error.
 * 
 * @example
 * ```typescript
 * const validator = pipe(
 *   trimWhitespace,
 *   minLength(3),
 *   maxLength(50)
 * );
 * ```
 */
export function pipe<T>(...validators: Validator<unknown>[]): Validator<T> {
  return (value: unknown, context: ValidationContext): ValidationResult<T> => {
    let currentValue = value;
    const allIssues: ValidationIssue[] = [];

    for (const validator of validators) {
      const result = validator(currentValue, context);

      if (!result.ok) {
        return { ok: false, issues: [...allIssues, ...result.issues] };
      }

      // Accumulate warnings
      if (result.issues && result.issues.length > 0) {
        allIssues.push(...result.issues);
      }

      // Pass normalized value to next validator
      currentValue = result.value;
    }

    return allIssues.length > 0
      ? { ok: true, value: currentValue as T, issues: allIssues }
      : { ok: true, value: currentValue as T };
  };
}

/**
 * All validators must pass (AND logic)
 * Each validator receives the original value.
 * Collects all errors before failing.
 * 
 * @example
 * ```typescript
 * const validator = all(
 *   minLength(3),
 *   maxLength(50),
 *   pattern(/^[a-z]+$/)
 * );
 * ```
 */
export function all<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: unknown, context: ValidationContext): ValidationResult<T> => {
    const allIssues: ValidationIssue[] = [];
    let lastValue: T | undefined;

    for (const validator of validators) {
      const result = validator(value, context);

      if (!result.ok) {
        allIssues.push(...result.issues);
      } else {
        if (result.issues && result.issues.length > 0) {
          allIssues.push(...result.issues);
        }
        lastValue = result.value;
      }
    }

    // If any validator failed, return all errors
    const errors = allIssues.filter(i => i.severity === 'error');
    if (errors.length > 0) {
      return { ok: false, issues: allIssues };
    }

    // All passed, return last value with warnings
    const warnings = allIssues.filter(i => i.severity === 'warn');
    return warnings.length > 0
      ? { ok: true, value: lastValue!, issues: warnings }
      : { ok: true, value: lastValue! };
  };
}

/**
 * At least one validator must pass (OR logic)
 * Returns first successful result.
 * If all fail, returns all errors.
 * 
 * @example
 * ```typescript
 * const validator = any(
 *   emailFormat,
 *   phoneFormat,
 *   urlFormat
 * );
 * ```
 */
export function any<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: unknown, context: ValidationContext): ValidationResult<T> => {
    const allIssues: ValidationIssue[] = [];

    for (const validator of validators) {
      const result = validator(value, context);

      if (result.ok) {
        return result; // First success wins
      }

      allIssues.push(...result.issues);
    }

    // All failed
    return { ok: false, issues: allIssues };
  };
}

/**
 * Make a validator optional (null/undefined passes)
 * 
 * @example
 * ```typescript
 * const validator = optional(emailFormat);
 * // null and undefined pass, other values must be valid emails
 * ```
 */
export function optional<T>(validator: Validator<T>): Validator<T | null | undefined> {
  return (value: unknown, context: ValidationContext): ValidationResult<T | null | undefined> => {
    if (value === null || value === undefined) {
      return { ok: true, value };
    }

    return validator(value, context);
  };
}

/**
 * Conditional validation based on predicate
 * 
 * @example
 * ```typescript
 * const validator = when(
 *   (val) => typeof val === 'string' && val.startsWith('http'),
 *   urlFormat
 * );
 * ```
 */
export function when<T>(
  predicate: (value: unknown) => boolean,
  validator: Validator<T>
): Validator<T> {
  return (value: unknown, context: ValidationContext): ValidationResult<T> => {
    if (!predicate(value)) {
      return { ok: true, value: value as T };
    }

    return validator(value, context);
  };
}

/**
 * Transform value after successful validation
 * 
 * @example
 * ```typescript
 * const validator = transform(
 *   stringValidator,
 *   (str) => str.toUpperCase()
 * );
 * ```
 */
export function transform<T, U>(
  validator: Validator<T>,
  fn: (value: T) => U
): Validator<U> {
  return (value: unknown, context: ValidationContext): ValidationResult<U> => {
    const result = validator(value, context);

    if (!result.ok) {
      return result;
    }

    const transformed = fn(result.value);

    return result.issues && result.issues.length > 0
      ? { ok: true, value: transformed, issues: result.issues }
      : { ok: true, value: transformed };
  };
}

/**
 * Add context to validator (modify field path)
 * 
 * @example
 * ```typescript
 * const validator = withPath(['customFields', 'email'], emailFormat);
 * ```
 */
export function withPath<T>(
  pathSegment: string | number | (string | number)[],
  validator: Validator<T>
): Validator<T> {
  return (value: unknown, context: ValidationContext): ValidationResult<T> => {
    const segments = Array.isArray(pathSegment) ? pathSegment : [pathSegment];
    const newContext: ValidationContext = {
      ...context,
      fieldPath: [...context.fieldPath, ...segments],
    };

    return validator(value, newContext);
  };
}
