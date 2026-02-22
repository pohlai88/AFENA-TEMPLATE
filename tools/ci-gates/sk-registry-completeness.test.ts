/**
 * CIG-06 — SHARED_KERNEL_REGISTRY Completeness
 *
 * Every build*Intent() call in finance domain packages must reference
 * an intent type that exists in SHARED_KERNEL_REGISTRY's writes arrays.
 *
 * This prevents intent types from being used in domain code without
 * being registered — which would break audit trail completeness and
 * registry-based CI gates.
 *
 * @see oss-finance-ext.md §5 CIG-06
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const MONOREPO_ROOT = resolve(__dirname, '../..');
const FINANCE_ROOT = resolve(MONOREPO_ROOT, 'business-domain/finance');
const SK_REGISTRY_PATH = resolve(
  MONOREPO_ROOT,
  'packages/canon/src/registries/shared-kernel-registry.ts',
);
const INTENT_REGISTRY_PATH = resolve(
  MONOREPO_ROOT,
  'packages/canon/src/registries/domain-intent-registry.ts',
);

function collectTsFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectTsFiles(full));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts') && !entry.endsWith('.spec.ts')) {
      results.push(full);
    }
  }
  return results;
}

/** Extract all intent types from SK registry writes arrays */
function extractSkWrites(): Set<string> {
  const source = readFileSync(SK_REGISTRY_PATH, 'utf-8');
  const writes = new Set<string>();
  // Match: writes: ['intent.type', 'another.type']
  const writesBlockRe = /writes:\s*\[([^\]]*)\]/g;
  let match: RegExpExecArray | null;
  while ((match = writesBlockRe.exec(source)) !== null) {
    const block = match[1]!;
    const intentRe = /'([^']+)'/g;
    let intentMatch: RegExpExecArray | null;
    while ((intentMatch = intentRe.exec(block)) !== null) {
      writes.add(intentMatch[1]!);
    }
  }
  return writes;
}

/** Extract all intent types from domain-intent-registry keys */
function extractIntentRegistryTypes(): Set<string> {
  const source = readFileSync(INTENT_REGISTRY_PATH, 'utf-8');
  const types = new Set<string>();
  // Match: 'intent.type': {
  const keyRe = /^\s*'([a-z][a-z0-9_.]+)':\s*\{/gm;
  let match: RegExpExecArray | null;
  while ((match = keyRe.exec(source)) !== null) {
    types.add(match[1]!);
  }
  return types;
}

/** Extract intent types from build*Intent function definitions in commands/ directories */
function extractUsedIntentTypes(): Array<{ pkg: string; file: string; intentType: string }> {
  const results: Array<{ pkg: string; file: string; intentType: string }> = [];

  const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
    const full = join(FINANCE_ROOT, entry);
    return statSync(full).isDirectory() && existsSync(join(full, 'package.json'));
  });

  for (const pkg of packages) {
    // Only scan commands/ directories — that's where build*Intent functions
    // define the actual DomainIntent type. Services use stableCanonicalJson
    // with type fields that are idempotency key components, not intent types.
    const commandsDir = join(FINANCE_ROOT, pkg, 'src', 'commands');
    if (!existsSync(commandsDir)) continue;

    const files = collectTsFiles(commandsDir);
    for (const filePath of files) {
      const source = readFileSync(filePath, 'utf-8');
      // Match: return { type: 'intent.type', ... } inside build*Intent functions
      const typeRe = /\{\s*type:\s*'([a-z][a-z0-9_.]+)'/g;
      let match: RegExpExecArray | null;
      while ((match = typeRe.exec(source)) !== null) {
        const intentType = match[1]!;
        if (intentType.includes('.')) {
          results.push({
            pkg,
            file: filePath.replace(FINANCE_ROOT, '').replace(/\\/g, '/'),
            intentType,
          });
        }
      }
    }
  }

  return results;
}

describe('gate.sk-registry-completeness — CIG-06', () => {
  const skWrites = extractSkWrites();
  const intentRegistryTypes = extractIntentRegistryTypes();

  it('SK registry has writes entries', () => {
    expect(skWrites.size).toBeGreaterThan(0);
  });

  it('domain-intent-registry has type entries', () => {
    expect(intentRegistryTypes.size).toBeGreaterThan(0);
  });

  it('every intent type in domain-intent-registry appears in at least one SK writes array', () => {
    const missing: string[] = [];
    for (const intentType of intentRegistryTypes) {
      if (!skWrites.has(intentType)) {
        missing.push(intentType);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `CIG-06: ${missing.length} intent types in domain-intent-registry not found in any SK writes array:\n` +
        missing.map((t) => `  - ${t}`).join('\n'),
      );
    }

    expect(missing).toEqual([]);
  });

  it('intent types used in finance build*Intent calls are registered in domain-intent-registry', () => {
    const usedTypes = extractUsedIntentTypes();
    const uniqueTypes = [...new Set(usedTypes.map((u) => u.intentType))];
    const unregistered: Array<{ intentType: string; locations: string[] }> = [];

    for (const intentType of uniqueTypes) {
      if (!intentRegistryTypes.has(intentType)) {
        const locations = usedTypes
          .filter((u) => u.intentType === intentType)
          .map((u) => `${u.pkg}${u.file}`);
        unregistered.push({ intentType, locations });
      }
    }

    if (unregistered.length > 0) {
      throw new Error(
        `CIG-06: ${unregistered.length} intent types used in finance code but not in domain-intent-registry:\n` +
        unregistered
          .map((u) => `  - '${u.intentType}' used in: ${u.locations.join(', ')}`)
          .join('\n'),
      );
    }

    expect(unregistered).toEqual([]);
  });

  it('intent types used in finance code appear in SK writes arrays', () => {
    const usedTypes = extractUsedIntentTypes();
    const uniqueTypes = [...new Set(usedTypes.map((u) => u.intentType))];
    const missing: Array<{ intentType: string; locations: string[] }> = [];

    for (const intentType of uniqueTypes) {
      if (!skWrites.has(intentType)) {
        const locations = usedTypes
          .filter((u) => u.intentType === intentType)
          .map((u) => `${u.pkg}${u.file}`);
        missing.push({ intentType, locations });
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `CIG-06: ${missing.length} intent types used in finance code but not in any SK writes array:\n` +
        missing
          .map((u) => `  - '${u.intentType}' used in: ${u.locations.join(', ')}`)
          .join('\n'),
      );
    }

    expect(missing).toEqual([]);
  });
});
