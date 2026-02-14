import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { assertCanonicalTokenPath, assertMethodsNonEmpty } from './rules';

import type { RouteFileEntry } from '../../src/lib/api/route-types';

const MANIFEST_PATH = path.resolve(process.cwd(), 'src/lib/api/route-manifest.ts');

export async function loadManifest(): Promise<RouteFileEntry[]> {
  const mod = await import(pathToFileURL(MANIFEST_PATH).toString());
  const manifest: RouteFileEntry[] | undefined = mod.ROUTE_MANIFEST ?? mod.default;

  if (!manifest || !Array.isArray(manifest)) {
    throw new Error(
      `route-manifest must export ROUTE_MANIFEST array (or default export): ${MANIFEST_PATH}`,
    );
  }

  // Basic schema checks
  for (const e of manifest) {
    if (!e.file || !e.path || !e.tier || !e.kind)
      throw new Error(`Manifest entry missing required fields: ${JSON.stringify(e)}`);
    assertCanonicalTokenPath(e.path);
    assertMethodsNonEmpty(e.methods);
  }

  return manifest;
}
