# Providers

Root-level React providers for the Afena UI library. These must be mounted once at the top of the component tree (typically in `app/layout.tsx`).

## Quick Start

```tsx
// apps/web/app/layout.tsx
import { Providers } from 'afena-ui/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Providers

### `<Providers>`

Unified wrapper that composes all required providers in the correct nesting order:

1. **ThemeProvider** — outermost (so Toaster can read theme)
2. **GlobalTooltipProvider** — shared Radix tooltip delay
3. **ToasterProvider** — Sonner toast mount (inside ThemeProvider)

### `<ThemeProvider>`

Wraps `next-themes` with Afena defaults:

| Prop | Default | Description |
| --- | --- | --- |
| `attribute` | `"class"` | Sets `.dark` on `<html>` — matches bridge CSS layer |
| `defaultTheme` | `"system"` | Respects OS preference |
| `enableSystem` | `true` | Allows "system" as a theme value |
| `disableTransitionOnChange` | `true` | Prevents FOUC during theme switch |

All props from `next-themes` `ThemeProvider` are forwarded.

### `<ToasterProvider>`

Mounts the Sonner `<Toaster />` component. Separated into its own provider so the root layout stays clean and the Toaster can be configured in one place.

To trigger toasts:

```tsx
import { toast } from 'afena-ui';

toast.success('Changes saved');
toast.error('Something went wrong');
```

### `<GlobalTooltipProvider>`

Wraps Radix's `TooltipProvider` at the root so all `<Tooltip>` instances share a single delay timer. Hovering from one tooltip to another skips the open delay.

| Prop | Default | Description |
| --- | --- | --- |
| `delayDuration` | `0` | Milliseconds before tooltip opens |

## Individual Imports

```tsx
import { Providers } from 'afena-ui/providers';
import { ThemeProvider } from 'afena-ui/providers/theme-provider';
import { ToasterProvider } from 'afena-ui/providers/toaster-provider';
import { GlobalTooltipProvider } from 'afena-ui/providers/tooltip-provider';
```

Or from the barrel:

```tsx
import { Providers, ThemeProvider, ToasterProvider, GlobalTooltipProvider } from 'afena-ui';
```

## Nesting Order

The nesting order matters:

```
ThemeProvider          ← must be outermost (provides theme to Toaster)
  └─ GlobalTooltipProvider  ← wraps all content for shared tooltip delay
       ├─ {children}        ← your app
       └─ ToasterProvider   ← renders Sonner portal (reads theme from context)
```
