'use client';

import * as React from 'react';

/**
 * Returns a debounced version of the provided value.
 * The returned value only updates after the specified delay has elapsed
 * since the last change to the input value.
 *
 * @param value - The value to debounce.
 * @param delay - Debounce delay in milliseconds (default: 500).
 * @returns The debounced value.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState("");
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // Only fires 300ms after the user stops typing
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Returns a debounced version of the provided callback.
 * The callback will only execute after the specified delay has elapsed
 * since the last invocation.
 *
 * @param callback - The function to debounce.
 * @param delay - Debounce delay in milliseconds (default: 500).
 * @returns A debounced version of the callback and a cancel function.
 *
 * @example
 * ```tsx
 * const [debouncedSave, cancel] = useDebouncedCallback(
 *   (value: string) => saveToServer(value),
 *   1000
 * );
 * ```
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay = 500,
): [(...args: Parameters<T>) => void, () => void] {
  const callbackRef = React.useRef(callback);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  const cancel = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const debouncedFn = React.useCallback(
    (...args: Parameters<T>) => {
      cancel();
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, cancel],
  );

  React.useEffect(() => cancel, [cancel]);

  return [debouncedFn, cancel];
}
