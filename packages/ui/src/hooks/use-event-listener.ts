'use client';

import * as React from 'react';

type Target = Window | Document | HTMLElement | null;

/**
 * Attaches an event listener to a target element with automatic cleanup.
 * The callback is always up-to-date without re-attaching the listener.
 *
 * @param eventName - The DOM event name.
 * @param handler - The event handler callback.
 * @param target - The target element (default: `window`).
 * @param options - Standard `AddEventListenerOptions`.
 *
 * @example
 * ```tsx
 * // Listen for window resize
 * useEventListener("resize", () => console.log(window.innerWidth));
 *
 * // Listen for scroll on a specific element
 * const ref = useRef<HTMLDivElement>(null);
 * useEventListener("scroll", handleScroll, ref.current);
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: Target,
  options?: boolean | AddEventListenerOptions,
): void {
  const handlerRef = React.useRef(handler);

  React.useEffect(() => {
    handlerRef.current = handler;
  });

  React.useEffect(() => {
    const el = target ?? (typeof window !== 'undefined' ? window : null);
    if (!el) return;

    const listener = (event: Event) => {
      handlerRef.current(event as WindowEventMap[K]);
    };

    el.addEventListener(eventName, listener, options);
    return () => el.removeEventListener(eventName, listener, options);
  }, [eventName, target, options]);
}
