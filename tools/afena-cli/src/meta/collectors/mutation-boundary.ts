/**
 * Mutation boundary detector — detects write boundaries in surface files.
 *
 * Standalone collector that identifies files with write operations
 * (mutate(), db.insert, db.update, db.delete, db.transaction, .execute)
 * but no capability annotation.
 *
 * Used by VIS-00 and autofix to find files needing CAPABILITIES const.
 */

import { readFileSync } from 'fs';
import fg from 'fast-glob';

export interface MutationBoundary {
  file: string;
  patterns: string[];
  hasCapabilities: boolean;
  hasJsDocCapability: boolean;
}

const WRITE_BOUNDARY_PATTERNS: { regex: RegExp; label: string }[] = [
  { regex: /mutate\s*\(/, label: 'mutate()' },
  { regex: /db\.insert\s*\(/, label: 'db.insert()' },
  { regex: /db\.update\s*\(/, label: 'db.update()' },
  { regex: /db\.delete\s*\(/, label: 'db.delete()' },
  { regex: /db\.transaction\s*\(/, label: 'db.transaction()' },
  { regex: /tx\.\w+\s*\(/, label: 'tx.*()' },
  { regex: /\.execute\s*\(/, label: '.execute()' },
];

const CAPABILITIES_REGEX =
  /export\s+const\s+CAPABILITIES\s*=\s*\[([^\]]*)\]\s*as\s+const/s;

const JSDOC_CAPABILITY_REGEX = /@capability\s+[\w.]+/;

const SURFACE_GLOBS = [
  'apps/web/app/actions/**/*.ts',
  'apps/web/app/api/**/route.ts',
  'packages/*/src/**/handlers/*.ts',
  'packages/*/src/engine.ts',
];

/**
 * Detect mutation boundaries across all surface files.
 * Returns files that contain write operations, with metadata about annotations.
 */
export async function detectMutationBoundaries(
  repoRoot: string,
): Promise<MutationBoundary[]> {
  const results: MutationBoundary[] = [];

  const surfaceFiles = await fg(SURFACE_GLOBS, {
    cwd: repoRoot,
    absolute: true,
  });

  for (const absPath of surfaceFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const matched: string[] = [];

    for (const { regex, label } of WRITE_BOUNDARY_PATTERNS) {
      if (regex.test(content)) {
        matched.push(label);
      }
    }

    if (matched.length === 0) continue;

    const relPath = absPath
      .replace(/\\/g, '/')
      .replace(repoRoot.replace(/\\/g, '/') + '/', '');

    results.push({
      file: relPath,
      patterns: matched,
      hasCapabilities: CAPABILITIES_REGEX.test(content),
      hasJsDocCapability: JSDOC_CAPABILITY_REGEX.test(content),
    });
  }

  return results;
}
