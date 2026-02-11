import { readFileSync } from 'fs';
import { join } from 'path';
import fg from 'fast-glob';
import { toPosix } from '../utils/paths';
import { ReadmeCanonModelSchema } from '../types';
import type { ReadmeCanonModel, ReadmeCanonExport } from '../types';

/**
 * Analyze a single package directory and produce a Canon README Model.
 * Never throws — returns a minimal model on error.
 */
export function analyzePackage(
  pkgDir: string,
  repoRoot: string
): ReadmeCanonModel {
  try {
    return analyzePackageUnsafe(pkgDir, repoRoot);
  } catch {
    return ReadmeCanonModelSchema.parse({
      identity: {
        name: pkgDir,
        packageType: 'library',
        relativePath: pkgDir,
      },
      install: {},
    });
  }
}

function analyzePackageUnsafe(
  pkgDir: string,
  repoRoot: string
): ReadmeCanonModel {
  const pkgJsonPath = join(repoRoot, pkgDir, 'package.json');
  const raw = readFileSync(pkgJsonPath, 'utf-8');
  const pkg: Record<string, any> = JSON.parse(raw);

  const name: string = pkg.name ?? pkgDir;
  const version: string | undefined = pkg.version;
  const description: string = pkg.description ?? '';
  const isPrivate: boolean = pkg.private ?? true;

  const packageType = detectPackageType(pkgDir, pkg);
  const exports = normalizeExports(pkg);
  const sourceFiles = scanSourceFiles(pkgDir, repoRoot);

  const deps: Record<string, string> = pkg.dependencies ?? {};
  const devDeps: Record<string, string> = pkg.devDependencies ?? {};
  const peerDeps: Record<string, string> = pkg.peerDependencies ?? {};
  const scripts: Record<string, string> = pkg.scripts ?? {};

  // Extract workspace:* references as related packages
  const relatedPackages = extractRelatedPackages({ ...deps, ...devDeps });

  // Extract peer dep names for install section
  const peerDepNames = Object.keys(peerDeps).sort();

  return ReadmeCanonModelSchema.parse({
    identity: {
      name,
      version,
      description,
      packageType,
      private: isPrivate,
      relativePath: pkgDir,
    },
    install: {
      workspace: isPrivate,
      peerDeps: peerDepNames,
    },
    exports,
    sourceFiles,
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
    peerDependencies: peerDeps,
    relatedPackages,
  });
}

/**
 * Detect package type from heuristics (no AST).
 */
function detectPackageType(
  pkgDir: string,
  pkg: Record<string, any>
): 'ui' | 'config' | 'library' | 'app' {
  const allDeps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };

  // App: under apps/
  if (pkgDir.startsWith('apps/')) return 'app';

  // Config: name contains config or eslint
  const name = (pkg.name ?? '').toLowerCase();
  if (name.includes('config') || name.includes('eslint')) return 'config';

  // UI: has react in deps or peerDeps
  if ('react' in allDeps || 'react-dom' in allDeps) return 'ui';

  return 'library';
}

/**
 * Normalize package.json exports field into Canon export entries.
 * Handles string, object with conditions, and nested subpath exports.
 */
function normalizeExports(pkg: Record<string, any>): ReadmeCanonExport[] {
  const result: ReadmeCanonExport[] = [];

  if (pkg.exports) {
    const exportsField = pkg.exports;

    if (typeof exportsField === 'string') {
      result.push({ subpath: '.', conditions: { default: exportsField } });
    } else if (typeof exportsField === 'object' && !Array.isArray(exportsField)) {
      for (const key of Object.keys(exportsField).sort()) {
        const value = exportsField[key];
        if (typeof value === 'string') {
          if (key.startsWith('.')) {
            result.push({ subpath: key, conditions: { default: value } });
          } else {
            const existing = result.find((e) => e.subpath === '.');
            if (existing) {
              existing.conditions[key] = value;
            } else {
              result.push({ subpath: '.', conditions: { [key]: value } });
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          const conditions: Record<string, string> = {};
          for (const condKey of Object.keys(value).sort()) {
            if (typeof value[condKey] === 'string') {
              conditions[condKey] = value[condKey];
            }
          }
          result.push({ subpath: key.startsWith('.') ? key : '.', conditions });
        }
      }
    }
  }

  // Fallback: if no exports field, use main/types/module
  if (result.length === 0) {
    const conditions: Record<string, string> = {};
    if (pkg.main) conditions['default'] = pkg.main;
    if (pkg.types) conditions['types'] = pkg.types;
    if (pkg.module) conditions['module'] = pkg.module;
    if (Object.keys(conditions).length > 0) {
      result.push({ subpath: '.', conditions });
    }
  }

  return result.sort((a, b) => a.subpath.localeCompare(b.subpath));
}

/**
 * Scan source files in a package directory.
 * Returns sorted relative paths (relative to pkg dir).
 */
function scanSourceFiles(pkgDir: string, repoRoot: string): string[] {
  const patterns = [
    `${pkgDir}/src/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/*.{ts,tsx,js,jsx,json}`,
  ];

  const files: string[] = fg.sync(patterns, {
    cwd: repoRoot,
    absolute: false,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
  });

  return files
    .map((f) => toPosix(f).replace(`${pkgDir}/`, ''))
    .filter((f) => f !== 'package.json')
    .sort();
}

/**
 * Extract workspace:* dependency names as related packages.
 */
function extractRelatedPackages(
  allDeps: Record<string, string>
): string[] {
  return Object.entries(allDeps)
    .filter(([, version]) => version.startsWith('workspace:'))
    .map(([name]) => name)
    .sort();
}
