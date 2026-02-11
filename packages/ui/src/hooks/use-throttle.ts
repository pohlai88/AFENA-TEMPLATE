'use client';

import * as React from 'react';

/**
 * Returns a throttled version of the provided value.
 * The returned value updates at most once per `interval` milliseconds.
 *
 * @param value - The value to throttle.
 * @param interval - Minimum time between updates in milliseconds (default: 500).
 * @returns The throttled value.
 *
 * @example
 * ```tsx
 * const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
 * const throttledPos = useThrottle(mousePos, 100);
 * ```
 */
export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastUpdated = React.useRef(Date.now());

  React.useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}
