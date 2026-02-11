'use client';

import * as React from 'react';

interface UseResizeObserverOptions {
  /** Only observe when this is `true`. Default: `true`. */
  enabled?: boolean;
}

interface Size {
  width: number;
  height: number;
}

/**
 * Observes the size of an element using `ResizeObserver`.
 * Returns the element's `contentRect` width and height.
 *
 * @param options - Configuration options.
 * @returns `{ ref, width, height }`
 *
 * @example
 * ```tsx
 * const { ref, width, height } = useResizeObserver();
 *
 * return (
 *   <div ref={ref}>
 *     {width}x{height}
 *   </div>
 * );
 * ```
 */
export function useResizeObserver(options: UseResizeObserverOptions = {}): {
  ref: React.RefCallback<Element>;
  width: number;
  height: number;
} {
  const { enabled = true } = options;
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 });
  const [node, setNode] = React.useState<Element | null>(null);

  React.useEffect(() => {
    if (!enabled || !node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setSize((prev) => {
        if (prev.width === width && prev.height === height) return prev;
        return { width, height };
      });
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, enabled]);

  const ref: React.RefCallback<Element> = React.useCallback(
    (el: Element | null) => setNode(el),
    [],
  );

  return { ref, ...size };
}
