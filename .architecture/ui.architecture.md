# Afena UI Design System — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-14T08:34:54Z. Do not edit — regenerate instead.
> **Package:** `afena-ui` (`packages/ui`)
> **Purpose:** Four-layer design system: Engine tokens → CSS bridge → shadcn/ui primitives → App shell.

---

## 1. Architecture Overview

Layer 0 (Engine): `tailwindengine.json` → codegen → CSS custom properties.
Layer 1 (Bridge): `globals.css` maps engine tokens → shadcn semantic variables.
Layer 2 (Components): 56 shadcn/ui primitives + custom hooks + utility lib.
Layer 3 (App Shell): Sidebar, header, breadcrumbs, command palette, auth UI.

Zero-drift constraints: no hardcoded colors, no client-invented actions, no `console.*`,
no `'use client'` in pages/layouts.

---

## 2. Key Design Decisions

- **Tailwind v4**: `@theme inline` registers `--color-*` for utility classes
- **shadcn/ui**: new-york style, Radix UI unified package
- **Token bridge**: Engine tokens → bare CSS vars (shadcn) + `@theme inline` (Tailwind v4)
- **Glass utility**: Dark-mode-aware in `@layer utilities` (not `@utility`)
- **Button polish**: Transition, shadow, lift on hover, press scale (both modes)
- **Import aliases**: `afena-ui/components` and `afena-ui/lib/utils` in app workspace

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 97 |
| **Test files** | 0 |
| **Source directories** | components, hooks, lib, providers |

```
packages/ui/src/
├── components/
├── hooks/
├── lib/
├── providers/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export | Source |
| ------ | ------ |
| `Providers` | `./providers` |
| `ThemeProvider` | `./providers` |
| `ToasterProvider` | `./providers` |
| `GlobalTooltipProvider` | `./providers` |
| `cn` | `./lib/utils` |
| `cva` | `./lib/utils` |
| `type VariantProps` | `./lib/utils` |
| `dataSlot` | `./lib/utils` |
| `cssVars` | `./lib/utils` |
| `pickDataAttributes` | `./lib/utils` |
| `composeRefs` | `./lib/compose-refs` |
| `useComposedRefs` | `./lib/compose-refs` |
| `composeEventHandlers` | `./lib/compose-event-handlers` |
| `Keys` | `./lib/keyboard` |
| `isKey` | `./lib/keyboard` |
| `isPrintableKey` | `./lib/keyboard` |
| `invariant` | `./lib/assertion` |
| `isDefined` | `./lib/assertion` |
| `isNonEmptyString` | `./lib/assertion` |
| `isPlainObject` | `./lib/assertion` |
| `isReactElement` | `./lib/assertion` |
| `canUseDOM` | `./lib/dom` |
| `getOwnerDocument` | `./lib/dom` |
| `getOwnerWindow` | `./lib/dom` |
| `getActiveElement` | `./lib/dom` |
| `contains` | `./lib/dom` |
| `getFocusableElements` | `./lib/dom` |
| `scrollIntoViewIfNeeded` | `./lib/dom` |
| `formatNumber` | `./lib/format` |
| `formatCurrency` | `./lib/format` |
| `formatCompact` | `./lib/format` |
| `formatRelativeTime` | `./lib/format` |
| `formatFileSize` | `./lib/format` |
| `truncate` | `./lib/format` |
| `getInitials` | `./lib/format` |
| `generateId` | `./lib/aria` |
| `ariaDescribedBy` | `./lib/aria` |
| `ariaDisclosureTrigger` | `./lib/aria` |
| `ariaLiveRegion` | `./lib/aria` |
| `ariaSortColumn` | `./lib/aria` |
| `ariaCountLabel` | `./lib/aria` |
| `cssVar` | `./lib/color` |
| `withOpacity` | `./lib/color` |
| `getComputedCSSVar` | `./lib/color` |
| `setCSSVar` | `./lib/color` |
| `removeCSSVar` | `./lib/color` |

### Type Exports

| Type | Source |
| ---- | ------ |
| `ComponentProps` | `./lib/types` |
| `PolymorphicProps` | `./lib/types` |
| `RequiredKeys` | `./lib/types` |
| `OptionalKeys` | `./lib/types` |
| `ValueOf` | `./lib/types` |
| `DeepReadonly` | `./lib/types` |
| `DeepPartial` | `./lib/types` |
| `StrictOmit` | `./lib/types` |
| `Merge` | `./lib/types` |

---

## 5. Dependencies

### Internal (workspace)

- `afena-eslint-config`
- `afena-typescript-config`

### External

| Package | Version |
| ------- | ------- |
| `@base-ui/react` | `^1.1.0` |
| `@hookform/resolvers` | `^5.2.2` |
| `@tanstack/react-table` | `^8.21.3` |
| `class-variance-authority` | `catalog:` |
| `clsx` | `catalog:` |
| `cmdk` | `^1.1.1` |
| `date-fns` | `^4.1.0` |
| `embla-carousel-react` | `^8.6.0` |
| `input-otp` | `^1.4.2` |
| `lucide-react` | `catalog:` |
| `next-themes` | `^0.4.6` |
| `radix-ui` | `^1.4.3` |
| `react` | `catalog:` |
| `react-day-picker` | `^9.13.2` |
| `react-dom` | `catalog:` |
| `react-hook-form` | `^7.71.1` |
| `react-resizable-panels` | `^4` |
| `recharts` | `2.15.4` |
| `sonner` | `^2.0.7` |
| `tailwind-merge` | `catalog:` |
| `tw-animate-css` | `^1.4.0` |
| `vaul` | `^1.1.2` |

---

## Cross-References

- [`route.architecture.md`](./route.architecture.md)
