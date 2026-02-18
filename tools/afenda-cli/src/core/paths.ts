import { existsSync } from 'fs';
import { resolve, relative, dirname, join } from 'path';

/**
 * Normalize a path to POSIX format (forward slashes).
 * Never stores absolute paths — always relative to repo root.
 */
export function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * Convert an absolute path to a POSIX-normalized path relative to the repo root.
 */
export function toRelativePosix(absolutePath: string, repoRoot: string): string {
  return toPosix(relative(repoRoot, absolutePath));
}

/**
 * Resolve a relative POSIX path to an absolute OS path from the repo root.
 */
export function fromRelativePosix(relativePosix: string, repoRoot: string): string {
  return resolve(repoRoot, relativePosix);
}

/**
 * Find the monorepo root by walking up from cwd looking for pnpm-workspace.yaml.
 */
export function findRepoRoot(startDir?: string): string {
  let dir = startDir ?? process.cwd();
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error('Could not find monorepo root (no pnpm-workspace.yaml found)');
    }
    dir = parent;
  }
}
