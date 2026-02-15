/**
 * Type-safe invariant helper for null/undefined checks.
 * 
 * Throws an error if the value is null or undefined, otherwise returns the value
 * with its type narrowed to exclude null/undefined.
 * 
 * @example
 * ```ts
 * const user = invariant(users.find(u => u.id === id), "User not found");
 * console.log(user.name); // OK: user is narrowed to defined type
 * ```
 * 
 * @param value - The value to check
 * @param message - Error message if value is null/undefined
 * @returns The value with null/undefined excluded from type
 * @throws Error if value is null or undefined
 */
export function invariant<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
