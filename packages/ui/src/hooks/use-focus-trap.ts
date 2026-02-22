'use client';

import * as React from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Traps keyboard focus within a container element.
 * When the user tabs past the last focusable element, focus wraps to the first,
 * and vice versa with Shift+Tab.
 *
 * @param active - Whether the focus trap is active. Default: `true`.
 * @returns A ref to attach to the container element.
 *
 * @example
 * ```tsx
 * const trapRef = useFocusTrap(isOpen);
 *
 * return isOpen ? (
 *   <div ref={trapRef} role="dialog">
 *     <input autoFocus />
 *     <button>Close</button>
 *   </div>
 * ) : null;
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active = true,
): React.RefObject<T | null> {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!active || !ref.current) return;

    const container = ref.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return ref;
}
