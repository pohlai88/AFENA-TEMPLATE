import { createHash } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
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
  return pkgDir.replace(/\//g, '__') + '.sig';
}

/**
 * Load a previously stored signature for a package.
 */
export function loadReadmeSignature(
  pkgDir: string,
  repoRoot: string
): string | null {
  const sigPath = join(repoRoot, '.afena', 'readme', sigFilename(pkgDir));
  if (!existsSync(sigPath)) return null;
  try {
    return readFileSync(sigPath, 'utf-8').trim();
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
  const sigDir = join(repoRoot, '.afena', 'readme');
  mkdirSync(sigDir, { recursive: true });
  const sigPath = join(sigDir, sigFilename(pkgDir));
  writeFileSync(sigPath, sig + '\n', 'utf-8');
}
