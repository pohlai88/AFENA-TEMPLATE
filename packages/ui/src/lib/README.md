# Lib — Utilities

Enterprise-quality utility functions for the afenda UI library. Zero external
dependencies beyond `clsx`, `tailwind-merge`, and `class-variance-authority`
(already in the component stack).

## Modules

### `utils.ts` — Core Styling

| Export                      | Description                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `cn(...inputs)`             | Merges Tailwind classes with intelligent conflict resolution (`clsx` + `tailwind-merge`). |
| `cva` / `VariantProps`      | Re-exported from `class-variance-authority` for single-import convenience.                |
| `dataSlot(name)`            | Returns `{ "data-slot": name }` — shadcn's slot-based styling convention.                 |
| `cssVars(vars)`             | Converts a `Record<string, string>` of CSS custom properties into `React.CSSProperties`.  |
| `pickDataAttributes(props)` | Filters an object to only `data-*` keys.                                                  |

### `compose-refs.ts` — Ref Composition (Radix Pattern)

| Export                     | Description                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `composeRefs(...refs)`     | Merges multiple React refs (callback, object, or undefined) into one callback ref. |
| `useComposedRefs(...refs)` | Memoized hook version of `composeRefs`.                                            |

### `compose-event-handlers.ts` — Event Chaining (Radix Pattern)

| Export                                     | Description                                                                             |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| `composeEventHandlers(external, internal)` | Chains two handlers; if the external calls `preventDefault()`, the internal is skipped. |

### `types.ts` — TypeScript Utility Types

| Export                        | Description                                                |
| ----------------------------- | ---------------------------------------------------------- |
| `ComponentProps<T>`           | Extracts props from a component type or intrinsic element. |
| `PolymorphicProps<El, Props>` | Props for `asChild`-style polymorphic components.          |
| `RequiredKeys<T, K>`          | Makes specific keys required.                              |
| `OptionalKeys<T, K>`          | Makes specific keys optional.                              |
| `ValueOf<T>`                  | Extracts value type from a Record.                         |
| `DeepReadonly<T>`             | Recursive readonly.                                        |
| `DeepPartial<T>`              | Recursive partial.                                         |
| `StrictOmit<T, K>`            | `Omit` that constrains `K` to actual keys of `T`.          |
| `Merge<A, B>`                 | Merges two types, `B` overrides `A`.                       |

### `keyboard.ts` — Keyboard Constants

| Export                  | Description                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| `Keys`                  | Object of `KeyboardEvent.key` constants (`Enter`, `Escape`, `ArrowDown`, etc.). |
| `isKey(event, key)`     | Checks if an event matches a key constant.                                      |
| `isPrintableKey(event)` | Returns `true` for single-character keys without modifiers (typeahead).         |

### `assertion.ts` — Runtime Guards

| Export                      | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| `invariant(condition, msg)` | Throws if falsy — narrows the type in subsequent code.                       |
| `isDefined(value)`          | Type guard for non-null, non-undefined. Useful as `array.filter(isDefined)`. |
| `isNonEmptyString(value)`   | Type guard for non-empty strings.                                            |
| `isPlainObject(value)`      | Type guard for plain objects (not arrays, null, or class instances).         |
| `isReactElement(value)`     | Type guard for React elements.                                               |

### `dom.ts` — DOM Helpers

| Export                            | Description                                                   |
| --------------------------------- | ------------------------------------------------------------- |
| `canUseDOM()`                     | Returns `true` in browser environments.                       |
| `getOwnerDocument(node)`          | Returns the owner document (portal-safe).                     |
| `getOwnerWindow(node)`            | Returns the owner window.                                     |
| `getActiveElement(scope)`         | Returns the active element, traversing shadow DOM.            |
| `contains(parent, child)`         | `Element.contains()` that works across shadow DOM boundaries. |
| `getFocusableElements(container)` | Queries all visible, focusable elements within a container.   |
| `scrollIntoViewIfNeeded(el)`      | Scrolls into view only if not already fully visible.          |

### `format.ts` — Formatting

| Export                           | Description                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| `formatNumber(value, opts)`      | Locale-aware number formatting via `Intl.NumberFormat`.     |
| `formatCurrency(value, opts)`    | Currency formatting (default USD).                          |
| `formatCompact(value, opts)`     | Compact notation (1.2K, 3.4M).                              |
| `formatRelativeTime(date, opts)` | Relative time ("2 hours ago", "in 3 days").                 |
| `formatFileSize(bytes, opts)`    | Human-readable file sizes (1.46 MB).                        |
| `truncate(str, maxLength)`       | Truncates with ellipsis.                                    |
| `getInitials(name)`              | Extracts initials for avatar fallbacks ("John Doe" → "JD"). |

### `aria.ts` — ARIA Helpers

| Export                              | Description                                                        |
| ----------------------------------- | ------------------------------------------------------------------ |
| `generateId(prefix)`                | Generates unique IDs for ARIA associations.                        |
| `ariaDescribedBy(...ids)`           | Builds `aria-describedby` from optional IDs.                       |
| `ariaDisclosureTrigger(isOpen, id)` | Returns `aria-expanded` + `aria-controls` for disclosure triggers. |
| `ariaLiveRegion(politeness)`        | Returns `aria-live`, `aria-atomic`, and `role` for live regions.   |
| `ariaSortColumn(direction)`         | Returns `aria-sort` for sortable table columns.                    |
| `ariaCountLabel(label, count)`      | Creates `aria-label` with count (e.g. "Notifications (5)").        |

### `color.ts` — CSS Variable & Color Utilities

| Export                        | Description                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| `cssVar(name, fallback)`      | Wraps a CSS custom property in `var()`.                                  |
| `withOpacity(color, opacity)` | Applies opacity via `color-mix(in oklch, ...)` — Tailwind v4 compatible. |
| `getComputedCSSVar(name, el)` | Reads a computed CSS variable from the DOM.                              |
| `setCSSVar(name, value, el)`  | Sets a CSS custom property on an element.                                |
| `removeCSSVar(name, el)`      | Removes a CSS custom property.                                           |

## Usage

All utilities are exported from the package barrel:

```tsx
import { cn, composeRefs, cva, formatCurrency, Keys } from 'afenda-ui';
```

Or import individual modules for tree-shaking:

```tsx
import { cn } from 'afenda-ui/lib/utils';
import { composeRefs } from 'afenda-ui/lib/compose-refs';
```

## Design Principles

- **shadcn-native** — Follows the same patterns used internally by shadcn/ui and
  Radix primitives.
- **Tailwind v4 aware** — `color.ts` uses `color-mix(in oklch, ...)` for
  opacity, matching the engine's oklch token system.
- **SSR-safe** — All DOM utilities guard against `window`/`document` access
  during server rendering.
- **Zero extra deps** — Only uses packages already in the component dependency
  tree.
- **Fully typed** — Every function has explicit generics, return types, and
  JSDoc with `@example` blocks.
