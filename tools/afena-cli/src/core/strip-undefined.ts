/**
 * Strip undefined values from an object to satisfy exactOptionalPropertyTypes.
 * With exactOptionalPropertyTypes: true, optional properties cannot be explicitly set to undefined.
 * This helper removes keys with undefined values before assignment.
 */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}
