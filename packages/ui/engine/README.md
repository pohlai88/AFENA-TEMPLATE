# Tailwind Design System Engine

A codegen-powered engine that takes **8 compulsory inputs** and auto-generates a
complete Tailwind v4 design system — shade scales, dark mode, typography,
spacing, shadows, animations, utilities, variants, and component classes.

---

## Tutorial — Get started in 5 minutes

### 1. Fill in your brand values

Open `packages/ui/engine/tailwindengine.json` and set the 8 required fields:

```jsonc
{
  "colors": {
    "primary": "#10b981", // your main brand color (hex)
    "secondary": "#6366f1", // supporting color
    "accent": "#f59e0b", // highlight / CTA color
  },
  "fonts": {
    "sans": "'Geist', sans-serif",
    "mono": "'Geist Mono', monospace",
  },
  "spacingUnit": "4px", // base unit — all spacing is multiples of this
  "radiusBase": "0.375rem", // base border-radius
  "fontSizeBase": "1rem", // base font size — type scale grows from here
  "darkMode": "class", // "class" | "media" | "data-attribute"
  "projectName": "afenda", // appears in generated file headers
  "shadowColor": "oklch(0 0 0 / 0.08)",
}
```

### 2. Run the generator

```bash
pnpm engine:generate
```

This reads your JSON, validates it, and writes 16 CSS files into
`engine/generated/`.

### 3. Verify

```bash
pnpm --filter web build
```

If the build passes, your design system is live. Every Tailwind utility now uses
your tokens.

### 4. Use in your app

Your app's `globals.css` already imports the engine output:

```css
@import 'tailwindcss';
@source "../../../packages/ui/src";
@import '../../../packages/ui/theme.css';
```

Now use the generated classes in your components:

```tsx
// Tailwind utilities (powered by your tokens)
<div className="bg-primary-500 text-primary-foreground rounded-lg shadow-md p-4">

// Component classes
<button className="btn-primary btn-md">Save</button>
<div className="card">
  <div className="card-header">
    <h2 className="card-title">Title</h2>
  </div>
  <div className="card-content">Content</div>
</div>
<input className="input" placeholder="Email" />
<span className="badge-primary">New</span>
<h1 className="heading-1">Page Title</h1>

// Custom utilities
<div className="flex-center glass">Centered glassmorphism</div>
<button className="interactive focus-ring">Click me</button>
<div className="scrollbar-hidden overflow-auto">No scrollbar</div>

// Custom variants
<div className="hocus:bg-primary-100">Hover or focus</div>
<button className="not-disabled:cursor-pointer">Enabled only</button>
```

---

## How-to Guides

### Change your brand colors

1. Open `tailwindengine.json`
2. Change the hex values under `"colors"`:
   ```json
   "colors": {
     "primary":   "#0ea5e9",
     "secondary": "#8b5cf6",
     "accent":    "#ec4899"
   }
   ```
3. Run `pnpm engine:generate`
4. The engine auto-generates 11 oklch shades per color (50–950), contrast
   foreground colors, and dark mode palette

### Override semantic colors

By default, `destructive` = red, `success` = primary, `warning` = accent, `info`
= secondary. To override:

```json
{
  "colors": {
    "primary": "#10b981",
    "secondary": "#6366f1",
    "accent": "#f59e0b"
  },
  "semanticColors": {
    "destructive": "#dc2626",
    "success": "#22c55e",
    "warning": "#eab308",
    "info": "#3b82f6"
  }
}
```

### Switch dark mode strategy

**Class-based** (toggle via `.dark` on `<html>`):

```json
"darkMode": "class"
```

Generated: `@custom-variant dark (&:where(.dark, .dark *));`

**System preference** (automatic via OS setting):

```json
"darkMode": "media"
```

Generated: uses Tailwind's built-in `prefers-color-scheme` — no custom variant
needed.

**Data attribute** (toggle via `data-theme="dark"` on `<html>`):

```json
"darkMode": "data-attribute"
```

Generated:
`@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`

### Change the type scale

The default ratio is `1.25` (major third). Common alternatives:

| Ratio   | Name           | Feel                   |
| ------- | -------------- | ---------------------- |
| `1.125` | Major second   | Compact, dense UI      |
| `1.200` | Minor third    | Moderate               |
| `1.250` | Major third    | **Default** — balanced |
| `1.333` | Perfect fourth | Spacious, editorial    |
| `1.500` | Perfect fifth  | Dramatic headings      |

```json
"typeScaleRatio": 1.333
```

### Add custom variants

```json
"customVariants": {
  "theme-midnight": "&:where([data-theme=\"midnight\"] *)",
  "theme-ocean":    "&:where([data-theme=\"ocean\"] *)"
}
```

These become usable as `theme-midnight:bg-blue-900` etc.

### Add custom breakpoints

```json
"breakpoints": {
  "xs": "475px",
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px"
}
```

### Integrate with a new app in the monorepo

In your new app's main CSS file:

```css
@import 'tailwindcss';
@source "../../../packages/ui/src";
@import '../../../packages/ui/theme.css';
```

That's it. All tokens, utilities, variants, and component classes are available.

---

## Reference

### File structure

```
packages/ui/engine/
├── tailwindengine.json          ← INPUT: you edit this
├── generate.ts                  ← codegen script
├── index.css                    ← generated barrel import
├── generated/                   ← ALL FILES BELOW ARE AUTO-GENERATED
│   ├── tokens/
│   │   ├── colors.css           ← color palettes + semantic + dark mode
│   │   ├── typography.css       ← font families + type scale + weights
│   │   ├── spacing.css          ← spacing scale + radius + border widths
│   │   ├── effects.css          ← shadows + opacity + blur + durations + easings
│   │   └── motion.css           ← @keyframes + animation tokens
│   ├── utilities/
│   │   ├── layout.css           ← scrollbar-hidden, aspect-*, z-index
│   │   ├── flexgrid.css         ← flex-center, flex-between, grid-fill, grid-fit
│   │   ├── typography.css       ← text-balance, text-pretty, truncate-*
│   │   ├── effects.css          ← glass, glass-dark, ring-focus, gradient-*
│   │   └── interactivity.css    ← focus-ring, disabled-style, interactive
│   ├── variants/
│   │   └── custom.css           ← dark, hocus, not-disabled, group-hocus
│   └── components/
│       ├── button.css           ← .btn, .btn-primary/secondary/outline/ghost/destructive
│       ├── card.css             ← .card, .card-header/title/description/content/footer
│       ├── input.css            ← .input, .input-error, .textarea, .select
│       ├── badge.css            ← .badge, .badge-primary/secondary/outline/destructive/success/warning
│       └── typography.css       ← .heading-1–6, .body, .body-sm/lg, .caption, .code
```

### Compulsory fields (8)

| #   | Field              | Type            | Example                                    |
| --- | ------------------ | --------------- | ------------------------------------------ |
| 1   | `colors.primary`   | CSS hex         | `"#10b981"`                                |
| 2   | `colors.secondary` | CSS hex         | `"#6366f1"`                                |
| 3   | `colors.accent`    | CSS hex         | `"#f59e0b"`                                |
| 4   | `fonts.sans`       | CSS font-family | `"'Geist', sans-serif"`                    |
| 5   | `fonts.mono`       | CSS font-family | `"'Geist Mono', monospace"`                |
| 6   | `spacingUnit`      | CSS length      | `"4px"`                                    |
| 7   | `radiusBase`       | CSS length      | `"0.375rem"`                               |
| 8   | `fontSizeBase`     | CSS length      | `"1rem"`                                   |
| 9   | `darkMode`         | enum            | `"class"` / `"media"` / `"data-attribute"` |
| 10  | `projectName`      | string          | `"afenda"`                                 |
| 11  | `shadowColor`      | CSS color       | `"oklch(0 0 0 / 0.08)"`                    |

> Note: `colors` has 3 sub-fields, `fonts` has 2 — totalling 8 top-level fields,
> 11 values.

### Optional fields (12)

| #   | Field                        | Type                   | Default                                     |
| --- | ---------------------------- | ---------------------- | ------------------------------------------- |
| 12  | `fonts.heading`              | CSS font-family        | Same as `fonts.sans`                        |
| 13  | `semanticColors.destructive` | CSS hex                | `"#ef4444"`                                 |
| 14  | `semanticColors.success`     | CSS hex                | Same as `colors.primary`                    |
| 15  | `semanticColors.warning`     | CSS hex                | Same as `colors.accent`                     |
| 16  | `semanticColors.info`        | CSS hex                | Same as `colors.secondary`                  |
| 17  | `typeScaleRatio`             | number                 | `1.25`                                      |
| 18  | `spacingSteps`               | number[]               | 33 standard steps (0.5–96)                  |
| 19  | `motion.fast`                | CSS time               | `"150ms"`                                   |
| 20  | `motion.normal`              | CSS time               | `"300ms"`                                   |
| 21  | `motion.slow`                | CSS time               | `"500ms"`                                   |
| 22  | `motion.reduced`             | CSS time               | `"0ms"`                                     |
| 23  | `easings`                    | Record<string, string> | 5 curves (default, in, out, in-out, bounce) |
| 24  | `zIndex`                     | Record<string, number> | 8 layers (dropdown–tooltip, 1000–1080)      |
| 25  | `breakpoints`                | Record<string, string> | Tailwind v4 defaults                        |
| 26  | `containers`                 | Record<string, string> | Derived from breakpoints                    |
| 27  | `opacitySteps`               | number[]               | 0–100 by 5                                  |
| 28  | `borderWidths`               | Record<string, string> | 0/1/2/4/8px                                 |
| 29  | `customVariants`             | Record<string, string> | `{}`                                        |

### Generated color palette (per color)

Each color input generates 11 shades in oklch color space:

```
Input: "#10b981"
  → 50:  oklch(0.970 0.016 159)   near-white tint
  → 100: oklch(0.940 0.039 159)
  → 200: oklch(0.880 0.071 159)
  → 300: oklch(0.800 0.103 159)
  → 400: oklch(0.740 0.134 159)
  → 500: oklch(0.640 0.158 159)   ← base (your input)
  → 600: oklch(0.550 0.142 159)
  → 700: oklch(0.450 0.126 159)
  → 800: oklch(0.350 0.103 159)
  → 900: oklch(0.250 0.079 159)
  → 950: oklch(0.150 0.055 159)   near-black shade
  → foreground: #000000 or #ffffff (WCAG contrast)
```

Dark mode swaps: 50↔950, 100↔900, 200↔800, 300↔700, 400↔600.

### Generated component classes

| Component      | Classes                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Button**     | `.btn` `.btn-primary` `.btn-secondary` `.btn-outline` `.btn-ghost` `.btn-destructive` `.btn-sm` `.btn-md` `.btn-lg` `.btn-icon` |
| **Card**       | `.card` `.card-header` `.card-title` `.card-description` `.card-content` `.card-footer`                                         |
| **Input**      | `.input` `.input-error` `.textarea` `.select`                                                                                   |
| **Badge**      | `.badge` `.badge-primary` `.badge-secondary` `.badge-outline` `.badge-destructive` `.badge-success` `.badge-warning`            |
| **Typography** | `.heading-1` `.heading-2` `.heading-3` `.heading-4` `.heading-5` `.heading-6` `.body` `.body-sm` `.body-lg` `.caption` `.code`  |

### Generated custom utilities

| Utility              | What it does                                                         |
| -------------------- | -------------------------------------------------------------------- |
| `scrollbar-hidden`   | Hides scrollbar across all browsers                                  |
| `aspect-photo`       | `aspect-ratio: 4/3`                                                  |
| `aspect-cinema`      | `aspect-ratio: 21/9`                                                 |
| `flex-center`        | `display: flex; align-items: center; justify-content: center`        |
| `flex-between`       | `display: flex; align-items: center; justify-content: space-between` |
| `flex-col-center`    | Flex column centered both axes                                       |
| `flex-start`         | Flex row, items centered, content start                              |
| `flex-end`           | Flex row, items centered, content end                                |
| `grid-fill`          | Auto-fill responsive grid (min 16rem)                                |
| `grid-fit`           | Auto-fit responsive grid (min 16rem)                                 |
| `text-balance`       | `text-wrap: balance`                                                 |
| `text-pretty`        | `text-wrap: pretty`                                                  |
| `truncate-1`         | Single-line ellipsis                                                 |
| `truncate-2`         | 2-line clamp                                                         |
| `truncate-3`         | 3-line clamp                                                         |
| `glass`              | Glassmorphism (light)                                                |
| `glass-dark`         | Glassmorphism (dark)                                                 |
| `ring-focus`         | Focus-visible ring via box-shadow                                    |
| `gradient-primary`   | Left-to-right primary gradient                                       |
| `gradient-secondary` | Left-to-right secondary gradient                                     |
| `gradient-accent`    | Left-to-right accent gradient                                        |
| `focus-ring`         | Focus-visible outline ring                                           |
| `disabled-style`     | Disabled state (opacity + no pointer)                                |
| `interactive`        | Cursor pointer + transition + disabled state                         |

### Generated custom variants

| Variant        | Selector                                 | Usage                         |
| -------------- | ---------------------------------------- | ----------------------------- |
| `dark`         | Depends on `darkMode` field              | `dark:bg-gray-900`            |
| `hocus`        | `&:hover, &:focus-visible`               | `hocus:text-primary-500`      |
| `not-disabled` | `&:not(:disabled)`                       | `not-disabled:cursor-pointer` |
| `group-hocus`  | `.group:hover &, .group:focus-visible &` | `group-hocus:opacity-100`     |

### Commands

| Command                                   | Where     | What it does                                   |
| ----------------------------------------- | --------- | ---------------------------------------------- |
| `pnpm engine:generate`                    | repo root | Regenerates all CSS from `tailwindengine.json` |
| `pnpm --filter afenda-ui engine:generate` | repo root | Same, explicit filter                          |
| `npx tsx packages/ui/engine/generate.ts`  | repo root | Direct execution                               |

---

## Explanation

### Why a codegen approach instead of pure CSS?

CSS cannot loop, compute shade scales, or derive values from a single color.
Tailwind v4's `@theme` directive accepts static values — it has no `for` loop or
color math. A codegen step bridges this gap: you provide minimal input, the
script does the math (hex → oklch conversion, lightness interpolation, contrast
calculation), and outputs static CSS that Tailwind v4 consumes natively.

### Why oklch for colors?

oklch is a perceptually uniform color space. Unlike HSL, equal steps in oklch
lightness produce visually equal steps in perceived brightness. This means shade
scales look consistent and predictable. The engine converts your hex input to
oklch, then interpolates lightness from 0.97 (shade 50) to 0.15 (shade 950)
while scaling chroma proportionally.

### Why raw CSS in components instead of @apply?

Tailwind v4's `@apply` only resolves **Tailwind utility classes** — not custom
CSS classes. Writing `.btn-primary { @apply btn ... }` fails because `.btn` is a
custom class, not a Tailwind utility. The engine generates raw CSS properties
with `var()` references to theme tokens, which is more explicit and avoids this
limitation.

### How dark mode works

The engine generates two blocks:

1. **`@theme { ... }`** — light mode tokens (default)
2. **`.dark { ... }`** — overrides that swap shade scales (50↔950, 100↔900,
   etc.)

When `darkMode: "class"`, a `@custom-variant dark` is generated so you can use
`dark:bg-primary-900` in your markup. Toggle it by adding/removing the `.dark`
class on `<html>`.

### How the import chain works

```
apps/web/app/globals.css
  └─ @import 'tailwindcss'              ← Tailwind v4 core
  └─ @source '../../../packages/ui/src' ← scan UI package for class usage
  └─ @import '../../../packages/ui/theme.css'
       └─ @import './engine/index.css'
            └─ @import './generated/tokens/colors.css'
            └─ @import './generated/tokens/typography.css'
            └─ @import './generated/tokens/spacing.css'
            └─ @import './generated/tokens/effects.css'
            └─ @import './generated/tokens/motion.css'
            └─ @import './generated/utilities/layout.css'
            └─ @import './generated/utilities/flexgrid.css'
            └─ @import './generated/utilities/typography.css'
            └─ @import './generated/utilities/effects.css'
            └─ @import './generated/utilities/interactivity.css'
            └─ @import './generated/variants/custom.css'
            └─ @import './generated/components/button.css'
            └─ @import './generated/components/card.css'
            └─ @import './generated/components/input.css'
            └─ @import './generated/components/badge.css'
            └─ @import './generated/components/typography.css'
```

### What `globals.css` should look like

After the engine is set up, your app's `globals.css` should be minimal. The
engine handles tokens, so remove any manual `:root` variables that overlap:

```css
@import 'tailwindcss';
@source "../../../packages/ui/src";
@import '../../../packages/ui/theme.css';

/* Only keep app-specific overrides here, not design tokens */
```

### Idempotency

Running `pnpm engine:generate` multiple times with the same input always
produces identical output. The generated files are deterministic — same JSON in,
same CSS out. No timestamps, no randomness.

### Git strategy

Generated files (`engine/generated/` and `engine/index.css`) are in
`.gitignore`. Only `tailwindengine.json` and `generate.ts` are tracked. Any
developer clones the repo and runs `pnpm engine:generate` to reproduce the
design system.
