/**
 * Enum Validation Rules
 * 
 * Pure validators for enum/choice constraints.
 * All validators are deterministic and side-effect free.
 */

import { VAL_CODES } from '../core/codes';
import { error, ok } from '../core/issue';
import type { ValidationContext, ValidationResult, Validator } from '../core/types';

/**
 * Validate value is in allowed choices
 */
export function inChoices<T = string>(choices: readonly T[]): Validator<T> {
  return (value: unknown, context: ValidationContext): ValidationResult<T> => {
    if (!choices.includes(value as T)) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.ENUM_INVALID_CHOICE, context, { 
          choices: choices as unknown[], 
          actual: value 
        })] 
      };
    }

    return ok(value as T);
  };
}

/**
 * Validate array of selections has maximum count
 */
export function maxSelections(max: number): Validator<unknown[]> {
  return (value: unknown, context: ValidationContext): ValidationResult<unknown[]> => {
    if (!Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'array', actual: typeof value })] };
    }

    if (value.length > max) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.ENUM_TOO_MANY_SELECTIONS, context, { 
          max, 
          actual: value.length 
        })] 
      };
    }

    return ok(value);
  };
}

/**
 * Validate array of selections has minimum count
 */
export function minSelections(min: number): Validator<unknown[]> {
  return (value: unknown, context: ValidationContext): ValidationResult<unknown[]> => {
    if (!Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'array', actual: typeof value })] };
    }

    if (value.length < min) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.ARRAY_TOO_SHORT, context, { 
          min, 
          actual: value.length 
        })] 
      };
    }

    return ok(value);
  };
}

/**
 * Validate all array items are in allowed choices
 */
export function allInChoices<T = string>(choices: readonly T[]): Validator<T[]> {
  return (value: unknown, context: ValidationContext): ValidationResult<T[]> => {
    if (!Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'array', actual: typeof value })] };
    }

    const invalid = value.filter(item => !choices.includes(item as T));
    if (invalid.length > 0) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.ENUM_INVALID_CHOICE, context, { 
          choices: choices as unknown[], 
          invalid 
        })] 
      };
    }

    return ok(value as T[]);
  };
}

/**
 * Validate array has no duplicates
 */
export function uniqueItems(): Validator<unknown[]> {
  return (value: unknown, context: ValidationContext): ValidationResult<unknown[]> => {
    if (!Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'array', actual: typeof value })] };
    }

    const seen = new Set();
    const duplicates: unknown[] = [];

    for (const item of value) {
      const key = typeof item === 'object' ? JSON.stringify(item) : item;
      if (seen.has(key)) {
        duplicates.push(item);
      } else {
        seen.add(key);
      }
    }

    if (duplicates.length > 0) {
      return { 
        ok: false, 
        issues: [error(VAL_CODES.ENUM_INVALID_CHOICE, context, { 
          constraint: 'unique', 
          duplicates 
        })] 
      };
    }

    return ok(value);
  };
}
