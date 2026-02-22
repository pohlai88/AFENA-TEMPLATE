/**
 * JSON Validation Rules
 * 
 * Canon policy decision on JSON semantics:
 * - Accept: null, boolean, number, string, object, array
 * - Reject: bigint, function, symbol, Date (unless stringified), circular references
 * - Test: JSON.stringify without mutation
 */

import { VAL_CODES } from '../core/codes';
import { issue } from '../core/issue';
import type { Validator } from '../core/types';

/**
 * Validate that a value is JSON-serializable
 * 
 * Tests serialization without mutating the input value.
 */
export function jsonSerializable(): Validator<unknown> {
  return (value, context) => {
    // Null/undefined pass
    if (value === null || value === undefined) {
      return { ok: true, value };
    }
    
    // Primitives pass
    if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
      return { ok: true, value };
    }
    
    // Reject disallowed types immediately
    if (typeof value === 'bigint' || typeof value === 'function' || typeof value === 'symbol') {
      return {
        ok: false,
        issues: [issue(VAL_CODES.JSON_NOT_SERIALIZABLE, context, { type: typeof value })],
      };
    }
    
    // For objects/arrays, test JSON.stringify (detects circular refs)
    try {
      JSON.stringify(value);
      return { ok: true, value };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isCircular = errorMessage.includes('circular') || errorMessage.includes('cyclic');
      
      return {
        ok: false,
        issues: [issue(
          isCircular ? VAL_CODES.JSON_CIRCULAR_REFERENCE : VAL_CODES.JSON_INVALID_STRUCTURE,
          context,
          { error: errorMessage },
        )],
      };
    }
  };
}
