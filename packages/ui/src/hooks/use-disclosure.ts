'use client';

import * as React from 'react';

interface UseDisclosureOptions {
  /** Controlled open state. */
  open?: boolean;
  /** Default open state for uncontrolled mode. */
  defaultOpen?: boolean;
  /** Callback when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}

interface UseDisclosureReturn {
  /** Whether the disclosure is open. */
  isOpen: boolean;
  /** Open the disclosure. */
  onOpen: () => void;
  /** Close the disclosure. */
  onClose: () => void;
  /** Toggle the disclosure. */
  onToggle: () => void;
  /** Props to spread onto a trigger element. */
  getButtonProps: () => {
    'aria-expanded': boolean;
    onClick: () => void;
  };
  /** Props to spread onto the disclosure panel. */
  getDisclosureProps: () => {
    hidden: boolean;
  };
}

/**
 * Manages open/close state for dialogs, drawers, popovers, accordions, etc.
 * Supports both controlled and uncontrolled patterns with ARIA helpers.
 *
 * @param options - Controlled state, default state, and change callback.
 * @returns Disclosure state and helper functions.
 *
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose, getButtonProps, getDisclosureProps } = useDisclosure();
 *
 * return (
 *   <>
 *     <Button {...getButtonProps()}>Open</Button>
 *     <Dialog {...getDisclosureProps()} onClose={onClose}>
 *       Content
 *     </Dialog>
 *   </>
 * );
 * ```
 */
export function useDisclosure(
  options: UseDisclosureOptions = {},
): UseDisclosureReturn {
  const { open, defaultOpen = false, onOpenChange } = options;

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : uncontrolledOpen;

  const onOpenChangeRef = React.useRef(onOpenChange);
  React.useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChangeRef.current?.(value);
    },
    [isControlled],
  );

  const onOpen = React.useCallback(() => setOpen(true), [setOpen]);
  const onClose = React.useCallback(() => setOpen(false), [setOpen]);
  const onToggle = React.useCallback(
    () => setOpen(!isOpen),
    [setOpen, isOpen],
  );

  const getButtonProps = React.useCallback(
    () => ({
      'aria-expanded': isOpen,
      onClick: onToggle,
    }),
    [isOpen, onToggle],
  );

  const getDisclosureProps = React.useCallback(
    () => ({
      hidden: !isOpen,
    }),
    [isOpen],
  );

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    getButtonProps,
    getDisclosureProps,
  };
}
