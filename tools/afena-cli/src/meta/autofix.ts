/**
 * Autofix — `afena meta fix` with safe insertion rules (§11).
 *
 * - Inserts `export const CAPABILITIES = [...] as const;` into eligible
 *   server action / API route files that have write boundaries but no annotation.
 * - Inserts `export const SURFACE = { ... } as const;` skeleton into
 *   surface.ts files for pages that lack one.
 * - Never overwrites existing annotations — only fills gaps.
 * - Writes .afena/meta.fix.report.json listing every touched file.
 */

import { readFileSync, writeFileSync } from 'fs';
import fg from 'fast-glob';
import type { FixAction, FixReport } from './emitters/fix-report';
import { writeFixReport } from './emitters/fix-report';

const WRITE_BOUNDARY_PATTERNS = [
  /mutate\s*\(/,
  /db\.insert\s*\(/,
  /db\.update\s*\(/,
  /db\.delete\s*\(/,
  /db\.transaction\s*\(/,
  /tx\.\w+\s*\(/,
  /\.execute\s*\(/,
];

const CAPABILITIES_REGEX =
  /export\s+const\s+CAPABILITIES\s*=\s*\[([^\]]*)\]\s*as\s+const/s;

const JSDOC_CAPABILITY_REGEX = /@capability\s+[\w.]+/;

const SURFACE_REGEX =
  /export\s+const\s+SURFACE\s*=\s*\{/;

function hasWriteBoundary(content: string): boolean {
  return WRITE_BOUNDARY_PATTERNS.some((re) => re.test(content));
}

function hasCapabilityAnnotation(content: string): boolean {
  return CAPABILITIES_REGEX.test(content) || JSDOC_CAPABILITY_REGEX.test(content);
}

/**
 * Detect indentation style from file content.
 */
function detectIndent(content: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\s+)\S/);
    if (match) {
      return match[1].includes('\t') ? '\t' : '  ';
    }
  }
  return '  ';
}

/**
 * Infer capability keys from file path.
 * Returns a best-guess array based on route/action naming conventions.
 */
function inferCapabilityKeys(relPath: string): string[] {
  const normalized = relPath.replace(/\\/g, '/');

  // API routes: infer from path segments
  if (normalized.includes('/app/api/')) {
    const segments = normalized.split('/app/api/')[1]?.split('/') ?? [];
    // e.g. api/search/route.ts → ['search.global']
    // e.g. api/custom-fields/[entityType]/route.ts → ['custom_fields.read']
    if (segments[0] === 'search') return ['search.global'];
    if (segments[0] === 'custom-fields') return ['custom_fields.read'];
    if (segments[0] === 'views') return ['views.read'];
    if (segments[0] === 'storage' && segments[1] === 'presign') return ['storage.files.upload'];
    if (segments[0] === 'storage' && segments[1] === 'metadata') return ['storage.files.metadata'];
    return [];
  }

  // Server actions: infer from filename
  if (normalized.includes('/app/actions/')) {
    const filename = normalized.split('/').pop()?.replace('.ts', '') ?? '';
    // e.g. contacts.ts → contacts CRUD
    return [`${filename}.create`, `${filename}.update`, `${filename}.delete`, `${filename}.restore`];
  }

  return [];
}

/**
 * Find the insertion point for CAPABILITIES const.
 * After imports, before first export/default export.
 */
function findCapabilitiesInsertLine(lines: string[]): number {
  let lastImportLine = -1;
  let firstExportLine = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') || line.startsWith('import{')) {
      lastImportLine = i;
    }
    if (
      firstExportLine === -1 &&
      (line.startsWith('export ') || line.startsWith('export{')) &&
      !line.startsWith('export const CAPABILITIES') &&
      !line.startsWith('export type')
    ) {
      firstExportLine = i;
    }
  }

  // After last import, or before first export, or at line 0
  if (lastImportLine >= 0) return lastImportLine + 1;
  if (firstExportLine >= 0) return firstExportLine;
  return 0;
}

/**
 * Generate CAPABILITIES const string.
 */
function generateCapabilitiesConst(keys: string[], indent: string): string {
  if (keys.length === 0) return '';
  const items = keys.map((k) => `${indent}'${k}',`).join('\n');
  return `\nexport const CAPABILITIES = [\n${items}\n] as const;\n`;
}

/**
 * Generate SURFACE const skeleton for a page.
 */
function generateSurfaceConst(
  surfaceId: string,
  page: string,
  exposes: string[],
  indent: string,
): string {
  const items = exposes.map((k) => `${indent}${indent}'${k}',`).join('\n');
  return [
    `export const SURFACE = {`,
    `${indent}surfaceId: '${surfaceId}',`,
    `${indent}page: '${page}',`,
    `${indent}exposes: [`,
    items,
    `${indent}],`,
    `} as const;`,
    '',
  ].join('\n');
}

/**
 * Run autofix across surface boundary files.
 *
 * @param repoRoot Absolute path to repo root
 * @param dryRun If true, don't write files — only report
 * @returns The fix report
 */
export async function runAutofix(
  repoRoot: string,
  dryRun: boolean,
): Promise<FixReport> {
  const actions: FixAction[] = [];

  // 1. Fix server actions / API routes missing CAPABILITIES
  const capFiles = await fg(
    [
      'apps/web/app/actions/**/*.ts',
      'apps/web/app/api/**/route.ts',
    ],
    { cwd: repoRoot, absolute: true },
  );

  for (const absPath of capFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const relPath = absPath
      .replace(/\\/g, '/')
      .replace(repoRoot.replace(/\\/g, '/') + '/', '');

    if (!hasWriteBoundary(content)) continue;
    if (hasCapabilityAnnotation(content)) continue;

    const keys = inferCapabilityKeys(relPath);
    if (keys.length === 0) continue;

    const indent = detectIndent(content);
    const capConst = generateCapabilitiesConst(keys, indent);

    if (!dryRun) {
      const lines = content.split('\n');
      const insertAt = findCapabilitiesInsertLine(lines);
      lines.splice(insertAt, 0, capConst);
      writeFileSync(absPath, lines.join('\n'), 'utf-8');
    }

    actions.push({
      path: relPath,
      action: 'insert_capabilities',
      keysAdded: keys,
    });
  }

  // 2. Find pages without co-located surface.ts
  const pageFiles = await fg(
    ['apps/web/app/**/page.tsx'],
    { cwd: repoRoot, absolute: true },
  );

  const existingSurfaces = new Set(
    (await fg(['apps/web/app/**/surface.ts'], { cwd: repoRoot, absolute: true }))
      .map((p) => p.replace(/\\/g, '/').replace(/surface\.ts$/, '')),
  );

  for (const absPath of pageFiles) {
    const dir = absPath.replace(/\\/g, '/').replace(/page\.tsx$/, '');

    if (existingSurfaces.has(dir)) continue;

    // Derive surface metadata from path
    const relDir = dir.replace(repoRoot.replace(/\\/g, '/') + '/', '');
    const pagePath = '/' + relDir
      .replace('apps/web/app/', '')
      .replace(/\(app\)\/?/, '')
      .replace(/\/$/, '');

    // Generate a stable surfaceId from path
    const surfaceId = 'web.' + pagePath
      .replace(/^\//, '')
      .replace(/\[([^\]]+)\]/g, '$1')
      .replace(/\//g, '.')
      .replace(/-/g, '_') + '.page';

    const surfacePath = dir + 'surface.ts';
    const relSurfacePath = surfacePath.replace(
      repoRoot.replace(/\\/g, '/') + '/',
      '',
    );

    // We only create skeleton surfaces — user fills in exposes
    const indent = '  ';
    const surfaceContent = generateSurfaceConst(surfaceId, pagePath, [], indent);

    if (!dryRun) {
      writeFileSync(surfacePath, surfaceContent, 'utf-8');
    }

    actions.push({
      path: relSurfacePath,
      action: 'insert_surface',
      keysAdded: [],
    });
  }

  const report: FixReport = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    dryRun,
    files: actions,
  };

  writeFixReport(repoRoot, report);
  return report;
}
