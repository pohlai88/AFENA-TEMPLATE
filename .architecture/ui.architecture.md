# Afena UI Architecture — Engineering Reference

> **Status:** Current as of Feb 13, 2026
> **Framework:** Next.js 16.1.6 (App Router, RSC-first)
> **Design System:** Tailwind v4 + shadcn/ui (new-york style)
> **UI Package:** `packages/ui` (`afena-ui`)
> **App:** `apps/web` (Next.js)
> **Cross-references:** `CAN-ARCH-CRUD-SAP` (crud.architecture.md), `database.architecture.md`, `meta.engine.md`, `ui.pattern.md`

---

## 0. Document Identity

| Field        | Value                                                                               |
| ------------ | ----------------------------------------------------------------------------------- |
| **Canon ID** | `CAN-ARCH-UI`                                                                       |
| **Version**  | `1.0`                                                                               |
| **Status**   | Ratified                                                                            |
| **Scope**    | All UI layers: design system, app shell, CRUD composables, data flow, observability |

---

## 1. Executive Summary

Afena's UI is a **four-layer architecture** built on a single principle: **the server is the source of truth for data, policy, and actions — the client is a rendering surface only.**

| Layer | Name                 | Location                         | Responsibility                                       |
| ----- | -------------------- | -------------------------------- | ---------------------------------------------------- |
| **0** | Design System Engine | `packages/ui/engine/`            | Token codegen → CSS variables → Tailwind v4 bridge   |
| **1** | Component Library    | `packages/ui/src/`               | shadcn/ui primitives + custom hooks + utility lib    |
| **2** | App Shell            | `apps/web/app/(app)/org/[slug]/` | Sidebar, header, breadcrumbs, command palette, auth  |
| **3** | Entity CRUD System   | `_components/crud/` + per-entity | ActionResolver, composables, server actions, logging |

Every layer enforces **zero-drift constraints**: no hardcoded colors, no client-invented actions, no `console.*` in runtime paths, no `'use client'` in pages/layouts.

---

## 2. System Invariants

These rules are **non-negotiable**. Violation of any invariant is a UI bug.

```
UI-INV-01  No hardcoded colors in component files.
           Only Tailwind v4 token classes (bg-primary, text-muted-foreground, etc.)
           and CSS custom properties from globals.css.
           Enforced by: CI invariant E3.

UI-INV-02  No 'use client' in page.tsx or layout.tsx.
           Pages and layouts are Server Components. Client interactivity lives
           in *_client.tsx leaf components only.
           Enforced by: CI invariant E1.

UI-INV-03  No console.* in runtime paths.
           All logging goes through Pino (afena-logger).
           Enforced by: CI invariant E2.
           Exception: apps/web/src/lib/client-logger.ts (designated wrapper).

UI-INV-04  Client cannot invent actions.
           All entity actions are resolved server-side by ActionResolver.
           Client renders ONLY what the resolver returns.
           Enforced by: CI invariant E4 + code review.

UI-INV-05  No ad-hoc action verbs.
           All verbs come from Canon AUTH_VERBS / ActionKind.
           Enforced by: CI invariant E4.

UI-INV-06  State ownership boundaries.
           TanStack Table owns table state. React Hook Form owns form state.
           Zustand is reserved for shell UX only (sidebar, density, preferences).
           Never duplicate table/form state into Zustand.

UI-INV-07  Components import from afena-ui only.
           Never import directly from radix-ui, cmdk, vaul, etc.
           All primitives are re-exported through packages/ui barrel.

UI-INV-08  Surface annotations required for capability tracking.
           Every page with write capabilities must have a co-located surface.ts.
           Enforced by: afena meta check (VIS-00 through VIS-04).
```

---

## 3. Layer 0 — Design System Engine

### 3.1 Architecture

The engine is a **codegen pipeline** that transforms a single JSON config into a complete CSS token system compatible with both shadcn/ui and Tailwind v4.

```
tailwindengine.json  →  generate.ts  →  globals.css (bridge)
     (input)            (codegen)         (output)
```

**Three sub-layers within the engine:**

| Sub-layer | What it provides                                                       | Source                        |
| --------- | ---------------------------------------------------------------------- | ----------------------------- |
| **A**     | Official shadcn neutral presets (slate/zinc/stone/neutral) — 21 tokens | Hardcoded in `generate.ts`    |
| **B**     | Brand primary overrides (oklch)                                        | `tailwindengine.json → brand` |
| **C**     | Semantic + extended tokens (status, elevation, motion)                 | Derived from A + B + config   |

### 3.2 Config File

**Location:** `packages/ui/engine/tailwindengine.json`

| Key                 | Type   | Current Value                            | Purpose                            |
| ------------------- | ------ | ---------------------------------------- | ---------------------------------- |
| `neutralBase`       | enum   | `"slate"`                                | shadcn preset (21 neutral tokens)  |
| `surfaces.dark`     | object | Semi-transparent oklch values            | Dark mode glass/panel overrides    |
| `brand.primary`     | string | `oklch(0.80 0.12 205)` (cyan)            | Brand primary color                |
| `brand.primaryDark` | string | `oklch(0.82 0.14 195)`                   | Dark mode primary                  |
| `semanticColors`    | object | destructive, success, warning, info (×2) | Status colors (light + dark)       |
| `fonts.sans`        | string | Plus Jakarta Sans, Inter                 | Engine default (overridden by app) |
| `radiusBase`        | string | `0.625rem`                               | Border radius base                 |
| `motion.normal`     | string | `400ms`                                  | Animation duration                 |
| `easings.default`   | string | `cubic-bezier(0.2, 0, 0, 1)`             | Standard easing                    |
| `projectName`       | string | `"Aura"`                                 | Theme name                         |

> **Note:** Some keys have defaults in the generator and may not appear in the config file.

### 3.3 Generated Output — globals.css

**Location:** `packages/ui/src/styles/globals.css` (563 lines, auto-generated)

**Structure:**

1. **`@theme inline`** — Registers `--color-*` aliases for Tailwind v4 utility classes (e.g., `bg-primary` reads `--color-primary` which reads `--primary`)
2. **`:root`** — Light mode concrete oklch values (neutrals from preset + brand overrides + derived tokens)
3. **`.dark`** — Dark mode values (surface overrides + adjusted brand + dark semantics)
4. **`@layer base`** — Resets (border-border, scrollbar styling, focus-visible, reduced-motion, dark body gradient)
5. **`@layer utilities`** — Elevation classes (`elev-xs` through `elev-2xl`), status utilities (`status-success/warning/info/critical`), aurora-card, glass, section-divider, button/card/badge polish
6. **View transitions** — Theme toggle animation support

### 3.4 Token Taxonomy

| Category        | Tokens                                                                                           | Count |
| --------------- | ------------------------------------------------------------------------------------------------ | ----- |
| **Neutral**     | background, foreground, card, popover, secondary, muted, accent, border, input, ring             | 21    |
| **Brand**       | primary, primary-foreground, destructive, destructive-foreground                                 | 4     |
| **Sidebar**     | sidebar, sidebar-foreground, sidebar-primary, sidebar-accent, sidebar-border, sidebar-ring, etc. | 14    |
| **Chart**       | chart-1 through chart-5, chart-grid, chart-axis, chart-tooltip                                   | 8     |
| **Interaction** | hover, active, selected, disabled, disabled-foreground, link, link-hover, placeholder            | 8     |
| **Status**      | success/warning/info/critical × (base, foreground, muted, border, ring)                          | 20    |
| **Badge**       | badge-critical/warning/success/info × (base, foreground)                                         | 8     |
| **Palette**     | palette-1 through palette-10                                                                     | 10    |
| **Elevation**   | shadow-xs through shadow-2xl, card-shadow, card-shadow-dark, glow, panel-shadow-left/right       | 10    |
| **Layout**      | sidebar-width, sidebar-width-icon, sidebar-width-mobile, header-height                           | 4     |
| **Z-index**     | z-base, z-sidebar, z-sticky, z-dropdown, z-popover, z-modal, z-fab, z-toast                      | 8     |
| **Motion**      | ease-standard, ease-emphasized, dur-fast, dur-standard, dur-slow                                 | 5     |
| **Radius**      | radius (base), radius-sm through radius-4xl                                                      | 7     |

**Total: ~127 CSS custom properties** across light and dark modes.

### 3.5 Engine-Level Polish (globals.css @layer utilities)

These are **global micro-interactions** applied via `data-slot` selectors — they work automatically on all shadcn components:

| Target                 | Behavior                                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------------------- |
| `[data-slot="button"]` | Transition + shadow-sm default + lift on hover + press scale. Dark: gradient, glow, glass per-variant |
| `[data-slot="card"]`   | Transition + shadow-md + translateY(-1px) on hover                                                    |
| `[data-slot="badge"]`  | Dark mode: glass bg + border                                                                          |
| `.glass`               | Backdrop-blur + semi-transparent bg (light: white/70%, dark: black/30%)                               |
| `.aurora-card`         | Opt-in gradient overlay + glow on hover                                                               |
| `.section-divider`     | Gradient fade line replacing hard `<Separator />`                                                     |
| `.status-*`            | Status utility classes with muted bg + colored border + foreground                                    |
| `.elev-*`              | Elevation shadow scale (xs through 2xl)                                                               |

### 3.6 Regeneration

```bash
npx tsx packages/ui/engine/generate.ts
```

**Rule:** Never hand-edit `globals.css`. Always modify `tailwindengine.json` and regenerate.

---

## 4. Layer 1 — Component Library (`packages/ui`)

### 4.1 Package Identity

| Field       | Value                                                |
| ----------- | ---------------------------------------------------- |
| **Name**    | `afena-ui`                                           |
| **Style**   | shadcn/ui `new-york`                                 |
| **Build**   | tsup (DTS only, source consumed directly by Next.js) |
| **Exports** | Barrel (`src/index.ts`) + direct path imports        |

### 4.2 Directory Structure

```
packages/ui/
├── engine/
│   ├── tailwindengine.json      ← Config (input)
│   ├── generate.ts              ← Codegen script (1495 lines)
│   └── index.css                ← Engine entry CSS
├── src/
│   ├── components/              ← 61 shadcn primitives + custom
│   ├── hooks/                   ← 21 custom hooks
│   ├── lib/                     ← Utilities (cn, format, aria, dom, types, etc.)
│   ├── providers/               ← ThemeProvider, ToasterProvider, GlobalTooltipProvider
│   ├── styles/
│   │   └── globals.css          ← Generated bridge CSS (563 lines)
│   └── index.ts                 ← Barrel exports (101 lines)
├── components.json              ← shadcn config
├── tsup.config.ts               ← Build config (DTS only)
├── tsconfig.json                ← composite: true
└── tsconfig.build.json          ← tsup escape hatch (composite: false)
```

### 4.3 Component Inventory (61 components)

**Core Primitives (from shadcn/ui):**
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, form, hover-card, input, input-group, input-otp, item, kbd, label, menubar, native-select, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

**Custom Components:**

- `animate-on-scroll` — IntersectionObserver + engine keyframes
- `data-table` — TanStack Table wrapper (in packages/ui)
- `date-picker` — Calendar + Popover composition
- `file-upload` — Drag-and-drop file upload
- `typography` — Heading/text primitives

**Total: 61 components** (shadcn primitives + custom)

### 4.4 Hook Inventory (21 hooks)

| Hook                           | Purpose                              |
| ------------------------------ | ------------------------------------ |
| `use-callback-ref`             | Stable callback ref                  |
| `use-click-outside`            | Click outside detection              |
| `use-clipboard`                | Clipboard copy/paste                 |
| `use-controllable-state`       | Controlled/uncontrolled state bridge |
| `use-debounce`                 | Debounced value/callback             |
| `use-disclosure`               | Open/close state machine             |
| `use-event-listener`           | Type-safe event listener             |
| `use-focus-trap`               | Focus trap for modals                |
| `use-intersection-observer`    | Viewport intersection detection      |
| `use-isomorphic-layout-effect` | SSR-safe useLayoutEffect             |
| `use-keyboard-shortcut`        | Keyboard shortcut binding            |
| `use-local-storage`            | Persistent local storage state       |
| `use-lock-body-scroll`         | Body scroll lock                     |
| `use-media-query`              | Responsive media query               |
| `use-mobile`                   | Mobile breakpoint detection          |
| `use-mounted`                  | Mount state tracking                 |
| `use-previous`                 | Previous value tracking              |
| `use-resize-observer`          | Element resize detection             |
| `use-scroll-position`          | Scroll position tracking             |
| `use-throttle`                 | Throttled value/callback             |
| `use-toggle`                   | Boolean toggle state                 |

### 4.5 Utility Library (`src/lib/`)

| Module                      | Exports                                                                                                                               |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `utils.ts`                  | `cn()`, `cva`, `VariantProps`, `dataSlot()`, `cssVars()`, `pickDataAttributes()`                                                      |
| `compose-refs.ts`           | `composeRefs()`, `useComposedRefs()`                                                                                                  |
| `compose-event-handlers.ts` | `composeEventHandlers()`                                                                                                              |
| `keyboard.ts`               | `Keys`, `isKey()`, `isPrintableKey()`                                                                                                 |
| `assertion.ts`              | `invariant()`, `isDefined()`, `isNonEmptyString()`, `isPlainObject()`, `isReactElement()`                                             |
| `dom.ts`                    | `canUseDOM()`, `getOwnerDocument()`, `getFocusableElements()`, `scrollIntoViewIfNeeded()`, etc.                                       |
| `format.ts`                 | `formatNumber()`, `formatCurrency()`, `formatCompact()`, `formatRelativeTime()`, `formatFileSize()`, `truncate()`, `getInitials()`    |
| `aria.ts`                   | `generateId()`, `ariaDescribedBy()`, `ariaDisclosureTrigger()`, `ariaLiveRegion()`, `ariaSortColumn()`, `ariaCountLabel()`            |
| `color.ts`                  | `cssVar()`, `withOpacity()`, `getComputedCSSVar()`, `setCSSVar()`, `removeCSSVar()`                                                   |
| `types.ts`                  | `ComponentProps`, `PolymorphicProps`, `RequiredKeys`, `OptionalKeys`, `ValueOf`, `DeepReadonly`, `DeepPartial`, `StrictOmit`, `Merge` |

### 4.6 Provider Composition

The `Providers` wrapper composes root-level providers in the correct nesting order:

```
ThemeProvider (next-themes)
  └── GlobalTooltipProvider (Radix shared delay)
        ├── {children}
        └── ToasterProvider (Sonner toast mount)
```

**Usage in root layout:**

```tsx
<Providers>{children}</Providers>
```

### 4.7 Import Patterns

**Barrel import (bundled):**

```tsx
import { Button, Card, cn } from 'afena-ui';
```

**Direct path import (tree-shakeable, preferred for app code):**

```tsx
import { Button } from 'afena-ui/components/button';
import { cn } from 'afena-ui/lib/utils';
import { useDebounce } from 'afena-ui/hooks/use-debounce';
import { Providers } from 'afena-ui/providers';
```

### 4.8 Adding New Components

```bash
# From packages/ui directory
pnpm dlx shadcn@latest add <component>
```

**Post-install checklist:**

1. Add export to `src/index.ts` barrel
2. Check `globals.css` for duplicate sidebar vars or injected CSS that overrides the bridge layer
3. Remove any hardcoded HSL values that conflict with engine token mappings

### 4.9 Build Configuration

tsup builds **DTS only** — Next.js consumes source files directly via the `exports` field in `package.json`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./components/*": "./src/components/*.tsx",
    "./providers": "./src/providers/index.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts",
    "./styles/*": "./src/styles/*.css"
  }
}
```

**Key dependencies:** radix-ui (unified), class-variance-authority, lucide-react, next-themes, sonner, cmdk, @tanstack/react-table, react-hook-form, @hookform/resolvers, recharts, react-resizable-panels, vaul, embla-carousel-react, react-day-picker, input-otp, tw-animate-css, @base-ui/react

---

## 5. Layer 2 — App Shell

### 5.1 Route Architecture

The app uses Next.js route groups to separate public and authenticated surfaces:

```
apps/web/app/
├── layout.tsx                          ← Root: fonts + Providers
├── globals.css                         ← Tailwind + engine bridge import
├── (public)/
│   ├── (marketing)/
│   │   ├── layout.tsx                  ← Minimal (no sidebar)
│   │   └── page.tsx                    ← Landing page (561 lines)
│   └── (auth)/
│       ├── layout.tsx                  ← Auth layout (centered)
│       └── auth/[path]/page.tsx        ← Neon Auth views
├── (app)/
│   ├── layout.tsx                      ← AuthProvider + QueryProvider + CommandPalette
│   ├── dashboard/page.tsx              ← Org selection / redirect
│   └── org/[slug]/
│       ├── layout.tsx                  ← Org shell (sidebar + header + main)
│       ├── page.tsx                    ← Org dashboard
│       ├── contacts/                   ← Entity pages
│       ├── files/                      ← File management
│       └── _components/                ← Shell + CRUD composables
└── api/                                ← API routes
    ├── auth/[...path]/                 ← Neon Auth handler
    ├── search/                         ← FTS search
    ├── custom-fields/[entityType]/     ← Custom field definitions
    ├── views/[entityType]/             ← Entity view definitions
    ├── storage/                        ← R2 presign + metadata
    └── meta/capabilities/              ← Capability ledger + flags
```

### 5.2 CSS Import Chain

```
apps/web/app/globals.css
  ├── @import 'tailwindcss'                           ← Tailwind v4 core
  ├── @source '../../../packages/ui/src'              ← Scan UI package for classes
  ├── @import '../../../packages/ui/theme.css'        ← Engine entry
  ├── @import '../../../packages/ui/src/styles/globals.css'  ← Bridge (generated)
  └── @theme inline { --font-sans: var(--font-geist-sans) } ← App-level font override
```

**Font loading:** Next.js `next/font/google` loads Geist Sans + Geist Mono, injected as CSS variables (`--font-geist-sans`, `--font-geist-mono`) on `<body>`. The app-level `@theme inline` overrides the engine's default font stack.

### 5.3 Provider Stack

The full provider nesting order from root to leaf:

```
RootLayout (Server)
  └── Providers (afena-ui: Theme + Tooltip + Toaster)
        └── AppLayout (Server)
              └── AuthProvider (Neon Auth UI)
                    └── QueryProvider (@tanstack/react-query)
                          ├── {children}
                          └── CommandPalette (⌘K)
                                └── OrgLayout (Server)
                                      └── OrgProvider (org context)
                                            └── SidebarProvider (shadcn)
                                                  ├── AppSidebar (Client)
                                                  └── SidebarInset
                                                        ├── AppHeader (Client)
                                                        └── <main>{children}</main>
```

### 5.4 Org Shell Components

**Location:** `apps/web/app/(app)/org/[slug]/`

| File                                     | Type   | Responsibility                                         |
| ---------------------------------------- | ------ | ------------------------------------------------------ |
| `layout.tsx`                             | Server | Fetch org context + actor, compose shell               |
| `_server/org-context_server.ts`          | Server | `React.cache()` wrapped org + actor resolution         |
| `_components/nav-config.ts`              | Data   | SSOT for sidebar labels, breadcrumb labels, ⌘K entries |
| `_components/app-sidebar_client.tsx`     | Client | Sidebar with nav groups, org switcher, user button     |
| `_components/app-header_client.tsx`      | Client | Header with sidebar trigger + breadcrumbs              |
| `_components/app-breadcrumbs_client.tsx` | Client | Dynamic breadcrumbs from `usePathname()`               |

### 5.5 Navigation Config (SSOT)

`nav-config.ts` is the **single source of truth** for all navigation surfaces:

```typescript
interface NavItem {
  label: string;
  href: (slug: string) => string;
  icon: LucideIcon;
  group: 'main' | 'system';
  commandPaletteAction?: string;
}
```

**Current nav items:** Dashboard, Contacts, Advisories, Files, Trash, Settings

**Consumers:**

1. **Sidebar** — renders `NAV_GROUPS` with active state from `usePathname()`
2. **Breadcrumbs** — `getBreadcrumbLabel(segment)` resolves segment → label
3. **Command Palette** — items with `commandPaletteAction` appear as quick actions

### 5.6 Org Context

**Server-side:** `getOrgContext(slug)` resolves org + actor from DB (React.cache for request dedup).

**Client-side:** `OrgProvider` / `useOrg()` provides read-only derived values:

```typescript
interface OrgContextValue {
  orgSlug: string; // Router source of truth
  orgId: string; // DB source of truth
  orgName: string;
  userRole: string | null;
}
```

### 5.7 Command Palette (⌘K)

**Location:** `apps/web/app/command-palette.tsx`

- **Trigger:** `⌘K` / `Ctrl+K` keyboard shortcut
- **Search:** `@tanstack/react-query` with `staleTime: 10s` → `GET /api/search?q=&limit=10`
- **Sections:** Search results, Quick actions (New Contact), Navigation (Dashboard, Contacts, Trash)
- **Org-aware:** Extracts org slug from `window.location.pathname`

### 5.8 Authentication

**Provider:** Neon Auth SDK (`@neondatabase/auth` v0.2.0-beta.1)

| Component             | Location                                   | Purpose                                 |
| --------------------- | ------------------------------------------ | --------------------------------------- |
| `auth` (server)       | `src/lib/auth/server.ts`                   | `createNeonAuth()` singleton            |
| `authClient` (client) | `src/lib/auth/client.ts`                   | `createAuthClient()` singleton          |
| Auth handler          | `app/api/auth/[...path]/route.ts`          | `auth.handler()`                        |
| Auth middleware       | `proxy.ts`                                 | `auth.middleware()(request)`            |
| Auth UI provider      | `app/auth-provider.tsx`                    | `NeonAuthUIProvider` wrapper            |
| Auth views            | `app/(public)/(auth)/auth/[path]/page.tsx` | Sign-in, sign-up, forgot-password, etc. |

**Auth CSS:** `@import '@neondatabase/auth/ui/tailwind'` — auto-inherits shadcn CSS vars (included via Neon Auth SDK).

---

## 6. Layer 3 — Entity CRUD System

### 6.1 Three-Concept Separation (Enterprise Action Model)

**Never mix these three concepts:**

| Concept               | What it is                     | Examples                                        | UI Surface                  |
| --------------------- | ------------------------------ | ----------------------------------------------- | --------------------------- |
| **Verb**              | User-facing primary action     | Create, Update, Delete, Restore, Submit, Cancel | Top-level buttons           |
| **Update Mode**       | Routing under Update only      | Edit, Correct, Amend, Adjust, Reassign          | Modal after clicking Update |
| **Workflow Decision** | State decision with RBAC + SoD | Approve, Reject                                 | Separate gated buttons      |

**Rules:**

- Users see **Update** as the single entrypoint for changes → **Update Mode dialog** chooses mode
- **Approve/Reject are never update subclasses**
- Policy governs both layers: (1) can user press Update? (2) which update modes? (3) workflow decisions allowed?

### 6.2 ActionResolver (Server Truth)

**Location:** `_components/crud/server/action-resolver_server.ts`

The ActionResolver is the **single authority** for what the current actor may do on the current entity. Client renders ONLY this output.

**Input:**

```typescript
interface ResolverInput {
  contract: EntityContract; // From entity-registry
  docStatus: DocStatus | null; // Current document status
  isDeleted: boolean; // Soft-delete flag
  isLocked: boolean; // Lock flag
  actor: { userId; roles; orgRole };
  submitterUserId?: string; // SoD signal
  assignedApproverUserIds?: string[];
}
```

**Output:**

```typescript
interface ResolvedActions {
  primary: ResolvedAction[]; // CTA buttons (Update, Submit, Delete)
  secondary: ResolvedAction[]; // Dropdown actions (Restore)
  workflow: ResolvedAction[]; // Gated decisions (Approve, Reject)
  updateModes: ResolvedUpdateMode[]; // Available modes for Update
}
```

**Resolution logic:**

1. Deleted entities → only `restore` (if `hasSoftDelete`)
2. Locked entities → no actions
3. Lifecycle transitions → filter verbs by current `docStatus`
4. SoD enforcement → submitter cannot approve their own submission
5. Update modes → `amend`/`adjust` only available after approval (`active` status)

### 6.3 EntityContract (Canon Type)

Every entity declares its capabilities via an `EntityContract`:

```typescript
interface EntityContract {
  entityType: string;
  label: string;
  labelPlural: string;
  hasLifecycle: boolean;
  hasSoftDelete: boolean;
  transitions: LifecycleTransition[];
  updateModes: UpdateMode[];
  reasonRequired: (ActionKind | UpdateMode)[];
  workflowDecisions: ActionKind[];
  primaryVerbs: ActionKind[];
  secondaryVerbs: ActionKind[];
}
```

**Reference implementation (Contacts):**

```typescript
const CONTACT_CONTRACT: EntityContract = {
  entityType: 'contacts',
  label: 'Contact',
  labelPlural: 'Contacts',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'delete', 'submit'] },
    { from: 'submitted', allowed: ['approve', 'reject', 'cancel'] },
    { from: 'active', allowed: ['update', 'cancel', 'delete'] },
    { from: 'cancelled', allowed: ['restore'] },
  ],
  updateModes: ['edit', 'correct', 'amend', 'adjust'],
  reasonRequired: ['reject', 'cancel'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['update', 'submit', 'delete'],
  secondaryVerbs: ['restore'],
};
```

### 6.4 CRUD Composable Inventory

**Location:** `apps/web/app/(app)/org/[slug]/_components/crud/`

#### Server Components (3 files)

| File                        | Purpose                                                 |
| --------------------------- | ------------------------------------------------------- |
| `entity-registry_server.ts` | Maps `entityType` → `EntityContract` (runtime registry) |
| `action-resolver_server.ts` | Resolves allowed actions from contract + state + actor  |
| `action-logger_server.ts`   | Pino wrappers: `logActionStart/Success/Error`           |

#### Client Components (12 files)

| File                               | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| `action-bar_client.tsx`            | Primary + Secondary + Workflow button sections                   |
| `action-button_client.tsx`         | Renders a single `ResolvedAction` as a Button                    |
| `confirm-action-dialog_client.tsx` | Confirmation dialog with optional reason + typed confirm         |
| `update-mode-dialog_client.tsx`    | Update → mode selection modal                                    |
| `status-badge.tsx`                 | Document status badge (draft/submitted/active/cancelled/amended) |
| `page-header.tsx`                  | Title + description + action slot                                |
| `entity-toolbar_client.tsx`        | Search input + filter slot                                       |
| `entity-columns.tsx`               | Shared column def helpers                                        |
| `entity-actions-cell_client.tsx`   | Row-level action dropdown                                        |
| `entity-detail-layout.tsx`         | 2-column detail layout (main + sidebar) + MetadataCard           |
| `entity-form-shell_client.tsx`     | Form wrapper with `useActionState` + error display + footer      |
| `data-table_client.tsx`            | TanStack Table wrapper with toolbar + pagination + empty state   |

### 6.5 Entity Page Patterns

#### List Page (Server + Client Table)

```
Server page.tsx
  ├── Fetch rows (React.cache query loader)
  ├── Fetch org context
  ├── Resolve row actions (ActionResolver per row)
  └── Render:
        ├── PageHeader (title + New/Trash buttons)
        └── EntityTable_client (DataTable + columns + row actions)
```

**Target:** List pages ≤ 70 lines. Contacts list: 71 lines.

#### Detail Page (Server + Client Islands)

```
Server page.tsx
  ├── Fetch entity (React.cache query loader)
  ├── Fetch org context
  ├── Resolve actions (ActionResolver)
  └── Render EntityDetailLayout:
        ├── header: PageHeader + StatusBadge + ActionBar
        ├── main: Info card(s)
        ├── sidebar: MetadataCard (created/updated/version + links)
        └── footer: Optional (notes, tabs)
```

**Target:** Detail pages ≤ 160 lines. Contacts detail: 161 lines.

#### Create/Edit Page (Server + Client Form)

```
Server page.tsx
  └── Render EntityFormShell_client:
        ├── Server action binding (useActionState)
        ├── Error summary block
        ├── Field components (RHF or native inputs)
        └── Footer: Cancel + Save
```

### 6.6 Entity File Structure (Per-Entity Convention)

```
contacts/
├── page.tsx                            ← List (Server)
├── surface.ts                          ← Capability annotation
├── new/
│   ├── page.tsx                        ← Create (Server)
│   └── surface.ts
├── [id]/
│   ├── page.tsx                        ← Detail (Server)
│   ├── surface.ts
│   ├── edit/
│   │   ├── page.tsx                    ← Edit (Server)
│   │   └── surface.ts
│   ├── versions/
│   │   ├── page.tsx                    ← Version history (Server)
│   │   └── surface.ts
│   └── audit/
│       ├── page.tsx                    ← Audit trail (Server)
│       └── surface.ts
├── trash/
│   ├── page.tsx                        ← Trash (Server)
│   └── surface.ts
├── _server/
│   ├── contacts.query_server.ts        ← React.cache() data loaders
│   ├── contacts.policy_server.ts       ← resolveContactActions()
│   └── contacts.server-actions.ts      ← executeContactAction() + logging
└── _components/
    ├── contact-contract.ts             ← EntityContract definition
    ├── contact-columns.ts              ← TanStack column defs
    ├── contact-fields.ts               ← Field registry for forms
    ├── contact-form_client.tsx          ← RHF form fields
    ├── contacts-table_client.tsx        ← DataTable wrapper + empty state
    ├── contact-detail-actions_client.tsx ← Detail page action bar
    ├── revert-button_client.tsx         ← Version revert action
    └── trash-restore-button_client.tsx  ← Trash restore action
```

---

## 7. Data Flow Architecture

### 7.1 Server Action Flow (Mutations)

```
Client Component
  │  1. User clicks action button
  │  2. ActionBar resolves: confirm dialog? update mode dialog? direct?
  │  3. Builds ActionEnvelope { clientActionId, orgId, entityType, entityId, kind, updateMode?, reason? }
  │
  ▼
Server Action (contacts.server-actions.ts)
  │  4. Auth check (session required)
  │  5. logActionStart(envelope)
  │  6. Switch on envelope.kind → delegate to entity action
  │
  ▼
Entity Actions (src/lib/actions/entity-actions.ts)
  │  7. buildContext() → MutationContext { actor, requestId, channel }
  │  8. Build MutationSpec { actionType, entityRef, input, expectedVersion }
  │
  ▼
CRUD Kernel (packages/crud → mutate())
  │  9. Single DB transaction
  │  10. Entity handler (allowlist input)
  │  11. Write audit_logs + entity_versions
  │  12. Workflow rules (before/after hooks)
  │
  ▼
Server Action (continued)
  │  13. logActionSuccess/Error(envelope, { durationMs })
  │  14. revalidatePath() for affected routes
  │
  ▼
Client Component
  │  15. router.refresh() or redirect
  └── 16. Toast notification (success/error)
```

### 7.2 Read Flow (Queries)

```
Server Page (page.tsx)
  │  1. React.cache() wrapped query loader
  │
  ▼
Entity Actions (src/lib/actions/entity-actions.ts)
  │  2. readEntity() / listEntities()
  │
  ▼
CRUD Kernel (packages/crud)
  │  3. getDb() → dbRo (read replica) or db (forcePrimary for read-after-write)
  │  4. RLS-filtered query (org_id scoped)
  │
  ▼
Server Page (continued)
  │  5. Resolve actions via ActionResolver
  │  6. Pass data + resolved actions to client components
  └── 7. Render
```

### 7.3 API Route Flow

```
Client (fetch / react-query)
  │
  ▼
API Route (app/api/*)
  │  withAuth() factory:
  │    1. Auth check (session required)
  │    2. Resolve org context from DB (auth.org_id())
  │    3. Build AuthSession { userId, orgId, email, name }
  │    4. Execute handler
  │    5. Return standard envelope: { ok, data, meta: { requestId } }
  │
  ▼
Client (continued)
  └── Parse response
```

### 7.4 Search Flow

```
Command Palette (⌘K)
  │  1. User types query
  │  2. @tanstack/react-query → GET /api/search?q=&limit=10&types=contacts,companies
  │
  ▼
Search API Route
  │  3. withAuth() guard + ALS context established
  │  4. packages/search → searchAll() (cross-entity adapter)
  │  5. Queries search_index materialized view (W5)
  │  6. FTS for queries ≥ 3 chars, ILIKE fallback otherwise
  │  7. Optional entity type filtering via ?types= param
  │
  ▼
Command Palette (continued)
  └── 8. Render mixed entity results with navigation
```

**search_index MV:** Unifies contacts + companies into a single materialized view with FTS (`tsvector`), ILIKE fallback, and tenant isolation via `org_id` filter. Refreshed via `REFRESH MATERIALIZED VIEW CONCURRENTLY search_index`.

---

## 8. State Management Policy

### 8.1 State Ownership Matrix

| State Domain       | Owner                         | Location                  | Persistence     |
| ------------------ | ----------------------------- | ------------------------- | --------------- |
| **Table state**    | TanStack Table                | `data-table_client.tsx`   | Component-local |
| **Form state**     | React Hook Form               | `contact-form_client.tsx` | Component-local |
| **Shell UX**       | Zustand (reserved)            | TBD                       | localStorage    |
| **Auth session**   | Neon Auth                     | Server + cookie           | Cookie          |
| **Org context**    | React Context                 | `OrgProvider`             | Request-scoped  |
| **Server cache**   | React.cache()                 | `*_server.ts` loaders     | Request-scoped  |
| **Query cache**    | @tanstack/react-query         | `QueryProvider`           | In-memory       |
| **Action pending** | React useState/useActionState | Per-component             | Component-local |

### 8.2 Zustand Allowlist (Shell UX Only)

| Allowed                                  | Not Allowed                              |
| ---------------------------------------- | ---------------------------------------- |
| Sidebar collapsed state                  | Table filters/sorts/pagination/selection |
| Density preference (compact/comfortable) | Form values                              |
| Last selected detail tab                 | Action pending states                    |
| Command palette UI preferences           | Entity data                              |

---

## 9. Observability

### 9.1 ActionLogger (Server)

**Location:** `_components/crud/server/action-logger_server.ts`

Every entity action emits structured Pino logs:

| Event            | Fields                                                                                              |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| `action.start`   | clientActionId, orgId, entityType, entityId, kind, updateMode, userId, reasonProvided, reasonLength |
| `action.success` | All start fields + fromStatus, toStatus, durationMs                                                 |
| `action.error`   | All start fields + err (Error object), durationMs                                                   |

**Privacy invariant (INV-4):** Never log raw `reason` content — log presence (`reasonProvided: boolean`) and length only.

### 9.2 Correlation

Client generates `clientActionId` (UUID) per action attempt and passes it through the `ActionEnvelope`. This enables end-to-end tracing from UI click → server action → CRUD kernel → audit log.

### 9.3 Client Logging

**Designated wrapper:** `apps/web/src/lib/client-logger.ts` — the only file allowed to use `console.*`.

---

## 10. Public Surface (Marketing + Auth)

### 10.1 Marketing Page

**Location:** `apps/web/app/(public)/(marketing)/page.tsx` (561 lines)

Conversion-focused landing page with:

- **Nav:** Glass utility + theme toggle + sign-in/sign-up CTAs
- **Hero:** Badge + H1 + subtitle + 2 CTAs
- **Trust bar:** Partner/integration logos
- **Product preview:** Screenshot/mockup section
- **Features:** 2 hero features + 4 compact feature cards
- **Stats:** Metric cards with Progress bars
- **Testimonials:** Avatar + quote cards
- **FAQ:** Accordion component
- **Footer:** 4-column layout

All sections use `AnimateOnScroll` for viewport-triggered animations. No `<Separator />` — uses `.section-divider` gradient fade + spacing.

### 10.2 Auth Pages

**Location:** `apps/web/app/(public)/(auth)/auth/[path]/page.tsx`

Uses Neon Auth SDK UI components (`AuthView` + `authViewPaths`):

- sign-in, sign-up, forgot-password, reset-password, magic-link, two-factor, callback, sign-out

Auth UI auto-inherits shadcn CSS vars — no extra theming needed.

---

## 11. File Naming Conventions

| Pattern               | Meaning                                       | Example                      |
| --------------------- | --------------------------------------------- | ---------------------------- |
| `page.tsx`            | Server Component (Next.js page)               | `contacts/page.tsx`          |
| `layout.tsx`          | Server Component (Next.js layout)             | `org/[slug]/layout.tsx`      |
| `*_client.tsx`        | Client Component (interactive leaf)           | `action-bar_client.tsx`      |
| `*_server.ts`         | Server-only module (never imported by client) | `org-context_server.ts`      |
| `*.server-actions.ts` | Server actions (`'use server'`)               | `contacts.server-actions.ts` |
| `*.query_server.ts`   | React.cache() data loaders                    | `contacts.query_server.ts`   |
| `*.policy_server.ts`  | ActionResolver wrappers                       | `contacts.policy_server.ts`  |
| `*-contract.ts`       | EntityContract definition                     | `contact-contract.ts`        |
| `*-columns.ts`        | TanStack Table column defs                    | `contact-columns.ts`         |
| `*-fields.ts`         | Form field registry                           | `contact-fields.ts`          |
| `surface.ts`          | Capability annotation (co-located)            | `contacts/surface.ts`        |
| `*.capabilities.ts`   | CAPABILITIES const for server actions         | `contacts.capabilities.ts`   |

---

## 12. CI Invariants

**Location:** `tools/ci-invariants.mjs`
**Script:** `pnpm ci:invariants`

| Gate | Rule                                     | Scope           | Exclusions                      |
| ---- | ---------------------------------------- | --------------- | ------------------------------- |
| E1   | No `'use client'` in page.tsx/layout.tsx | `apps/web/app/` | `files/page.tsx` (pre-existing) |
| E2   | No `console.*` in runtime paths          | `apps/web/`     | `client-logger.ts`              |
| E3   | No hardcoded colors (hex/rgb/hsl/oklch)  | `apps/web/app/` | —                               |
| E4   | No ad-hoc action verbs                   | `apps/web/app/` | —                               |

**Additional enforcement:**

- `afena meta check` — VIS-00 through VIS-04 (capability surface completeness)
- ESLint `no-restricted-syntax` — blocks `db.insert/update/delete` outside packages/crud (INVARIANT-01)
- ESLint `no-restricted-syntax` — blocks `dbRo.insert/update/delete` everywhere (INVARIANT-RO)

---

## 13. Dependency Graph

```
packages/ui (afena-ui)
  ├── radix-ui, cva, lucide-react, next-themes, sonner, cmdk
  ├── @tanstack/react-table, react-hook-form, recharts
  └── tailwindcss (peer)

packages/canon (afena-canon)
  └── zod

packages/crud (afena-crud)
  ├── afena-canon, afena-database, afena-logger
  ├── drizzle-orm, fast-json-patch
  └── packages/workflow (evaluateRules hooks)

packages/search (afena-search)
  └── afena-database (dbRo)

packages/logger (afena-logger)
  └── pino

apps/web
  ├── afena-ui (components, hooks, providers, styles)
  ├── afena-canon (types, schemas, enums)
  ├── afena-crud (mutate, readEntity, listEntities)
  ├── afena-database (db, dbRo, schema)
  ├── afena-search (FTS adapters)
  ├── afena-logger (Pino)
  ├── @neondatabase/auth (Neon Auth SDK)
  ├── @tanstack/react-query (search, command palette)
  └── next (16.1.6, App Router)
```

---

## 14. Adding a New Entity (W1 Auto-Wiring)

The entity generator (`entity-new.ts`) performs **all wiring automatically** (Gate G2). Only 3 manual steps remain.

### Automated (via `entity-new.ts`)

```bash
npx tsx packages/database/src/scripts/entity-new.ts invoices --doc --skip-schema
```

**Available flags:**

- `--doc` — Include lifecycle verbs (submit/cancel/approve/reject)
- `--skip-schema` — Skip schema generation (for existing tables like companies)

This generates **17+ files** and performs **10 auto-wiring insertions**:

- Schema file + barrel export
- Handler + HANDLER_REGISTRY + TABLE_REGISTRY entries
- ENTITY_TYPES + ACTION_TYPES + CAPABILITY_CATALOG entries
- Search adapter stub
- 7 page files + 7 surface.ts files
- Support files: contract, columns, fields, query_server, policy_server, server-actions
- Nav item in nav-config.ts

### Manual Steps (post-generation)

1. **Run migration** (if schema was generated)
2. **Seed meta_assets** (if needed)
3. **Customize stubs** (allowlist fields, column defs, form fields)

### Registered Entities

| Entity      | Pages                                               | Lifecycle | Column Base        | UI Status                        |
| ----------- | --------------------------------------------------- | --------- | ------------------ | -------------------------------- |
| `contacts`  | 7 (list, detail, new, edit, versions, audit, trash) | Yes (doc) | `docEntityColumns` | ✅ Fully implemented             |
| `companies` | 7 (list, detail, new, edit, versions, audit, trash) | No        | `erpEntityColumns` | ⚠️ Infrastructure only (stub UI) |

---

## 15. Design System Governance

### 15.1 Token-Only Rule

**All color, spacing, shadow, and motion values must come from CSS custom properties.** No hardcoded values in component files.

✅ Correct:

```tsx
<div className="bg-primary text-primary-foreground shadow-md">
<div className="status-warning">
<div className="elev-lg">
```

❌ Incorrect:

```tsx
<div style={{ background: 'oklch(0.80 0.12 205)' }}>
<div className="bg-[#3b82f6]">
<div style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
```

### 15.2 Component-Only Rule

**All UI primitives must be imported from `afena-ui`.** Never import directly from underlying libraries.

✅ Correct:

```tsx
import { Button } from 'afena-ui/components/button';
import { Dialog } from 'afena-ui/components/dialog';
```

❌ Incorrect:

```tsx
import * as Dialog from '@radix-ui/react-dialog';
import { Toaster } from 'sonner';
```

### 15.3 Theme Modification Flow

```
1. Edit tailwindengine.json
2. Run: npx tsx packages/ui/engine/generate.ts
3. Verify: globals.css regenerated
4. Test: both light and dark modes
5. Commit: both JSON + generated CSS
```

---

## 16. Performance Considerations

### 16.1 Server Components by Default

All pages and layouts are Server Components. This means:

- Zero JS shipped for page chrome (headers, metadata cards, static content)
- Data fetching happens on the server (no waterfalls)
- `React.cache()` deduplicates identical requests within a single render

### 16.2 Client Islands

Client components are **leaf nodes only** — they receive pre-resolved data from server parents:

- `DataTable` receives `data` + `columns` + `rowActions` (pre-resolved)
- `ActionBar` receives `ResolvedActions` (pre-computed server-side)
- `ContactForm` receives initial values (pre-fetched)

### 16.3 Read Replica Routing

All list/detail/search queries use `dbRo` (Neon read replica) by default. `forcePrimary: true` is used only for read-after-write stickiness.

### 16.4 Bundle Optimization

- `packages/ui` uses `tsup` DTS-only build — Next.js tree-shakes source directly
- Direct path imports (`afena-ui/components/button`) avoid pulling the entire barrel
- `@tanstack/react-query` is loaded only within `(app)` route group (not marketing)

---

## 17. Accessibility

### 17.1 Built-in (from shadcn/ui + Radix)

- All interactive components have proper ARIA roles, labels, and keyboard navigation
- Focus management in dialogs, sheets, dropdowns, command palette
- `focus-visible` outline styling in `@layer base`

### 17.2 Engine-Level

- `prefers-reduced-motion` media query disables all animations
- `scrollbar-gutter: stable` prevents layout shift
- `touch-action: manipulation` on interactive elements
- `text-balance` on headings

### 17.3 Custom Utilities

- `packages/ui/src/lib/aria.ts` — `ariaDescribedBy()`, `ariaLiveRegion()`, `ariaSortColumn()`, `ariaCountLabel()`
- `packages/ui/src/lib/dom.ts` — `getFocusableElements()`, `scrollIntoViewIfNeeded()`

---

## 18. Dark Mode

### 18.1 Strategy

- **Mechanism:** `class` strategy via `next-themes` (`ThemeProvider`)
- **Toggle:** `<html>` gets `.dark` class
- **CSS:** `.dark` selector in `globals.css` overrides all tokens
- **View transitions:** Smooth theme toggle animation via `::view-transition-old/new(root)`

### 18.2 Dark Mode Enhancements

| Feature              | Implementation                                            |
| -------------------- | --------------------------------------------------------- |
| **Body gradient**    | Radial gradients with primary/info color-mix on dark body |
| **Glass surfaces**   | Semi-transparent oklch panels (6%/8%/10% white)           |
| **Button polish**    | Gradient bg + glow shadow + glass border per variant      |
| **Card hover**       | Inset shadow + border glow                                |
| **Badge glass**      | Glass bg + border in dark mode                            |
| **Elevated shadows** | Deeper, more dramatic shadow values                       |
| **Letter spacing**   | Slightly tighter (-0.01em) for dark mode readability      |

---

## Appendix A — Key File Paths

| Purpose                  | Path                                                      |
| ------------------------ | --------------------------------------------------------- |
| Engine config            | `packages/ui/engine/tailwindengine.json`                  |
| Engine codegen           | `packages/ui/engine/generate.ts`                          |
| Generated CSS            | `packages/ui/src/styles/globals.css`                      |
| Component barrel         | `packages/ui/src/index.ts`                                |
| shadcn config (UI)       | `packages/ui/components.json`                             |
| shadcn config (app)      | `apps/web/components.json`                                |
| App globals CSS          | `apps/web/app/globals.css`                                |
| Root layout              | `apps/web/app/layout.tsx`                                 |
| App layout               | `apps/web/app/(app)/layout.tsx`                           |
| Org layout               | `apps/web/app/(app)/org/[slug]/layout.tsx`                |
| Nav config               | `apps/web/app/(app)/org/[slug]/_components/nav-config.ts` |
| CRUD server composables  | `apps/web/app/(app)/org/[slug]/_components/crud/server/`  |
| CRUD client composables  | `apps/web/app/(app)/org/[slug]/_components/crud/client/`  |
| Entity actions factory   | `apps/web/src/lib/actions/entity-actions.ts`              |
| Mutation context builder | `apps/web/src/lib/actions/context.ts`                     |
| API auth wrapper         | `apps/web/src/lib/api/with-auth.ts`                       |
| Auth server              | `apps/web/src/lib/auth/server.ts`                         |
| Auth client              | `apps/web/src/lib/auth/client.ts`                         |
| CI invariants            | `tools/ci-invariants.mjs`                                 |
| Capability exceptions    | `.afena/capability-exceptions.json`                       |

---

## Appendix B — Lifecycle State Machine

```
                    ┌──────────┐
                    │  draft   │
                    └────┬─────┘
                         │ Submit
                         ▼
                    ┌──────────┐
              ┌─────│ submitted│─────┐
              │     └──────────┘     │
              │ Approve         Reject│
              ▼                      ▼
         ┌──────────┐          ┌──────────┐
         │  active   │          │  draft   │ (or rejected)
         └────┬─────┘          └──────────┘
              │ Cancel
              ▼
         ┌──────────┐
         │cancelled │
         └────┬─────┘
              │ Restore
              ▼
         ┌──────────┐
         │  active   │ (or draft, entity-specific)
         └──────────┘

  Soft delete (is_deleted flag) is orthogonal to lifecycle status.
  Deleted entities: only Restore is available.
```

---

## Appendix C — ActionEnvelope Schema

```typescript
interface ActionEnvelope {
  clientActionId: string; // UUID — correlation ID from client
  orgId: string; // Organization ID
  entityType: string; // e.g., 'contacts'
  entityId?: string; // Entity ID (null for create)
  kind: ActionKind; // Verb: create, update, delete, restore, submit, cancel, approve, reject
  updateMode?: UpdateMode; // Only when kind === 'update': edit, correct, amend, adjust, reassign
  reason?: string; // Required for reject, cancel, amend, adjust
}
```

---

## Appendix D — Component Slot Styling Convention

shadcn/ui uses `data-slot` attributes for global styling hooks. The engine applies micro-interactions via these selectors in `@layer utilities`:

```css
[data-slot="button"]  → transition, shadow, lift, press
[data-slot="card"]    → transition, shadow, lift
[data-slot="badge"]   → dark mode glass
```

Custom components should use `dataSlot()` from `afena-ui/lib/utils`:

```tsx
import { dataSlot } from 'afena-ui/lib/utils';

<div {...dataSlot("metric-card")} className={cn("p-4", className)}>
```

This enables engine-level styling without modifying component internals.
