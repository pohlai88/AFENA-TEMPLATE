/**
 * Number Validation Rules
 * 
 * Pure validators for number constraints.
 * All validators are deterministic and side-effect free.
 */

import { VAL_CODES } from '../core/codes';
import { error, ok } from '../core/issue';
import type { ValidationContext, ValidationResult, Validator } from '../core/types';

/**
 * Validate minimum number value
 */
export function min(minValue: number): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    if (value < minValue) {
      return { ok: false, issues: [error(VAL_CODES.NUMBER_TOO_SMALL, context, { min: minValue, actual: value })] };
    }

    return ok(value);
  };
}

/**
 * Validate maximum number value
 */
export function max(maxValue: number): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    if (value > maxValue) {
      return { ok: false, issues: [error(VAL_CODES.NUMBER_TOO_LARGE, context, { max: maxValue, actual: value })] };
    }

    return ok(value);
  };
}

/**
 * Validate number is an integer
 */
export function integer(): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    if (!Number.isInteger(value)) {
      return { ok: false, issues: [error(VAL_CODES.NUMBER_NOT_INTEGER, context, { actual: value })] };
    }

    return ok(value);
  };
}

/**
 * Validate number precision (total digits)
 */
export function precision(maxPrecision: number): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    // Count total significant digits
    const str = Math.abs(value).toString().replace('.', '');
    const actualPrecision = str.replace(/^0+/, '').length;

    if (actualPrecision > maxPrecision) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.NUMBER_PRECISION_EXCEEDED, context, { 
          maxPrecision, 
          actualPrecision 
        })] 
      };
    }

    return ok(value);
  };
}

/**
 * Validate number scale (decimal places)
 */
export function scale(maxScale: number): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    // Count decimal places
    const str = value.toString();
    const decimalIndex = str.indexOf('.');
    const actualScale = decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;

    if (actualScale > maxScale) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.NUMBER_SCALE_EXCEEDED, context, { 
          maxScale, 
          actualScale 
        })] 
      };
    }

    return ok(value);
  };
}

/**
 * Validate number is positive (> 0)
 */
export function positive(): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    if (value <= 0) {
      return { ok: false, issues: [error(VAL_CODES.NUMBER_TOO_SMALL, context, { min: 0, actual: value, exclusive: true })] };
    }

    return ok(value);
  };
}

/**
 * Validate number is non-negative (>= 0)
 */
export function nonNegative(): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    if (value < 0) {
      return { ok: false, issues: [error(VAL_CODES.NUMBER_TOO_SMALL, context, { min: 0, actual: value })] };
    }

    return ok(value);
  };
}

/**
 * Validate number is finite (not NaN or Infinity)
 */
export function finite(): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    if (!Number.isFinite(value)) {
      return { ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context, { format: 'finite-number' })] };
    }

    return ok(value);
  };
}

/**
 * Validate number type
 */
export function isNumber(): Validator<number> {
  return (value: unknown, context: ValidationContext): ValidationResult<number> => {
    if (typeof value !== 'number') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'number', actual: typeof value })] };
    }

    return ok(value);
  };
}
