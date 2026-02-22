#!/usr/bin/env node
/**
 * generate-manifest.mjs — Produces canon-manifest.json
 *
 * Computes SHA-256 checksums of all registry, port, and taxonomy files
 * so downstream consumers can verify they are running against a known
 * canon version. Run after any registry change.
 *
 * Usage:  node scripts/generate-manifest.mjs
 * Output: packages/canon/canon-manifest.json
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const CANON_ROOT = resolve(import.meta.dirname, '..');
const SRC = join(CANON_ROOT, 'src');

/** Files/dirs whose content is checksummed for integrity. */
const MANIFEST_TARGETS = [
  'src/registries/domain-intent-registry.ts',
  'src/registries/domain-taxonomy.ts',
  'src/registries/shared-kernel-registry.ts',
  'src/registries/overlay-activation.ts',
  'src/registries/entity-contracts.data.ts',
  'src/registries/entity-contracts-comprehensive.data.ts',
  'src/registries/entity-contracts-generated.data.ts',
  'src/registries/capability-registry.ts',
  'src/types/domain-intent.ts',
  'src/types/domain-context.ts',
  'src/types/domain-error.ts',
  'src/types/domain-event.ts',
  'src/types/domain-result.ts',
  'src/types/branded.ts',
  'src/types/entity.ts',
  'src/types/action.ts',
  'src/types/capability.ts',
  'src/ports/index.ts',
  'src/index.ts',
];

function sha256(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

function collectPortFiles() {
  const portsDir = join(SRC, 'ports');
  try {
    return readdirSync(portsDir)
      .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
      .map((f) => `src/ports/${f}`);
  } catch {
    return [];
  }
}

function countIntentTypes(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const matches = content.match(/\|\s*\{\s*type:\s*'/g);
  return matches ? matches.length : 0;
}

function countRegistryEntries(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const matches = content.match(/^\s+'[\w.-]+'\s*:\s*\{/gm);
  return matches ? matches.length : 0;
}

// ── Main ──────────────────────────────────────────────────

const allTargets = [...new Set([...MANIFEST_TARGETS, ...collectPortFiles()])].sort();

const files = {};
for (const rel of allTargets) {
  const abs = join(CANON_ROOT, rel);
  try {
    const stat = statSync(abs);
    const content = readFileSync(abs, 'utf8');
    files[rel] = {
      sha256: sha256(content),
      size: stat.size,
    };
  } catch {
    files[rel] = { sha256: null, size: 0, missing: true };
  }
}

const intentFile = join(CANON_ROOT, 'src/types/domain-intent.ts');
const registryFile = join(CANON_ROOT, 'src/registries/domain-intent-registry.ts');
const taxonomyFile = join(CANON_ROOT, 'src/registries/domain-taxonomy.ts');

const intentCount = countIntentTypes(intentFile);
const registryCount = countRegistryEntries(registryFile);

const taxonomyContent = readFileSync(taxonomyFile, 'utf8');
const declaredIntentCount = Number(taxonomyContent.match(/INTENT_COUNT\s*=\s*(\d+)/)?.[1] ?? 0);
const declaredPackageCount = Number(taxonomyContent.match(/DOMAIN_PACKAGE_COUNT\s*=\s*(\d+)/)?.[1] ?? 0);

const manifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  summary: {
    intentUnionMembers: intentCount,
    registryEntries: registryCount,
    declaredIntentCount,
    declaredPackageCount,
    filesChecksummed: Object.keys(files).length,
    integrityOk:
      intentCount === declaredIntentCount && registryCount === intentCount,
  },
  files,
};

const outPath = join(CANON_ROOT, 'canon-manifest.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

const ok = manifest.summary.integrityOk ? '✅' : '❌';
console.log(`${ok} canon-manifest.json generated`);
console.log(`   Intent union members: ${intentCount}`);
console.log(`   Registry entries:     ${registryCount}`);
console.log(`   INTENT_COUNT:         ${declaredIntentCount}`);
console.log(`   DOMAIN_PACKAGE_COUNT: ${declaredPackageCount}`);
console.log(`   Files checksummed:    ${manifest.summary.filesChecksummed}`);

if (!manifest.summary.integrityOk) {
  console.error('\n⚠️  Integrity mismatch — intent count, registry entries, or INTENT_COUNT are out of sync.');
  process.exit(1);
}
