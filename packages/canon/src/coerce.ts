/**
 * Mutation Input Coercion (Canon SSOT)
 *
 * Ensures that values in a mutation input record are DB-safe before passing
 * to Drizzle. This does NOT validate semantics — only type coercion to prevent
 * silent failures at the driver layer.
 *
 * Coercions applied:
 *   - JS Date → ISO-8601 string (Neon HTTP driver does not handle Date objects)
 *   - Infinity / NaN → null (PostgreSQL rejects these)
 *   - undefined values → removed (avoid accidental column overwrites)
 *   - BigInt → number (Drizzle/JSON cannot serialize BigInt)
 */

/**
 * Coerce a flat mutation input record for database safety.
 * Values are coerced in-place; a new object is always returned.
 *
 * @param input - Raw sanitized input record from the Plan phase.
 * @returns A new shallow-copy record with all values DB-safe.
 */
export function coerceMutationInput(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    // Drop undefined — Drizzle treats undefined as "do not include column"
    if (value === undefined) continue;

    // JS Date → ISO-8601 string
    if (value instanceof Date) {
      result[key] = isNaN(value.getTime()) ? null : value.toISOString();
      continue;
    }

    // BigInt → number (safe for typical ERP values; throws if > MAX_SAFE_INTEGER)
    if (typeof value === 'bigint') {
      if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
        throw new RangeError(
          `coerceMutationInput: BigInt value at key "${key}" exceeds safe integer range`,
        );
      }
      result[key] = Number(value);
      continue;
    }

    // Infinity / NaN → null (PostgreSQL cannot store IEEE special values in numeric columns)
    if (typeof value === 'number' && !isFinite(value)) {
      result[key] = null;
      continue;
    }

    // Nested plain objects — recurse shallowly (only one level deep; arrays are passed through)
    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = coerceMutationInput(value as Record<string, unknown>);
      continue;
    }

    result[key] = value;
  }

  return result;
}
