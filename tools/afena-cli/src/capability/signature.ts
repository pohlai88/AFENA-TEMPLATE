import { statSync, existsSync } from 'fs';
import { join } from 'path';

import fg from 'fast-glob';

import { toPosix } from '../core/paths';

interface FileSignature {
  path: string;
  mtime: number;
  size: number;
}

/**
 * Compute a fast signature from file mtimes and sizes.
 * Does NOT hash lockfile contents — uses mtime+size for speed.
 */
export function computeSignature(repoRoot: string): string {
  const parts: FileSignature[] = [];

  // pnpm-lock.yaml mtime + size
  addFileSig(parts, repoRoot, 'pnpm-lock.yaml');

  // All workspace package.json files
  const pkgJsons = fg.sync(
    ['apps/*/package.json', 'packages/*/package.json', 'tools/*/package.json'],
    { cwd: repoRoot, absolute: true }
  );
  for (const p of pkgJsons.sort()) {
    addFileSig(parts, repoRoot, toPosix(p.replace(repoRoot.replace(/\\/g, '/'), '').replace(/^\//, '')));
  }

  // afena.registry.json
  addFileSig(parts, repoRoot, 'afena.registry.json');

  // .afenarc config files
  for (const name of ['.afenarc.json', '.afenarc.yaml', 'afena.config.js']) {
    addFileSig(parts, repoRoot, name);
  }

  return parts
    .map((f) => `${f.path}:${f.mtime}:${f.size}`)
    .join('|');
}

function addFileSig(
  parts: FileSignature[],
  repoRoot: string,
  relativePath: string
): void {
  const fullPath = join(repoRoot, relativePath);
  if (existsSync(fullPath)) {
    const stat = statSync(fullPath);
    parts.push({
      path: toPosix(relativePath),
      mtime: Math.floor(stat.mtimeMs),
      size: stat.size,
    });
  }
}
