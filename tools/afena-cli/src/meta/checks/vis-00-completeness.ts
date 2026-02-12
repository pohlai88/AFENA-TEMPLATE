/**
 * VIS-00 — Canon Completeness for Mutations.
 * No state mutation exists without a capability key.
 *
 * Scope: Only enforced inside surface boundary folders (actions, API routes,
 * handlers, engine entrypoints). Never fires on internal helpers.
 */

import { readFileSync } from 'fs';
import fg from 'fast-glob';
import type { CapabilityException } from 'afena-canon';
import { findException } from '../exceptions';

export interface Vis00Violation {
  file: string;
  reason: string;
  exceptionId?: string;
}

const WRITE_BOUNDARY_PATTERNS = [
  /mutate\s*\(/,
  /db\.insert\s*\(/,
  /db\.update\s*\(/,
  /db\.delete\s*\(/,
  /db\.transaction\s*\(/,
  /tx\.\w+\s*\(/,
  /\.execute\s*\(/,
];

const CAPABILITIES_REGEX =
  /export\s+const\s+CAPABILITIES\s*=\s*\[([^\]]*)\]\s*as\s+const/s;

const JSDOC_CAPABILITY_REGEX = /@capability\s+[\w.]+/;

const EXCEPTION_POINTER_REGEX =
  /@capability:ignore\s+VIS-00\s+exceptionId="([^"]+)"/;

function hasWriteBoundary(content: string): boolean {
  return WRITE_BOUNDARY_PATTERNS.some((re) => re.test(content));
}

function hasCapabilityAnnotation(content: string): boolean {
  return CAPABILITIES_REGEX.test(content) || JSDOC_CAPABILITY_REGEX.test(content);
}

/**
 * Run VIS-00 check across all surface boundary files.
 * Returns violations for files with write boundaries but no capability annotation.
 */
export async function checkVis00(
  repoRoot: string,
  exceptions: CapabilityException[],
): Promise<Vis00Violation[]> {
  const violations: Vis00Violation[] = [];

  const surfaceFiles = await fg(
    [
      'apps/web/app/actions/**/*.ts',
      'apps/web/app/api/**/route.ts',
      'packages/*/src/**/handlers/*.ts',
      'packages/*/src/engine.ts',
    ],
    { cwd: repoRoot, absolute: true },
  );

  for (const absPath of surfaceFiles) {
    const content = readFileSync(absPath, 'utf-8');

    if (!hasWriteBoundary(content)) continue;
    if (hasCapabilityAnnotation(content)) continue;

    const relPath = absPath.replace(/\\/g, '/').replace(repoRoot.replace(/\\/g, '/') + '/', '');

    // Check for inline exception pointer
    const pointerMatch = content.match(EXCEPTION_POINTER_REGEX);
    if (pointerMatch) {
      const pointerId = pointerMatch[1];
      const exc = exceptions.find((e) => e.id === pointerId);
      if (exc) {
        violations.push({
          file: relPath,
          reason: `Write boundary without CAPABILITIES — excepted by ${pointerId}`,
          exceptionId: pointerId,
        });
        continue;
      }
      // Pointer without matching authority = error
      violations.push({
        file: relPath,
        reason: `Write boundary without CAPABILITIES — inline pointer "${pointerId}" has no matching exception`,
      });
      continue;
    }

    // Check for file-level exception
    const exc = findException(exceptions, '*', 'VIS-00', relPath);
    if (exc) {
      continue; // Excepted at file level
    }

    violations.push({
      file: relPath,
      reason: 'Write boundary detected without CAPABILITIES annotation',
    });
  }

  return violations;
}
