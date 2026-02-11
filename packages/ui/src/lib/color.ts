/**
 * Color utilities for working with the Tailwind Engine token system.
 * Handles CSS variable resolution, opacity modifiers, and color manipulation.
 */

/**
 * Wraps a CSS custom property name in `var()` with an optional fallback.
 *
 * @example
 * ```tsx
 * cssVar("--color-primary-500");                // "var(--color-primary-500)"
 * cssVar("--color-primary-500", "#3b82f6");     // "var(--color-primary-500, #3b82f6)"
 * ```
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`;
}

/**
 * Applies an opacity modifier to a Tailwind v4 `oklch` color variable.
 * Works with the engine's `--color-*` tokens that use oklch values.
 *
 * @example
 * ```tsx
 * withOpacity("var(--color-primary-500)", 0.5);
 * // "color-mix(in oklch, var(--color-primary-500) 50%, transparent)"
 * ```
 */
export function withOpacity(color: string, opacity: number): string {
  const percent = Math.round(opacity * 100);
  return `color-mix(in oklch, ${color} ${percent}%, transparent)`;
}

/**
 * Resolves the computed value of a CSS custom property from the DOM.
 * Returns `undefined` if running on the server or the property is not set.
 *
 * @example
 * ```tsx
 * const primaryColor = getComputedCSSVar("--color-primary-500");
 * ```
 */
export function getComputedCSSVar(
  name: string,
  element?: Element,
): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const el = element ?? document.documentElement;
  const value = getComputedStyle(el).getPropertyValue(name).trim();
  return value || undefined;
}

/**
 * Sets a CSS custom property on an element (defaults to `:root`).
 *
 * @example
 * ```tsx
 * setCSSVar("--sidebar-width", "16rem");
 * setCSSVar("--header-height", "64px", myElement);
 * ```
 */
export function setCSSVar(
  name: string,
  value: string,
  element?: HTMLElement,
): void {
  if (typeof window === 'undefined') return;
  const el = element ?? document.documentElement;
  el.style.setProperty(name, value);
}

/**
 * Removes a CSS custom property from an element (defaults to `:root`).
 */
export function removeCSSVar(name: string, element?: HTMLElement): void {
  if (typeof window === 'undefined') return;
  const el = element ?? document.documentElement;
  el.style.removeProperty(name);
}
