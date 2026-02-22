/**
 * Runtime type guards and assertion utilities.
 * Useful for narrowing types in event handlers and generic components.
 */

/**
 * Asserts a condition is truthy. Throws with the given message if not.
 * Use in development to catch impossible states early.
 *
 * @example
 * ```tsx
 * const el = document.getElementById("root");
 * invariant(el, "Root element not found");
 * // el is now narrowed to HTMLElement
 * ```
 */
export function invariant(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Invariant violation');
  }
}

/**
 * Returns `true` if the value is not `null` and not `undefined`.
 * Useful as a filter predicate for arrays.
 *
 * @example
 * ```tsx
 * const items = [1, null, 2, undefined, 3].filter(isDefined);
 * // items: number[]
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Returns `true` if the value is a non-empty string.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Returns `true` if the value is a plain object (not an array, null, or class instance).
 */
export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Returns `true` if the value is a valid React element.
 */
export function isReactElement(value: unknown): value is React.ReactElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$$typeof' in value &&
    typeof (value as Record<string, unknown>).type !== 'undefined'
  );
}

import type * as React from 'react';
