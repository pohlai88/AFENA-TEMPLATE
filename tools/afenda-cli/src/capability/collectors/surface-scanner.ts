/**
 * L1 Regex Scanner — fast scan for CAPABILITIES and SURFACE consts.
 * Discovers capability annotations in surface boundary files.
 */

import { readFileSync } from 'fs';

import fg from 'fast-glob';

export interface CapabilitySurface {
  file: string;
  kind: 'server_action' | 'api_route' | 'cli_command' | 'engine';
  capabilities: string[];
}

export interface UiSurface {
  file: string;
  surfaceId: string;
  page: string;
  exposes: string[];
}

export interface ScanResult {
  capabilities: CapabilitySurface[];
  uiSurfaces: UiSurface[];
}

const CAPABILITIES_REGEX =
  /export\s+const\s+CAPABILITIES\s*=\s*\[([^\]]*)\]\s*as\s+const/s;

const SURFACE_REGEX =
  /export\s+const\s+SURFACE\s*=\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}\s*as\s+const/s;

function extractStringArray(raw: string): string[] {
  const matches = raw.match(/'([^']+)'/g) ?? raw.match(/"([^"]+)"/g) ?? [];
  return matches.map((m) => m.slice(1, -1));
}

const SURFACE_ID_REGEX = /surfaceId\s*:\s*['"]([^'"]+)['"]/;
const PAGE_REGEX = /page\s*:\s*['"]([^'"]+)['"]/;
const EXPOSES_REGEX = /exposes\s*:\s*\[([^\]]*)\]/;

function extractStringField(raw: string, field: 'surfaceId' | 'page'): string {
  const re = field === 'surfaceId' ? SURFACE_ID_REGEX : PAGE_REGEX;
  const match = raw.match(re);
  return match ? match[1] : '';
}

function extractArrayField(raw: string): string[] {
  const match = raw.match(EXPOSES_REGEX);
  return match ? extractStringArray(match[1]) : [];
}

function classifyFile(filePath: string): CapabilitySurface['kind'] | null {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/app/actions/') || normalized.includes('/app/actions.'))
    return 'server_action';
  if (normalized.includes('/app/api/')) return 'api_route';
  if (normalized.includes('/cli/') || normalized.includes('/bin/'))
    return 'cli_command';
  if (normalized.includes('/handlers/') || normalized.includes('/engine'))
    return 'engine';
  return null;
}

/**
 * Scan the repo for CAPABILITIES and SURFACE annotations.
 * @param repoRoot Absolute path to the repo root.
 */
export async function scanSurfaces(repoRoot: string): Promise<ScanResult> {
  const capabilitySurfaces: CapabilitySurface[] = [];
  const uiSurfaces: UiSurface[] = [];

  // Scan for CAPABILITIES in server actions, API routes, engine files
  const capFiles = await fg(
    [
      'apps/web/app/actions/**/*.ts',
      'apps/web/app/api/**/route.ts',
      'packages/*/src/**/handlers/*.ts',
      'packages/*/src/engine.ts',
    ],
    { cwd: repoRoot, absolute: true },
  );

  for (const absPath of capFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const match = content.match(CAPABILITIES_REGEX);
    if (!match) continue;

    const capabilities = extractStringArray(match[1]);
    if (capabilities.length === 0) continue;

    const relPath = absPath.replace(/\\/g, '/').replace(`${repoRoot.replace(/\\/g, '/')  }/`, '');
    const kind = classifyFile(relPath) ?? 'engine';

    capabilitySurfaces.push({ file: relPath, kind, capabilities });
  }

  // Scan for SURFACE in co-located surface.ts files
  const surfaceFiles = await fg(
    ['apps/web/app/**/surface.ts'],
    { cwd: repoRoot, absolute: true },
  );

  for (const absPath of surfaceFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const match = content.match(SURFACE_REGEX);
    if (!match) continue;

    const body = match[1];
    const surfaceId = extractStringField(body, 'surfaceId');
    const page = extractStringField(body, 'page');
    const exposes = extractArrayField(body);

    if (!surfaceId || exposes.length === 0) continue;

    const relPath = absPath.replace(/\\/g, '/').replace(`${repoRoot.replace(/\\/g, '/')  }/`, '');
    uiSurfaces.push({ file: relPath, surfaceId, page, exposes });
  }

  return { capabilities: capabilitySurfaces, uiSurfaces };
}
