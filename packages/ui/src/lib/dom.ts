/**
 * DOM query and manipulation helpers for interactive components.
 * SSR-safe — all functions guard against missing `window`/`document`.
 */

/**
 * Returns `true` when running in a browser environment.
 */
export function canUseDOM(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
}

/**
 * Returns the owner document of a node, falling back to `document`.
 * Useful for portaled components that may live in a different document context.
 */
export function getOwnerDocument(node: Node | null | undefined): Document {
  return node?.ownerDocument ?? document;
}

/**
 * Returns the owner window of a node, falling back to `window`.
 */
export function getOwnerWindow(node: Node | null | undefined): Window {
  return getOwnerDocument(node).defaultView ?? window;
}

/**
 * Returns the currently active element in the given document scope.
 */
export function getActiveElement(
  scope: Document | ShadowRoot = document,
): Element | null {
  let activeElement = scope.activeElement;

  // Traverse into shadow roots
  while (activeElement?.shadowRoot?.activeElement) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}

/**
 * Returns `true` if the element contains the target, including across shadow DOM boundaries.
 */
export function contains(
  parent: Element | null | undefined,
  child: Element | null | undefined,
): boolean {
  if (!parent || !child) return false;
  if (parent.contains(child)) return true;

  // Check shadow DOM
  let current: Node | null = child;
  while (current) {
    if (current === parent) return true;
    current =
      (current as Element).assignedSlot ??
      current.parentNode ??
      (current as ShadowRoot).host ??
      null;
  }

  return false;
}

/**
 * Queries all focusable elements within a container.
 * Respects `tabindex`, `disabled`, and visibility.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ].join(', ');

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => el.offsetParent !== null,
  );
}

/**
 * Scrolls an element into view within a scrollable container,
 * only if it's not already fully visible. Avoids jarring full-page scrolls.
 */
export function scrollIntoViewIfNeeded(
  element: HTMLElement,
  options?: ScrollIntoViewOptions,
): void {
  const parent = element.parentElement;
  if (!parent) return;

  const parentRect = parent.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const isFullyVisible =
    elementRect.top >= parentRect.top &&
    elementRect.bottom <= parentRect.bottom;

  if (!isFullyVisible) {
    element.scrollIntoView({ block: 'nearest', ...options });
  }
}
