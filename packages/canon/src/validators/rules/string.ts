/**
 * String Validation Rules
 * 
 * Pure validators for string constraints.
 * All validators are deterministic and side-effect free.
 */

import { VAL_CODES } from '../core/codes';
import { error, ok } from '../core/issue';
import type { ValidationContext, ValidationResult, Validator } from '../core/types';

/**
 * Validate minimum string length
 */
export function minLength(min: number): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    if (value.length < min) {
      return { ok: false, issues: [error(VAL_CODES.STRING_TOO_SHORT, context, { min, actual: value.length })] };
    }

    return ok(value);
  };
}

/**
 * Validate maximum string length
 */
export function maxLength(max: number): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    if (value.length > max) {
      return { ok: false, issues: [error(VAL_CODES.STRING_TOO_LONG, context, { max, actual: value.length })] };
    }

    return ok(value);
  };
}

/**
 * Validate string matches pattern
 */
export function pattern(regex: RegExp, format?: string): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    if (!regex.test(value)) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.STRING_PATTERN_MISMATCH, context, { 
          pattern: regex.source,
          ...(format ? { format } : {}),
        })] 
      };
    }

    return ok(value);
  };
}

/**
 * Validate string contains only ASCII characters
 */
export function ascii(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // ASCII range: 0-127
    if (!/^[\x00-\x7F]*$/.test(value)) {
      return { ok: false, issues: [error(VAL_CODES.STRING_NOT_ASCII, context)] };
    }

    return ok(value);
  };
}

/**
 * Validate string is a valid slug (lowercase, hyphenated)
 */
export function slug(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // Slug: lowercase letters, numbers, hyphens, no leading/trailing hyphens
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return { ok: false, issues: [error(VAL_CODES.STRING_NOT_SLUG, context)] };
    }

    return ok(value);
  };
}

/**
 * Validate email format (basic regex)
 */
export function emailFormat(): Validator<string> {
  return pattern(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'email-basic'
  );
}

/**
 * Validate URL format (basic regex)
 */
export function urlFormat(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    try {
      new URL(value);
      return ok(value);
    } catch {
      return { ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context, { format: 'url-basic' })] };
    }
  };
}

/**
 * Validate phone format (basic - digits only after normalization)
 */
export function phoneFormat(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // After normalization, should be 10-15 digits
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      return { ok: false, issues: [error(VAL_CODES.INVALID_FORMAT, context, { format: 'phone-basic' })] };
    }

    return ok(value);
  };
}

/**
 * Validate string is not empty (after trimming)
 */
export function notEmpty(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    if (value.trim().length === 0) {
      return { ok: false, issues: [error(VAL_CODES.REQUIRED_FIELD_MISSING, context)] };
    }

    return ok(value);
  };
}

/**
 * Validate string type
 */
export function isString(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    return ok(value);
  };
}
