/**
 * Stage 1 — Ingest: refactor canon + manifest.
 * Output: .afena/meta/raw/refactor.entities.json, local.contract.snapshot.json
 * Lossless: never rename, fix, or infer. Raw data preserved.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { ENTITY_TYPES } from 'afena-canon';

// Avoid importing afena-database (pulls in db.ts which requires DATABASE_URL).
// Read _registry.ts and extract TABLE_REGISTRY keys + RLS_TABLES.
function loadLocalRegistry(repoRoot: string): { tableRegistry: string[]; rlsTables: string[] } {
  const registryPath = join(repoRoot, 'packages', 'database', 'src', 'schema', '_registry.ts');
  if (!existsSync(registryPath)) {
    return { tableRegistry: [], rlsTables: [] };
  }
  const content = readFileSync(registryPath, 'utf-8');
  const tableMatches = content.matchAll(/\s+(\w+):\s*['"]?(?:truth|control|projection|evidence|link|system)['"]?/g);
  const tableRegistry = [...tableMatches].map((m) => m[1]);
  // RLS_TABLES = TABLE_REGISTRY minus 'system' kind
  const systemMatches = content.matchAll(/\s+(\w+):\s*['"]?system['"]?/g);
  const systemTables = new Set([...systemMatches].map((m) => m[1]));
  const rlsTables = tableRegistry.filter((t) => !systemTables.has(t)).sort();
  return { tableRegistry, rlsTables };
}

const CANON_GLOB = '.PRD/erp-refactor/v3/canon/*.canon.json';
const MANIFEST_PATH = '.PRD/erp-refactor/v3/manifest.json';

export async function runScan(repoRoot: string): Promise<void> {
  const { readdirSync } = await import('fs');
  const canonDir = join(repoRoot, '.PRD', 'erp-refactor', 'v3', 'canon');
  const manifestPath = join(repoRoot, MANIFEST_PATH);
  const outDir = join(repoRoot, '.afena', 'meta', 'raw');

  mkdirSync(outDir, { recursive: true });

  // Load manifest
  let manifest: { db?: { dbNameMap?: Record<string, Record<string, string>> } } = {};
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  }

  // Load canon files
  const entities: Record<string, unknown> = {};
  if (existsSync(canonDir)) {
    const files = readdirSync(canonDir).filter((f) => f.endsWith('.canon.json'));
    for (const f of files) {
      const path = join(canonDir, f);
      const data = JSON.parse(readFileSync(path, 'utf-8'));
      const name = data.name ?? data.doctypeId?.split(':').pop() ?? f.replace('.canon.json', '');
      entities[name] = { ...data, _file: f };
    }
  }

  const refactorOutput = {
    scannedAt: new Date().toISOString(),
    manifestDbNameMap: manifest.db?.dbNameMap ?? {},
    entities,
    entityCount: Object.keys(entities).length,
  };

  writeFileSync(join(outDir, 'refactor.entities.json'), JSON.stringify(refactorOutput, null, 2));

  // Local snapshot (ENTITY_TYPES, TABLE_REGISTRY, RLS_TABLES, spine denylist)
  const spinePath = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'spine-denylist.json');
  let spineDenylist: { entityTypes?: { db?: string[]; 'db+ui'?: string[] } } = {};
  if (existsSync(spinePath)) {
    spineDenylist = JSON.parse(readFileSync(spinePath, 'utf-8'));
  }

  const { tableRegistry, rlsTables } = loadLocalRegistry(repoRoot);

  const localSnapshot = {
    scannedAt: new Date().toISOString(),
    entityTypes: [...ENTITY_TYPES],
    tableRegistry,
    rlsTables,
    spineDenylist: spineDenylist.entityTypes ?? { db: [], 'db+ui': [] },
  };

  writeFileSync(join(outDir, 'local.contract.snapshot.json'), JSON.stringify(localSnapshot, null, 2));
}
