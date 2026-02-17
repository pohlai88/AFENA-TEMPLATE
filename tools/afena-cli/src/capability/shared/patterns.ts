/**
 * Shared patterns for capability scanning and mutation boundary detection.
 * Single source of truth — used by VIS-00, autofix, and mutation-boundary collector.
 */

export const WRITE_BOUNDARY_PATTERNS: { regex: RegExp; label: string }[] = [
  { regex: /mutate\s*\(/, label: 'mutate()' },
  { regex: /db\.insert\s*\(/, label: 'db.insert()' },
  { regex: /db\.update\s*\(/, label: 'db.update()' },
  { regex: /db\.delete\s*\(/, label: 'db.delete()' },
  { regex: /db\.transaction\s*\(/, label: 'db.transaction()' },
  { regex: /tx\.\w+\s*\(/, label: 'tx.*()' },
  { regex: /\.execute\s*\(/, label: '.execute()' },
];

export const CAPABILITIES_REGEX =
  /export\s+const\s+CAPABILITIES\s*=\s*\[([^\]]*)\]\s*as\s+const/s;

export const JSDOC_CAPABILITY_REGEX = /@capability\s+[\w.]+/;

export const SURFACE_GLOBS = [
  'apps/web/app/actions/**/*.ts',
  'apps/web/app/api/**/route.ts',
  'packages/*/src/**/handlers/*.ts',
  'packages/*/src/engine.ts',
];

export function hasWriteBoundary(content: string): boolean {
  return WRITE_BOUNDARY_PATTERNS.some(({ regex }) => regex.test(content));
}

export function hasCapabilityAnnotation(content: string): boolean {
  return CAPABILITIES_REGEX.test(content) || JSDOC_CAPABILITY_REGEX.test(content);
}
