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

import {
  WRITE_BOUNDARY_PATTERNS,
  CAPABILITIES_REGEX,
  JSDOC_CAPABILITY_REGEX,
  SURFACE_GLOBS,
} from '../shared/patterns';

export interface MutationBoundary {
  file: string;
  patterns: string[];
  hasCapabilities: boolean;
  hasJsDocCapability: boolean;
}

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
      .replace(`${repoRoot.replace(/\\/g, '/')  }/`, '');

    results.push({
      file: relPath,
      patterns: matched,
      hasCapabilities: CAPABILITIES_REGEX.test(content),
      hasJsDocCapability: JSDOC_CAPABILITY_REGEX.test(content),
    });
  }

  return results;
}
