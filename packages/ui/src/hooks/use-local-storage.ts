'use client';

import * as React from 'react';

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

function parseJSON<T>(value: string | null, fallback: T): T {
  if (value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Manages a value in `localStorage` with automatic JSON serialization,
 * SSR safety, and cross-tab synchronization via the `storage` event.
 *
 * @param key - The localStorage key.
 * @param initialValue - Default value when the key does not exist.
 * @returns A stateful value and a setter (same API as `useState`).
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage("theme", "light");
 * const [prefs, setPrefs] = useLocalStorage("prefs", { sidebar: true });
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] {
  const readValue = React.useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? parseJSON<T>(raw, initialValue) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = React.useState<T>(readValue);

  const setValue: SetValue<T> = React.useCallback(
    (value) => {
      try {
        const newValue =
          value instanceof Function ? value(storedValue) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);

        // Dispatch a custom event so other hook instances on the same page sync
        window.dispatchEvent(
          new StorageEvent('storage', { key, newValue: JSON.stringify(newValue) }),
        );
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Sync across tabs / windows
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(parseJSON<T>(e.newValue, initialValue));
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, initialValue]);

  // Re-read on mount (handles SSR hydration mismatch)
  React.useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  return [storedValue, setValue];
}
