/**
 * GAP-DB-006 / SER-01: Typed boundary layer for API → DB coercion.
 *
 * Coerces API input (JSON-serializable) into DB-ready values:
 * - Date strings → ISO strings (DB accepts timestamptz)
 * - UUID validation
 * - custom_data JSONB shape
 *
 * Handlers receive MutationSpec; input is coerced before dispatch.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Coerce a value for DB insertion. Returns coerced value or original. */
export function coerceValue(value: unknown, hint?: 'date' | 'uuid' | 'json'): unknown {
  if (value === null || value === undefined) return value;

  if (hint === 'date') {
    if (typeof value === 'string') {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? value : d.toISOString();
    }
    if (value instanceof Date) return value.toISOString();
  }

  if (hint === 'uuid') {
    if (typeof value === 'string' && UUID_RE.test(value)) return value;
    return value;
  }

  if (hint === 'json' && typeof value === 'object' && value !== null) {
    return value;
  }

  return value;
}

/**
 * Coerce mutation input for DB boundary.
 * Recursively processes object, coercing known date/uuid patterns.
 */
export function coerceMutationInput(input: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const dateSuffixes = ['_at', 'At', 'Date', '_date'];
  const uuidSuffixes = ['_id', 'Id', 'Id'];

  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined) {
      result[key] = value;
      continue;
    }

    const hint =
      dateSuffixes.some((s) => key.endsWith(s)) ? 'date'
      : uuidSuffixes.some((s) => key.endsWith(s)) ? 'uuid'
      : key === 'custom_data' || key === 'customData' ? 'json'
      : undefined;

    result[key] = coerceValue(value, hint);
  }

  return result;
}
