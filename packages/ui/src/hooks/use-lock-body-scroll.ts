'use client';

import * as React from 'react';

/**
 * Locks body scroll when active, restoring the original overflow on cleanup.
 * Useful for modals, drawers, and full-screen overlays.
 *
 * @param locked - Whether scrolling should be locked. Default: `true`.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * useLockBodyScroll(open);
 *
 * return open ? <Modal onClose={() => setOpen(false)} /> : null;
 * ```
 */
export function useLockBodyScroll(locked = true): void {
  React.useEffect(() => {
    if (!locked) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Measure scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [locked]);
}
