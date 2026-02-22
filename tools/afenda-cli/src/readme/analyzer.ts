import fg from 'fast-glob';

import { safeReadFile } from '../core/fs-safe';
import { PackageJsonSchema, parseJson, type PackageJson } from '../core/parse-json';
import { toPosix } from '../core/paths';
import { ReadmeCanonModelSchema } from '../types';

import type { ReadmeCanonExport, ReadmeCanonModel } from '../types';

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
 * Includes src/, scripts/, engine/, domain/, config/, and other common top-level dirs.
 * Returns sorted relative paths (relative to pkg dir).
 */
function scanSourceFiles(pkgDir: string, repoRoot: string): string[] {
  const patterns = [
    `${pkgDir}/src/**/*.{ts,tsx,js,jsx,mts,mjs,cjs}`,
    `${pkgDir}/*.{ts,tsx,js,jsx,json,mts,mjs,cjs}`,
    `${pkgDir}/scripts/**/*.{ts,tsx,js,jsx,mjs,mts}`,
    `${pkgDir}/engine/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/domain/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/config/**/*.{ts,tsx,js,jsx,json}`,
    `${pkgDir}/capability/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/readme/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/lib/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/core/**/*.{ts,tsx,js,jsx}`,
    `${pkgDir}/docs/**/*.md`,
  ];

  const files: string[] = fg.sync(patterns, {
    cwd: repoRoot,
    absolute: false,
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**', '**/*.d.ts'],
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

/** Known directory names → short description for README. */
const DIR_DESCRIPTIONS: Record<string, string> = {
  types: 'Type definitions and shared interfaces',
  utils: 'Utility functions',
  components: 'React UI components',
  hooks: 'React hooks',
  services: 'Business logic and services',
  api: 'API clients and HTTP layer',
  schema: 'Database or validation schemas',
  config: 'Configuration and constants',
  constants: 'Constants and enums',
  helpers: 'Helper functions',
  domain: 'Domain logic and entities',
  engine: 'Core engine or pipeline logic',
  capability: 'Capability or feature modules',
  collectors: 'Data collectors or introspectors',
  emitters: 'Code or doc emitters',
  readme: 'README generation templates and renderers',
  lib: 'Library and shared code',
  core: 'Core utilities and base types',
  scripts: 'Build or runtime scripts',
  docs: 'Documentation and guides',
  migrations: 'Migration scripts',
  handlers: 'Request or event handlers',
  outbox: 'Outbox or queue writers',
  plan: 'Planning or mutation plan logic',
  commit: 'Commit or apply logic',
  deliver: 'Post-commit delivery effects',
  rules: 'Rule definitions and evaluators',
  detectors: 'Detection or analysis modules',
  forecasters: 'Forecasting or prediction logic',
  scoring: 'Scoring or metrics',
  explain: 'Explanation or rendering',
  evidence: 'Evidence or audit helpers',
  v2: 'Versioned module (v2)',
};

/**
 * Analyze package structure and detect key directories/patterns.
 * Adds top-level dirs, per-dir descriptions, and file counts for better README coverage.
 */
function analyzeStructure(
  _pkgDir: string,
  _repoRoot: string,
  sourceFiles: string[]
): {
  hasTests: boolean;
  hasDocs: boolean;
  subdirectories: string[];
  mainModules: string[];
  isEmpty: boolean;
  topLevelDirs: string[];
  dirDescriptions: Record<string, string>;
  fileCountByDir: Record<string, number>;
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

  // Top-level directory (first path segment)
  const topLevelDirs = new Set<string>();
  // Subdirectories under src/ only (for backward compatibility and tree)
  const subdirs = new Set<string>();
  const fileCountByDir: Record<string, number> = {};

  const knownDirNames = new Set(['src', 'scripts', 'engine', 'domain', 'config', 'capability', 'readme', 'lib', 'core', 'docs']);
  for (const f of sourceFiles) {
    const parts = f.split('/');
    const first = parts[0];
    if (first) {
      const isLikelyDir = parts.length > 1 || knownDirNames.has(first);
      if (isLikelyDir) {
        topLevelDirs.add(first);
        fileCountByDir[first] = (fileCountByDir[first] ?? 0) + 1;
      }
    }
    if (f.startsWith('src/') && parts.length > 2 && parts[1]) {
      subdirs.add(parts[1]);
      const key = `src/${parts[1]}`;
      fileCountByDir[key] = (fileCountByDir[key] ?? 0) + 1;
    }
  }

  const dirDescriptions: Record<string, string> = {};
  for (const d of [...topLevelDirs, ...subdirs]) {
    const desc = DIR_DESCRIPTIONS[d];
    if (desc) dirDescriptions[d] = desc;
  }

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
    topLevelDirs: Array.from(topLevelDirs).sort(),
    dirDescriptions,
    fileCountByDir,
  };
}

/**
 * Detect key exports by scanning for common patterns.
 * Used for "What's inside" and more descriptive README sections.
 */
function detectKeyExports(sourceFiles: string[]): string[] {
  const exports = new Set<string>();

  const mainIndex = sourceFiles.find(f => f === 'src/index.ts' || f === 'src/index.tsx');
  if (mainIndex) {
    exports.add('Main exports (barrel from index)');
  }

  const patterns = [
    { pattern: /\/types\//, label: 'Type definitions and shared interfaces' },
    { pattern: /\/utils\//, label: 'Utility functions' },
    { pattern: /\/components\//, label: 'React components' },
    { pattern: /\/hooks\//, label: 'React hooks' },
    { pattern: /\/services\//, label: 'Services and business logic' },
    { pattern: /\/api\//, label: 'API clients' },
    { pattern: /\/schema\//, label: 'Schemas (DB or validation)' },
    { pattern: /\/config\//, label: 'Configuration' },
    { pattern: /\/constants\//, label: 'Constants and enums' },
    { pattern: /\/helpers\//, label: 'Helper functions' },
    { pattern: /\/domain\//, label: 'Domain logic and entities' },
    { pattern: /\/engine\//, label: 'Core engine or pipeline' },
    { pattern: /\/capability\//, label: 'Capability or feature modules' },
    { pattern: /\/collectors\//, label: 'Data collectors or introspectors' },
    { pattern: /\/emitters\//, label: 'Code or doc emitters' },
    { pattern: /\/readme\//, label: 'README generation' },
    { pattern: /\/handlers\//, label: 'Request or event handlers' },
    { pattern: /\/migrations\//, label: 'Migration scripts' },
    { pattern: /\/rules\//, label: 'Rule definitions and evaluators' },
    { pattern: /\/detectors\//, label: 'Detection or analysis' },
    { pattern: /\/forecasters\//, label: 'Forecasting or prediction' },
    { pattern: /\/scripts\//, label: 'Scripts and tooling' },
  ];

  for (const { pattern, label } of patterns) {
    if (sourceFiles.some(f => pattern.test(f))) {
      exports.add(label);
    }
  }

  return Array.from(exports).sort();
}
