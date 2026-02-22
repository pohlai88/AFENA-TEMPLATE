/**
 * Project analyzer — collect workspace layout, manifest, and docs for PROJECT.md generation.
 */

import fg from 'fast-glob';

import { safeExists, safeReadFile } from '../core/fs-safe';
import { toPosix } from '../core/paths';

export interface ProjectAnalysis {
  repoRoot: string;
  generatedAt: string;
  workspace: {
    packages: string[];
    corePackages: string[];
    domainPackages: string[];
    tools: string[];
    apps: string[];
  };
  manifest: {
    tableCount: number;
    totalFiles: number;
    totalLoc: number;
    totalTestFiles: number;
    totalTestLoc: number;
    packageCount: number;
  } | null;
  docsExist: {
    architecture: boolean;
    governance: boolean;
    businessDomain: boolean;
  };
}

/**
 * Analyze the monorepo for PROJECT.md generation.
 */
export function analyzeProject(repoRoot: string): ProjectAnalysis {
  const generatedAt = new Date().toISOString().slice(0, 10);

  // Resolve workspace packages from filesystem
  const pkgGlobs = [
    'apps/*/package.json',
    'packages/*/package.json',
    'business-domain/*/package.json',
    'business-domain/*/*/package.json',
    'tools/*/package.json',
  ];
  const pkgPaths = fg.sync(pkgGlobs, { cwd: repoRoot, absolute: false });
  const packages = [...new Set(pkgPaths.map((p) => toPosix(p).replace(/\/package\.json$/, '')))].sort();

  const corePackages = packages.filter((p) => p.startsWith('packages/') && !p.includes('business-domain'));
  const domainPackages = packages.filter((p) => p.includes('business-domain/'));
  const tools = packages.filter((p) => p.startsWith('tools/'));
  const apps = packages.filter((p) => p.startsWith('apps/'));

  // Load codebase manifest if present
  let manifest: ProjectAnalysis['manifest'] = null;
  if (safeExists(repoRoot, '.afenda', 'codebase.manifest.json')) {
    try {
      const raw = JSON.parse(safeReadFile(repoRoot, '.afenda', 'codebase.manifest.json')) as {
        schemaCatalog?: { tableCount?: number };
        packageGraph?: { nodes?: unknown[] };
        stats?: {
          totalFiles?: number;
          totalLoc?: number;
          totalTestFiles?: number;
          totalTestLoc?: number;
          packages?: unknown[];
        };
      };
      const schemaCatalog = raw?.schemaCatalog ?? {};
      const stats = raw?.stats ?? {};
      manifest = {
        tableCount: (schemaCatalog as { tableCount?: number }).tableCount ?? 0,
        totalFiles: stats.totalFiles ?? 0,
        totalLoc: stats.totalLoc ?? 0,
        totalTestFiles: stats.totalTestFiles ?? 0,
        totalTestLoc: stats.totalTestLoc ?? 0,
        packageCount: (raw?.packageGraph?.nodes ?? stats?.packages ?? []).length,
      };
    } catch {
      manifest = null;
    }
  }

  return {
    repoRoot,
    generatedAt,
    workspace: {
      packages,
      corePackages,
      domainPackages,
      tools,
      apps,
    },
    manifest,
    docsExist: {
      architecture: safeExists(repoRoot, 'ARCHITECTURE.md'),
      governance: safeExists(repoRoot, 'packages', 'GOVERNANCE.md'),
      businessDomain: safeExists(repoRoot, 'docs', 'architecture', 'BUSINESS_DOMAIN_ARCHITECTURE.md'),
    },
  };
}
