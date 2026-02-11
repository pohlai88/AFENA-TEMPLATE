'use client';

import * as React from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Disconnect the observer when the element first becomes visible. Default: `false`. */
  once?: boolean;
  /** Only observe when this is `true`. Default: `true`. */
  enabled?: boolean;
}

interface UseIntersectionObserverReturn {
  /** Ref to attach to the target element. */
  ref: React.RefCallback<Element>;
  /** The latest `IntersectionObserverEntry`, or `undefined` before first observation. */
  entry: IntersectionObserverEntry | undefined;
  /** Whether the target is currently intersecting. */
  isIntersecting: boolean;
}

/**
 * Observes an element's intersection with an ancestor or the viewport.
 *
 * @param options - Standard `IntersectionObserver` options plus `once` and `enabled`.
 * @returns `{ ref, entry, isIntersecting }`
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   once: true,
 * });
 *
 * return (
 *   <div ref={ref} className={isIntersecting ? "animate-in" : "opacity-0"}>
 *     Lazy section
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    once = false,
    enabled = true,
  } = options;

  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();
  const [node, setNode] = React.useState<Element | null>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    if (!enabled || !node) return;

    // Cleanup previous observer
    observerRef.current?.disconnect();

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        if (!observerEntry) return;
        setEntry(observerEntry);

        if (once && observerEntry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin },
    );

    observer.observe(node);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [node, threshold, root, rootMargin, once, enabled]);

  const ref: React.RefCallback<Element> = React.useCallback(
    (el: Element | null) => setNode(el),
    [],
  );

  return {
    ref,
    entry,
    isIntersecting: entry?.isIntersecting ?? false,
  };
}
