'use client';

import * as React from 'react';

/**
 * Returns a stable ref whose `.current` always points to the latest callback.
 * Useful for event handlers passed to effects or third-party libraries
 * without re-triggering the effect on every render.
 *
 * @example
 * ```tsx
 * const onScroll = useCallbackRef((e: Event) => {
 *   console.log(e);
 * });
 * ```
 */
export function useCallbackRef<T extends (...args: never[]) => unknown>(
  callback: T | undefined,
): T {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  return React.useMemo(
    () =>
      ((...args: Parameters<T>) =>
        callbackRef.current?.(...args)) as unknown as T,
    [],
  );
}
