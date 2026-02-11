/**
 * ARIA attribute helpers for building accessible components.
 * Follows WAI-ARIA 1.2 patterns used by Radix UI and shadcn.
 */

let idCounter = 0;

/**
 * Generates a deterministic, unique ID for ARIA associations.
 * Falls back to a counter-based ID for environments without `React.useId`.
 *
 * @param prefix - Optional prefix for readability in the DOM.
 * @returns A unique string ID.
 *
 * @example
 * ```tsx
 * const labelId = generateId("label");  // "label-1"
 * const inputId = generateId("input");  // "input-2"
 * ```
 */
export function generateId(prefix = 'afena'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Builds `aria-describedby` from an optional description ID and error ID.
 * Returns `undefined` when no IDs are provided (avoids empty string in DOM).
 *
 * @example
 * ```tsx
 * <input aria-describedby={ariaDescribedBy(descriptionId, errorId)} />
 * ```
 */
export function ariaDescribedBy(
  ...ids: (string | undefined | null | false)[]
): string | undefined {
  const filtered = ids.filter(Boolean) as string[];
  return filtered.length > 0 ? filtered.join(' ') : undefined;
}

/**
 * Returns ARIA attributes for a disclosure trigger (button that opens/closes content).
 *
 * @example
 * ```tsx
 * <button {...ariaDisclosureTrigger(isOpen, panelId)}>Toggle</button>
 * ```
 */
export function ariaDisclosureTrigger(
  isOpen: boolean,
  controlsId?: string,
): Record<string, string | boolean | undefined> {
  return {
    'aria-expanded': isOpen,
    ...(controlsId ? { 'aria-controls': controlsId } : {}),
  };
}

/**
 * Returns ARIA attributes for a live region (toast, alert, status).
 *
 * @param politeness - `"polite"` (default) or `"assertive"`.
 *
 * @example
 * ```tsx
 * <div {...ariaLiveRegion("polite")}>3 items updated</div>
 * ```
 */
export function ariaLiveRegion(
  politeness: 'polite' | 'assertive' = 'polite',
): Record<string, string> {
  return {
    'aria-live': politeness,
    'aria-atomic': 'true',
    role: politeness === 'assertive' ? 'alert' : 'status',
  };
}

/**
 * Returns the appropriate `aria-sort` value for a sortable table column.
 *
 * @example
 * ```tsx
 * <th {...ariaSortColumn(currentSort === "name" ? direction : undefined)}>Name</th>
 * ```
 */
export function ariaSortColumn(
  direction: 'asc' | 'desc' | undefined,
): { 'aria-sort'?: 'ascending' | 'descending' | 'none' } {
  if (!direction) return { 'aria-sort': 'none' };
  return { 'aria-sort': direction === 'asc' ? 'ascending' : 'descending' };
}

/**
 * Creates an `aria-label` that includes a count, commonly used for badges and tabs.
 *
 * @example
 * ```tsx
 * <span {...ariaCountLabel("Notifications", 5)}>5</span>
 * // aria-label="Notifications (5)"
 * ```
 */
export function ariaCountLabel(
  label: string,
  count: number,
): { 'aria-label': string } {
  return { 'aria-label': `${label} (${count})` };
}
