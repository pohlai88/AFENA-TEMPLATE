'use client';

import * as React from 'react';

/**
 * A simple boolean toggle hook with `on`, `off`, and `toggle` helpers.
 *
 * @param initialValue - The initial boolean value. Default: `false`.
 * @returns `[value, { toggle, on, off, set }]`
 *
 * @example
 * ```tsx
 * const [isOpen, { toggle, off }] = useToggle(false);
 *
 * return (
 *   <>
 *     <Button onClick={toggle}>Toggle</Button>
 *     {isOpen && <Dialog onClose={off}>Content</Dialog>}
 *   </>
 * );
 * ```
 */
export function useToggle(
  initialValue = false,
): [
  boolean,
  {
    toggle: () => void;
    on: () => void;
    off: () => void;
    set: React.Dispatch<React.SetStateAction<boolean>>;
  },
] {
  const [value, setValue] = React.useState(initialValue);

  const handlers = React.useMemo(
    () => ({
      toggle: () => setValue((v) => !v),
      on: () => setValue(true),
      off: () => setValue(false),
      set: setValue,
    }),
    [],
  );

  return [value, handlers];
}
