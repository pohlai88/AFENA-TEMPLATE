/**
 * Reference Validation Rules
 * 
 * Pure validators for reference/ID constraints.
 * All validators are deterministic and side-effect free.
 * 
 * Note: These validators only check format, NOT existence in database.
 * Database FK checks belong in Axis/app layer (async IO).
 */

import { VAL_CODES } from '../core/codes';
import { error, ok } from '../core/issue';
import type { ValidationContext, ValidationResult, Validator } from '../core/types';

/**
 * Validate UUID format (RFC 4122)
 */
export function uuidFormat(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      return { ok: false, issues: [error(VAL_CODES.REF_INVALID_UUID, context, { actual: value })] };
    }

    return ok(value);
  };
}

/**
 * Validate entity reference format (type:id)
 */
export function entityRefFormat(): Validator<string> {
  return (value: unknown, context: ValidationContext): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'string', actual: typeof value })] };
    }

    // Entity ref format: entityType:uuid
    const parts = value.split(':');
    if (parts.length !== 2) {
      return { ok: false, issues: [error(VAL_CODES.REF_INVALID_ENTITY_REF, context, { actual: value, format: 'type:id' })] };
    }

    const entityType = parts[0];
    const id = parts[1];

    // Validate entity type is not empty
    if (!entityType || entityType.trim().length === 0) {
      return { ok: false, issues: [error(VAL_CODES.REF_INVALID_ENTITY_REF, context, { actual: value, reason: 'empty entity type' })] };
    }

    // Validate ID is a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      return { ok: false, issues: [error(VAL_CODES.REF_INVALID_ENTITY_REF, context, { actual: value, reason: 'invalid UUID' })] };
    }

    return ok(value);
  };
}

/**
 * Validate array of UUIDs
 */
export function uuidArray(): Validator<string[]> {
  return (value: unknown, context: ValidationContext): ValidationResult<string[]> => {
    if (!Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'array', actual: typeof value })] };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const invalid: string[] = [];

    for (const item of value) {
      if (typeof item !== 'string' || !uuidRegex.test(item)) {
        invalid.push(String(item));
      }
    }

    if (invalid.length > 0) {
      return { ok: false, issues: [error(VAL_CODES.REF_INVALID_UUID, context, { invalid })] };
    }

    return ok(value as string[]);
  };
}

/**
 * Validate JSON-serializable value
 * Rejects: bigint, function, symbol, circular references
 */
export function jsonSerializable(): Validator<unknown> {
  return (value: unknown, context: ValidationContext): ValidationResult<unknown> => {
    // Check for non-serializable types
    const type = typeof value;
    if (type === 'bigint' || type === 'function' || type === 'symbol') {
      return { ok: false, issues: [error(VAL_CODES.JSON_NOT_SERIALIZABLE, context, { type })] };
    }

    // Check for circular references by attempting to serialize
    try {
      JSON.stringify(value);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('circular')) {
        return { ok: false, issues: [error(VAL_CODES.JSON_CIRCULAR_REFERENCE, context)] };
      }
      return { ok: false, issues: [error(VAL_CODES.JSON_INVALID_STRUCTURE, context, { reason: message })] };
    }

    return ok(value);
  };
}

/**
 * Validate value is a plain object (not array, null, or class instance)
 */
export function plainObject(): Validator<Record<string, unknown>> {
  return (value: unknown, context: ValidationContext): ValidationResult<Record<string, unknown>> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'object', actual: typeof value })] };
    }

    // Check if it's a plain object (not a class instance)
    if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'plain object', actual: 'class instance' })] };
    }

    return ok(value as Record<string, unknown>);
  };
}

/**
 * Validate value is an array
 */
export function isArray(): Validator<unknown[]> {
  return (value: unknown, context: ValidationContext): ValidationResult<unknown[]> => {
    if (!Array.isArray(value)) {
      return { ok: false, issues: [error(VAL_CODES.TYPE_MISMATCH, context, { expected: 'array', actual: typeof value })] };
    }

    return ok(value);
  };
}
