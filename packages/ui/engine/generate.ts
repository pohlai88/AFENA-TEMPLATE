/**
 * Tailwind Design System Engine — Codegen Script
 *
 * Reads tailwindengine.json, validates with Zod, and generates
 * all CSS files for the complete Tailwind v4 design system.
 *
 * Usage: npx tsx packages/ui/engine/generate.ts
 */

import * as fs from 'fs';
import * as path from 'path';

import { z } from 'zod';

// ─── Zod Schema ──────────────────────────────────────────────

const EngineSchema = z.object({
  // Compulsory (8)
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
  }),
  fonts: z.object({
    sans: z.string(),
    mono: z.string(),
  }),
  spacingUnit: z.string(),
  radiusBase: z.string(),
  fontSizeBase: z.string(),
  darkMode: z.enum(['class', 'media', 'data-attribute']),
  projectName: z.string(),
  shadowColor: z.string(),

  // Optional (12)
  'fonts.heading': z.string().nullable().optional(),
  semanticColors: z.object({
    destructive: z.string().nullable().optional(),
    success: z.string().nullable().optional(),
    warning: z.string().nullable().optional(),
    info: z.string().nullable().optional(),
  }).optional(),
  typeScaleRatio: z.number().optional(),
  spacingSteps: z.array(z.number()).nullable().optional(),
  motion: z.object({
    fast: z.string().optional(),
    normal: z.string().optional(),
    slow: z.string().optional(),
    reduced: z.string().optional(),
  }).optional(),
  easings: z.record(z.string(), z.string()).optional(),
  zIndex: z.record(z.string(), z.number()).optional(),
  breakpoints: z.record(z.string(), z.string()).nullable().optional(),
  containers: z.record(z.string(), z.string()).nullable().optional(),
  opacitySteps: z.array(z.number()).optional(),
  borderWidths: z.record(z.string(), z.string()).optional(),
  customVariants: z.record(z.string(), z.string()).optional(),
});

type EngineConfig = z.infer<typeof EngineSchema>;

// ─── Color Math (hex → oklch, shade generation) ─────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  // RGB → linear LMS (using OKLab matrix)
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2220049168 * lg + 0.6896926213 * lb;

  const l_c = Math.cbrt(l_);
  const m_c = Math.cbrt(m_);
  const s_c = Math.cbrt(s_);

  const L = 0.2104542553 * l_c + 0.7936177850 * m_c - 0.0040720468 * s_c;
  const a = 1.9779984951 * l_c - 2.4285922050 * m_c + 0.4505937099 * s_c;
  const bVal = 0.0259040371 * l_c + 0.7827717662 * m_c - 0.8086757660 * s_c;

  const C = Math.sqrt(a * a + bVal * bVal);
  let H = Math.atan2(bVal, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { l: L, c: C, h: H };
}

function hexToOklch(hex: string): { l: number; c: number; h: number } {
  const [r, g, b] = hexToRgb(hex);
  return rgbToOklch(r, g, b);
}

function formatOklch(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(2)})`;
}

// WCAG 2.1 contrast: use white text on dark/saturated backgrounds.
// Threshold 0.72 aligns with shadcn convention (white fg on primary/accent/destructive).
function contrastForeground(l: number): string {
  return l > 0.72 ? '#000000' : '#ffffff';
}

interface ShadeEntry {
  step: number;
  l: number;
  c: number;
  h: number;
}

function generateShades(base: { l: number; c: number; h: number }): ShadeEntry[] {
  // Lightness targets for each shade step (Tailwind-like distribution)
  const targets: { step: number; l: number; cScale: number }[] = [
    { step: 50, l: 0.97, cScale: 0.10 },
    { step: 100, l: 0.94, cScale: 0.25 },
    { step: 200, l: 0.88, cScale: 0.45 },
    { step: 300, l: 0.80, cScale: 0.65 },
    { step: 400, l: 0.74, cScale: 0.85 },
    { step: 500, l: 0.64, cScale: 1.00 },
    { step: 600, l: 0.55, cScale: 0.90 },
    { step: 700, l: 0.45, cScale: 0.80 },
    { step: 800, l: 0.35, cScale: 0.65 },
    { step: 900, l: 0.25, cScale: 0.50 },
    { step: 950, l: 0.15, cScale: 0.35 },
  ];

  return targets.map(t => ({
    step: t.step,
    l: t.l,
    c: Math.min(base.c * t.cScale, 0.4),
    h: base.h,
  }));
}

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

const DEFAULT_OPACITY_STEPS = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
];

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

// ─── Token Generators ────────────────────────────────────────

function generateColorsCSS(config: EngineConfig): string {
  const { colors, projectName, shadowColor } = config;
  const semantic = config.semanticColors ?? {};
  let out = header(projectName, 'Colors');

  // Generate shade palettes
  const colorEntries = Object.entries(colors);
  const palettes: Record<string, ShadeEntry[]> = {};

  for (const [name, hex] of colorEntries) {
    const base = hexToOklch(hex);
    palettes[name] = generateShades(base);
  }

  // Semantic color defaults
  const destructiveHex = semantic.destructive ?? '#ef4444';
  const successHex = semantic.success ?? colors.primary;
  const warningHex = semantic.warning ?? colors.accent;
  const infoHex = semantic.info ?? colors.secondary;

  palettes['destructive'] = generateShades(hexToOklch(destructiveHex));
  palettes['success'] = generateShades(hexToOklch(successHex));
  palettes['warning'] = generateShades(hexToOklch(warningHex));
  palettes['info'] = generateShades(hexToOklch(infoHex));

  // Light mode @theme
  out += '@theme {\n';
  for (const [name, shades] of Object.entries(palettes)) {
    out += `  /* ${name} */\n`;
    for (const s of shades) {
      out += `  --color-${name}-${s.step}: ${formatOklch(s.l, s.c, s.h)};\n`;
    }
    // Foreground for the 500 shade
    const base500 = shades.find(s => s.step === 500) ?? shades[5];
    out += `  --color-${name}-foreground: ${contrastForeground(base500.l)};\n\n`;
  }

  // Semantic aliases
  out += '  /* Semantic aliases */\n';
  out += '  --color-background: #ffffff;\n';
  out += '  --color-foreground: #0a0a0a;\n';
  out += '  --color-muted: var(--color-secondary-100);\n';
  out += '  --color-muted-foreground: var(--color-secondary-500);\n';
  out += '  --color-border: var(--color-secondary-200);\n';
  out += '  --color-ring: var(--color-primary-500);\n';
  out += '  --color-input: var(--color-secondary-300);\n';
  out += `  --color-shadow: ${shadowColor};\n`;
  out += '}\n\n';

  // Dark mode overrides
  out += '/* Dark mode overrides */\n';
  out += '.dark {\n';
  for (const [name, shades] of Object.entries(palettes)) {
    // Swap: 50↔950, 100↔900, 200↔800, 300↔700, 400↔600, 500 stays
    const swapMap: Record<number, number> = {
      50: 950, 100: 900, 200: 800, 300: 700, 400: 600,
      500: 500,
      600: 400, 700: 300, 800: 200, 900: 100, 950: 50,
    };
    for (const s of shades) {
      const darkStep = swapMap[s.step] ?? s.step;
      const darkShade = shades.find(x => x.step === darkStep) ?? shades[0];
      out += `  --color-${name}-${s.step}: ${formatOklch(darkShade.l, darkShade.c, darkShade.h)};\n`;
    }
  }
  out += '  --color-background: #0a0a0a;\n';
  out += '  --color-foreground: #fafafa;\n';
  out += '  --color-muted: var(--color-secondary-800);\n';
  out += '  --color-muted-foreground: var(--color-secondary-400);\n';
  out += '  --color-border: var(--color-secondary-700);\n';
  out += '  --color-ring: var(--color-primary-400);\n';
  out += '  --color-input: var(--color-secondary-700);\n';
  out += '}\n';

  return out;
}

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
  const { shadowColor, projectName } = config;
  const opacitySteps = config.opacitySteps ?? DEFAULT_OPACITY_STEPS;
  const easings = { ...DEFAULT_EASINGS, ...config.easings };
  const motion = { ...DEFAULT_MOTION, ...config.motion };
  let out = header(projectName, 'Effects');

  out += '@theme {\n';
  out += '  /* Shadows */\n';
  out += `  --shadow-xs: 0 1px 2px 0 ${shadowColor};\n`;
  out += `  --shadow-sm: 0 1px 3px 0 ${shadowColor}, 0 1px 2px -1px ${shadowColor};\n`;
  out += `  --shadow-md: 0 4px 6px -1px ${shadowColor}, 0 2px 4px -2px ${shadowColor};\n`;
  out += `  --shadow-lg: 0 10px 15px -3px ${shadowColor}, 0 4px 6px -4px ${shadowColor};\n`;
  out += `  --shadow-xl: 0 20px 25px -5px ${shadowColor}, 0 8px 10px -6px ${shadowColor};\n`;
  out += `  --shadow-2xl: 0 25px 50px -12px ${shadowColor};\n`;
  out += `  --shadow-inner: inset 0 2px 4px 0 ${shadowColor};\n`;
  out += `  --shadow-ring: 0 0 0 3px var(--color-ring);\n`;

  out += '\n  /* Opacity scale */\n';
  for (const step of opacitySteps) {
    out += `  --opacity-${step}: ${(step / 100).toFixed(2)};\n`;
  }

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

// ─── Component Generators ────────────────────────────────────

function btnBase(): string {
  return [
    'display: inline-flex;',
    'align-items: center;',
    'justify-content: center;',
    'border-radius: var(--radius-md);',
    'font-weight: 500;',
    'transition-property: color, background-color, border-color, box-shadow;',
    'transition-duration: var(--duration-fast, 150ms);',
    'transition-timing-function: var(--ease-default, cubic-bezier(0.4, 0, 0.2, 1));',
  ].map(l => `  ${l}`).join('\n');
}

function btnFocus(): string {
  return [
    '&:focus-visible {',
    '  outline: none;',
    '  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-ring);',
    '}',
  ].map(l => `  ${l}`).join('\n');
}

function btnDisabled(): string {
  return [
    '&:disabled {',
    '  opacity: 0.5;',
    '  pointer-events: none;',
    '}',
  ].map(l => `  ${l}`).join('\n');
}

function generateButtonComponentCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Component — Button');

  // .btn base
  out += `.btn {\n${btnBase()}\n${btnFocus()}\n${btnDisabled()}\n}\n\n`;

  // .btn-primary
  out += `.btn-primary {\n${btnBase()}\n`;
  out += '  background-color: var(--color-primary-500);\n';
  out += '  color: var(--color-primary-foreground);\n';
  out += '  &:hover { background-color: var(--color-primary-600); }\n';
  out += `${btnFocus()}\n${btnDisabled()}\n}\n\n`;

  // .btn-secondary
  out += `.btn-secondary {\n${btnBase()}\n`;
  out += '  background-color: var(--color-secondary-500);\n';
  out += '  color: var(--color-secondary-foreground);\n';
  out += '  &:hover { background-color: var(--color-secondary-600); }\n';
  out += `${btnFocus()}\n${btnDisabled()}\n}\n\n`;

  // .btn-outline
  out += `.btn-outline {\n${btnBase()}\n`;
  out += '  border: 1px solid var(--color-border);\n';
  out += '  background-color: transparent;\n';
  out += '  color: var(--color-foreground);\n';
  out += '  &:hover { background-color: var(--color-muted); }\n';
  out += `${btnFocus()}\n${btnDisabled()}\n}\n\n`;

  // .btn-ghost
  out += `.btn-ghost {\n${btnBase()}\n`;
  out += '  background-color: transparent;\n';
  out += '  color: var(--color-foreground);\n';
  out += '  &:hover { background-color: var(--color-muted); }\n';
  out += `${btnFocus()}\n${btnDisabled()}\n}\n\n`;

  // .btn-destructive
  out += `.btn-destructive {\n${btnBase()}\n`;
  out += '  background-color: var(--color-destructive-500);\n';
  out += '  color: var(--color-destructive-foreground);\n';
  out += '  &:hover { background-color: var(--color-destructive-600); }\n';
  out += `${btnFocus()}\n${btnDisabled()}\n}\n\n`;

  // Sizes
  out += '/* Button sizes */\n';
  out += '.btn-sm { padding: 0.375rem 0.75rem; font-size: var(--text-sm, 0.875rem); }\n';
  out += '.btn-md { padding: 0.5rem 1rem; font-size: var(--text-base, 1rem); }\n';
  out += '.btn-lg { padding: 0.75rem 1.5rem; font-size: var(--text-lg, 1.125rem); }\n';
  out += '.btn-icon { width: 2.25rem; height: 2.25rem; padding: 0; }\n';

  return out;
}

function generateCardComponentCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Component — Card');

  out += '.card {\n';
  out += '  border-radius: var(--radius-lg);\n';
  out += '  border: 1px solid var(--color-border);\n';
  out += '  background-color: var(--color-background);\n';
  out += '  box-shadow: var(--shadow-sm);\n';
  out += '}\n\n';

  out += '.card-header {\n';
  out += '  display: flex;\n';
  out += '  flex-direction: column;\n';
  out += '  gap: 0.375rem;\n';
  out += '  padding: 1.5rem;\n';
  out += '}\n\n';

  out += '.card-title {\n';
  out += '  font-size: var(--text-2xl, 1.5rem);\n';
  out += '  font-weight: 600;\n';
  out += '  line-height: 1;\n';
  out += '  letter-spacing: -0.025em;\n';
  out += '}\n\n';

  out += '.card-description {\n';
  out += '  font-size: var(--text-sm, 0.875rem);\n';
  out += '  color: var(--color-muted-foreground);\n';
  out += '}\n\n';

  out += '.card-content {\n';
  out += '  padding: 0 1.5rem 1.5rem;\n';
  out += '}\n\n';

  out += '.card-footer {\n';
  out += '  display: flex;\n';
  out += '  align-items: center;\n';
  out += '  padding: 0 1.5rem 1.5rem;\n';
  out += '}\n';

  return out;
}

function inputBase(): string {
  return [
    'display: flex;',
    'width: 100%;',
    'border-radius: var(--radius-md);',
    'border: 1px solid var(--color-input);',
    'background-color: var(--color-background);',
    'padding: 0.5rem 0.75rem;',
    'font-size: var(--text-sm, 0.875rem);',
    '&::placeholder { color: var(--color-muted-foreground); }',
    '&:focus-visible {',
    '  outline: none;',
    '  box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-ring);',
    '}',
    '&:disabled {',
    '  cursor: not-allowed;',
    '  opacity: 0.5;',
    '}',
  ].map(l => `  ${l}`).join('\n');
}

function generateInputComponentCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Component — Input');

  out += `.input {\n  height: 2.5rem;\n${inputBase()}\n}\n\n`;

  out += `.input-error {\n  height: 2.5rem;\n${inputBase()}\n`;
  out += '  border-color: var(--color-destructive-500);\n';
  out += '  &:focus-visible {\n';
  out += '    box-shadow: 0 0 0 2px var(--color-background), 0 0 0 4px var(--color-destructive-500);\n';
  out += '  }\n';
  out += '}\n\n';

  out += `.textarea {\n  min-height: 5rem;\n${inputBase()}\n}\n\n`;

  out += `.select {\n  height: 2.5rem;\n${inputBase()}\n}\n`;

  return out;
}

function badgeBase(): string {
  return [
    'display: inline-flex;',
    'align-items: center;',
    'border-radius: 9999px;',
    'padding: 0.125rem 0.625rem;',
    'font-size: var(--text-xs, 0.75rem);',
    'font-weight: 600;',
    'transition-property: color, background-color, border-color;',
    'transition-duration: var(--duration-fast, 150ms);',
  ].map(l => `  ${l}`).join('\n');
}

function generateBadgeComponentCSS(config: EngineConfig): string {
  const { projectName } = config;
  let out = header(projectName, 'Component — Badge');

  out += `.badge {\n${badgeBase()}\n}\n\n`;

  out += `.badge-primary {\n${badgeBase()}\n`;
  out += '  background-color: var(--color-primary-500);\n';
  out += '  color: var(--color-primary-foreground);\n';
  out += '}\n\n';

  out += `.badge-secondary {\n${badgeBase()}\n`;
  out += '  background-color: var(--color-secondary-100);\n';
  out += '  color: var(--color-secondary-700);\n';
  out += '}\n\n';

  out += `.badge-outline {\n${badgeBase()}\n`;
  out += '  border: 1px solid var(--color-border);\n';
  out += '  color: var(--color-foreground);\n';
  out += '}\n\n';

  out += `.badge-destructive {\n${badgeBase()}\n`;
  out += '  background-color: var(--color-destructive-500);\n';
  out += '  color: var(--color-destructive-foreground);\n';
  out += '}\n\n';

  out += `.badge-success {\n${badgeBase()}\n`;
  out += '  background-color: var(--color-success-500);\n';
  out += '  color: var(--color-success-foreground);\n';
  out += '}\n\n';

  out += `.badge-warning {\n${badgeBase()}\n`;
  out += '  background-color: var(--color-warning-500);\n';
  out += '  color: var(--color-warning-foreground);\n';
  out += '}\n';

  return out;
}

function generateTypographyComponentCSS(config: EngineConfig): string {
  const { projectName } = config;
  const ratio = config.typeScaleRatio ?? 1.25;
  const baseRem = parseFloat(config.fontSizeBase);
  let out = header(projectName, 'Component — Typography');

  const headings = [
    { cls: 'heading-1', exp: 5, weight: 800, tracking: '-0.025em' },
    { cls: 'heading-2', exp: 4, weight: 700, tracking: '-0.025em' },
    { cls: 'heading-3', exp: 3, weight: 600, tracking: '-0.025em' },
    { cls: 'heading-4', exp: 2, weight: 600, tracking: '0em' },
    { cls: 'heading-5', exp: 1, weight: 500, tracking: '0em' },
    { cls: 'heading-6', exp: 0, weight: 500, tracking: '0em' },
  ];

  for (const h of headings) {
    const size = baseRem * Math.pow(ratio, h.exp);
    const lh = size < 1.25 ? 1.6 : size < 2 ? 1.5 : size < 3 ? 1.25 : 1.1;
    out += `.${h.cls} {\n`;
    out += `  font-family: var(--font-heading);\n`;
    out += `  font-size: ${size.toFixed(4)}rem;\n`;
    out += `  font-weight: ${h.weight};\n`;
    out += `  letter-spacing: ${h.tracking};\n`;
    out += `  line-height: ${lh};\n`;
    out += `  color: var(--color-foreground);\n`;
    out += '}\n\n';
  }

  out += '.body {\n';
  out += '  font-family: var(--font-sans);\n';
  out += `  font-size: ${baseRem}rem;\n`;
  out += '  color: var(--color-foreground);\n';
  out += '  line-height: 1.625;\n';
  out += '}\n\n';

  out += '.body-sm {\n';
  out += '  font-family: var(--font-sans);\n';
  out += `  font-size: ${(baseRem * Math.pow(ratio, -1)).toFixed(4)}rem;\n`;
  out += '  color: var(--color-foreground);\n';
  out += '  line-height: 1.625;\n';
  out += '}\n\n';

  out += '.body-lg {\n';
  out += '  font-family: var(--font-sans);\n';
  out += `  font-size: ${(baseRem * Math.pow(ratio, 1)).toFixed(4)}rem;\n`;
  out += '  color: var(--color-foreground);\n';
  out += '  line-height: 1.625;\n';
  out += '}\n\n';

  out += '.caption {\n';
  out += '  font-family: var(--font-sans);\n';
  out += `  font-size: ${(baseRem * Math.pow(ratio, -2)).toFixed(4)}rem;\n`;
  out += '  color: var(--color-muted-foreground);\n';
  out += '}\n\n';

  out += '.code {\n';
  out += '  font-family: var(--font-mono);\n';
  out += `  font-size: ${(baseRem * Math.pow(ratio, -1)).toFixed(4)}rem;\n`;
  out += '  background-color: var(--color-muted);\n';
  out += '  border-radius: var(--radius-sm);\n';
  out += '  padding: 0.125rem 0.375rem;\n';
  out += '}\n';

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

  console.log(`Reading ${jsonPath}...`);
  const raw: unknown = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const config = EngineSchema.parse(raw);
  console.log(`✓ Validated: ${config.projectName} engine config (${Object.keys(config.colors).length} colors)`);

  // Ensure output directories
  const dirs = [
    generatedDir,
    path.join(generatedDir, 'tokens'),
    path.join(generatedDir, 'utilities'),
    path.join(generatedDir, 'variants'),
    path.join(generatedDir, 'components'),
  ];
  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true });
  }

  // Generate all files
  const files: { rel: string; content: string }[] = [
    // Tokens
    { rel: 'tokens/colors.css', content: generateColorsCSS(config) },
    { rel: 'tokens/typography.css', content: generateTypographyCSS(config) },
    { rel: 'tokens/spacing.css', content: generateSpacingCSS(config) },
    { rel: 'tokens/effects.css', content: generateEffectsCSS(config) },
    { rel: 'tokens/motion.css', content: generateMotionCSS(config) },
    // Utilities
    { rel: 'utilities/layout.css', content: generateLayoutUtilitiesCSS(config) },
    { rel: 'utilities/flexgrid.css', content: generateFlexgridUtilitiesCSS(config) },
    { rel: 'utilities/typography.css', content: generateTypographyUtilitiesCSS(config) },
    { rel: 'utilities/effects.css', content: generateEffectsUtilitiesCSS(config) },
    { rel: 'utilities/interactivity.css', content: generateInteractivityUtilitiesCSS(config) },
    // Variants
    { rel: 'variants/custom.css', content: generateVariantsCSS(config) },
    // Components
    { rel: 'components/button.css', content: generateButtonComponentCSS(config) },
    { rel: 'components/card.css', content: generateCardComponentCSS(config) },
    { rel: 'components/input.css', content: generateInputComponentCSS(config) },
    { rel: 'components/badge.css', content: generateBadgeComponentCSS(config) },
    { rel: 'components/typography.css', content: generateTypographyComponentCSS(config) },
  ];

  // Breakpoints/containers (only if provided)
  const bpContent = generateBreakpointsCSS(config);
  if (bpContent) {
    files.push({ rel: 'tokens/breakpoints.css', content: bpContent });
  }

  // Write files
  for (const f of files) {
    const filePath = path.join(generatedDir, f.rel);
    fs.writeFileSync(filePath, f.content, 'utf-8');
    console.log(`  ✓ ${f.rel}`);
  }

  // Write barrel index.css
  const indexContent = `${files
    .map(f => `@import './generated/${f.rel}';`)
    .join('\n')}\n`;
  const indexPath = path.join(resolvedDir, 'index.css');
  fs.writeFileSync(indexPath, indexContent, 'utf-8');
  console.log(`  ✓ index.css (barrel)`);

  console.log(`\n✅ Generated ${files.length} CSS files for ${config.projectName} design system.`);
}

try {
  main();
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  console.error('❌ Engine generation failed:', message);
  process.exit(1);
}
/* eslint-enable no-console, security/detect-non-literal-fs-filename */
