import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * RG-19 — Registry / Schema Coherence Gate
 *
 * Mechanically verifies that TABLE_REGISTRY in _registry.ts stays in sync
 * with the actual schema files and their contents. Prevents drift between
 * the registry metadata and the real schema definitions.
 *
 * Gates:
 *   RG-19-01: Every schema file has a registry entry (completeness)
 *   RG-19-02: Every registry entry has a schema file (no orphans)
 *   RG-19-03: Finance domain tables have required governance fields
 *   RG-19-04: Evidence tables do NOT have hasUpdatedAtTrigger
 *   RG-19-05: Truth tables have hasRls + hasTenant + hasCompositePk
 */

const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');
const REGISTRY_PATH = resolve(SCHEMA_DIR, '_registry.ts');

function getSchemaFileNames(): string[] {
  return readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith('.ts'))
    .filter((f) => f !== 'index.ts' && f !== '_registry.ts' && f !== 'relations.ts')
    .map((f) => f.replace('.ts', '').replace(/-/g, '_'));
}

function getRegistryKeys(): string[] {
  const content = readFileSync(REGISTRY_PATH, 'utf-8');
  const registryStart = content.indexOf('export const TABLE_REGISTRY');
  const registryEnd = content.indexOf('\n};', registryStart);
  if (registryStart === -1 || registryEnd === -1) return [];
  const registryBlock = content.slice(registryStart, registryEnd);
  const matches = registryBlock.match(/^\s{2}(\w+):\s*\{/gm);
  if (!matches) return [];
  return matches.map((m) => m.trim().replace(/:\s*\{$/, ''));
}

interface RegistryEntry {
  kind: string;
  hasRls: boolean;
  hasTenant: boolean;
  hasCompositePk: boolean;
  hasUpdatedAtTrigger: boolean;
  domain?: string;
  subdomain?: string;
  dataSensitivity?: string;
  retentionClass?: string;
  timeAxis?: string;
}

function parseRegistryEntries(): Record<string, RegistryEntry> {
  const content = readFileSync(REGISTRY_PATH, 'utf-8');
  const registryStart = content.indexOf('export const TABLE_REGISTRY');
  const registryEnd = content.indexOf('\n};', registryStart);
  const registryBlock = content.slice(registryStart, registryEnd);
  const entries: Record<string, RegistryEntry> = {};

  const entryRegex = /^\s{2}(\w+):\s*\{([^}]+)\}/gm;
  let match;
  while ((match = entryRegex.exec(registryBlock)) !== null) {
    const key = match[1]!;
    const body = match[2]!;

    const getBool = (name: string): boolean => {
      const m = body.match(new RegExp(`${name}:\\s*(true|false)`));
      return m ? m[1] === 'true' : false;
    };
    const getStr = (name: string): string | undefined => {
      const m = body.match(new RegExp(`${name}:\\s*'([^']+)'`));
      return m ? m[1] : undefined;
    };

    entries[key] = {
      kind: getStr('kind') ?? 'unknown',
      hasRls: getBool('hasRls'),
      hasTenant: getBool('hasTenant'),
      hasCompositePk: getBool('hasCompositePk'),
      hasUpdatedAtTrigger: getBool('hasUpdatedAtTrigger'),
      domain: getStr('domain'),
      subdomain: getStr('subdomain'),
      dataSensitivity: getStr('dataSensitivity'),
      retentionClass: getStr('retentionClass'),
      timeAxis: getStr('timeAxis'),
    };
  }
  return entries;
}

describe('RG-19: Registry / Schema Coherence', () => {
  const schemaFiles = getSchemaFileNames();
  const registryKeys = getRegistryKeys();
  const entries = parseRegistryEntries();

  test('RG-19-01: every schema file has a registry entry', () => {
    const unregistered = schemaFiles.filter((f) => !registryKeys.includes(f));
    expect(unregistered, `Unregistered schema files: ${unregistered.join(', ')}`).toEqual([]);
  });

  test('RG-19-02: no orphan registry entries (every entry has a schema file)', () => {
    const orphans = registryKeys.filter((k) => !schemaFiles.includes(k));
    expect(orphans, `Orphan registry entries: ${orphans.join(', ')}`).toEqual([]);
  });

  test('RG-19-03: finance domain tables have governance fields', () => {
    const missing: string[] = [];
    for (const [name, entry] of Object.entries(entries)) {
      if (entry.domain === 'finance') {
        if (!entry.dataSensitivity) missing.push(`${name}: missing dataSensitivity`);
        if (!entry.retentionClass) missing.push(`${name}: missing retentionClass`);
      }
    }
    expect(missing, `Finance tables missing governance fields:\n${missing.join('\n')}`).toEqual([]);
  });

  test('RG-19-04: evidence tables do NOT have hasUpdatedAtTrigger', () => {
    const violations: string[] = [];
    for (const [name, entry] of Object.entries(entries)) {
      if (entry.kind === 'evidence' && entry.hasUpdatedAtTrigger) {
        violations.push(name);
      }
    }
    expect(violations, `Evidence tables with hasUpdatedAtTrigger: ${violations.join(', ')}`).toEqual([]);
  });

  test('RG-19-05: truth tables have hasRls + hasTenant + hasCompositePk', () => {
    const violations: string[] = [];
    for (const [name, entry] of Object.entries(entries)) {
      if (entry.kind === 'truth') {
        if (!entry.hasRls) violations.push(`${name}: missing hasRls`);
        if (!entry.hasTenant) violations.push(`${name}: missing hasTenant`);
        if (!entry.hasCompositePk) violations.push(`${name}: missing hasCompositePk`);
      }
    }
    expect(violations, `Truth table violations:\n${violations.join('\n')}`).toEqual([]);
  });

  test('RG-19-06: registry count matches schema file count', () => {
    expect(registryKeys.length).toBe(schemaFiles.length);
  });
});
