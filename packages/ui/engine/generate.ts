/**
 * Tailwind Design System Engine — Codegen Script
 *
 * Reads tailwindengine.json, validates with Zod, and generates
 * all CSS files for the complete Tailwind v4 design system.
 *
 * Architecture: "Neutral base + brand primary" pattern.
 * - Layer A: Official shadcn neutral presets (stone/zinc/slate/neutral) — no math
 * - Layer B: Brand primary overrides from config (oklch)
 * - Layer C: Semantic + extended tokens derived from inputs
 *
 * Output: generates globals.css (bridge) matching official shadcn v4 pattern.
 *
 * Usage: npx tsx packages/ui/engine/generate.ts
 */

import * as fs from 'fs';
import * as path from 'path';

import { z } from 'zod';

// ─── Zod Schema ──────────────────────────────────────────────

const SurfaceSchema = z.object({
  bg: z.string(),       // → --background
  panel: z.string(),    // → --card, --popover, --sidebar
  panel2: z.string(),   // → --secondary, --muted, --accent
  border: z.string(),   // → --border, --input, --sidebar-border
  text: z.string(),     // → --foreground, --card-foreground, --popover-foreground
  muted: z.string(),    // → --muted-foreground, --ring
});

const EngineSchema = z.object({
  neutralBase: z.enum(['stone', 'zinc', 'slate', 'neutral']),
  surfaces: z.object({
    light: SurfaceSchema.optional(),
    dark: SurfaceSchema.optional(),
  }).optional(),
  brand: z.object({
    primary: z.string(),
    primaryDark: z.string(),
    primaryForeground: z.string(),
    primaryForegroundDark: z.string(),
  }),
  semanticColors: z.object({
    destructive: z.string(),
    destructiveDark: z.string(),
    success: z.string(),
    successDark: z.string(),
    warning: z.string(),
    warningDark: z.string(),
    info: z.string(),
    infoDark: z.string(),
  }),
  fonts: z.object({
    sans: z.string(),
    mono: z.string(),
  }),
  spacingUnit: z.string(),
  radiusBase: z.string(),
  fontSizeBase: z.string(),
  typeScaleRatio: z.number().optional(),
  darkMode: z.enum(['class', 'media', 'data-attribute']),
  projectName: z.string(),
  motion: z.object({
    fast: z.string().optional(),
    normal: z.string().optional(),
    slow: z.string().optional(),
    reduced: z.string().optional(),
  }).optional(),
  easings: z.record(z.string(), z.string()).optional(),
  'fonts.heading': z.string().nullable().optional(),
  spacingSteps: z.array(z.number()).nullable().optional(),
  zIndex: z.record(z.string(), z.number()).optional(),
  breakpoints: z.record(z.string(), z.string()).nullable().optional(),
  containers: z.record(z.string(), z.string()).nullable().optional(),
  opacitySteps: z.array(z.number()).optional(),
  borderWidths: z.record(z.string(), z.string()).optional(),
  customVariants: z.record(z.string(), z.string()).optional(),
});

type EngineConfig = z.infer<typeof EngineSchema>;

// ─── Official shadcn v4 Neutral Presets ──────────────────────
// Exact values from shadcn-ui/ui repo theming.mdx — zero math, zero errors.

interface NeutralPreset {
  light: Record<string, string>;
  dark: Record<string, string>;
}

const NEUTRAL_PRESETS: Record<string, NeutralPreset> = {
  stone: {
    light: {
      '--background': 'oklch(1 0 0)',
      '--foreground': 'oklch(0.147 0.004 49.25)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.147 0.004 49.25)',
      '--popover': 'oklch(1 0 0)',
      '--popover-foreground': 'oklch(0.147 0.004 49.25)',
      '--secondary': 'oklch(0.97 0.001 106.424)',
      '--secondary-foreground': 'oklch(0.216 0.006 56.043)',
      '--muted': 'oklch(0.97 0.001 106.424)',
      '--muted-foreground': 'oklch(0.553 0.013 58.071)',
      '--accent': 'oklch(0.97 0.001 106.424)',
      '--accent-foreground': 'oklch(0.216 0.006 56.043)',
      '--border': 'oklch(0.923 0.003 48.717)',
      '--input': 'oklch(0.923 0.003 48.717)',
      '--ring': 'oklch(0.709 0.01 56.259)',
      '--sidebar': 'oklch(0.985 0.001 106.423)',
      '--sidebar-foreground': 'oklch(0.147 0.004 49.25)',
      '--sidebar-accent': 'oklch(0.97 0.001 106.424)',
      '--sidebar-accent-foreground': 'oklch(0.216 0.006 56.043)',
      '--sidebar-border': 'oklch(0.923 0.003 48.717)',
      '--sidebar-ring': 'oklch(0.709 0.01 56.259)',
    },
    dark: {
      '--background': 'oklch(0.147 0.004 49.25)',
      '--foreground': 'oklch(0.985 0.001 106.423)',
      '--card': 'oklch(0.216 0.006 56.043)',
      '--card-foreground': 'oklch(0.985 0.001 106.423)',
      '--popover': 'oklch(0.216 0.006 56.043)',
      '--popover-foreground': 'oklch(0.985 0.001 106.423)',
      '--secondary': 'oklch(0.268 0.007 34.298)',
      '--secondary-foreground': 'oklch(0.985 0.001 106.423)',
      '--muted': 'oklch(0.268 0.007 34.298)',
      '--muted-foreground': 'oklch(0.709 0.01 56.259)',
      '--accent': 'oklch(0.268 0.007 34.298)',
      '--accent-foreground': 'oklch(0.985 0.001 106.423)',
      '--border': 'oklch(1 0 0 / 10%)',
      '--input': 'oklch(1 0 0 / 15%)',
      '--ring': 'oklch(0.553 0.013 58.071)',
      '--sidebar': 'oklch(0.216 0.006 56.043)',
      '--sidebar-foreground': 'oklch(0.985 0.001 106.423)',
      '--sidebar-accent': 'oklch(0.268 0.007 34.298)',
      '--sidebar-accent-foreground': 'oklch(0.985 0.001 106.423)',
      '--sidebar-border': 'oklch(1 0 0 / 10%)',
      '--sidebar-ring': 'oklch(0.553 0.013 58.071)',
    },
  },
  zinc: {
    light: {
      '--background': 'oklch(1 0 0)',
      '--foreground': 'oklch(0.141 0.005 285.823)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.141 0.005 285.823)',
      '--popover': 'oklch(1 0 0)',
      '--popover-foreground': 'oklch(0.141 0.005 285.823)',
      '--secondary': 'oklch(0.967 0.001 286.375)',
      '--secondary-foreground': 'oklch(0.21 0.006 285.885)',
      '--muted': 'oklch(0.967 0.001 286.375)',
      '--muted-foreground': 'oklch(0.552 0.016 285.938)',
      '--accent': 'oklch(0.967 0.001 286.375)',
      '--accent-foreground': 'oklch(0.21 0.006 285.885)',
      '--border': 'oklch(0.92 0.004 286.32)',
      '--input': 'oklch(0.92 0.004 286.32)',
      '--ring': 'oklch(0.705 0.015 286.067)',
      '--sidebar': 'oklch(0.985 0 0)',
      '--sidebar-foreground': 'oklch(0.141 0.005 285.823)',
      '--sidebar-accent': 'oklch(0.967 0.001 286.375)',
      '--sidebar-accent-foreground': 'oklch(0.21 0.006 285.885)',
      '--sidebar-border': 'oklch(0.92 0.004 286.32)',
      '--sidebar-ring': 'oklch(0.705 0.015 286.067)',
    },
    dark: {
      '--background': 'oklch(0.141 0.005 285.823)',
      '--foreground': 'oklch(0.985 0 0)',
      '--card': 'oklch(0.21 0.006 285.885)',
      '--card-foreground': 'oklch(0.985 0 0)',
      '--popover': 'oklch(0.21 0.006 285.885)',
      '--popover-foreground': 'oklch(0.985 0 0)',
      '--secondary': 'oklch(0.274 0.006 286.033)',
      '--secondary-foreground': 'oklch(0.985 0 0)',
      '--muted': 'oklch(0.274 0.006 286.033)',
      '--muted-foreground': 'oklch(0.705 0.015 286.067)',
      '--accent': 'oklch(0.274 0.006 286.033)',
      '--accent-foreground': 'oklch(0.985 0 0)',
      '--border': 'oklch(1 0 0 / 10%)',
      '--input': 'oklch(1 0 0 / 15%)',
      '--ring': 'oklch(0.552 0.016 285.938)',
      '--sidebar': 'oklch(0.21 0.006 285.885)',
      '--sidebar-foreground': 'oklch(0.985 0 0)',
      '--sidebar-accent': 'oklch(0.274 0.006 286.033)',
      '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
      '--sidebar-border': 'oklch(1 0 0 / 10%)',
      '--sidebar-ring': 'oklch(0.552 0.016 285.938)',
    },
  },
  slate: {
    light: {
      '--background': 'oklch(1 0 0)',
      '--foreground': 'oklch(0.13 0.028 261.692)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.13 0.028 261.692)',
      '--popover': 'oklch(1 0 0)',
      '--popover-foreground': 'oklch(0.13 0.028 261.692)',
      '--secondary': 'oklch(0.967 0.003 264.542)',
      '--secondary-foreground': 'oklch(0.21 0.034 264.665)',
      '--muted': 'oklch(0.967 0.003 264.542)',
      '--muted-foreground': 'oklch(0.551 0.027 264.364)',
      '--accent': 'oklch(0.967 0.003 264.542)',
      '--accent-foreground': 'oklch(0.21 0.034 264.665)',
      '--border': 'oklch(0.928 0.006 264.531)',
      '--input': 'oklch(0.928 0.006 264.531)',
      '--ring': 'oklch(0.707 0.022 261.325)',
      '--sidebar': 'oklch(0.985 0.002 247.839)',
      '--sidebar-foreground': 'oklch(0.13 0.028 261.692)',
      '--sidebar-accent': 'oklch(0.967 0.003 264.542)',
      '--sidebar-accent-foreground': 'oklch(0.21 0.034 264.665)',
      '--sidebar-border': 'oklch(0.928 0.006 264.531)',
      '--sidebar-ring': 'oklch(0.707 0.022 261.325)',
    },
    dark: {
      '--background': 'oklch(0.13 0.028 261.692)',
      '--foreground': 'oklch(0.985 0.002 247.839)',
      '--card': 'oklch(0.21 0.034 264.665)',
      '--card-foreground': 'oklch(0.985 0.002 247.839)',
      '--popover': 'oklch(0.21 0.034 264.665)',
      '--popover-foreground': 'oklch(0.985 0.002 247.839)',
      '--secondary': 'oklch(0.278 0.033 256.848)',
      '--secondary-foreground': 'oklch(0.985 0.002 247.839)',
      '--muted': 'oklch(0.278 0.033 256.848)',
      '--muted-foreground': 'oklch(0.707 0.022 261.325)',
      '--accent': 'oklch(0.278 0.033 256.848)',
      '--accent-foreground': 'oklch(0.985 0.002 247.839)',
      '--border': 'oklch(1 0 0 / 10%)',
      '--input': 'oklch(1 0 0 / 15%)',
      '--ring': 'oklch(0.551 0.027 264.364)',
      '--sidebar': 'oklch(0.21 0.034 264.665)',
      '--sidebar-foreground': 'oklch(0.985 0.002 247.839)',
      '--sidebar-accent': 'oklch(0.278 0.033 256.848)',
      '--sidebar-accent-foreground': 'oklch(0.985 0.002 247.839)',
      '--sidebar-border': 'oklch(1 0 0 / 10%)',
      '--sidebar-ring': 'oklch(0.551 0.027 264.364)',
    },
  },
  neutral: {
    light: {
      '--background': 'oklch(1 0 0)',
      '--foreground': 'oklch(0.145 0 0)',
      '--card': 'oklch(1 0 0)',
      '--card-foreground': 'oklch(0.145 0 0)',
      '--popover': 'oklch(1 0 0)',
      '--popover-foreground': 'oklch(0.145 0 0)',
      '--secondary': 'oklch(0.97 0 0)',
      '--secondary-foreground': 'oklch(0.205 0 0)',
      '--muted': 'oklch(0.97 0 0)',
      '--muted-foreground': 'oklch(0.556 0 0)',
      '--accent': 'oklch(0.97 0 0)',
      '--accent-foreground': 'oklch(0.205 0 0)',
      '--border': 'oklch(0.922 0 0)',
      '--input': 'oklch(0.922 0 0)',
      '--ring': 'oklch(0.708 0 0)',
      '--sidebar': 'oklch(0.985 0 0)',
      '--sidebar-foreground': 'oklch(0.145 0 0)',
      '--sidebar-accent': 'oklch(0.97 0 0)',
      '--sidebar-accent-foreground': 'oklch(0.205 0 0)',
      '--sidebar-border': 'oklch(0.922 0 0)',
      '--sidebar-ring': 'oklch(0.708 0 0)',
    },
    dark: {
      '--background': 'oklch(0.145 0 0)',
      '--foreground': 'oklch(0.985 0 0)',
      '--card': 'oklch(0.205 0 0)',
      '--card-foreground': 'oklch(0.985 0 0)',
      '--popover': 'oklch(0.205 0 0)',
      '--popover-foreground': 'oklch(0.985 0 0)',
      '--secondary': 'oklch(0.269 0 0)',
      '--secondary-foreground': 'oklch(0.985 0 0)',
      '--muted': 'oklch(0.269 0 0)',
      '--muted-foreground': 'oklch(0.708 0 0)',
      '--accent': 'oklch(0.269 0 0)',
      '--accent-foreground': 'oklch(0.985 0 0)',
      '--border': 'oklch(1 0 0 / 10%)',
      '--input': 'oklch(1 0 0 / 15%)',
      '--ring': 'oklch(0.556 0 0)',
      '--sidebar': 'oklch(0.205 0 0)',
      '--sidebar-foreground': 'oklch(0.985 0 0)',
      '--sidebar-accent': 'oklch(0.269 0 0)',
      '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
      '--sidebar-border': 'oklch(1 0 0 / 10%)',
      '--sidebar-ring': 'oklch(0.556 0 0)',
    },
  },
};

// ─── Defaults ────────────────────────────────────────────────

const DEFAULT_SPACING_STEPS = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
];

const DEFAULT_MOTION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  reduced: '0ms',
};

const DEFAULT_EASINGS: Record<string, string> = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

const DEFAULT_ZINDEX: Record<string, number> = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  toast: 1070,
  tooltip: 1080,
};

// Opacity steps available for custom utilities if needed
// const DEFAULT_OPACITY_STEPS = [
//   0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
//   55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
// ];

const DEFAULT_BORDER_WIDTHS: Record<string, string> = {
  DEFAULT: '1px',
  '0': '0px',
  '2': '2px',
  '4': '4px',
  '8': '8px',
};

// ─── File header ─────────────────────────────────────────────

function header(projectName: string, section: string): string {
  return `/* ═══════════════════════════════════════════════════════════
 * ${projectName} Design System — ${section}
 * AUTO-GENERATED by tailwind engine. Do not hand-edit.
 * ═══════════════════════════════════════════════════════════ */\n\n`;
}

// ─── Theme Generator (replaces old generateColorsCSS) ────────

function generateGlobalsCSS(config: EngineConfig): string {
  const { projectName, brand, semanticColors, neutralBase, radiusBase } = config;
  const preset = NEUTRAL_PRESETS[neutralBase];
  
  // Validate preset exists
  if (!preset) {
    throw new Error(`Invalid neutralBase: "${neutralBase}". Must be one of: ${Object.keys(NEUTRAL_PRESETS).join(', ')}`);
  }
  
  let out = '';

  out += `/*\n`;
  out += ` * ${projectName} Design System — globals.css\n`;
  out += ` * AUTO-GENERATED by tailwind engine. Do not hand-edit.\n`;
  out += ` *\n`;
  out += ` * Neutral base: ${neutralBase} (official shadcn preset)\n`;
  out += ` * Brand primary: ${brand.primary}\n`;
  out += ` *\n`;
  out += ` * Structure:\n`;
  out += ` *   1. @theme inline — Tailwind v4 utility mapping\n`;
  out += ` *   2. :root — Light mode concrete oklch values\n`;
  out += ` *   3. .dark — Dark mode concrete oklch values\n`;
  out += ` *   4. @layer base — Resets\n`;
  out += ` *   5. @layer utilities — Elevation, status\n`;
  out += ` *   6. @layer components — FAB, metric cards, activity trail\n`;
  out += ` *   7. View transitions\n`;
  out += ` */\n\n`;

  out += `@import 'tw-animate-css';\n\n`;
  out += `@custom-variant dark (&:where(.dark, .dark *));\n\n`;

  // ── @theme inline ──
  out += `@theme inline {\n`;
  // Core shadcn tokens
  const themeTokens = [
    'background', 'foreground', 'card', 'card-foreground',
    'popover', 'popover-foreground', 'primary', 'primary-foreground',
    'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
    'accent', 'accent-foreground', 'destructive', 'destructive-foreground',
    'border', 'input', 'ring',
    'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
    'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
    'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
  ];
  for (const t of themeTokens) {
    out += `  --color-${t}: var(--${t});\n`;
  }
  // Extended tokens
  const extendedTokens = [
    'chart-grid', 'chart-axis', 'chart-tooltip', 'chart-tooltip-text',
    'sidebar-hover', 'sidebar-active', 'sidebar-selected',
    'sidebar-muted', 'sidebar-muted-foreground',
    'hover', 'active', 'selected',
    'disabled', 'disabled-foreground',
    'link', 'link-hover', 'placeholder',
    'accent-hover', 'muted-hover',
    'success', 'success-foreground', 'success-muted', 'success-border', 'success-ring',
    'warning', 'warning-foreground', 'warning-muted', 'warning-border', 'warning-ring',
    'info', 'info-foreground', 'info-muted', 'info-border', 'info-ring',
    'critical', 'critical-foreground', 'critical-muted', 'critical-border', 'critical-ring',
  ];
  for (const t of extendedTokens) {
    out += `  --color-${t}: var(--${t});\n`;
  }
  // Font
  out += `  --font-sans: var(--font-sans);\n`;
  out += `  --font-mono: var(--font-geist-mono);\n`;
  // Radius
  out += `  --radius-sm: calc(var(--radius) - 4px);\n`;
  out += `  --radius-md: calc(var(--radius) - 2px);\n`;
  out += `  --radius-lg: var(--radius);\n`;
  out += `  --radius-xl: calc(var(--radius) + 4px);\n`;
  out += `  --radius-2xl: calc(var(--radius) + 8px);\n`;
  out += `  --radius-3xl: calc(var(--radius) + 12px);\n`;
  out += `  --radius-4xl: calc(var(--radius) + 16px);\n`;
  // Shadows
  out += `  --shadow-xs: var(--shadow-xs);\n`;
  out += `  --shadow-sm: var(--shadow-sm);\n`;
  out += `  --shadow-md: var(--shadow-md);\n`;
  out += `  --shadow-lg: var(--shadow-lg);\n`;
  out += `  --shadow-xl: var(--shadow-xl);\n`;
  out += `  --shadow-2xl: var(--shadow-2xl);\n`;
  out += `  --shadow-glow: var(--glow);\n`;
  out += `}\n\n`;

  // ── :root (light mode) ──
  out += `:root {\n`;
  out += `  color-scheme: light;\n`;
  out += `  --font-sans: var(--font-figtree), system-ui, sans-serif;\n`;
  // Neutral tokens: surfaces override > preset fallback
  const lightSurf = config.surfaces?.light;
  if (lightSurf) {
    out += `  --background: ${lightSurf.bg};\n`;
    out += `  --foreground: ${lightSurf.text};\n`;
    out += `  --card: ${lightSurf.panel};\n`;
    out += `  --card-foreground: ${lightSurf.text};\n`;
    out += `  --popover: ${lightSurf.panel};\n`;
    out += `  --popover-foreground: ${lightSurf.text};\n`;
    out += `  --secondary: ${lightSurf.panel2};\n`;
    out += `  --secondary-foreground: ${lightSurf.text};\n`;
    out += `  --muted: ${lightSurf.panel2};\n`;
    out += `  --muted-foreground: ${lightSurf.muted};\n`;
    out += `  --accent: ${lightSurf.panel2};\n`;
    out += `  --accent-foreground: ${lightSurf.text};\n`;
    out += `  --border: ${lightSurf.border};\n`;
    out += `  --input: ${lightSurf.border};\n`;
    out += `  --ring: ${lightSurf.muted};\n`;
    out += `  --sidebar: ${lightSurf.panel};\n`;
    out += `  --sidebar-foreground: ${lightSurf.text};\n`;
    out += `  --sidebar-accent: ${lightSurf.panel2};\n`;
    out += `  --sidebar-accent-foreground: ${lightSurf.text};\n`;
    out += `  --sidebar-border: ${lightSurf.border};\n`;
    out += `  --sidebar-ring: ${lightSurf.muted};\n`;
  } else {
    for (const [key, val] of Object.entries(preset.light)) {
      out += `  ${key}: ${val};\n`;
    }
  }
  // Brand overrides
  out += `  --primary: ${brand.primary};\n`;
  out += `  --primary-foreground: ${brand.primaryForeground};\n`;
  out += `  --destructive: ${semanticColors.destructive};\n`;
  out += `  --destructive-foreground: ${brand.primaryForeground};\n`;
  out += `  --sidebar-primary: ${brand.primary};\n`;
  out += `  --sidebar-primary-foreground: ${brand.primaryForeground};\n`;
  // Radius
  out += `  --radius: ${radiusBase};\n`;
  // Charts (teal gradient)
  out += `  --chart-1: oklch(0.85 0.13 165);\n`;
  out += `  --chart-2: oklch(0.77 0.15 163);\n`;
  out += `  --chart-3: oklch(0.7 0.15 162);\n`;
  out += `  --chart-4: oklch(0.6 0.13 163);\n`;
  out += `  --chart-5: oklch(0.51 0.1 166);\n`;
  // Layout
  out += `  --sidebar-width: 16rem;\n`;
  out += `  --sidebar-width-icon: 3rem;\n`;
  out += `  --sidebar-width-mobile: 18rem;\n`;
  out += `  --header-height: 3.5rem;\n`;
  // Badges
  out += `  --badge-critical: ${semanticColors.destructive};\n`;
  out += `  --badge-critical-foreground: ${brand.primaryForeground};\n`;
  out += `  --badge-warning: ${semanticColors.warning};\n`;
  out += `  --badge-warning-foreground: oklch(0.15 0.01 85);\n`;
  out += `  --badge-success: ${semanticColors.success};\n`;
  out += `  --badge-success-foreground: oklch(0.98 0.02 145);\n`;
  out += `  --badge-info: ${semanticColors.info};\n`;
  out += `  --badge-info-foreground: ${brand.primaryForeground};\n`;
  // Palette
  out += `  --palette-1: oklch(0.55 0.22 265);\n`;
  out += `  --palette-2: oklch(0.58 0.24 293);\n`;
  out += `  --palette-3: oklch(0.65 0.22 350);\n`;
  out += `  --palette-4: oklch(0.58 0.24 27);\n`;
  out += `  --palette-5: oklch(0.65 0.18 45);\n`;
  out += `  --palette-6: oklch(0.75 0.18 95);\n`;
  out += `  --palette-7: oklch(0.65 0.18 145);\n`;
  out += `  --palette-8: oklch(0.65 0.12 175);\n`;
  out += `  --palette-9: oklch(0.65 0.14 195);\n`;
  out += `  --palette-10: var(--primary);\n`;
  // Animation speed
  out += `  --speed: 1.2s;\n`;
  // Chart companions
  out += `  --chart-grid: var(--border);\n`;
  out += `  --chart-axis: var(--muted-foreground);\n`;
  out += `  --chart-tooltip: var(--popover);\n`;
  out += `  --chart-tooltip-text: var(--popover-foreground);\n`;
  // Sidebar interaction states
  out += `  --sidebar-hover: oklch(0.97 0.001 106.424);\n`;
  out += `  --sidebar-active: oklch(0.95 0.002 106.424);\n`;
  out += `  --sidebar-selected: oklch(0.96 0.002 106.424);\n`;
  out += `  --sidebar-muted: var(--muted);\n`;
  out += `  --sidebar-muted-foreground: var(--muted-foreground);\n`;
  // Global interaction
  out += `  --hover: oklch(0.95 0.001 106.424);\n`;
  out += `  --active: oklch(0.93 0.002 106.424);\n`;
  out += `  --selected: oklch(0.94 0.002 106.424);\n`;
  out += `  --disabled: oklch(0.98 0.001 106.424);\n`;
  out += `  --disabled-foreground: oklch(0.72 0.01 56.259);\n`;
  out += `  --link: var(--primary);\n`;
  out += `  --link-hover: oklch(0.52 0.13 163);\n`;
  out += `  --placeholder: oklch(0.709 0.01 56.259);\n`;
  out += `  --accent-hover: oklch(0.94 0.002 106.424);\n`;
  out += `  --muted-hover: oklch(0.94 0.002 106.424);\n`;
  // Status
  out += `  --success: var(--badge-success);\n`;
  out += `  --success-foreground: var(--badge-success-foreground);\n`;
  out += `  --success-muted: oklch(0.95 0.04 145);\n`;
  out += `  --success-border: oklch(0.88 0.06 145);\n`;
  out += `  --success-ring: var(--badge-success);\n`;
  out += `  --warning: var(--badge-warning);\n`;
  out += `  --warning-foreground: var(--badge-warning-foreground);\n`;
  out += `  --warning-muted: oklch(0.97 0.05 85);\n`;
  out += `  --warning-border: oklch(0.9 0.07 85);\n`;
  out += `  --warning-ring: var(--badge-warning);\n`;
  out += `  --info: var(--badge-info);\n`;
  out += `  --info-foreground: var(--badge-info-foreground);\n`;
  out += `  --info-muted: oklch(0.95 0.04 163);\n`;
  out += `  --info-border: oklch(0.88 0.06 163);\n`;
  out += `  --info-ring: var(--badge-info);\n`;
  out += `  --critical: var(--badge-critical);\n`;
  out += `  --critical-foreground: var(--badge-critical-foreground);\n`;
  out += `  --critical-muted: oklch(0.96 0.06 27.325);\n`;
  out += `  --critical-border: oklch(0.9 0.08 27.325);\n`;
  out += `  --critical-ring: var(--badge-critical);\n`;
  // Z-index governance
  out += `  --z-base: 0;\n`;
  out += `  --z-sidebar: 20;\n`;
  out += `  --z-sticky: 30;\n`;
  out += `  --z-dropdown: 40;\n`;
  out += `  --z-popover: 45;\n`;
  out += `  --z-modal: 50;\n`;
  out += `  --z-fab: 60;\n`;
  out += `  --z-toast: 100;\n`;
  // Motion + elevation
  out += `  --ease-standard: cubic-bezier(0.2, 0, 0, 1);\n`;
  out += `  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);\n`;
  out += `  --dur-fast: 120ms;\n`;
  out += `  --dur-standard: 200ms;\n`;
  out += `  --dur-slow: 320ms;\n`;
  out += `  --shadow-xs: 0 1px 1px hsl(0 0% 0% / 0.06);\n`;
  out += `  --shadow-sm: 0 1px 2px hsl(0 0% 0% / 0.08);\n`;
  out += `  --shadow-md: 0 6px 16px hsl(0 0% 0% / 0.1);\n`;
  out += `  --shadow-lg: 0 10px 28px hsl(0 0% 0% / 0.12);\n`;
  out += `  --shadow-xl: 0 18px 44px hsl(0 0% 0% / 0.14);\n`;
  out += `  --shadow-2xl: 0 28px 64px hsl(0 0% 0% / 0.16);\n`;
  // Card elevation
  out += `  --card-shadow: 0 0 0 1px hsl(0 0% 0% / 0.03), 0 2px 4px hsl(0 0% 0% / 0.05), 0 12px 24px hsl(0 0% 0% / 0.05);\n`;
  out += `  --card-shadow-dark: 0 -20px 80px -20px oklch(1 0 0 / 0.12) inset;\n`;
  out += `  --card-border-dark: 1px solid oklch(1 0 0 / 0.1);\n`;
  // Glow (accent-tinted card shadow)
  out += `  --glow: 0 0 0 1px hsl(0 0% 0% / 0.06), 0 18px 60px color-mix(in oklab, var(--primary) 14%, transparent);\n`;
  // Panel shadow
  out += `  --panel-shadow-left: 2px 0 4px hsl(0 0% 0% / 0.08);\n`;
  out += `  --panel-shadow-right: -2px 0 4px hsl(0 0% 0% / 0.08);\n`;
  out += `}\n\n`;

  // ── .dark ──
  out += `.dark {\n`;
  out += `  color-scheme: dark;\n`;
  // Neutral tokens: surfaces override > preset fallback
  const darkSurf = config.surfaces?.dark;
  if (darkSurf) {
    out += `  --background: ${darkSurf.bg};\n`;
    out += `  --foreground: ${darkSurf.text};\n`;
    out += `  --card: ${darkSurf.panel};\n`;
    out += `  --card-foreground: ${darkSurf.text};\n`;
    out += `  --popover: ${darkSurf.panel};\n`;
    out += `  --popover-foreground: ${darkSurf.text};\n`;
    out += `  --secondary: ${darkSurf.panel2};\n`;
    out += `  --secondary-foreground: ${darkSurf.text};\n`;
    out += `  --muted: ${darkSurf.panel2};\n`;
    out += `  --muted-foreground: ${darkSurf.muted};\n`;
    out += `  --accent: ${darkSurf.panel2};\n`;
    out += `  --accent-foreground: ${darkSurf.text};\n`;
    out += `  --border: ${darkSurf.border};\n`;
    out += `  --input: ${darkSurf.border};\n`;
    out += `  --ring: ${darkSurf.muted};\n`;
    out += `  --sidebar: ${darkSurf.panel};\n`;
    out += `  --sidebar-foreground: ${darkSurf.text};\n`;
    out += `  --sidebar-accent: ${darkSurf.panel2};\n`;
    out += `  --sidebar-accent-foreground: ${darkSurf.text};\n`;
    out += `  --sidebar-border: ${darkSurf.border};\n`;
    out += `  --sidebar-ring: ${darkSurf.muted};\n`;
  } else {
    for (const [key, val] of Object.entries(preset.dark)) {
      out += `  ${key}: ${val};\n`;
    }
  }
  // Brand overrides dark
  const darkBg = darkSurf?.bg ?? preset.dark['--background'];
  out += `  --primary: ${brand.primaryDark};\n`;
  out += `  --primary-foreground: ${brand.primaryForegroundDark};\n`;
  out += `  --destructive: ${semanticColors.destructiveDark};\n`;
  out += `  --destructive-foreground: ${darkBg};\n`;
  out += `  --sidebar-primary: oklch(0.77 0.15 163);\n`;
  out += `  --sidebar-primary-foreground: ${brand.primaryForegroundDark};\n`;
  // Layout
  out += `  --sidebar-width: 16rem;\n`;
  out += `  --sidebar-width-icon: 3rem;\n`;
  out += `  --sidebar-width-mobile: 18rem;\n`;
  out += `  --header-height: 3.5rem;\n`;
  // Badges dark
  out += `  --badge-critical: ${semanticColors.destructiveDark};\n`;
  out += `  --badge-critical-foreground: ${darkBg};\n`;
  out += `  --badge-warning: ${semanticColors.warningDark};\n`;
  out += `  --badge-warning-foreground: ${darkBg};\n`;
  out += `  --badge-success: ${semanticColors.successDark};\n`;
  out += `  --badge-success-foreground: ${darkBg};\n`;
  out += `  --badge-info: ${semanticColors.infoDark};\n`;
  out += `  --badge-info-foreground: ${darkBg};\n`;
  // Charts (same in dark)
  out += `  --chart-1: oklch(0.85 0.13 165);\n`;
  out += `  --chart-2: oklch(0.77 0.15 163);\n`;
  out += `  --chart-3: oklch(0.7 0.15 162);\n`;
  out += `  --chart-4: oklch(0.6 0.13 163);\n`;
  out += `  --chart-5: oklch(0.51 0.1 166);\n`;
  // Chart companions dark
  out += `  --chart-grid: var(--border);\n`;
  out += `  --chart-axis: var(--muted-foreground);\n`;
  out += `  --chart-tooltip: var(--popover);\n`;
  out += `  --chart-tooltip-text: var(--popover-foreground);\n`;
  // Sidebar states dark
  out += `  --sidebar-hover: oklch(0.24 0.01 34.298);\n`;
  out += `  --sidebar-active: oklch(0.28 0.01 34.298);\n`;
  out += `  --sidebar-selected: oklch(0.26 0.01 34.298);\n`;
  out += `  --sidebar-muted: var(--muted);\n`;
  out += `  --sidebar-muted-foreground: var(--muted-foreground);\n`;
  // Interaction dark
  out += `  --hover: oklch(0.24 0.01 34.298);\n`;
  out += `  --active: oklch(0.28 0.01 34.298);\n`;
  out += `  --selected: oklch(0.26 0.01 34.298);\n`;
  out += `  --disabled: oklch(0.22 0.01 34.298);\n`;
  out += `  --disabled-foreground: oklch(0.56 0.01 56.259);\n`;
  out += `  --link: var(--primary);\n`;
  out += `  --link-hover: oklch(0.78 0.12 163);\n`;
  out += `  --placeholder: oklch(0.56 0.01 56.259);\n`;
  out += `  --accent-hover: oklch(0.3 0.01 34.298);\n`;
  out += `  --muted-hover: oklch(0.3 0.01 34.298);\n`;
  // Status dark
  out += `  --success: var(--badge-success);\n`;
  out += `  --success-foreground: var(--badge-success-foreground);\n`;
  out += `  --success-muted: oklch(0.24 0.05 145);\n`;
  out += `  --success-border: oklch(0.34 0.07 145);\n`;
  out += `  --success-ring: var(--badge-success);\n`;
  out += `  --warning: var(--badge-warning);\n`;
  out += `  --warning-foreground: var(--badge-warning-foreground);\n`;
  out += `  --warning-muted: oklch(0.26 0.05 85);\n`;
  out += `  --warning-border: oklch(0.36 0.07 85);\n`;
  out += `  --warning-ring: var(--badge-warning);\n`;
  out += `  --info: var(--badge-info);\n`;
  out += `  --info-foreground: var(--badge-info-foreground);\n`;
  out += `  --info-muted: oklch(0.24 0.05 163);\n`;
  out += `  --info-border: oklch(0.34 0.07 163);\n`;
  out += `  --info-ring: var(--badge-info);\n`;
  out += `  --critical: var(--badge-critical);\n`;
  out += `  --critical-foreground: var(--badge-critical-foreground);\n`;
  out += `  --critical-muted: oklch(0.26 0.05 22.216);\n`;
  out += `  --critical-border: oklch(0.36 0.07 22.216);\n`;
  out += `  --critical-ring: var(--badge-critical);\n`;
  // Card elevation dark
  out += `  --card-shadow-dark: 0 -20px 80px -20px oklch(1 0 0 / 0.12) inset;\n`;
  out += `  --card-border-dark: 1px solid oklch(1 0 0 / 0.1);\n`;
  // Glow dark (stronger accent tint)
  out += `  --glow: 0 0 0 1px oklch(1 0 0 / 0.08), 0 0 40px color-mix(in oklab, var(--primary) 22%, transparent);\n`;
  // Shadows dark (deeper)
  out += `  --shadow-xs: 0 1px 2px hsl(0 0% 0% / 0.2);\n`;
  out += `  --shadow-sm: 0 1px 3px hsl(0 0% 0% / 0.3);\n`;
  out += `  --shadow-md: 0 6px 16px hsl(0 0% 0% / 0.35);\n`;
  out += `  --shadow-lg: 0 10px 28px hsl(0 0% 0% / 0.4);\n`;
  out += `  --shadow-xl: 0 20px 60px hsl(0 0% 0% / 0.45);\n`;
  out += `  --shadow-2xl: 0 28px 64px hsl(0 0% 0% / 0.5);\n`;
  // Palette dark
  out += `  --palette-1: oklch(0.62 0.2 265);\n`;
  out += `  --palette-2: oklch(0.65 0.22 293);\n`;
  out += `  --palette-3: oklch(0.7 0.2 350);\n`;
  out += `  --palette-4: oklch(0.65 0.22 27);\n`;
  out += `  --palette-5: oklch(0.72 0.16 45);\n`;
  out += `  --palette-6: oklch(0.78 0.16 95);\n`;
  out += `  --palette-7: oklch(0.72 0.16 145);\n`;
  out += `  --palette-8: oklch(0.72 0.1 175);\n`;
  out += `  --palette-9: oklch(0.72 0.12 195);\n`;
  out += `  --palette-10: var(--primary);\n`;
  out += `}\n\n`;

  // ── @layer base ──
  out += `@layer base {\n`;
  out += `  * {\n`;
  out += `    @apply border-border;\n`;
  out += `  }\n`;
  out += `  html {\n`;
  out += `    scrollbar-gutter: stable;\n`;
  out += `  }\n`;
  out += `  body {\n`;
  out += `    @apply bg-background text-foreground font-sans antialiased min-h-svh;\n`;
  out += `    @apply selection:bg-primary/20 selection:text-foreground;\n`;
  out += `    font-feature-settings: "cv11", "ss01", "tnum";\n`;
  out += `  }\n`;
  out += `  .dark body {\n`;
  out += `    background:\n`;
  out += `      radial-gradient(900px 480px at 15% 10%, color-mix(in oklab, var(--primary) 24%, transparent) 0%, transparent 60%),\n`;
  out += `      radial-gradient(900px 520px at 85% 15%, color-mix(in oklab, var(--info) 18%, transparent) 0%, transparent 60%),\n`;
  out += `      linear-gradient(180deg, color-mix(in oklab, var(--primary) 22%, var(--background)) 0%, var(--background) 100%);\n`;
  out += `    letter-spacing: -0.01em;\n`;
  out += `  }\n`;
  out += `  h1, h2, h3, h4, h5, h6 {\n`;
  out += `    @apply tracking-tight font-medium text-balance;\n`;
  out += `  }\n`;
  out += `  td, th, .tabular-nums {\n`;
  out += `    font-variant-numeric: tabular-nums;\n`;
  out += `  }\n`;
  out += `  ::-webkit-scrollbar {\n`;
  out += `    width: 6px;\n`;
  out += `    height: 6px;\n`;
  out += `  }\n`;
  out += `  ::-webkit-scrollbar-track {\n`;
  out += `    @apply bg-transparent;\n`;
  out += `  }\n`;
  out += `  ::-webkit-scrollbar-thumb {\n`;
  out += `    @apply bg-muted-foreground/20 rounded-full hover:bg-muted-foreground/40 transition-colors;\n`;
  out += `  }\n`;
  out += `  button, a, input, select, textarea {\n`;
  out += `    touch-action: manipulation;\n`;
  out += `  }\n`;
  out += `  :focus-visible {\n`;
  out += `    @apply outline-2 outline-offset-2 outline-ring;\n`;
  out += `  }\n`;
  out += `  @media (prefers-reduced-motion: reduce) {\n`;
  out += `    *, *::before, *::after {\n`;
  out += `      animation-duration: 0.001ms !important;\n`;
  out += `      animation-iteration-count: 1 !important;\n`;
  out += `      transition-duration: 0.001ms !important;\n`;
  out += `    }\n`;
  out += `    html {\n`;
  out += `      scroll-behavior: auto;\n`;
  out += `    }\n`;
  out += `  }\n`;
  out += `}\n\n`;

  // ── @layer utilities ──
  out += `@layer utilities {\n`;
  out += `  .text-balance {\n`;
  out += `    text-wrap: balance;\n`;
  out += `  }\n`;
  const elevations = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  for (const e of elevations) {
    out += `  .elev-${e} {\n`;
    out += `    box-shadow: var(--shadow-${e});\n`;
    out += `  }\n`;
  }
  const statuses = ['success', 'warning', 'info', 'critical'];
  for (const s of statuses) {
    out += `  .status-${s} {\n`;
    out += `    @apply border;\n`;
    out += `    background: var(--${s}-muted);\n`;
    out += `    color: var(--${s}-foreground);\n`;
    out += `    border-color: var(--${s}-border);\n`;
    out += `  }\n`;
  }
  // .aurora-card is opt-in only — not applied to cards by default
  out += `  .aurora-card {\n`;
  out += `    position: relative;\n`;
  out += `    overflow: hidden;\n`;
  out += `    box-shadow: var(--shadow-lg);\n`;
  out += `    transition: box-shadow var(--dur-standard) var(--ease-standard);\n`;
  out += `  }\n`;
  out += `  .aurora-card:hover {\n`;
  out += `    box-shadow: var(--glow);\n`;
  out += `  }\n`;
  out += `  .aurora-card::before {\n`;
  out += `    content: "";\n`;
  out += `    position: absolute;\n`;
  out += `    inset: -2px;\n`;
  out += `    background: radial-gradient(520px 180px at 30% 0%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 60%);\n`;
  out += `    pointer-events: none;\n`;
  out += `    opacity: 0.9;\n`;
  out += `    z-index: 0;\n`;
  out += `  }\n`;
  out += `  .aurora-card > * {\n`;
  out += `    position: relative;\n`;
  out += `    z-index: 1;\n`;
  out += `  }\n`;

  // ── Button polish (both modes) ──
  out += `  [data-slot="button"] {\n`;
  out += `    transition: transform 150ms var(--ease-standard), box-shadow 150ms var(--ease-standard), background-color 150ms var(--ease-standard), border-color 150ms var(--ease-standard);\n`;
  out += `  }\n`;
  // Light-mode: subtle shadow + lift + press
  out += `  :root [data-slot="button"] {\n`;
  out += `    box-shadow: var(--shadow-sm);\n`;
  out += `  }\n`;
  out += `  :root [data-slot="button"]:hover {\n`;
  out += `    transform: translateY(-1px);\n`;
  out += `    box-shadow: var(--shadow-md);\n`;
  out += `  }\n`;
  out += `  :root [data-slot="button"]:active {\n`;
  out += `    transform: translateY(0px) scale(0.98);\n`;
  out += `    box-shadow: var(--shadow-sm);\n`;
  out += `  }\n`;
  // Ghost + link variants: no shadow in light mode
  out += `  :root [data-slot="button"][data-variant="ghost"],\n`;
  out += `  :root [data-slot="button"][data-variant="link"] {\n`;
  out += `    box-shadow: none;\n`;
  out += `  }\n`;
  out += `  :root [data-slot="button"][data-variant="ghost"]:hover,\n`;
  out += `  :root [data-slot="button"][data-variant="link"]:hover {\n`;
  out += `    box-shadow: none;\n`;
  out += `  }\n`;
  // Dark-mode: more dramatic
  out += `  .dark [data-slot="button"]:hover {\n`;
  out += `    transform: translateY(-1px);\n`;
  out += `  }\n`;
  out += `  .dark [data-slot="button"]:active {\n`;
  out += `    transform: translateY(0px) scale(0.97);\n`;
  out += `  }\n`;

  // Dark: default variant — gradient bg + accent border glow
  out += `  .dark [data-slot="button"][data-variant="default"] {\n`;
  out += `    background: linear-gradient(135deg, var(--primary), color-mix(in oklab, var(--primary) 70%, var(--background)));\n`;
  out += `    border: 1px solid color-mix(in oklab, var(--primary) 55%, var(--border));\n`;
  out += `  }\n`;
  out += `  .dark [data-slot="button"][data-variant="default"]:hover {\n`;
  out += `    box-shadow: var(--glow);\n`;
  out += `    border-color: color-mix(in oklab, var(--primary) 65%, var(--border));\n`;
  out += `  }\n`;

  // Dark: outline variant — glass bg + accent border tint
  out += `  .dark [data-slot="button"][data-variant="outline"] {\n`;
  out += `    background: var(--card);\n`;
  out += `    border: 1px solid var(--border);\n`;
  out += `  }\n`;
  out += `  .dark [data-slot="button"][data-variant="outline"]:hover {\n`;
  out += `    background: var(--accent);\n`;
  out += `    border-color: color-mix(in oklab, var(--primary) 45%, var(--border));\n`;
  out += `    box-shadow: var(--glow);\n`;
  out += `  }\n`;

  // Dark: secondary variant — glass bg
  out += `  .dark [data-slot="button"][data-variant="secondary"] {\n`;
  out += `    background: var(--card);\n`;
  out += `    border: 1px solid var(--border);\n`;
  out += `  }\n`;
  out += `  .dark [data-slot="button"][data-variant="secondary"]:hover {\n`;
  out += `    background: var(--accent);\n`;
  out += `    border-color: color-mix(in oklab, var(--primary) 35%, var(--border));\n`;
  out += `  }\n`;

  // Dark: ghost variant
  out += `  .dark [data-slot="button"][data-variant="ghost"]:hover {\n`;
  out += `    background: var(--card);\n`;
  out += `  }\n`;

  // Dark: destructive variant — destructive glow
  out += `  .dark [data-slot="button"][data-variant="destructive"]:hover {\n`;
  out += `    box-shadow: 0 0 0 1px oklch(1 0 0 / 0.08), 0 0 30px color-mix(in oklab, var(--destructive) 22%, transparent);\n`;
  out += `  }\n`;

  // ── Card baseline motion (both modes) ──
  out += `  [data-slot="card"] {\n`;
  out += `    transition: box-shadow 180ms var(--ease-standard), transform 180ms var(--ease-standard), border-color 180ms var(--ease-standard);\n`;
  out += `  }\n`;
  out += `  :root [data-slot="card"]:hover {\n`;
  out += `    box-shadow: var(--shadow-md);\n`;
  out += `    transform: translateY(-1px);\n`;
  out += `  }\n`;
  out += `  .dark [data-slot="card"]:hover {\n`;
  out += `    transform: translateY(-1px);\n`;
  out += `  }\n`;

  // ── Section divider (gradient fade) ──
  out += `  .section-divider {\n`;
  out += `    height: 1px;\n`;
  out += `    width: 100%;\n`;
  out += `    background: linear-gradient(to right, transparent, color-mix(in oklab, var(--border) 60%, transparent), transparent);\n`;
  out += `  }\n`;

  // ── Glass utility (dark-mode-aware) ──
  out += `  .glass {\n`;
  out += `    background: oklch(1 0 0 / 0.7);\n`;
  out += `    backdrop-filter: blur(12px) saturate(180%);\n`;
  out += `    -webkit-backdrop-filter: blur(12px) saturate(180%);\n`;
  out += `  }\n`;
  out += `  .dark .glass {\n`;
  out += `    background: oklch(0 0 0 / 0.3);\n`;
  out += `  }\n`;

  // ── Dark-mode badge ──
  out += `  .dark [data-slot="badge"] {\n`;
  out += `    border: 1px solid var(--border);\n`;
  out += `    background: var(--accent);\n`;
  out += `  }\n`;

  out += `  @media print {\n`;
  out += `    .elev-xs, .elev-sm, .elev-md, .elev-lg, .elev-xl, .elev-2xl {\n`;
  out += `      box-shadow: none;\n`;
  out += `    }\n`;
  out += `  }\n`;
  out += `}\n\n`;

  // ── View transitions ──
  out += `/* View Transitions (theme toggle animation) */\n`;
  out += `::view-transition-old(root),\n`;
  out += `::view-transition-new(root) {\n`;
  out += `  animation: none;\n`;
  out += `  mix-blend-mode: normal;\n`;
  out += `}\n`;

  return out;
}

// ─── Token Generators ────────────────────────────────────────

function generateTypographyCSS(config: EngineConfig): string {
  const { fonts, fontSizeBase, projectName } = config;
  const headingFont = config['fonts.heading'] ?? fonts.sans;
  const ratio = config.typeScaleRatio ?? 1.25;
  let out = header(projectName, 'Typography');

  // Parse base size
  const baseRem = parseFloat(fontSizeBase);

  // Type scale: xs(-2), sm(-1), base(0), lg(1), xl(2), 2xl(3), 3xl(4), 4xl(5), 5xl(6), 6xl(7), 7xl(8), 8xl(9), 9xl(10)
  const steps = [
    { name: 'xs', exp: -2 },
    { name: 'sm', exp: -1 },
    { name: 'base', exp: 0 },
    { name: 'lg', exp: 1 },
    { name: 'xl', exp: 2 },
    { name: '2xl', exp: 3 },
    { name: '3xl', exp: 4 },
    { name: '4xl', exp: 5 },
    { name: '5xl', exp: 6 },
    { name: '6xl', exp: 7 },
    { name: '7xl', exp: 8 },
    { name: '8xl', exp: 9 },
    { name: '9xl', exp: 10 },
  ];

  out += '@theme {\n';
  out += `  /* Font families */\n`;
  out += `  --font-sans: ${fonts.sans};\n`;
  out += `  --font-mono: ${fonts.mono};\n`;
  out += `  --font-heading: ${headingFont};\n\n`;

  out += `  /* Type scale (ratio: ${ratio}) */\n`;
  for (const s of steps) {
    const size = baseRem * Math.pow(ratio, s.exp);
    const lineHeight = size < 1.25 ? 1.6 : size < 2 ? 1.5 : size < 3 ? 1.25 : 1.1;
    out += `  --text-${s.name}: ${size.toFixed(4)}rem;\n`;
    out += `  --text-${s.name}--line-height: ${lineHeight};\n`;
  }

  out += '\n  /* Letter spacing */\n';
  out += '  --tracking-tighter: -0.05em;\n';
  out += '  --tracking-tight: -0.025em;\n';
  out += '  --tracking-normal: 0em;\n';
  out += '  --tracking-wide: 0.025em;\n';
  out += '  --tracking-wider: 0.05em;\n';
  out += '  --tracking-widest: 0.1em;\n';

  out += '\n  /* Font weights */\n';
  const weights = [
    ['thin', 100], ['extralight', 200], ['light', 300], ['normal', 400],
    ['medium', 500], ['semibold', 600], ['bold', 700], ['extrabold', 800], ['black', 900],
  ] as const;
  for (const [name, val] of weights) {
    out += `  --font-weight-${name}: ${val};\n`;
  }

  out += '}\n';
  return out;
}

function generateSpacingCSS(config: EngineConfig): string {
  const { spacingUnit, radiusBase, projectName } = config;
  const steps = config.spacingSteps ?? DEFAULT_SPACING_STEPS;
  const borderWidths = config.borderWidths ?? DEFAULT_BORDER_WIDTHS;
  let out = header(projectName, 'Spacing & Sizing');

  const baseVal = parseFloat(spacingUnit);
  const baseUnit = spacingUnit.replace(/[\d.]/g, '') || 'px';
  const radiusVal = parseFloat(radiusBase);
  const radiusUnit = radiusBase.replace(/[\d.]/g, '') || 'rem';

  out += '@theme {\n';
  out += '  /* Spacing scale */\n';
  for (const step of steps) {
    const val = baseVal * step;
    const key = String(step).replace('.', '_');
    out += `  --spacing-${key}: ${val}${baseUnit};\n`;
  }

  out += '\n  /* Border radius */\n';
  out += `  --radius-none: 0;\n`;
  out += `  --radius-sm: ${(radiusVal * 0.667).toFixed(3)}${radiusUnit};\n`;
  out += `  --radius-md: ${radiusVal}${radiusUnit};\n`;
  out += `  --radius-lg: ${(radiusVal * 1.333).toFixed(3)}${radiusUnit};\n`;
  out += `  --radius-xl: ${(radiusVal * 2).toFixed(3)}${radiusUnit};\n`;
  out += `  --radius-2xl: ${(radiusVal * 2.667).toFixed(3)}${radiusUnit};\n`;
  out += `  --radius-full: 9999px;\n`;

  out += '\n  /* Border widths */\n';
  for (const [name, val] of Object.entries(borderWidths)) {
    const key = name === 'DEFAULT' ? 'default' : name;
    out += `  --border-width-${key}: ${val};\n`;
  }

  out += '}\n';
  return out;
}

function generateEffectsCSS(config: EngineConfig): string {
  const { projectName } = config;
  // opacitySteps available if needed for custom opacity utilities
  // const opacitySteps = config.opacitySteps ?? DEFAULT_OPACITY_STEPS;
  const easings = { ...DEFAULT_EASINGS, ...config.easings };
  const motion = { ...DEFAULT_MOTION, ...config.motion };
  let out = header(projectName, 'Effects');

  const sc = 'hsl(0 0% 0% / 0.1)';
  out += '@theme {\n';
  out += '  /* Shadows */\n';
  out += `  --shadow-xs: 0 1px 2px 0 ${sc};\n`;
  out += `  --shadow-sm: 0 1px 3px 0 ${sc}, 0 1px 2px -1px ${sc};\n`;
  out += `  --shadow-md: 0 4px 6px -1px ${sc}, 0 2px 4px -2px ${sc};\n`;
  out += `  --shadow-lg: 0 10px 15px -3px ${sc}, 0 4px 6px -4px ${sc};\n`;
  out += `  --shadow-xl: 0 20px 25px -5px ${sc}, 0 8px 10px -6px ${sc};\n`;
  out += `  --shadow-2xl: 0 25px 50px -12px ${sc};\n`;
  out += `  --shadow-inner: inset 0 2px 4px 0 ${sc};\n`;
  out += `  --shadow-ring: 0 0 0 3px var(--color-ring);\n`;

  // NOTE: Do NOT generate --opacity-* in @theme — Tailwind v4 handles opacity
  // internally. Custom --opacity-* values break color-mix() because they emit
  // decimals (0.9) where color-mix() requires percentages (90%).

  out += '\n  /* Blur scale */\n';
  const blurs = [
    ['none', '0'], ['sm', '4px'], ['md', '12px'], ['lg', '16px'],
    ['xl', '24px'], ['2xl', '40px'], ['3xl', '64px'],
  ];
  for (const [name, val] of blurs) {
    out += `  --blur-${name}: ${val};\n`;
  }

  out += '\n  /* Transition durations */\n';
  for (const [name, val] of Object.entries(motion)) {
    out += `  --duration-${name}: ${val};\n`;
  }

  out += '\n  /* Easing functions */\n';
  for (const [name, val] of Object.entries(easings)) {
    out += `  --ease-${name}: ${val};\n`;
  }

  out += '}\n';
  return out;
}

function generateMotionCSS(config: EngineConfig): string {
  const { projectName } = config;
  const motion = { ...DEFAULT_MOTION, ...config.motion };
  let out = header(projectName, 'Motion & Animation');

  out += '@theme {\n';
  out += `  --animate-fade-in: fade-in ${motion.normal} var(--ease-out, cubic-bezier(0, 0, 0.2, 1));\n`;
  out += `  --animate-fade-out: fade-out ${motion.normal} var(--ease-in, cubic-bezier(0.4, 0, 1, 1));\n`;
  out += `  --animate-slide-up: slide-up ${motion.normal} var(--ease-out, cubic-bezier(0, 0, 0.2, 1));\n`;
  out += `  --animate-slide-down: slide-down ${motion.normal} var(--ease-out, cubic-bezier(0, 0, 0.2, 1));\n`;
  out += `  --animate-scale-in: scale-in ${motion.normal} var(--ease-out, cubic-bezier(0, 0, 0.2, 1));\n`;
  out += `  --animate-spin: spin 1s linear infinite;\n`;
  out += `  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n`;
  out += `  --animate-bounce: bounce 1s infinite;\n\n`;

  out += '  @keyframes fade-in {\n';
  out += '    from { opacity: 0; }\n';
  out += '    to { opacity: 1; }\n';
  out += '  }\n\n';

  out += '  @keyframes fade-out {\n';
  out += '    from { opacity: 1; }\n';
  out += '    to { opacity: 0; }\n';
  out += '  }\n\n';

  out += '  @keyframes slide-up {\n';
  out += '    from { transform: translateY(10px); opacity: 0; }\n';
  out += '    to { transform: translateY(0); opacity: 1; }\n';
  out += '  }\n\n';

  out += '  @keyframes slide-down {\n';
  out += '    from { transform: translateY(-10px); opacity: 0; }\n';
  out += '    to { transform: translateY(0); opacity: 1; }\n';
  out += '  }\n\n';

  out += '  @keyframes scale-in {\n';
  out += '    from { transform: scale(0.95); opacity: 0; }\n';
  out += '    to { transform: scale(1); opacity: 1; }\n';
  out += '  }\n\n';

  out += '  @keyframes spin {\n';
  out += '    to { transform: rotate(360deg); }\n';
  out += '  }\n\n';

  out += '  @keyframes pulse {\n';
  out += '    50% { opacity: 0.5; }\n';
  out += '  }\n\n';

  out += '  @keyframes bounce {\n';
  out += '    0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }\n';
  out += '    50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }\n';
  out += '  }\n';

  out += '}\n\n';

  // Reduced motion
  out += '@media (prefers-reduced-motion: reduce) {\n';
  out += '  *, *::before, *::after {\n';
  out += '    animation-duration: 0.01ms !important;\n';
  out += '    animation-iteration-count: 1 !important;\n';
  out += '    transition-duration: 0.01ms !important;\n';
  out += '    scroll-behavior: auto !important;\n';
  out += '  }\n';
  out += '}\n';

  return out;
}

// ─── Utility Generators ──────────────────────────────────────

function generateLayoutUtilitiesCSS(config: EngineConfig): string {
  const { projectName } = config;
  const zIndex = config.zIndex ?? DEFAULT_ZINDEX;
  let out = header(projectName, 'Utilities — Layout');

  out += '@utility scrollbar-hidden {\n';
  out += '  -ms-overflow-style: none;\n';
  out += '  scrollbar-width: none;\n';
  out += '  &::-webkit-scrollbar {\n';
  out += '    display: none;\n';
  out += '  }\n';
  out += '}\n\n';

  out += '@utility aspect-auto {\n';
  out += '  aspect-ratio: auto;\n';
  out += '}\n\n';

  out += '@utility aspect-square {\n';
  out += '  aspect-ratio: 1 / 1;\n';
  out += '}\n\n';

  out += '@utility aspect-video {\n';
  out += '  aspect-ratio: 16 / 9;\n';
  out += '}\n\n';

  out += '@utility aspect-photo {\n';
  out += '  aspect-ratio: 4 / 3;\n';
  out += '}\n\n';

  out += '@utility aspect-cinema {\n';
  out += '  aspect-ratio: 21 / 9;\n';
  out += '}\n\n';

  // Z-index utilities
  out += '@theme {\n';
  for (const [name, val] of Object.entries(zIndex)) {
    out += `  --z-${name}: ${val};\n`;
  }
  out += '}\n';

  return out;
}

function generateFlexgridUtilitiesCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Utilities — Flexbox & Grid');

  out += '@utility flex-center {\n';
  out += '  display: flex;\n';
  out += '  align-items: center;\n';
  out += '  justify-content: center;\n';
  out += '}\n\n';

  out += '@utility flex-between {\n';
  out += '  display: flex;\n';
  out += '  align-items: center;\n';
  out += '  justify-content: space-between;\n';
  out += '}\n\n';

  out += '@utility flex-col-center {\n';
  out += '  display: flex;\n';
  out += '  flex-direction: column;\n';
  out += '  align-items: center;\n';
  out += '  justify-content: center;\n';
  out += '}\n\n';

  out += '@utility flex-start {\n';
  out += '  display: flex;\n';
  out += '  align-items: center;\n';
  out += '  justify-content: flex-start;\n';
  out += '}\n\n';

  out += '@utility flex-end {\n';
  out += '  display: flex;\n';
  out += '  align-items: center;\n';
  out += '  justify-content: flex-end;\n';
  out += '}\n\n';

  out += '@utility grid-fill {\n';
  out += '  display: grid;\n';
  out += '  grid-template-columns: repeat(auto-fill, minmax(min(100%, 16rem), 1fr));\n';
  out += '}\n\n';

  out += '@utility grid-fit {\n';
  out += '  display: grid;\n';
  out += '  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n';
  out += '}\n\n';

  return out;
}

function generateTypographyUtilitiesCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Utilities — Typography');

  out += '@utility text-balance {\n';
  out += '  text-wrap: balance;\n';
  out += '}\n\n';

  out += '@utility text-pretty {\n';
  out += '  text-wrap: pretty;\n';
  out += '}\n\n';

  out += '@utility truncate-1 {\n';
  out += '  overflow: hidden;\n';
  out += '  text-overflow: ellipsis;\n';
  out += '  white-space: nowrap;\n';
  out += '}\n\n';

  out += '@utility truncate-2 {\n';
  out += '  display: -webkit-box;\n';
  out += '  -webkit-box-orient: vertical;\n';
  out += '  -webkit-line-clamp: 2;\n';
  out += '  overflow: hidden;\n';
  out += '}\n\n';

  out += '@utility truncate-3 {\n';
  out += '  display: -webkit-box;\n';
  out += '  -webkit-box-orient: vertical;\n';
  out += '  -webkit-line-clamp: 3;\n';
  out += '  overflow: hidden;\n';
  out += '}\n\n';

  return out;
}

function generateEffectsUtilitiesCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Utilities — Effects');

  out += '@utility glass {\n';
  out += '  background: oklch(1 0 0 / 0.1);\n';
  out += '  backdrop-filter: blur(12px) saturate(180%);\n';
  out += '  -webkit-backdrop-filter: blur(12px) saturate(180%);\n';
  out += '  border: 1px solid oklch(1 0 0 / 0.15);\n';
  out += '}\n\n';

  out += '@utility glass-dark {\n';
  out += '  background: oklch(0 0 0 / 0.3);\n';
  out += '  backdrop-filter: blur(12px) saturate(180%);\n';
  out += '  -webkit-backdrop-filter: blur(12px) saturate(180%);\n';
  out += '  border: 1px solid oklch(1 0 0 / 0.08);\n';
  out += '}\n\n';

  out += '@utility ring-focus {\n';
  out += '  &:focus-visible {\n';
  out += '    outline: none;\n';
  out += '    box-shadow: var(--shadow-ring);\n';
  out += '  }\n';
  out += '}\n\n';

  out += '@utility gradient-primary {\n';
  out += '  background-image: linear-gradient(to right, var(--color-primary-500), var(--color-primary-600));\n';
  out += '}\n\n';

  out += '@utility gradient-secondary {\n';
  out += '  background-image: linear-gradient(to right, var(--color-secondary-500), var(--color-secondary-600));\n';
  out += '}\n\n';

  out += '@utility gradient-accent {\n';
  out += '  background-image: linear-gradient(to right, var(--color-accent-500), var(--color-accent-600));\n';
  out += '}\n\n';

  return out;
}

function generateInteractivityUtilitiesCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Utilities — Interactivity');

  out += '@utility focus-ring {\n';
  out += '  &:focus-visible {\n';
  out += '    outline: 2px solid var(--color-ring);\n';
  out += '    outline-offset: 2px;\n';
  out += '  }\n';
  out += '}\n\n';

  out += '@utility disabled-style {\n';
  out += '  &:disabled {\n';
  out += '    opacity: 0.5;\n';
  out += '    pointer-events: none;\n';
  out += '    cursor: not-allowed;\n';
  out += '  }\n';
  out += '}\n\n';

  out += '@utility interactive {\n';
  out += '  cursor: pointer;\n';
  out += '  transition-property: color, background-color, border-color, box-shadow, opacity;\n';
  out += '  transition-duration: var(--duration-fast, 150ms);\n';
  out += '  transition-timing-function: var(--ease-default, cubic-bezier(0.4, 0, 0.2, 1));\n';
  out += '  &:disabled {\n';
  out += '    opacity: 0.5;\n';
  out += '    pointer-events: none;\n';
  out += '    cursor: not-allowed;\n';
  out += '  }\n';
  out += '}\n\n';

  return out;
}

// ─── Variant Generator ───────────────────────────────────────

function generateVariantsCSS(config: EngineConfig): string {
  const { projectName, darkMode } = config;
  const custom = config.customVariants ?? {};
  let out = header(projectName, 'Custom Variants');

  // Dark mode variant
  if (darkMode === 'class') {
    out += '@custom-variant dark (&:where(.dark, .dark *));\n\n';
  } else if (darkMode === 'data-attribute') {
    out += '@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));\n\n';
  }
  // 'media' uses Tailwind's built-in prefers-color-scheme — no custom variant needed

  // Built-in convenience variants
  out += '/* Convenience variants */\n';
  out += '@custom-variant hocus {\n';
  out += '  &:hover, &:focus-visible {\n';
  out += '    @slot;\n';
  out += '  }\n';
  out += '}\n\n';

  out += '@custom-variant not-disabled (&:not(:disabled));\n\n';

  out += '@custom-variant group-hocus {\n';
  out += '  :merge(.group):hover &, :merge(.group):focus-visible & {\n';
  out += '    @slot;\n';
  out += '  }\n';
  out += '}\n\n';

  // User-defined custom variants
  if (Object.keys(custom).length > 0) {
    out += '/* User-defined variants */\n';
    for (const [name, selector] of Object.entries(custom)) {
      out += `@custom-variant ${name} (${selector});\n`;
    }
    out += '\n';
  }

  return out;
}

// ─── Breakpoints & Containers ────────────────────────────────

function generateBreakpointsCSS(config: EngineConfig): string {
  const { projectName, breakpoints, containers } = config;
  if (!breakpoints && !containers) return '';

  let out = header(projectName, 'Breakpoints & Containers');
  out += '@theme {\n';

  if (breakpoints) {
    out += '  /* Custom breakpoints */\n';
    for (const [name, val] of Object.entries(breakpoints)) {
      out += `  --breakpoint-${name}: ${val};\n`;
    }
  }

  if (containers) {
    out += '\n  /* Container max-widths */\n';
    for (const [name, val] of Object.entries(containers)) {
      out += `  --container-${name}: ${val};\n`;
    }
  }

  out += '}\n';
  return out;
}

// ─── Main: Read, Validate, Generate, Write ───────────────────

/* eslint-disable no-console, security/detect-non-literal-fs-filename */
function main() {
  const engineDir = path.dirname(new URL(import.meta.url).pathname);
  // On Windows, strip leading slash from /C:/...
  const resolvedDir = engineDir.replace(/^\/([A-Za-z]:)/, '$1');
  const jsonPath = path.join(resolvedDir, 'tailwindengine.json');
  const generatedDir = path.join(resolvedDir, 'generated');
  const srcStylesDir = path.resolve(resolvedDir, '..', 'src', 'styles');

  console.log(`Reading ${jsonPath}...`);
  const raw: unknown = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const config = EngineSchema.parse(raw);
  console.log(`✓ Validated: ${config.projectName} engine config (neutral base: ${config.neutralBase})`);

  // Ensure output directories
  const dirs = [
    generatedDir,
    path.join(generatedDir, 'tokens'),
    path.join(generatedDir, 'utilities'),
    path.join(generatedDir, 'variants'),
    srcStylesDir,
  ];
  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true });
  }

  // Generate token/utility/variant files (NO colors.css, NO component CSS)
  const files: { rel: string; content: string }[] = [
    { rel: 'tokens/typography.css', content: generateTypographyCSS(config) },
    { rel: 'tokens/spacing.css', content: generateSpacingCSS(config) },
    { rel: 'tokens/effects.css', content: generateEffectsCSS(config) },
    { rel: 'tokens/motion.css', content: generateMotionCSS(config) },
    { rel: 'utilities/layout.css', content: generateLayoutUtilitiesCSS(config) },
    { rel: 'utilities/flexgrid.css', content: generateFlexgridUtilitiesCSS(config) },
    { rel: 'utilities/typography.css', content: generateTypographyUtilitiesCSS(config) },
    { rel: 'utilities/effects.css', content: generateEffectsUtilitiesCSS(config) },
    { rel: 'utilities/interactivity.css', content: generateInteractivityUtilitiesCSS(config) },
    { rel: 'variants/custom.css', content: generateVariantsCSS(config) },
  ];

  // Breakpoints/containers (only if provided)
  const bpContent = generateBreakpointsCSS(config);
  if (bpContent) {
    files.push({ rel: 'tokens/breakpoints.css', content: bpContent });
  }

  // Write generated files
  for (const f of files) {
    const filePath = path.join(generatedDir, f.rel);
    fs.writeFileSync(filePath, f.content, 'utf-8');
    console.log(`  ✓ ${f.rel}`);
  }

  // Write barrel index.css (engine tokens + utilities + variants only)
  const indexContent = `${files
    .map(f => `@import './generated/${f.rel}';`)
    .join('\n')}\n`;
  const indexPath = path.join(resolvedDir, 'index.css');
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`  ✓ index.css (barrel)`);

  // Generate the bridge globals.css (theme file with shadcn preset + brand)
  const globalsContent = generateGlobalsCSS(config);
  const globalsPath = path.join(srcStylesDir, 'globals.css');
  fs.writeFileSync(globalsPath, globalsContent, 'utf-8');
  console.log(`  ✓ src/styles/globals.css (theme bridge)`);

  console.log(`\n✅ Generated ${files.length + 1} CSS files for ${config.projectName} design system.`);
  console.log(`   Neutral base: ${config.neutralBase}`);
  console.log(`   Brand primary: ${config.brand.primary}`);
}

try {
  main();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error('❌ Engine generation failed:', message);
  process.exit(1);
}
/* eslint-enable no-console, security/detect-non-literal-fs-filename */
