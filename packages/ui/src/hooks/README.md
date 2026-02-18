# Hooks

Enterprise-quality React hooks for the afenda UI library. All hooks are
SSR-safe, fully typed, and `'use client'` annotated for Next.js RSC
compatibility.

## Available Hooks

### Core / Primitives

| Hook                        | Description                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `useCallbackRef`            | Stable ref whose `.current` always points to the latest callback. Avoids re-triggering effects when handlers change. |
| `useControllableState`      | Controlled / uncontrolled state pattern used by Radix UI and shadcn components.                                      |
| `useIsomorphicLayoutEffect` | SSR-safe drop-in for `useLayoutEffect` — falls back to `useEffect` on the server.                                    |
| `useMounted`                | Returns `true` after client mount. Guard browser-only code in SSR/RSC.                                               |
| `usePrevious`               | Tracks the previous value of a variable across renders.                                                              |

### Media / Responsive

| Hook            | Description                                                                          |
| --------------- | ------------------------------------------------------------------------------------ |
| `useMediaQuery` | Subscribes to any CSS media query and returns a boolean match.                       |
| `useIsMobile`   | Convenience wrapper — `true` when viewport is below 768px. Composes `useMediaQuery`. |

### Timing

| Hook                   | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `useDebounce`          | Returns a debounced copy of a value (updates after a quiet period).      |
| `useDebouncedCallback` | Returns a debounced function with a `cancel` handle.                     |
| `useThrottle`          | Returns a throttled copy of a value (updates at most once per interval). |

### DOM / Interaction

| Hook                      | Description                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `useClickOutside`         | Fires a callback on clicks outside one or more ref'd elements.          |
| `useEventListener`        | Attaches an auto-cleanup event listener with a stable callback ref.     |
| `useFocusTrap`            | Traps Tab / Shift+Tab focus within a container (modals, drawers).       |
| `useIntersectionObserver` | Observes element visibility with optional `once` mode for lazy loading. |
| `useKeyboardShortcut`     | Registers global or scoped keyboard shortcuts with modifier support.    |
| `useLockBodyScroll`       | Locks `<body>` scroll with scrollbar-width compensation.                |
| `useResizeObserver`       | Tracks an element's `contentRect` width and height.                     |
| `useScrollPosition`       | Tracks window or element scroll position with passive listeners.        |

### State

| Hook              | Description                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `useClipboard`    | Copy-to-clipboard with a transient `copied` status indicator.                             |
| `useDisclosure`   | Open/close state manager with ARIA prop helpers (`getButtonProps`, `getDisclosureProps`). |
| `useLocalStorage` | Typed `localStorage` with JSON serialization, SSR safety, and cross-tab sync.             |
| `useToggle`       | Boolean state with `toggle`, `on`, `off`, and `set` helpers.                              |

## Usage

All hooks are exported from the package barrel:

```tsx
import { useClipboard, useDebounce, useMediaQuery } from 'afenda-ui';
```

Or import individually for tree-shaking:

```tsx
import { useMediaQuery } from 'afenda-ui/hooks/use-media-query';
```

## Conventions

- **`'use client'`** — Every hook file includes the directive for Next.js App
  Router compatibility.
- **SSR-safe** — No direct `window` or `document` access during server
  rendering.
- **Zero external deps** — Pure React; no additional packages required.
- **Stable refs** — Callbacks passed to effects use `useRef` to avoid
  unnecessary re-subscriptions.
- **JSDoc** — Every hook has full documentation with `@example` blocks.
