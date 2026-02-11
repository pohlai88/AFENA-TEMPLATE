'use client';

import * as React from 'react';

type EventType = 'mousedown' | 'mouseup' | 'touchstart' | 'touchend';

interface UseClickOutsideOptions {
  /** DOM event to listen for. Default: `"mousedown"`. */
  eventType?: EventType;
  /** Only listen when this is `true`. Default: `true`. */
  enabled?: boolean;
}

/**
 * Invokes a callback when a click (or touch) occurs outside the referenced element.
 * Commonly used for closing dropdowns, popovers, and modals.
 *
 * @param refs - One or more refs to elements that should be considered "inside".
 * @param callback - Handler invoked on outside click.
 * @param options - Event type and enabled flag.
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside([ref], () => setOpen(false));
 *
 * return <div ref={ref}>Dropdown content</div>;
 * ```
 */
export function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  callback: (event: Event) => void,
  options: UseClickOutsideOptions = {},
): void {
  const { eventType = 'mousedown', enabled = true } = options;

  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });

  React.useEffect(() => {
    if (!enabled) return;

    const handler = (event: Event) => {
      const target = event.target as Node | null;
      if (!target) return;

      const isInside = refs.some(
        (ref) => ref.current?.contains(target),
      );

      if (!isInside) {
        callbackRef.current(event);
      }
    };

    document.addEventListener(eventType, handler, { passive: true });
    return () => document.removeEventListener(eventType, handler);
  }, [refs, eventType, enabled]);
}
