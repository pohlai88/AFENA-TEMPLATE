/**
 * Architecture introspector — collects structural data from each package
 * for auto-generating .architecture/*.architecture.md documents.
 *
 * Scans: barrel exports, source directory tree, key interfaces/types,
 * invariant comments, test counts, and design pattern indicators.
 */

import { readFileSync, existsSync } from 'fs';
import { join, basename } from 'path';

import fg from 'fast-glob';

import { PackageJson, PackageJsonSchema, safeReadJsonAbsolute } from '../../core/parse-json';
import { toPosix } from '../../core/paths';

// ── Types ──────────────────────────────────────────────────

export interface ArchPackageInfo {
  /** Package name from package.json */
  name: string;
  /** Relative path (e.g. 'packages/crud') */
  path: string;
  /** Package description from package.json */
  description: string;
  /** Package type heuristic */
  packageType: 'library' | 'app' | 'tool' | 'config' | 'ui';
  /** Workspace dependencies (internal only) */
  internalDeps: string[];
  /** External production dependencies */
  externalDeps: Record<string, string>;
  /** Barrel exports extracted from index.ts */
  barrelExports: BarrelExport[];
  /** Source directory structure (top-level dirs under src/) */
  sourceDirs: string[];
  /** Source file count (non-test) */
  sourceFileCount: number;
  /** Test file count */
  testFileCount: number;
  /** Key types/interfaces found in source */
  keyTypes: string[];
  /** Invariant comments found (e.g. INVARIANT-01, K-01) */
  invariants: string[];
  /** Design patterns detected */
  patterns: string[];
  /** Database tables owned by this package (from schema files) */
  ownedTables: string[];
  /** README manual section (content below AUTOGEN:END) */
  manualReadmeContent: string;
}

export interface BarrelExport {
  name: string;
  kind: 'function' | 'class' | 'type' | 'const' | 'enum' | 'unknown';
  source: string;
}

// ── Regexes ────────────────────────────────────────────────

const EXPORT_REGEX = /export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
const TYPE_EXPORT_REGEX = /export\s+type\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
const INTERFACE_REGEX = /export\s+(?:interface|type)\s+(\w+)/g;
const CLASS_REGEX = /export\s+(?:abstract\s+)?class\s+(\w+)/g;
const INVARIANT_REGEX = /\b(INVARIANT[-_]\w+|K-\d+|VIS-\d+|UI-INV-\d+|TERM-\d+|OPS-\d+|ACC-\d+|GOV-\d+|SPD-\d+)/g;
const TABLE_REGEX = /pgTable\(\s*['"](\w+)['"]/g;

const PATTERN_INDICATORS: Record<string, RegExp> = {
  'Template Method': /abstract\s+class\s+\w+[^{]*\{[\s\S]*?abstract\s+/,
  'Strategy': /interface\s+\w+Detector|interface\s+\w+Strategy/,
  'Chain of Responsibility': /class\s+\w+Chain|addStep|addGate/,
  'Registry': /registry|Registry|registerRule|registerSearchableEntity|HANDLER_REGISTRY/,
  'Factory': /function\s+(?:create|build)\w+/,
  'Builder': /class\s+\w+Builder/,
  'Observer': /fire-and-forget|void\s+db\s*\.\s*insert/,
  'Singleton': /let\s+instance\s*:\s*\w+\s*\|\s*null\s*=\s*null/,
};

// ── Collector ──────────────────────────────────────────────

/**
 * Introspect all workspace packages for architecture-relevant data.
 */
export function collectArchitectureData(
  repoRoot: string,
): ArchPackageInfo[] {
  const pkgJsonPaths = fg.sync(
    ['apps/*/package.json', 'packages/*/package.json', 'tools/*/package.json'],
    { cwd: repoRoot, absolute: false },
  );

  const results: ArchPackageInfo[] = [];

  for (const pkgJsonRel of pkgJsonPaths.sort()) {
    const pkgDir = toPosix(pkgJsonRel).replace('/package.json', '');
    const info = introspectPackage(pkgDir, repoRoot);
    if (info) results.push(info);
  }

  return results;
}

function introspectPackage(
  pkgDir: string,
  repoRoot: string,
): ArchPackageInfo | null {
  const pkgJsonPath = join(repoRoot, pkgDir, 'package.json');
  if (!existsSync(pkgJsonPath)) return null;

  try {
    const pkg = safeReadJsonAbsolute(repoRoot, pkgJsonPath, PackageJsonSchema);
    const name: string = pkg.name ?? basename(pkgDir);
    const description: string = pkg.description ?? '';
    const deps: Record<string, string> = pkg.dependencies ?? {};
    const devDeps: Record<string, string> = pkg.devDependencies ?? {};

    const internalDeps = Object.entries({ ...deps, ...devDeps })
      .filter(([, v]) => v.startsWith('workspace:'))
      .map(([k]) => k)
      .sort();

    const externalDeps: Record<string, string> = {};
    for (const [k, v] of Object.entries(deps)) {
      if (!v.startsWith('workspace:')) externalDeps[k] = v;
    }

    const packageType = detectType(pkgDir, pkg);

    // Source files
    const srcFiles = fg.sync(
      [`${pkgDir}/src/**/*.{ts,tsx,js,jsx}`],
      {
        cwd: repoRoot,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
      },
    );

    const testFiles = srcFiles.filter(
      (f) => f.includes('.test.') || f.includes('.spec.') || f.includes('__tests__'),
    );
    const nonTestFiles = srcFiles.filter(
      (f) => !f.includes('.test.') && !f.includes('.spec.') && !f.includes('__tests__'),
    );

    // Source dirs (top-level under src/)
    const srcDirSet = new Set<string>();
    for (const f of nonTestFiles) {
      const rel = toPosix(f).replace(`${toPosix(join(repoRoot, pkgDir, 'src'))}/`, '');
      const parts = rel.split('/');
      if (parts.length > 1) srcDirSet.add(parts[0]);
    }
    const sourceDirs = [...srcDirSet].sort();

    // Barrel exports
    const barrelExports = extractBarrelExports(pkgDir, repoRoot);

    // Key types + invariants + patterns from all source files
    const keyTypes = new Set<string>();
    const invariants = new Set<string>();
    const patterns = new Set<string>();

    for (const f of nonTestFiles) {
      const content = readFileSync(f, 'utf-8');

      for (const m of content.matchAll(INTERFACE_REGEX)) keyTypes.add(m[1]);
      for (const m of content.matchAll(CLASS_REGEX)) keyTypes.add(m[1]);
      for (const m of content.matchAll(INVARIANT_REGEX)) invariants.add(m[1]);

      for (const [patternName, regex] of Object.entries(PATTERN_INDICATORS)) {
        if (regex.test(content)) patterns.add(patternName);
      }
    }

    // Owned tables (for database package or packages with schema files)
    const ownedTables: string[] = [];
    const schemaFiles = fg.sync(
      [`${pkgDir}/src/schema/*.ts`, `${pkgDir}/src/**/*schema*.ts`],
      { cwd: repoRoot, absolute: true, ignore: ['**/index.ts'] },
    );
    for (const sf of schemaFiles) {
      const content = readFileSync(sf, 'utf-8');
      for (const m of content.matchAll(TABLE_REGEX)) ownedTables.push(m[1]);
    }

    // Manual README content (below AUTOGEN:END)
    const manualReadmeContent = extractManualReadme(pkgDir, repoRoot);

    return {
      name,
      path: pkgDir,
      description,
      packageType,
      internalDeps,
      externalDeps,
      barrelExports,
      sourceDirs,
      sourceFileCount: nonTestFiles.length,
      testFileCount: testFiles.length,
      keyTypes: [...keyTypes].sort(),
      invariants: [...invariants].sort(),
      patterns: [...patterns].sort(),
      ownedTables: ownedTables.sort(),
      manualReadmeContent,
    };
  } catch {
    return null;
  }
}

function detectType(
  pkgDir: string,
  pkg: PackageJson,
): ArchPackageInfo['packageType'] {
  if (pkgDir.startsWith('apps/')) return 'app';
  if (pkgDir.startsWith('tools/')) return 'tool';
  const name = (pkg.name ?? '').toLowerCase();
  if (name.includes('config') || name.includes('eslint')) return 'config';
  const allDeps: Record<string, string> = {
    ...(pkg.dependencies ?? {}),
    ...(pkg.peerDependencies ?? {}),
  };
  if ('react' in allDeps || 'react-dom' in allDeps) return 'ui';
  return 'library';
}

function extractBarrelExports(
  pkgDir: string,
  repoRoot: string,
): BarrelExport[] {
  const candidates = [
    join(repoRoot, pkgDir, 'src', 'index.ts'),
    join(repoRoot, pkgDir, 'src', 'index.tsx'),
  ];

  for (const barrelPath of candidates) {
    if (!existsSync(barrelPath)) continue;

    const content = readFileSync(barrelPath, 'utf-8');
    const exports: BarrelExport[] = [];

    // Value exports
    for (const m of content.matchAll(EXPORT_REGEX)) {
      const names = m[1].split(',').map((n) => n.trim()).filter(Boolean);
      const source = m[2];
      for (const n of names) {
        const cleanName = n.includes(' as ') ? n.split(' as ')[1].trim() : n;
        exports.push({ name: cleanName, kind: 'function', source });
      }
    }

    // Type exports
    for (const m of content.matchAll(TYPE_EXPORT_REGEX)) {
      const names = m[1].split(',').map((n) => n.trim()).filter(Boolean);
      const source = m[2];
      for (const n of names) {
        const cleanName = n.includes(' as ') ? n.split(' as ')[1].trim() : n;
        exports.push({ name: cleanName, kind: 'type', source });
      }
    }

    return exports;
  }

  return [];
}

function extractManualReadme(pkgDir: string, repoRoot: string): string {
  const readmePath = join(repoRoot, pkgDir, 'README.md');
  if (!existsSync(readmePath)) return '';

  const content = readFileSync(readmePath, 'utf-8');
  const endMarker = '<!-- AUTOGEN:END -->';
  const idx = content.indexOf(endMarker);
  if (idx === -1) return content.trim();

  return content.slice(idx + endMarker.length).trim();
}
