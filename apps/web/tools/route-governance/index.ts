// Bootstrap env so route imports (→ entity-route-handlers → auth/db) don't fail in CI
const ciEnv: Record<string, string> = {
  DATABASE_URL: 'postgresql://ci:ci@localhost:5432/ci_route_governance',
  NEON_AUTH_BASE_URL: 'https://ci.example.com',
  NEON_AUTH_COOKIE_SECRET: 'ci-route-governance-dummy-secret-min-32-chars',
};
for (const [k, v] of Object.entries(ciEnv)) {
  process.env[k] ??= v;
}

import { loadManifest } from './load-manifest';
import {
  loadOpenApiFromGenerator,
  assertOpenApiMatchesManifest,
} from './openapi-check';
import { assertCanonicalTokenPath, overlap } from './rules';
import { scanRouteFiles } from './scan-routes';

import type { RouteFileEntry } from '../../src/lib/api/route-types';

function fail(msg: string): never {
  throw new Error(`[route-governance] ${msg}`);
}

function keyPath(e: RouteFileEntry): string {
  return e.path;
}

function keyFile(e: RouteFileEntry): string {
  return e.file.replaceAll('\\', '/');
}

function deepEqualSubsetManifestVsMeta(e: RouteFileEntry, meta: unknown): void {
  const m = meta as Record<string, unknown>;
  const expected = {
    path: e.path,
    methods: e.methods,
    tier: e.tier,
    exposeInOpenApi: e.exposeInOpenApi,
    ...(e.tier === 'contract' ? { version: e.version } : {}),
  };

  const same =
    m.path === expected.path &&
    Array.isArray(m.methods) &&
    m.methods.length === expected.methods.length &&
    (expected.methods as string[]).every((x, i) => m.methods[i] === x) &&
    m.tier === expected.tier &&
    m.exposeInOpenApi === expected.exposeInOpenApi &&
    (expected as Record<string, unknown>).version === m.version;

  if (!same) {
    fail(
      `ROUTE_META mismatch for ${e.file}\nExpected: ${JSON.stringify(expected)}\nActual:   ${JSON.stringify(meta)}`,
    );
  }
}

function assertManifestUniqueness(manifest: RouteFileEntry[]): void {
  const files = new Map<string, RouteFileEntry>();
  for (const e of manifest) {
    const f = keyFile(e);
    if (files.has(f)) fail(`Manifest duplicate file entry: ${f}`);
    files.set(f, e);
  }

  const paths = new Map<string, RouteFileEntry>();
  for (const e of manifest) {
    const p = keyPath(e);
    if (paths.has(p)) fail(`Manifest duplicate path entry: ${p}`);
    paths.set(p, e);
  }

  const byPath = new Map<string, RouteFileEntry[]>();
  for (const e of manifest) {
    const p = keyPath(e);
    byPath.set(p, [...(byPath.get(p) ?? []), e]);
  }
  for (const [p, entries] of byPath) {
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const ov = overlap(entries[i].methods, entries[j].methods);
        if (ov.length) fail(`Manifest method overlap for path ${p}: ${ov.join(', ')}`);
      }
    }
  }
}

function assertWebhookKindRules(manifest: RouteFileEntry[]): void {
  for (const e of manifest) {
    if (e.kind === 'webhook') {
      if (e.methods.length !== 1 || e.methods[0] !== 'POST') {
        fail(`Webhook kind must be POST-only: ${e.path} has methods=${e.methods.join(',')}`);
      }
      if (e.tier !== 'contract') {
        fail(`Webhook kind must be contract tier (per spec): ${e.path} tier=${e.tier}`);
      }
    }
  }
}

function assertCanonicalTokensEverywhere(manifest: RouteFileEntry[]): void {
  for (const e of manifest) assertCanonicalTokenPath(e.path);
}

export async function main(): Promise<void> {
  const manifest = await loadManifest();

  assertManifestUniqueness(manifest);
  assertWebhookKindRules(manifest);
  assertCanonicalTokensEverywhere(manifest);

  const scanned = await scanRouteFiles();

  const manifestByFile = new Map<string, RouteFileEntry>();
  for (const e of manifest) manifestByFile.set(keyFile(e), e);

  for (const r of scanned) {
    const rel = r.file.replaceAll('\\', '/');
    const m = manifestByFile.get(rel);
    if (!m) fail(`Route file not present in manifest: ${rel}`);

    const exported = [...r.exportedHandlers].sort();
    const metaMethods = [...r.meta.methods].sort();

    if (exported.join(',') !== metaMethods.join(',')) {
      fail(
        `Handler exports do not match ROUTE_META.methods in ${rel}\nHandlers: ${exported.join(',')}\nMeta:     ${metaMethods.join(',')}`,
      );
    }

    deepEqualSubsetManifestVsMeta(m, r.meta);
  }

  const scannedSet = new Set(scanned.map((s) => s.file.replaceAll('\\', '/')));
  for (const e of manifest) {
    if (!scannedSet.has(keyFile(e))) {
      fail(`Manifest entry points to missing route file: ${e.file}`);
    }
  }

  const spec = await loadOpenApiFromGenerator(manifest);
  assertOpenApiMatchesManifest(spec, manifest);

  console.log(
    `[route-governance] OK (${manifest.length} manifest entries, ${scanned.length} route files)`,
  );
}

main().catch((err) => {
  console.error(String(err?.stack ?? err));
  process.exit(1);
});
