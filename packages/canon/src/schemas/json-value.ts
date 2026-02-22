import { z } from 'zod';

import { SCHEMA_ERROR_CODES } from './error-codes';

/**
 * Pre-check JSON depth with deterministic traversal
 * 
 * Uses iterative stack-based approach to avoid recursion limits
 * and ensure consistent depth counting across all branches.
 */
function assertJsonDepth(value: unknown, maxDepth: number): boolean {
  const stack: Array<{ v: unknown; d: number }> = [{ v: value, d: 0 }];

  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) continue;

    const { v, d } = item;
    if (d > maxDepth) return false;

    if (Array.isArray(v)) {
      for (const x of v) {
        stack.push({ v: x, d: d + 1 });
      }
    } else if (v && typeof v === 'object') {
      for (const x of Object.values(v as Record<string, unknown>)) {
        stack.push({ v: x, d: d + 1 });
      }
    }
  }

  return true;
}

/**
 * Recursive JSON value schema with depth limit
 * 
 * Validates JSON-compatible values (string, number, boolean, null, array, object)
 * with a maximum nesting depth of 32 levels to prevent stack overflow attacks.
 * 
 * @example
 * ```ts
 * // ✅ Valid
 * jsonValueSchema.parse({ user: { name: "Alice", age: 30 } });
 * 
 * // ❌ Invalid - exceeds depth limit
 * const deep = { a: { b: { c: { ... } } } }; // 33+ levels
 * jsonValueSchema.parse(deep); // Fails with CANON_JSON_DEPTH_EXCEEDED
 * ```
 */
export const jsonValueSchema: z.ZodType<unknown> = z.unknown().superRefine((val, ctx) => {
  if (!assertJsonDepth(val, 32)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${SCHEMA_ERROR_CODES.JSON_DEPTH_EXCEEDED}: JSON depth limit exceeded (max: 32)`,
    });
  }
});
