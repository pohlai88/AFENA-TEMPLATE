import { cva, type VariantProps } from 'class-variance-authority';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with intelligent conflict resolution.
 * Combines `clsx` (conditional classes) with `tailwind-merge` (dedup).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export cva + VariantProps so consumers only need `import { cn, cva } from "afena-ui"`
export { cva, type VariantProps };

/**
 * Creates a `data-slot` prop object for shadcn's slot-based styling convention.
 *
 * @example
 * ```tsx
 * <div {...dataSlot("card-header")} className={cn("p-6", className)}>
 * ```
 */
export function dataSlot(name: string): { 'data-slot': string } {
  return { 'data-slot': name };
}

/**
 * Converts a record of CSS custom properties into a `React.CSSProperties` object.
 * Useful for passing engine tokens or dynamic theme values as inline styles.
 *
 * @example
 * ```tsx
 * <div style={cssVars({ "--sidebar-width": "16rem", "--header-height": "4rem" })}>
 * ```
 */
export function cssVars(
  vars: Record<string, string | number | undefined>,
): React.CSSProperties {
  const style: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined) {
      style[key] = value;
    }
  }
  return style as React.CSSProperties;
}

/**
 * Type-safe extraction of `data-*` attributes from props.
 * Filters an object to only include keys starting with `data-`.
 */
export function pickDataAttributes<T extends Record<string, unknown>>(
  props: T,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    if (key.startsWith('data-')) {
      result[key] = props[key];
    }
  }
  return result;
}
