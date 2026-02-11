import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { DiscoveryOutput } from '../types';

/**
 * Load the previous discovery output from .afena/discovery.json.
 * Returns null if not found or invalid.
 */
export function loadPreviousDiscovery(
  repoRoot: string
): DiscoveryOutput | null {
  const filePath = join(repoRoot, '.afena', 'discovery.json');
  if (!existsSync(filePath)) return null;

  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as DiscoveryOutput;
  } catch {
    return null;
  }
}

/**
 * Load the previous signature from .afena/last-signature.
 */
export function loadPreviousSignature(repoRoot: string): string | null {
  const filePath = join(repoRoot, '.afena', 'last-signature');
  if (!existsSync(filePath)) return null;

  try {
    return readFileSync(filePath, 'utf-8').trim();
  } catch {
    return null;
  }
}

/**
 * Check if discovery output has meaningful changes compared to previous.
 */
export function hasContentChanged(
  current: DiscoveryOutput,
  previous: DiscoveryOutput | null
): boolean {
  if (!previous) return true;
  return current.contentHash !== previous.contentHash;
}

/**
 * Check if there are new warnings compared to previous discovery.
 */
export function hasNewWarnings(
  current: DiscoveryOutput,
  previous: DiscoveryOutput | null
): boolean {
  if (!previous) {
    return current.ungrouped.length > 0 || current.missingReadmes.length > 0 || current.staleReadmes.length > 0;
  }

  const prevSources = new Set(previous.ungrouped.map((u: { source: string }) => u.source));
  const newUngrouped = current.ungrouped.some((u: { source: string }) => !prevSources.has(u.source));

  const prevMissing = new Set(previous.missingReadmes);
  const newMissing = current.missingReadmes.some((m: string) => !prevMissing.has(m));

  const prevStale = new Set(previous.staleReadmes);
  const newStale = current.staleReadmes.some((s: string) => !prevStale.has(s));

  return newUngrouped || newMissing || newStale;
}
