import path from 'node:path';

/**
 * Resolves path within root. Throws if target escapes root.
 * Cross-platform; safe against prefix collisions.
 */
export function resolveWithin(root: string, ...segments: string[]): string {
  const rootAbs = path.resolve(root);
  const targetAbs = path.resolve(rootAbs, ...segments);
  const rel = path.relative(rootAbs, targetAbs);

  // If rel starts with '..' or is absolute, it escaped the root.
  if (rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel))) {
    return targetAbs;
  }

  throw new Error(`Path escape detected: ${targetAbs}`);
}

/** Convert absolute path to segments relative to root. Throws if path escapes root. */
export function absolutePathToSegments(root: string, absolutePath: string): string[] {
  const rootAbs = path.resolve(root);
  const targetAbs = path.resolve(absolutePath);
  const rel = path.relative(rootAbs, targetAbs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path escape detected: ${absolutePath}`);
  }
  return rel.split(/[/\\]/).filter(Boolean);
}
