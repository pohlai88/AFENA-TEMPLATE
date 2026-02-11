/**
 * Keyboard key constants matching `KeyboardEvent.key` values.
 * Centralizes magic strings used across interactive components
 * (combobox, command, dropdown-menu, select, etc.).
 */
export const Keys = {
  Enter: 'Enter',
  Space: ' ',
  Escape: 'Escape',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Tab: 'Tab',

  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',

  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
} as const;

export type Key = (typeof Keys)[keyof typeof Keys];

/**
 * Returns `true` if the keyboard event matches the given key.
 *
 * @example
 * ```tsx
 * onKeyDown={(e) => {
 *   if (isKey(e, Keys.Escape)) close();
 *   if (isKey(e, Keys.Enter)) submit();
 * }}
 * ```
 */
export function isKey(event: KeyboardEvent | React.KeyboardEvent, key: Key): boolean {
  return event.key === key;
}

/**
 * Returns `true` if the event key is a printable character (single char, no modifier).
 * Useful for typeahead / search-on-type in listboxes and comboboxes.
 */
export function isPrintableKey(event: KeyboardEvent | React.KeyboardEvent): boolean {
  return event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
}

// Namespace import for React.KeyboardEvent compatibility
import type * as React from 'react';
