/**
 * Temporal Validation Rules
 * 
 * Pure validators for date/time constraints.
 * All validators are deterministic and side-effect free.
 */

import { VAL_CODES } from '../core/codes';
import { error, ok } from '../core/issue';
import type { ValidationContext, ValidationResult, Validator } from '../core/types';

/**
 * Validate ISO date format (YYYY-MM-DD)
 */
export function isoDate(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // ISO date format: YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { ok: false, issues: [error(VAL_CODES.DATE_INVALID_FORMAT, context, { format: 'YYYY-MM-DD' })] };
    }

    // Validate it's a real date
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { ok: false, issues: [error(VAL_CODES.DATE_INVALID_FORMAT, context, { format: 'YYYY-MM-DD' })] };
    }

    return ok(value);
  };
}

/**
 * Validate ISO datetime format (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
export function isoDatetime(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // Validate it's a real datetime
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { ok: false, issues: [error(VAL_CODES.DATETIME_INVALID_FORMAT, context, { format: 'ISO 8601' })] };
    }

    return ok(value);
  };
}

/**
 * Validate date is within range
 */
export function dateRange(minDate?: string, maxDate?: string): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { ok: false, issues: [error(VAL_CODES.DATE_INVALID_FORMAT, context)] };
    }

    if (minDate) {
      const min = new Date(minDate);
      if (date < min) {
        return { ok: false, issues: [error(VAL_CODES.DATE_OUT_OF_RANGE, context, { min: minDate, actual: value })] };
      }
    }

    if (maxDate) {
      const max = new Date(maxDate);
      if (date > max) {
        return { ok: false, issues: [error(VAL_CODES.DATE_OUT_OF_RANGE, context, { max: maxDate, actual: value })] };
      }
    }

    return ok(value);
  };
}

/**
 * Validate date is in the past
 */
export function pastDate(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { ok: false, issues: [error(VAL_CODES.DATE_INVALID_FORMAT, context)] };
    }

    const now = new Date();
    if (date >= now) {
      return { ok: false, issues: [error(VAL_CODES.DATE_OUT_OF_RANGE, context, { constraint: 'past', actual: value })] };
    }

    return ok(value);
  };
}

/**
 * Validate date is in the future
 */
export function futureDate(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { ok: false, issues: [error(VAL_CODES.DATE_INVALID_FORMAT, context)] };
    }

    const now = new Date();
    if (date <= now) {
      return { ok: false, issues: [error(VAL_CODES.DATE_OUT_OF_RANGE, context, { constraint: 'future', actual: value })] };
    }

    return ok(value);
  };
}
