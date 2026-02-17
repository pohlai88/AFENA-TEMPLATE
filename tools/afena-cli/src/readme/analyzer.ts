import fg from 'fast-glob';

import { safeReadFile } from '../core/fs-safe';
import { parseJson, PackageJsonSchema, type PackageJson } from '../core/parse-json';
import { toPosix } from '../core/paths';
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
  const pkg = parseJson(
    safeReadFile(repoRoot, ...pkgDir.split('/'), 'package.json'),
    PackageJsonSchema
  );

  const name: string = pkg.name ?? pkgDir;
  const version: string | undefined = pkg.version;
  const description: string = pkg.description ?? '';
  const isPrivate: boolean = pkg.private ?? true;

  const packageType = detectPackageType(pkgDir, pkg);
  const binNames = extractBinNames(pkg);
  const exports = normalizeExports(pkg);
  const sourceFiles = scanSourceFiles(pkgDir, repoRoot);
  const structure = analyzeStructure(pkgDir, repoRoot, sourceFiles);
  const keyExports = detectKeyExports(sourceFiles);

  const deps = (pkg.dependencies ?? {});
  const devDeps = (pkg.devDependencies ?? {});
  const peerDeps = (pkg.peerDependencies ?? {});
  const scripts = (pkg.scripts ?? {});

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
    binNames,
    exports,
    sourceFiles,
    scripts,
    dependencies: deps,
    devDependencies: devDeps,
    peerDependencies: peerDeps,
    relatedPackages,
    structure,
    keyExports,
  });
}

/**
 * Detect package type from heuristics (no AST).
 */
function detectPackageType(
  pkgDir: string,
  pkg: PackageJson
): 'ui' | 'config' | 'library' | 'app' | 'tool' {
  const allDeps = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };

  // App: under apps/
  if (pkgDir.startsWith('apps/')) return 'app';

  // Tool: under tools/
  if (pkgDir.startsWith('tools/')) return 'tool';

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
function normalizeExports(pkg: PackageJson): ReadmeCanonExport[] {
  const result: ReadmeCanonExport[] = [];

  if (pkg.exports) {
    const exportsField = pkg.exports;

    if (typeof exportsField === 'string') {
      result.push({ subpath: '.', conditions: { default: exportsField } });
    } else if (typeof exportsField === 'object' && !Array.isArray(exportsField)) {
      const exportsObj = exportsField as Record<string, unknown>;
      for (const key of Object.keys(exportsObj).sort()) {
        const value = exportsObj[key];
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
          const valueObj = value as Record<string, unknown>;
          for (const condKey of Object.keys(valueObj).sort()) {
            const v = valueObj[condKey];
            if (typeof v === 'string') {
              conditions[condKey] = v;
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
 * Extract bin command names from package.json bin field.
 */
function extractBinNames(pkg: PackageJson): string[] {
  const bin = pkg.bin;
  if (!bin) return [];
  if (typeof bin === 'string') {
    const name: string = pkg.name ?? '';
    return [name.replace(/^@.*\//, '')];
  }
  if (typeof bin === 'object' && !Array.isArray(bin)) {
    return Object.keys(bin).sort();
  }
  return [];
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

/**
 * Analyze package structure and detect key directories/patterns.
 */
function analyzeStructure(
  pkgDir: string,
  repoRoot: string,
  sourceFiles: string[]
): {
  hasTests: boolean;
  hasDocs: boolean;
  subdirectories: string[];
  mainModules: string[];
  isEmpty: boolean;
} {
  const hasTests = sourceFiles.some(f =>
    f.includes('__tests__') ||
    f.includes('.test.') ||
    f.includes('.spec.')
  );

  const hasDocs = sourceFiles.some(f =>
    f.toLowerCase().includes('readme') ||
    f.endsWith('.md')
  );

  // Detect subdirectories under src/
  const subdirs = new Set<string>();
  sourceFiles
    .filter(f => f.startsWith('src/'))
    .forEach(f => {
      const parts = f.split('/');
      if (parts.length > 2) {
        subdirs.add(parts[1]);
      }
    });

  // Detect main entry modules (index files)
  const mainModules = sourceFiles
    .filter(f =>
      f.includes('index.ts') ||
      f.includes('index.tsx') ||
      f.includes('index.js')
    )
    .map(f => f.replace(/\/index\.(ts|tsx|js)$/, '') || 'root')
    .filter(f => f !== 'root');

  const isEmpty = sourceFiles.length === 0 ||
    sourceFiles.every(f => f === 'package.json' || f.endsWith('.json'));

  return {
    hasTests,
    hasDocs,
    subdirectories: Array.from(subdirs).sort(),
    mainModules,
    isEmpty,
  };
}

/**
 * Detect key exports by scanning for common patterns.
 */
function detectKeyExports(sourceFiles: string[]): string[] {
  const exports = new Set<string>();

  // Look for main index file
  const mainIndex = sourceFiles.find(f => f === 'src/index.ts' || f === 'src/index.tsx');
  if (mainIndex) {
    exports.add('Main exports');
  }

  // Detect common patterns
  const patterns = [
    { pattern: /types/, label: 'Type definitions' },
    { pattern: /utils/, label: 'Utility functions' },
    { pattern: /components/, label: 'React components' },
    { pattern: /hooks/, label: 'React hooks' },
    { pattern: /services/, label: 'Services' },
    { pattern: /api/, label: 'API clients' },
    { pattern: /schema/, label: 'Schemas' },
    { pattern: /config/, label: 'Configuration' },
    { pattern: /constants/, label: 'Constants' },
    { pattern: /helpers/, label: 'Helper functions' },
  ];

  for (const { pattern, label } of patterns) {
    if (sourceFiles.some(f => pattern.test(f))) {
      exports.add(label);
    }
  }

  return Array.from(exports).sort();
}
