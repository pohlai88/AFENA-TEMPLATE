/**
 * Meta scan cache — cache capability surface scan by file mtime.
 * Invalidates when any scanned file changes. Store in .afenda/.cache/meta-scan.json.
 */

import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

import fg from 'fast-glob';

import { scanSurfaces } from './collectors/surface-scanner';

import type { ScanResult } from './collectors/surface-scanner';

const CACHE_DIR = '.afenda/.cache';
const CACHE_FILE = 'meta-scan.json';

const SURFACE_GLOBS = [
  'apps/web/app/actions/**/*.ts',
  'apps/web/app/api/**/route.ts',
  'packages/*/src/**/handlers/*.ts',
  'packages/*/src/engine.ts',
  'apps/web/app/**/surface.ts',
];

interface CacheEntry {
  signature: string;
  cachedAt: string;
  result: ScanResult;
}

function computeSignature(repoRoot: string, fileStats: { path: string; mtimeMs: number }[]): string {
  const payload = fileStats
    .map((f) => `${f.path}:${f.mtimeMs}`)
    .sort()
    .join('\n');
  return createHash('sha256').update(payload).digest('hex');
}

async function getScannedFileStats(repoRoot: string): Promise<{ path: string; mtimeMs: number }[]> {
  const absRoot = repoRoot.replace(/\\/g, '/');
  const files = await fg(SURFACE_GLOBS, { cwd: repoRoot, absolute: true });
  const stats: { path: string; mtimeMs: number }[] = [];
  for (const absPath of files) {
    try {
      const stat = statSync(absPath);
      const relPath = absPath.replace(/\\/g, '/').replace(`${absRoot}/`, '');
      stats.push({ path: relPath, mtimeMs: stat.mtimeMs });
    } catch {
      // File may have been deleted
    }
  }
  return stats;
}

function getCachePath(repoRoot: string): string {
  return join(repoRoot, CACHE_DIR, CACHE_FILE);
}

function loadCache(cachePath: string): CacheEntry | null {
  if (!existsSync(cachePath)) return null;
  try {
    const raw = readFileSync(cachePath, 'utf-8');
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

function saveCache(cachePath: string, entry: CacheEntry): void {
  const dir = dirname(cachePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(cachePath, JSON.stringify(entry, null, 0), 'utf-8');
}

/**
 * Scan surfaces with caching. Uses file mtimes to invalidate cache.
 * Set AFENDA_META_NO_CACHE=1 to bypass cache.
 */
export async function scanSurfacesWithCache(repoRoot: string): Promise<ScanResult> {
  if (process.env.AFENDA_META_NO_CACHE === '1') {
    return scanSurfaces(repoRoot);
  }

  const fileStats = await getScannedFileStats(repoRoot);
  const signature = computeSignature(repoRoot, fileStats);
  const cachePath = getCachePath(repoRoot);
  const cached = loadCache(cachePath);

  if (cached && cached.signature === signature) {
    return cached.result;
  }

  const result = await scanSurfaces(repoRoot);
  const entry: CacheEntry = {
    signature,
    cachedAt: new Date().toISOString(),
    result,
  };
  saveCache(cachePath, entry);
  return result;
}
