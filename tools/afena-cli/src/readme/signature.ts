import { createHash } from 'crypto';

import { safeExists, safeMkdir, safeReadFile, safeWriteFile } from '../core/fs-safe';

import { TEMPLATE_VERSION } from './templates';

import type { ReadmeCanonModel } from '../types';

export const GENERATOR_VERSION = '1';

/**
 * Recursively sort all object keys for deterministic JSON output.
 * Arrays are preserved in order (caller must pre-sort).
 */
function sortKeys(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  if (typeof value === 'object') {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[key] = sortKeys((value as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return value;
}

/**
 * Compute a deterministic SHA-256 signature for a Canon README model.
 * Includes templateId, template version, and generator version in the hash.
 */
export function computeReadmeSignature(model: ReadmeCanonModel): string {
  const payload = {
    model: sortKeys(model),
    templateId: model.identity.packageType,
    templateVersion: TEMPLATE_VERSION,
    generatorVersion: GENERATOR_VERSION,
  };
  const json = JSON.stringify(sortKeys(payload));
  return `sha256:${createHash('sha256').update(json).digest('hex')}`;
}

/**
 * Derive the .sig filename from a package's relative path.
 * e.g. "packages/ui" -> "packages__ui.sig"
 */
function sigFilename(pkgDir: string): string {
  return `${pkgDir.replace(/\//g, '__')}.sig`;
}

/**
 * Load a previously stored signature for a package.
 */
export function loadReadmeSignature(
  pkgDir: string,
  repoRoot: string
): string | null {
  const sigFile = sigFilename(pkgDir);
  if (!safeExists(repoRoot, '.afena', 'readme', sigFile)) return null;
  try {
    return safeReadFile(repoRoot, '.afena', 'readme', sigFile).trim();
  } catch {
    return null;
  }
}

/**
 * Save a signature for a package to the cache.
 */
export function saveReadmeSignature(
  pkgDir: string,
  repoRoot: string,
  sig: string
): void {
  safeMkdir(repoRoot, '.afena', 'readme');
  safeWriteFile(repoRoot, `${sig}\n`, '.afena', 'readme', sigFilename(pkgDir));
}
