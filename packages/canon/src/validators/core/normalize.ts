/**
 * Pure Normalization Helpers
 * 
 * Deterministic normalization functions that return normalized values.
 * All functions are pure and idempotent.
 */

import { ok } from './issue';
import type { ValidationContext, ValidationResult, Validator } from './types';

/**
 * Trim leading and trailing whitespace
 * 
 * @example
 * ```typescript
 * trimWhitespace('  hello  ') // => 'hello'
 * ```
 */
export function trimWhitespace(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  return ok(value.trim());
}

/**
 * Collapse multiple whitespace characters into single space
 * 
 * @example
 * ```typescript
 * collapseWhitespace('hello    world') // => 'hello world'
 * ```
 */
export function collapseWhitespace(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  return ok(value.replace(/\s+/g, ' '));
}

/**
 * Convert to lowercase
 * 
 * @example
 * ```typescript
 * lowercase('HELLO') // => 'hello'
 * ```
 */
export function lowercase(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  return ok(value.toLowerCase());
}

/**
 * Convert to uppercase
 * 
 * @example
 * ```typescript
 * uppercase('hello') // => 'HELLO'
 * ```
 */
export function uppercase(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  return ok(value.toUpperCase());
}

/**
 * Normalize to slug format (lowercase, hyphenated)
 * 
 * @example
 * ```typescript
 * toSlug('Hello World!') // => 'hello-world'
 * ```
 */
export function toSlug(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  return ok(slug);
}

/**
 * Normalize email (lowercase, trim)
 * 
 * @example
 * ```typescript
 * normalizeEmail('  User@Example.COM  ') // => 'user@example.com'
 * ```
 */
export function normalizeEmail(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  return ok(value.trim().toLowerCase());
}

/**
 * Normalize phone number (remove non-digits)
 * 
 * @example
 * ```typescript
 * normalizePhone('(555) 123-4567') // => '5551234567'
 * ```
 */
export function normalizePhone(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  return ok(value.replace(/\D/g, ''));
}

/**
 * Normalize URL (trim, lowercase protocol/domain)
 * 
 * @example
 * ```typescript
 * normalizeUrl('  HTTPS://Example.COM/Path  ') // => 'https://example.com/Path'
 * ```
 */
export function normalizeUrl(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);
    // Lowercase protocol and hostname, preserve path case
    return ok(`${url.protocol.toLowerCase()}//${url.hostname.toLowerCase()}${url.pathname}${url.search}${url.hash}`);
  } catch {
    // If not a valid URL, just trim
    return ok(trimmed);
  }
}

/**
 * Normalize number (parse string to number)
 * 
 * @example
 * ```typescript
 * normalizeNumber('42.5') // => 42.5
 * ```
 */
export function normalizeNumber(value: unknown, _context: ValidationContext): ValidationResult<number> {
  if (typeof value === 'number') {
    return ok(value);
  }

  if (typeof value === 'string') {
    const num = Number(value);
    if (!isNaN(num)) {
      return ok(num);
    }
  }

  return ok(value as number);
}

/**
 * Normalize boolean (parse string to boolean)
 * 
 * @example
 * ```typescript
 * normalizeBoolean('true') // => true
 * normalizeBoolean('1') // => true
 * normalizeBoolean('yes') // => true
 * ```
 */
export function normalizeBoolean(value: unknown, _context: ValidationContext): ValidationResult<boolean> {
  if (typeof value === 'boolean') {
    return ok(value);
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') {
      return ok(true);
    }
    if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off') {
      return ok(false);
    }
  }

  if (typeof value === 'number') {
    return ok(value !== 0);
  }

  return ok(value as boolean);
}

/**
 * Normalize date string to ISO format
 * 
 * @example
 * ```typescript
 * normalizeDate('2024-01-15') // => '2024-01-15'
 * ```
 */
export function normalizeDate(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  const trimmed = value.trim();

  try {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      // Return ISO date string (YYYY-MM-DD)
      const isoDate = date.toISOString().split('T')[0] ?? '';
      return ok(isoDate);
    }
  } catch {
    // Invalid date, return as-is
  }

  return ok(trimmed);
}

/**
 * Normalize datetime string to ISO format
 * 
 * @example
 * ```typescript
 * normalizeDatetime('2024-01-15 10:30:00') // => '2024-01-15T10:30:00.000Z'
 * ```
 */
export function normalizeDatetime(value: unknown, _context: ValidationContext): ValidationResult<string> {
  if (typeof value !== 'string') {
    return ok(value as string);
  }

  const trimmed = value.trim();

  try {
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      return ok(date.toISOString());
    }
  } catch {
    // Invalid datetime, return as-is
  }

  return ok(trimmed);
}

/**
 * Create a normalizing validator from a pure function
 * 
 * @example
 * ```typescript
 * const trimValidator = normalizer((val: string) => val.trim());
 * ```
 */
export function normalizer<T>(fn: (value: T) => T): Validator<T> {
  return (value: unknown, _context: ValidationContext): ValidationResult<T> => {
    try {
      return ok(fn(value as T));
    } catch {
      return ok(value as T);
    }
  };
}
