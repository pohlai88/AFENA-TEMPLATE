import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * G-LINT-01 — ESLint Configuration Governance Gate (Static Analysis)
 *
 * Enforces structural rules for eslint configs across the monorepo:
 *
 * RULE-01: Every package with source code MUST have an eslint config file
 * RULE-02: Packages with "type":"module" MUST use .cjs extension for eslint config
 * RULE-03: Every eslint config MUST put ignores block BEFORE ...baseConfig spread
 * RULE-04: Every eslint config ignores MUST include dist/** and *.config.*
 * RULE-05: No eslint config may use the createRequire ESM hack
 * RULE-06: No eslint config may reference jest globals (use vitest)
 * RULE-07: parserOptions must use projectService:true (not project:'./tsconfig.json')
 */

const REPO_ROOT = resolve(__dirname, '../..');

function getSubdirs(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() && entry !== 'node_modules' && entry !== 'dist';
  });
}

function collectPackageDirs(): string[] {
  const dirs: string[] = [];

  // packages/*
  const pkgsDir = join(REPO_ROOT, 'packages');
  for (const entry of getSubdirs(pkgsDir)) {
    const pkgDir = join(pkgsDir, entry);
    if (existsSync(join(pkgDir, 'package.json'))) dirs.push(pkgDir);
  }

  // business-domain/*/*
  const bdDir = join(REPO_ROOT, 'business-domain');
  for (const family of getSubdirs(bdDir)) {
    for (const pkg of getSubdirs(join(bdDir, family))) {
      const pkgDir = join(bdDir, family, pkg);
      if (existsSync(join(pkgDir, 'package.json'))) dirs.push(pkgDir);
    }
  }

  // tools/* (except ci-gates which is a test-only package)
  const toolsDir = join(REPO_ROOT, 'tools');
  for (const entry of getSubdirs(toolsDir)) {
    if (entry === 'ci-gates' || entry === 'docs' || entry === 'quality-metrics') continue;
    const pkgDir = join(toolsDir, entry);
    if (existsSync(join(pkgDir, 'package.json'))) dirs.push(pkgDir);
  }

  // apps/*
  const appsDir = join(REPO_ROOT, 'apps');
  for (const entry of getSubdirs(appsDir)) {
    const pkgDir = join(appsDir, entry);
    if (existsSync(join(pkgDir, 'package.json'))) dirs.push(pkgDir);
  }

  return dirs;
}

function findEslintConfig(dir: string): string | null {
  for (const name of ['eslint.config.cjs', 'eslint.config.js', 'eslint.config.mjs']) {
    const full = join(dir, name);
    if (existsSync(full)) return full;
  }
  return null;
}

function readPkg(dir: string): Record<string, unknown> {
  try {
    return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8')) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function rel(absPath: string): string {
  return absPath
    .replace(REPO_ROOT + '\\', '')
    .replace(REPO_ROOT + '/', '')
    .replace(/\\/g, '/');
}

// Config packages that don't need eslint configs
const CONFIG_PACKAGES = ['eslint-config', 'typescript-config'];

const allDirs = collectPackageDirs();
const lintableDirs = allDirs.filter((dir) => {
  const name = dir.split(/[\\/]/).pop() ?? '';
  return !CONFIG_PACKAGES.includes(name) && existsSync(join(dir, 'src'));
});

// ─── RULE-01: Every lintable package has an eslint config ─────────────────────

describe('G-LINT-01 RULE-01: every package with src/ has an eslint config', () => {
  test('lintable packages exist', () => {
    expect(lintableDirs.length).toBeGreaterThan(0);
  });

  test('all lintable packages have eslint config', () => {
    const missing: string[] = [];
    for (const dir of lintableDirs) {
      if (!findEslintConfig(dir)) missing.push(rel(dir));
    }
    if (missing.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-01: ${missing.length} package(s) missing eslint config:\n\n` +
          missing.map((p) => `  ${p}`).join('\n'),
      );
    }
  });
});

// ─── RULE-02: type:module packages use .cjs extension ─────────────────────────

describe('G-LINT-01 RULE-02: type:module packages use .cjs eslint config', () => {
  test('no type:module package has eslint.config.js (must be .cjs)', () => {
    const violations: string[] = [];
    for (const dir of lintableDirs) {
      const pkg = readPkg(dir);
      if (pkg['type'] !== 'module') continue;
      const jsConfig = join(dir, 'eslint.config.js');
      if (existsSync(jsConfig)) {
        violations.push(
          `${rel(dir)} — has "type":"module" but uses eslint.config.js (rename to .cjs)`,
        );
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-02: ${violations.length} violation(s):\n\n` +
          violations.map((v) => `  ${v}`).join('\n'),
      );
    }
  });
});

// ─── RULE-03: ignores before baseConfig spread ────────────────────────────────

describe('G-LINT-01 RULE-03: ignores block before ...baseConfig', () => {
  test('no config has ...baseConfig before ignores', () => {
    const violations: string[] = [];
    for (const dir of lintableDirs) {
      const configPath = findEslintConfig(dir);
      if (!configPath) continue;
      const content = readFileSync(configPath, 'utf-8');
      // Find positions of ...baseConfig (or ...reactConfig or ...nextConfig) and ignores
      const spreadMatch = content.match(/\.\.\.(baseConfig|reactConfig|nextConfig)/);
      const ignoresMatch = content.match(/ignores\s*:/);
      if (spreadMatch && ignoresMatch) {
        const spreadIdx = content.indexOf(spreadMatch[0]);
        const ignoresIdx = content.indexOf(ignoresMatch[0]);
        if (spreadIdx < ignoresIdx) {
          violations.push(`${rel(configPath)} — ...${spreadMatch[1]} appears before ignores block`);
        }
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-03: ${violations.length} violation(s) — ignores must be first element:\n\n` +
          violations.map((v) => `  ${v}`).join('\n'),
      );
    }
  });
});

// ─── RULE-04: ignores must include dist/** and *.config.* ─────────────────────

describe('G-LINT-01 RULE-04: ignores include dist/** and *.config.*', () => {
  test('all configs ignore dist/** and *.config.*', () => {
    const violations: string[] = [];
    for (const dir of lintableDirs) {
      const configPath = findEslintConfig(dir);
      if (!configPath) continue;
      const content = readFileSync(configPath, 'utf-8');
      // domainConfig already includes { ignores: ['dist/**', '*.config.*'] }
      if (
        content.includes("require('afenda-eslint-config/domain')") ||
        content.includes('require("afenda-eslint-config/domain")')
      ) {
        continue;
      }
      if (!content.includes("'dist/**'") && !content.includes('"dist/**"')) {
        violations.push(`${rel(configPath)} — missing dist/** in ignores`);
      }
      if (
        !content.includes("'*.config.*'") &&
        !content.includes('"*.config.*"') &&
        !content.includes("'**/*.config.*'") &&
        !content.includes('"**/*.config.*"')
      ) {
        violations.push(`${rel(configPath)} — missing *.config.* in ignores`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-04: ${violations.length} violation(s):\n\n` +
          violations.map((v) => `  ${v}`).join('\n'),
      );
    }
  });
});

// ─── RULE-05: no createRequire ESM hack ───────────────────────────────────────

describe('G-LINT-01 RULE-05: no createRequire ESM hack in eslint configs', () => {
  test('no config uses createRequire', () => {
    const violations: string[] = [];
    for (const dir of lintableDirs) {
      const configPath = findEslintConfig(dir);
      if (!configPath) continue;
      const content = readFileSync(configPath, 'utf-8');
      if (content.includes('createRequire')) {
        violations.push(
          `${rel(configPath)} — uses createRequire hack (convert to CJS module.exports)`,
        );
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-05: ${violations.length} violation(s):\n\n` +
          violations.map((v) => `  ${v}`).join('\n'),
      );
    }
  });
});

// ─── RULE-06: no jest globals ─────────────────────────────────────────────────

describe('G-LINT-01 RULE-06: no jest globals in eslint configs', () => {
  test('no config references jest globals', () => {
    const violations: string[] = [];
    // Check shared config files
    const sharedDir = join(REPO_ROOT, 'packages', 'eslint-config');
    for (const file of ['base.js', 'react.js', 'next.js']) {
      const filePath = join(sharedDir, file);
      if (!existsSync(filePath)) continue;
      const content = readFileSync(filePath, 'utf-8');
      if (/jest\s*:\s*true/.test(content)) {
        violations.push(`packages/eslint-config/${file} — references jest globals (use vitest)`);
      }
    }
    // Check per-package configs
    for (const dir of lintableDirs) {
      const configPath = findEslintConfig(dir);
      if (!configPath) continue;
      const content = readFileSync(configPath, 'utf-8');
      if (/jest\s*:\s*true/.test(content)) {
        violations.push(`${rel(configPath)} — references jest globals (use vitest)`);
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-06: ${violations.length} violation(s):\n\n` +
          violations.map((v) => `  ${v}`).join('\n'),
      );
    }
  });
});

// ─── RULE-07: projectService:true not project:'./tsconfig.json' ───────────────

describe('G-LINT-01 RULE-07: use projectService:true not project path', () => {
  test('no config uses project: ./tsconfig.json', () => {
    const violations: string[] = [];
    for (const dir of lintableDirs) {
      const configPath = findEslintConfig(dir);
      if (!configPath) continue;
      const content = readFileSync(configPath, 'utf-8');
      if (/project\s*:\s*['"]\.\/tsconfig\.json['"]/.test(content)) {
        violations.push(
          `${rel(configPath)} — uses project:'./tsconfig.json' (use projectService:true)`,
        );
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `G-LINT-01 RULE-07: ${violations.length} violation(s):\n\n` +
          violations.map((v) => `  ${v}`).join('\n'),
      );
    }
  });
});
