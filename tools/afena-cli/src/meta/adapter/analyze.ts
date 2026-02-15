/**
 * Stage 3 — Analyze: collisions, spine lock, link targets.
 * Collision keys: entityType, tableName, route, handler (plan §3a).
 * Policy-driven: decision + reasonCodes per entity.
 * Output: .afena/meta/reports/analyze.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { ENTITY_TYPES } from 'afena-canon';
import { loadOverrides } from './utils';
import { applyCollisionPolicy } from './collision-policy';

function loadTableRegistry(repoRoot: string): Set<string> {
  const registryPath = join(repoRoot, 'packages', 'database', 'src', 'schema', '_registry.ts');
  if (!existsSync(registryPath)) return new Set();
  const content = readFileSync(registryPath, 'utf-8');
  const matches = content.matchAll(/\s+(\w+):\s*['"]?(?:truth|control|projection|evidence|link|system)['"]?/g);
  return new Set([...matches].map((m) => m[1]));
}

function loadRouteSegments(repoRoot: string): Set<string> {
  const orgSlugDir = join(repoRoot, 'apps', 'web', 'app', '(app)', 'org', '[slug]');
  if (!existsSync(orgSlugDir)) return new Set();
  const entries = readdirSync(orgSlugDir, { withFileTypes: true });
  return new Set(entries.filter((e) => e.isDirectory()).map((e) => e.name));
}

/** Check if route dir has page.tsx (real implementation) or is placeholder. */
function isRouteEmptyPlaceholder(repoRoot: string, entityType: string): boolean {
  const routeDir = join(repoRoot, 'apps', 'web', 'app', '(app)', 'org', '[slug]', entityType);
  if (!existsSync(routeDir)) return true;
  const pagePath = join(routeDir, 'page.tsx');
  return !existsSync(pagePath);
}

function loadNavEntityTypes(repoRoot: string): Set<string> {
  const navPath = join(repoRoot, 'apps', 'web', 'app', '(app)', 'org', '[slug]', '_components', 'nav-config.ts');
  if (!existsSync(navPath)) return new Set();
  const content = readFileSync(navPath, 'utf-8');
  const matches = content.matchAll(/orgEntity\s*\(\s*\w+\s*,\s*['"]([^'"]+)['"]\s*\)/g);
  return new Set([...matches].map((m) => m[1]));
}

function loadHandlerRegistry(repoRoot: string): Set<string> {
  const mutatePath = join(repoRoot, 'packages', 'crud', 'src', 'mutate.ts');
  if (!existsSync(mutatePath)) return new Set();
  const content = readFileSync(mutatePath, 'utf-8');
  const start = content.indexOf('HANDLER_REGISTRY');
  if (start < 0) return new Set();
  const open = content.indexOf('{', start);
  if (open < 0) return new Set();
  let depth = 1;
  let end = open + 1;
  for (; end < content.length && depth > 0; end++) {
    const c = content[end];
    if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  const block = content.slice(start, end);
  const matches = block.matchAll(/\n\s+(\w+):\s+\w+/g);
  return new Set([...matches].map((m) => m[1]));
}

export interface AnalyzeReportEntry {
  entityType: string;
  collisions: string[];
  lockLevel?: string;
  decision: string;
  reasonCodes: string[];
  collisionExpected?: string[];
  uiAdoptMode?: string;
  outputsAllowed?: { spec: boolean; db: boolean; ui: boolean };
  routeDetails?: {
    routePathExists: boolean;
    navExists: boolean;
    routeEmptyPlaceholder: boolean;
  };
}

export async function runAnalyze(repoRoot: string): Promise<void> {
  const stagedPath = join(repoRoot, '.afena', 'meta', 'staged', 'transformed.entities.json');
  const rawPath = join(repoRoot, '.afena', 'meta', 'raw', 'refactor.entities.json');
  const spinePath = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'spine-denylist.json');
  const outDir = join(repoRoot, '.afena', 'meta', 'reports');

  if (!existsSync(stagedPath)) {
    throw new Error('Run afena meta transform first');
  }

  mkdirSync(outDir, { recursive: true });

  const staged = JSON.parse(readFileSync(stagedPath, 'utf-8'));
  const raw = existsSync(rawPath) ? JSON.parse(readFileSync(rawPath, 'utf-8')) : { entities: {} };
  const entityTypes = new Set(ENTITY_TYPES);
  const tableRegistry = loadTableRegistry(repoRoot);
  const routeSegments = loadRouteSegments(repoRoot);
  const navEntityTypes = loadNavEntityTypes(repoRoot);
  const handlerRegistry = loadHandlerRegistry(repoRoot);
  const overrides = loadOverrides(repoRoot);

  let spineDenylist: { entityTypes?: { db?: string[]; 'db+ui'?: string[] } } = {};
  if (existsSync(spinePath)) {
    spineDenylist = JSON.parse(readFileSync(spinePath, 'utf-8'));
  }

  const dbLocked = new Set(spineDenylist.entityTypes?.db ?? []);
  const dbUiLocked = new Set(spineDenylist.entityTypes?.['db+ui'] ?? []);
  const allEntityTypes = new Set(Object.keys(staged.entities ?? {}));

  const reports: AnalyzeReportEntry[] = [];
  const recommendedForAdoption: { entityType: string; score: number; reasons: string[] }[] = [];

  for (const [entityType, entity] of Object.entries(staged.entities ?? {}) as [string, any][]) {
    const collisions: string[] = [];
    if (entityTypes.has(entityType as any)) collisions.push('entityType');
    const tableName = entityType.replace(/-/g, '_');
    if (tableRegistry.has(tableName)) collisions.push('tableName');
    const routePathExists = routeSegments.has(entityType);
    const navExists = navEntityTypes.has(entityType);
    const routeEmptyPlaceholder = isRouteEmptyPlaceholder(repoRoot, entityType);
    if (routePathExists || navExists) collisions.push('route');
    if (handlerRegistry.has(entityType)) collisions.push('handler');
    if (dbLocked.has(entityType)) collisions.push('spine:db');
    if (dbUiLocked.has(entityType)) collisions.push('spine:db+ui');

    let lockLevel: string | undefined;
    if (dbUiLocked.has(entityType)) lockLevel = 'db+ui';
    else if (dbLocked.has(entityType)) lockLevel = 'db';

    const override = overrides[entityType] as Record<string, unknown> | undefined;
    const overrideCollisionExpected = override?.collisionExpected as string[] | undefined;

    const policyInput = {
      entityType,
      collisions,
      lockLevel: lockLevel as 'db' | 'db+ui' | undefined,
      routeDetails: {
        routePathExists,
        navExists,
        routeEmptyPlaceholder,
      },
      overrideCollisionExpected,
    };

    const policy = applyCollisionPolicy(policyInput);

    const entry: AnalyzeReportEntry = {
      entityType,
      collisions,
      lockLevel,
      decision: policy.decision,
      reasonCodes: policy.reasonCodes,
      routeDetails: policyInput.routeDetails,
    };
    if (policy.collisionExpected) entry.collisionExpected = policy.collisionExpected;
    if (policy.uiAdoptMode) entry.uiAdoptMode = policy.uiAdoptMode;
    if (policy.outputsAllowed) entry.outputsAllowed = policy.outputsAllowed;

    reports.push(entry);

    // Build recommendedForAdoption: no collisions, few fields, config preferred
    if (policy.decision === 'ALLOW' && policy.outputsAllowed?.spec) {
      const fields = (entity.fields ?? []) as any[];
      const linkCount = fields.filter((f: any) => f.fieldType === 'link').length;
      const fieldCount = fields.length;
      let score = 100;
      const reasons: string[] = [];
      if (collisions.length > 0) score -= 20;
      if (linkCount > 5) score -= 15;
      else if (linkCount > 0) score -= 5;
      if (fieldCount > 30) score -= 10;
      else if (fieldCount < 10) {
        score += 10;
        reasons.push('few fields');
      }
      if (entity.kind === 'config') {
        score += 15;
        reasons.push('config');
      }
      if (linkCount === 0) reasons.push('no links');
      recommendedForAdoption.push({ entityType, score, reasons });
    }
  }

  recommendedForAdoption.sort((a, b) => b.score - a.score);

  const output = {
    analyzedAt: new Date().toISOString(),
    reports,
    summary: {
      total: reports.length,
      withCollisions: reports.filter((r) => r.collisions.length > 0).length,
      locked: reports.filter((r) => r.lockLevel).length,
      byDecision: {
        ALLOW: reports.filter((r) => r.decision === 'ALLOW').length,
        SKIP_DB: reports.filter((r) => r.decision === 'SKIP_DB').length,
        SKIP_ALL: reports.filter((r) => r.decision === 'SKIP_ALL').length,
        FAIL: reports.filter((r) => r.decision === 'FAIL').length,
        ADOPT_UI_ONLY: reports.filter((r) => r.decision === 'ADOPT_UI_ONLY').length,
      },
    },
    recommendedForAdoption: recommendedForAdoption.slice(0, 15),
  };

  writeFileSync(join(outDir, 'analyze.json'), JSON.stringify(output, null, 2));
}
