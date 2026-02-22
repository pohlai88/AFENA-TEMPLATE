import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * G-TS-01 — TypeScript & tsup Configuration Governance Gate (Static Analysis)
 *
 * Enforces the rules from .agents/skills/ts-tsup-config/SKILL.md:
 *
 * RULE-01: Source-first domain packages (business-domain/family/name) MUST NOT have
 *          composite:true, noEmit:false, outDir, or tsup.config.ts
 * RULE-02: Source-first domain packages MUST point main/types to ./src/index.ts
 * RULE-03: Source-first domain packages MUST NOT appear in root tsconfig references
 * RULE-04: Library packages (packages/*) with tsup.config.ts MUST have tsconfig.build.json
 * RULE-05: Every tsup.config.ts MUST reference tsconfig.build.json (not tsconfig.json)
 * RULE-06: Root tsconfig.json references MUST only contain packages/* entries
 */

const REPO_ROOT = resolve(__dirname, '../..');
const PACKAGES_DIR = join(REPO_ROOT, 'packages');
const BUSINESS_DOMAIN_DIR = join(REPO_ROOT, 'business-domain');
const ROOT_TSCONFIG = join(REPO_ROOT, 'tsconfig.json');

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(filePath: string): Record<string, unknown> {
  try {
    const raw = readFileSync(filePath, 'utf-8');
    // Strip single-line comments for jsonc support
    const stripped = raw.replace(/\/\/[^\n]*/g, '');
    return JSON.parse(stripped) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function getSubdirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() && entry !== 'node_modules' && entry !== 'dist';
  });
}

/** Collect all business-domain/<family>/<name> leaf package dirs */
function collectDomainPackageDirs(): string[] {
  const dirs: string[] = [];
  for (const family of getSubdirs(BUSINESS_DOMAIN_DIR)) {
    for (const pkg of getSubdirs(join(BUSINESS_DOMAIN_DIR, family))) {
      const pkgDir = join(BUSINESS_DOMAIN_DIR, family, pkg);
      if (existsSync(join(pkgDir, 'package.json'))) {
        dirs.push(pkgDir);
      }
    }
  }
  return dirs;
}

/** Collect all packages/* dirs that have a package.json */
function collectLibraryPackageDirs(): string[] {
  return getSubdirs(PACKAGES_DIR).filter((entry) =>
    existsSync(join(PACKAGES_DIR, entry, 'package.json')),
  ).map((entry) => join(PACKAGES_DIR, entry));
}

function relPath(absPath: string): string {
  return absPath.replace(REPO_ROOT + '\\', '').replace(REPO_ROOT + '/', '');
}

// ─── RULE-01: Domain packages must not use composite/noEmit:false/outDir ────

describe('G-TS-01 RULE-01: source-first domain packages have no build-mode tsconfig', () => {
  const domainDirs = collectDomainPackageDirs();

  test('business-domain packages exist', () => {
    expect(domainDirs.length).toBeGreaterThan(0);
  });

  test('no domain package has composite:true in tsconfig.json', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      const tsconfig = readJson(join(dir, 'tsconfig.json'));
      const opts = (tsconfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      if (opts['composite'] === true) {
        violations.push(`${relPath(dir)}/tsconfig.json — composite:true forbidden on source-first packages`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-01: ${violations.length} domain package(s) have composite:true.\n` +
        `Source-first packages must NOT use composite. Remove it and remove from root tsconfig references.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('no domain package has noEmit:false explicitly set', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      const tsconfig = readJson(join(dir, 'tsconfig.json'));
      const opts = (tsconfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      if (opts['noEmit'] === false) {
        violations.push(`${relPath(dir)}/tsconfig.json — noEmit:false forbidden (source-first packages don't emit)`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-01: ${violations.length} domain package(s) have noEmit:false.\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('no domain package has outDir set in tsconfig.json', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      const tsconfig = readJson(join(dir, 'tsconfig.json'));
      const opts = (tsconfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      if (opts['outDir'] !== undefined) {
        violations.push(`${relPath(dir)}/tsconfig.json — outDir forbidden on source-first packages`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-01: ${violations.length} domain package(s) have outDir set.\n` +
        `Source-first packages do not emit output. Remove outDir.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('no domain package has tsup.config.ts', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      if (existsSync(join(dir, 'tsup.config.ts'))) {
        violations.push(`${relPath(dir)}/tsup.config.ts — tsup forbidden on source-first packages`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-01: ${violations.length} domain package(s) have tsup.config.ts.\n` +
        `Source-first packages are consumed directly from src/. Delete tsup.config.ts.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('no domain package has tsconfig.build.json', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      if (existsSync(join(dir, 'tsconfig.build.json'))) {
        violations.push(`${relPath(dir)}/tsconfig.build.json — not needed on source-first packages`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-01: ${violations.length} domain package(s) have tsconfig.build.json.\n` +
        `Source-first packages do not build. Delete tsconfig.build.json.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });
});

// ─── RULE-02: Domain packages must point main/types to src/ ─────────────────

describe('G-TS-01 RULE-02: source-first domain packages point main/types to src/', () => {
  const domainDirs = collectDomainPackageDirs();

  test('all domain package.json main fields point to ./src/index.ts', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      const pkg = readJson(join(dir, 'package.json'));
      const main = pkg['main'] as string | undefined;
      if (!main) {
        violations.push(`${relPath(dir)}/package.json — missing "main" field`);
      } else if (!main.startsWith('./src/')) {
        violations.push(`${relPath(dir)}/package.json — "main": "${main}" must start with ./src/`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-02: ${violations.length} domain package(s) have wrong "main" field.\n` +
        `Source-first packages must use "main": "./src/index.ts"\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('all domain package.json exports default points to ./src/', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      const pkg = readJson(join(dir, 'package.json'));
      const exports = pkg['exports'] as Record<string, unknown> | undefined;
      if (!exports) continue; // no exports field is acceptable
      const dotExport = exports['.'] as Record<string, unknown> | undefined;
      if (!dotExport) continue;
      const defaultExport = dotExport['default'] as string | undefined;
      if (defaultExport && !defaultExport.startsWith('./src/')) {
        violations.push(
          `${relPath(dir)}/package.json — exports["."].default: "${defaultExport}" must start with ./src/`,
        );
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-02: ${violations.length} domain package(s) have wrong exports.default.\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('no domain package.json has a "build" script calling tsup', () => {
    const violations: string[] = [];
    for (const dir of domainDirs) {
      const pkg = readJson(join(dir, 'package.json'));
      const scripts = (pkg['scripts'] ?? {}) as Record<string, string>;
      if (scripts['build']?.includes('tsup')) {
        violations.push(`${relPath(dir)}/package.json — "build": "${scripts['build']}" calls tsup (forbidden)`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-02: ${violations.length} domain package(s) have a tsup build script.\n` +
        `Remove the build script. Source-first packages do not build.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });
});

// ─── RULE-03: Domain packages must NOT appear in root tsconfig references ────

describe('G-TS-01 RULE-03: root tsconfig.json references only library packages', () => {
  test('root tsconfig.json exists', () => {
    expect(existsSync(ROOT_TSCONFIG)).toBe(true);
  });

  test('no business-domain package appears in root tsconfig references', () => {
    if (!existsSync(ROOT_TSCONFIG)) return;
    const tsconfig = readJson(ROOT_TSCONFIG);
    const refs = (tsconfig['references'] ?? []) as Array<{ path: string }>;
    const violations = refs.filter((r) => r.path?.includes('business-domain'));
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-03: ${violations.length} business-domain package(s) in root tsconfig references.\n` +
        `Source-first packages must NOT appear in references (they have no composite:true).\n\n` +
        violations.map((v) => `  ${v.path}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('no apps/* package appears in root tsconfig references', () => {
    if (!existsSync(ROOT_TSCONFIG)) return;
    const tsconfig = readJson(ROOT_TSCONFIG);
    const refs = (tsconfig['references'] ?? []) as Array<{ path: string }>;
    const violations = refs.filter((r) => r.path?.startsWith('./apps/') || r.path?.startsWith('apps/'));
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-03: ${violations.length} apps/* package(s) in root tsconfig references.\n` +
        `Leaf apps must NOT appear in references.\n\n` +
        violations.map((v) => `  ${v.path}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });
});

// ─── RULE-04: Library packages with tsup must have tsconfig.build.json ───────

describe('G-TS-01 RULE-04: library packages with tsup have tsconfig.build.json', () => {
  const libraryDirs = collectLibraryPackageDirs();

  test('every packages/* with tsup.config.ts has tsconfig.build.json', () => {
    const violations: string[] = [];
    for (const dir of libraryDirs) {
      const hasTsup = existsSync(join(dir, 'tsup.config.ts'));
      const hasBuild = existsSync(join(dir, 'tsconfig.build.json'));
      if (hasTsup && !hasBuild) {
        violations.push(`${relPath(dir)} — has tsup.config.ts but missing tsconfig.build.json`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-04: ${violations.length} library package(s) missing tsconfig.build.json.\n` +
        `tsup DTS generation is incompatible with composite:true. tsconfig.build.json disables composite for tsup.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });

  test('every packages/* tsconfig.build.json sets composite:false', () => {
    const violations: string[] = [];
    for (const dir of libraryDirs) {
      const buildPath = join(dir, 'tsconfig.build.json');
      if (!existsSync(buildPath)) continue;
      const buildConfig = readJson(buildPath);
      const opts = (buildConfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      if (opts['composite'] !== false) {
        violations.push(`${relPath(dir)}/tsconfig.build.json — must have composite:false`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-04: ${violations.length} tsconfig.build.json file(s) missing composite:false.\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });
});

// ─── RULE-05: Every tsup.config.ts must reference tsconfig.build.json ────────

describe('G-TS-01 RULE-05: all tsup.config.ts files use tsconfig.build.json', () => {
  function findTsupConfigs(rootDir: string): string[] {
    const results: string[] = [];
    if (!existsSync(rootDir)) return results;
    for (const entry of readdirSync(rootDir)) {
      const full = join(rootDir, entry);
      if (statSync(full).isDirectory() && entry !== 'node_modules' && entry !== 'dist') {
        results.push(...findTsupConfigs(full));
      } else if (entry === 'tsup.config.ts') {
        results.push(full);
      }
    }
    return results;
  }

  const tsupConfigs = [
    ...findTsupConfigs(PACKAGES_DIR),
    ...findTsupConfigs(join(REPO_ROOT, 'tools')),
  ];

  test('tsup config files exist in packages/ or tools/', () => {
    expect(tsupConfigs.length).toBeGreaterThan(0);
  });

  test('all tsup.config.ts files reference tsconfig.build.json not tsconfig.json', () => {
    const violations: string[] = [];
    for (const configPath of tsupConfigs) {
      const content = readFileSync(configPath, 'utf-8');
      // Check for tsconfig: './tsconfig.json' (wrong) — but not tsconfig.build.json
      const wrongRef = /tsconfig\s*:\s*['"]\.\/tsconfig\.json['"]/;
      if (wrongRef.test(content)) {
        violations.push(
          `${relPath(configPath)} — tsconfig: './tsconfig.json' must be './tsconfig.build.json'`,
        );
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-05: ${violations.length} tsup.config.ts file(s) reference tsconfig.json directly.\n` +
        `tsup DTS build fails when composite:true is active. Use tsconfig.build.json instead.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });
});

// ─── RULE-06: Root tsconfig references must only contain packages/* ──────────

describe('G-TS-01 RULE-06: root tsconfig references are all valid library packages', () => {
  test('every path in root tsconfig references has a tsconfig.json with composite:true', () => {
    if (!existsSync(ROOT_TSCONFIG)) return;
    const tsconfig = readJson(ROOT_TSCONFIG);
    const refs = (tsconfig['references'] ?? []) as Array<{ path: string }>;
    const violations: string[] = [];

    for (const ref of refs) {
      const absPath = resolve(REPO_ROOT, ref.path);
      const refTsconfig = join(absPath, 'tsconfig.json');
      if (!existsSync(refTsconfig)) {
        violations.push(`${ref.path} — referenced but tsconfig.json not found`);
        continue;
      }
      const refConfig = readJson(refTsconfig);
      const opts = (refConfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      // Allow packages that inherit composite from their base config
      // Only flag if explicitly set to false
      if (opts['composite'] === false) {
        violations.push(`${ref.path} — in root references but tsconfig.json has composite:false`);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `G-TS-01 RULE-06: ${violations.length} invalid root tsconfig reference(s).\n` +
        `Only library packages with composite:true should be in root references.\n\n` +
        violations.map((v) => `  ${v}`).join('\n'),
      );
    }
    expect(violations).toHaveLength(0);
  });
});
