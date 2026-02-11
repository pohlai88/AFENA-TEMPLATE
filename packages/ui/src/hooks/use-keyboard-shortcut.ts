'use client';

import * as React from 'react';

type KeyboardModifier = 'ctrl' | 'shift' | 'alt' | 'meta';

interface UseKeyboardShortcutOptions {
  /** Modifier keys that must be held. */
  modifiers?: KeyboardModifier[];
  /** Prevent the browser default action. Default: `true`. */
  preventDefault?: boolean;
  /** Only listen when this is `true`. Default: `true`. */
  enabled?: boolean;
  /** Target element ref. Defaults to `document`. */
  target?: React.RefObject<HTMLElement | null>;
}

const MODIFIER_MAP: Record<KeyboardModifier, keyof KeyboardEvent> = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  alt: 'altKey',
  meta: 'metaKey',
};

/**
 * Registers a global (or scoped) keyboard shortcut.
 *
 * @param key - The `KeyboardEvent.key` value to listen for (case-insensitive).
 * @param callback - Handler invoked when the shortcut fires.
 * @param options - Modifier keys, enabled flag, and optional target element.
 *
 * @example
 * ```tsx
 * // Ctrl+K to open search
 * useKeyboardShortcut("k", () => setOpen(true), { modifiers: ["ctrl"] });
 *
 * // Escape to close dialog
 * useKeyboardShortcut("Escape", () => setOpen(false));
 *
 * // Meta+S to save (Mac Cmd+S)
 * useKeyboardShortcut("s", handleSave, { modifiers: ["meta"], preventDefault: true });
 * ```
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {},
): void {
  const {
    modifiers = [],
    preventDefault = true,
    enabled = true,
    target,
  } = options;

  const callbackRef = React.useRef(callback);
  React.useEffect(() => {
    callbackRef.current = callback;
  });

  React.useEffect(() => {
    if (!enabled) return;

    const element = target?.current ?? document;

    const handler = (e: Event) => {
      const event = e as KeyboardEvent;

      // Match key (case-insensitive)
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      // Check all required modifiers are pressed
      const allModifiersMatch = modifiers.every(
        (mod) => event[MODIFIER_MAP[mod]] === true,
      );
      if (!allModifiersMatch) return;

      // Ensure no extra modifiers are pressed (unless explicitly required)
      const extraModifiers = (['ctrl', 'shift', 'alt', 'meta'] as const).some(
        (mod) =>
          !modifiers.includes(mod) && event[MODIFIER_MAP[mod]] === true,
      );
      if (extraModifiers) return;

      if (preventDefault) event.preventDefault();
      callbackRef.current(event);
    };

    element.addEventListener('keydown', handler);
    return () => element.removeEventListener('keydown', handler);
  }, [key, modifiers, preventDefault, enabled, target]);
}
