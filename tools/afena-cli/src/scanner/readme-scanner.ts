import { existsSync, statSync } from 'fs';
import { join } from 'path';
import fg from 'fast-glob';
import { toPosix } from '../utils/paths';
import type { AfenaConfig } from '../types';

/**
 * Scan for packages missing README.md or with stale READMEs.
 */
export function scanReadmes(
  repoRoot: string,
  config: AfenaConfig
): { missing: string[]; stale: string[] } {
  const { ignore, required } = config.docs.readme;
  const ignoreSet = new Set(ignore.map((p: string) => toPosix(p)));
  const staleThreshold = config.discovery.staleThresholdSeconds * 1000;

  // Find all workspace package directories
  const pkgJsons: string[] = fg.sync(
    ['apps/*/package.json', 'packages/*/package.json'],
    { cwd: repoRoot, absolute: false }
  );

  const missing: string[] = [];
  const stale: string[] = [];

  for (const pkgJson of pkgJsons.sort()) {
    const pkgDir = toPosix(pkgJson).replace('/package.json', '');

    // Skip ignored packages
    if (ignoreSet.has(pkgDir)) continue;

    const readmePath = join(repoRoot, pkgDir, 'README.md');

    if (!existsSync(readmePath)) {
      missing.push(pkgDir);
      continue;
    }

    // Check staleness: compare README mtime against source files
    try {
      const readmeStat = statSync(readmePath);
      const readmeMtime = readmeStat.mtimeMs;

      const latestSourceMtime = getLatestSourceMtime(repoRoot, pkgDir);
      if (latestSourceMtime === null) continue;

      if (latestSourceMtime - readmeMtime > staleThreshold) {
        stale.push(pkgDir);
      }
    } catch {
      // If we can't stat, skip staleness check
    }
  }

  // Also check required packages that might not be in workspace globs
  for (const req of required) {
    const posixReq = toPosix(req);
    if (!missing.includes(posixReq) && !stale.includes(posixReq)) {
      const readmePath = join(repoRoot, posixReq, 'README.md');
      if (!existsSync(readmePath)) {
        missing.push(posixReq);
      }
    }
  }

  return { missing: missing.sort(), stale: stale.sort() };
}

/**
 * Get the latest mtime of source files in a package directory.
 * Checks src/**, package.json, and common entry points.
 */
function getLatestSourceMtime(repoRoot: string, pkgDir: string): number | null {
  const sourceFiles: string[] = fg.sync(
    [`${pkgDir}/src/**/*.{ts,tsx,js,jsx}`, `${pkgDir}/package.json`],
    { cwd: repoRoot, absolute: true, stats: false }
  );

  if (sourceFiles.length === 0) return null;

  let latest = 0;
  for (const file of sourceFiles) {
    try {
      const stat = statSync(file);
      if (stat.mtimeMs > latest) {
        latest = stat.mtimeMs;
      }
    } catch {
      // skip files we can't stat
    }
  }

  return latest > 0 ? latest : null;
}
