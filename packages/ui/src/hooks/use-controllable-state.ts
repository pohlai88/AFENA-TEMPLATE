'use client';

import * as React from 'react';

interface UseControllableStateOptions<T> {
  /** The controlled value (from props). Pass `undefined` for uncontrolled mode. */
  prop?: T;
  /** The initial value for uncontrolled mode. */
  defaultProp?: T;
  /** Called when the value changes (both controlled and uncontrolled). */
  onChange?: (value: T) => void;
}

/**
 * Manages the controlled / uncontrolled state pattern used throughout
 * Radix UI and shadcn components. When `prop` is provided the component
 * is controlled; otherwise it manages its own internal state starting
 * from `defaultProp`.
 *
 * This is the same pattern used internally by Radix primitives.
 *
 * @example
 * ```tsx
 * // Inside a component that supports both controlled and uncontrolled usage:
 * function Toggle({ open, defaultOpen, onOpenChange }: ToggleProps) {
 *   const [isOpen, setIsOpen] = useControllableState({
 *     prop: open,
 *     defaultProp: defaultOpen ?? false,
 *     onChange: onOpenChange,
 *   });
 *
 *   return <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? "On" : "Off"}</button>;
 * }
 * ```
 */
export function useControllableState<T>(
  options: UseControllableStateOptions<T>,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { prop, defaultProp, onChange } = options;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<T>(
    defaultProp as T,
  );

  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (nextValue) => {
      const resolvedValue =
        nextValue instanceof Function ? nextValue(value) : nextValue;

      if (!isControlled) {
        setUncontrolledValue(resolvedValue);
      }

      onChangeRef.current?.(resolvedValue);
    },
    [isControlled, value],
  );

  return [value, setValue];
}
