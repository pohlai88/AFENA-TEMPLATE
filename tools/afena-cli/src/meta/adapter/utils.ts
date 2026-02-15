/**
 * Adapter pipeline utilities — adapterVersion, inputsHash, overrides, naming.
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ── Naming (singular/plural, slug, table) ────────────────────────────────────

/** Words that are already plural or uncountable — do not pluralize. */
const NO_PLURALIZE = new Set(['settings', 'defaults', 'config', 'data', 'metadata', 'info']);

/** Load irregulars from adapter config, or use defaults. */
function loadIrregulars(repoRoot?: string): Record<string, string> {
  const defaults: Record<string, string> = {
    batch: 'batches',
    company: 'companies',
    address: 'addresses',
    series: 'series',
    status: 'statuses',
    analysis: 'analyses',
    currency: 'currencies',
    branch: 'branches',
  };
  if (!repoRoot) return defaults;
  try {
    const path = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'irregulars.json');
    if (existsSync(path)) {
      const loaded = JSON.parse(readFileSync(path, 'utf-8')) as Record<string, string>;
      return { ...defaults, ...loaded };
    }
  } catch {
    /* ignore */
  }
  return defaults;
}

/** In-memory irregulars (used when repoRoot not available). */
let _irregulars: Record<string, string> = loadIrregulars();

/** Pluralize a single word. */
function pluralizeWord(word: string): string {
  const lower = word.toLowerCase();
  if (_irregulars[lower]) return _irregulars[lower];
  if (NO_PLURALIZE.has(lower)) return word;
  if (word.endsWith('y') && !/^[aeiou]y$/i.test(word.slice(-2))) return word.slice(0, -1) + 'ies';
  if (/\b(s|sh|ch|x|z)$/.test(word)) return word + 'es';
  if (word.endsWith('s')) return word;
  return word + 's';
}

/** Which rule was applied for pluralization (for report). */
export function getPluralizationRule(word: string): 'irregular' | 'regular' | 'no_pluralize' {
  const lower = word.toLowerCase();
  if (_irregulars[lower]) return 'irregular';
  if (NO_PLURALIZE.has(lower)) return 'no_pluralize';
  return 'regular';
}

/** Initialize irregulars from repo (call at pipeline start). */
export function initIrregulars(repoRoot: string): void {
  _irregulars = loadIrregulars(repoRoot);
}

/** Convert doctype name to entityType slug (plural). */
export function nameToEntityType(name: string): string {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return pluralizeSlug(slug);
}

/** Pluralize a slug (e.g. sales-order → sales-orders). */
export function pluralizeSlug(slug: string): string {
  const parts = slug.split('-');
  if (parts.length === 0) return slug;
  const last = parts[parts.length - 1];
  parts[parts.length - 1] = pluralizeWord(last);
  return parts.join('-');
}

/** Convert entityType slug to tableName (snake_plural). */
export function entityTypeToTableName(entityType: string): string {
  return entityType.replace(/-/g, '_');
}

import { createHash } from 'crypto';
import { execSync } from 'child_process';

/** Get adapter version (git SHA or fallback). */
export function getAdapterVersion(repoRoot: string): string {
  try {
    return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf-8' }).trim().slice(0, 12);
  } catch {
    return 'unknown';
  }
}

/** Build inputsHash from all pipeline inputs (plan §9a). Excludes timestamps for determinism. */
export function buildInputsHash(inputs: {
  rawRefactor?: unknown;
  staged?: unknown;
  analyze?: unknown;
  mappingTable?: unknown;
  policiesContent?: string;
  overrides?: Record<string, unknown>;
  spineDenylist?: unknown;
}): string {
  const stripTimestamps = (obj: unknown): unknown => {
    if (obj == null) return obj;
    if (Array.isArray(obj)) return obj.map(stripTimestamps);
    if (typeof obj === 'object') {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (['scannedAt', 'transformedAt', 'analyzedAt', 'mappedAt', 'generatedAt'].includes(k)) continue;
        out[k] = stripTimestamps(v);
      }
      return out;
    }
    return obj;
  };
  const hash = createHash('sha256');
  hash.update(JSON.stringify(stripTimestamps(inputs.rawRefactor ?? {})));
  hash.update(JSON.stringify(stripTimestamps(inputs.staged ?? {})));
  hash.update(JSON.stringify(stripTimestamps(inputs.analyze ?? {})));
  hash.update(JSON.stringify(inputs.mappingTable ?? {}));
  hash.update(inputs.policiesContent ?? '');
  hash.update(JSON.stringify(inputs.overrides ?? {}));
  hash.update(JSON.stringify(inputs.spineDenylist ?? {}));
  return hash.digest('hex');
}

/** Load overrides from adapters/erpnext/overrides/*.json. */
export function loadOverrides(repoRoot: string): Record<string, unknown> {
  const overridesDir = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'overrides');
  const result: Record<string, unknown> = {};
  if (!existsSync(overridesDir)) return result;
  const files = readdirSync(overridesDir).filter((f) => f.endsWith('.override.json'));
  for (const f of files) {
    const entityType = f.replace('.override.json', '');
    const filePath = join(overridesDir, f);
    try {
      result[entityType] = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (err) {
      console.warn(`  [adapter] Skipped invalid override ${f}:`, (err as Error).message);
    }
  }
  return result;
}
