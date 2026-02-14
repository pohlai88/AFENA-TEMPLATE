import type { Method } from './types';

// Hard rules from the spec:
export function assertCanonicalTokenPath(path: string): void {
  // No express tokens
  if (path.includes(':')) throw new Error(`Path contains ":" token: ${path}`);
  // No OpenAPI tokens in code/manifest
  if (path.includes('{') || path.includes('}')) throw new Error(`Path contains "{ }" token: ${path}`);
  // Must start with /api/
  if (!path.startsWith('/api/')) throw new Error(`Path must start with /api/: ${path}`);
}

export function assertMethodsNonEmpty(methods: readonly Method[]): void {
  if (!methods.length) throw new Error('methods must be non-empty');
}

export function overlap(a: readonly string[], b: readonly string[]): string[] {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x));
}

/** Convert canonical Next token path to OpenAPI path form. Hard-fails on : tokens. */
export function toOpenApiPath(canonicalPath: string): string {
  assertCanonicalTokenPath(canonicalPath);
  return canonicalPath.replaceAll('[', '{').replaceAll(']', '}');
}
