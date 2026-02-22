'use client';

import * as React from 'react';

/**
 * Tracks the previous value of a variable across renders.
 * Returns `undefined` on the first render.
 *
 * @param value - The value to track.
 * @returns The value from the previous render, or `undefined` on mount.
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0);
 * const prevCount = usePrevious(count);
 * // prevCount is undefined on first render, then tracks previous count
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>(undefined);

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
