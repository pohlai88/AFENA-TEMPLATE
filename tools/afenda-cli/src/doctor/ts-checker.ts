import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { log } from '../core/logger';

export interface TsCheckResult {
  ok: boolean;
  violations: Violation[];
  checked: number;
}

interface Violation {
  rule: string;
  path: string;
  message: string;
}

function readJson(filePath: string): Record<string, unknown> {
  try {
    const raw = readFileSync(filePath, 'utf-8');
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

function collectDomainPackageDirs(repoRoot: string): string[] {
  const dirs: string[] = [];
  const bdDir = join(repoRoot, 'business-domain');
  for (const family of getSubdirs(bdDir)) {
    for (const pkg of getSubdirs(join(bdDir, family))) {
      const pkgDir = join(bdDir, family, pkg);
      if (existsSync(join(pkgDir, 'package.json'))) dirs.push(pkgDir);
    }
  }
  return dirs;
}

function collectLibraryPackageDirs(repoRoot: string): string[] {
  const pkgsDir = join(repoRoot, 'packages');
  return getSubdirs(pkgsDir)
    .filter((entry) => existsSync(join(pkgsDir, entry, 'package.json')))
    .map((entry) => join(pkgsDir, entry));
}

function findTsupConfigs(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory() && entry !== 'node_modules' && entry !== 'dist') {
      results.push(...findTsupConfigs(full));
    } else if (entry === 'tsup.config.ts') {
      results.push(full);
    }
  }
  return results;
}

function rel(repoRoot: string, absPath: string): string {
  return absPath.replace(repoRoot + '\\', '').replace(repoRoot + '/', '');
}

export function runTsCheck(repoRoot: string): TsCheckResult {
  const violations: Violation[] = [];
  let checked = 0;

  const domainDirs = collectDomainPackageDirs(repoRoot);
  const libraryDirs = collectLibraryPackageDirs(repoRoot);
  const rootTsconfig = join(repoRoot, 'tsconfig.json');

  // ── RULE-01: Domain packages must not use build-mode tsconfig ──────────────
  for (const dir of domainDirs) {
    checked++;
    const tsconfigPath = join(dir, 'tsconfig.json');
    const tsconfig = readJson(tsconfigPath);
    const opts = (tsconfig['compilerOptions'] ?? {}) as Record<string, unknown>;
    const p = rel(repoRoot, dir);

    if (opts['composite'] === true) {
      violations.push({ rule: 'RULE-01', path: p, message: 'tsconfig.json has composite:true — forbidden on source-first packages' });
    }
    if (opts['noEmit'] === false) {
      violations.push({ rule: 'RULE-01', path: p, message: 'tsconfig.json has noEmit:false — source-first packages do not emit' });
    }
    if (opts['outDir'] !== undefined) {
      violations.push({ rule: 'RULE-01', path: p, message: `tsconfig.json has outDir:"${opts['outDir']}" — remove it` });
    }
    if (existsSync(join(dir, 'tsup.config.ts'))) {
      violations.push({ rule: 'RULE-01', path: p, message: 'tsup.config.ts present — source-first packages must not build' });
    }
    if (existsSync(join(dir, 'tsconfig.build.json'))) {
      violations.push({ rule: 'RULE-01', path: p, message: 'tsconfig.build.json present — not needed on source-first packages' });
    }
  }

  // ── RULE-02: Domain packages must point main/types to src/ ─────────────────
  for (const dir of domainDirs) {
    const pkg = readJson(join(dir, 'package.json'));
    const p = rel(repoRoot, dir);
    const main = pkg['main'] as string | undefined;

    if (!main) {
      violations.push({ rule: 'RULE-02', path: p, message: 'package.json missing "main" field' });
    } else if (!main.startsWith('./src/')) {
      violations.push({ rule: 'RULE-02', path: p, message: `package.json "main":"${main}" must start with ./src/` });
    }

    const scripts = (pkg['scripts'] ?? {}) as Record<string, string>;
    if (scripts['build']?.includes('tsup')) {
      violations.push({ rule: 'RULE-02', path: p, message: `package.json "build":"${scripts['build']}" calls tsup — remove it` });
    }
  }

  // ── RULE-03: Domain packages must NOT appear in root tsconfig references ────
  if (existsSync(rootTsconfig)) {
    checked++;
    const tsconfig = readJson(rootTsconfig);
    const refs = (tsconfig['references'] ?? []) as Array<{ path: string }>;
    for (const ref of refs) {
      if (ref.path?.includes('business-domain')) {
        violations.push({ rule: 'RULE-03', path: 'tsconfig.json', message: `references contains "${ref.path}" — source-first packages must not be referenced` });
      }
      if (ref.path?.startsWith('./apps/') || ref.path?.startsWith('apps/')) {
        violations.push({ rule: 'RULE-03', path: 'tsconfig.json', message: `references contains "${ref.path}" — leaf apps must not be referenced` });
      }
    }
  }

  // ── RULE-04: Library packages with tsup must have tsconfig.build.json ───────
  for (const dir of libraryDirs) {
    checked++;
    const p = rel(repoRoot, dir);
    const hasTsup = existsSync(join(dir, 'tsup.config.ts'));
    const hasBuild = existsSync(join(dir, 'tsconfig.build.json'));
    if (hasTsup && !hasBuild) {
      violations.push({ rule: 'RULE-04', path: p, message: 'has tsup.config.ts but missing tsconfig.build.json' });
    }
    if (hasBuild) {
      const buildConfig = readJson(join(dir, 'tsconfig.build.json'));
      const opts = (buildConfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      if (opts['composite'] !== false) {
        violations.push({ rule: 'RULE-04', path: p, message: 'tsconfig.build.json must have composite:false' });
      }
    }
  }

  // ── RULE-05: Every tsup.config.ts must reference tsconfig.build.json ────────
  const tsupConfigs = [
    ...findTsupConfigs(join(repoRoot, 'packages')),
    ...findTsupConfigs(join(repoRoot, 'tools')),
  ];
  for (const configPath of tsupConfigs) {
    checked++;
    const content = readFileSync(configPath, 'utf-8');
    const wrongRef = /tsconfig\s*:\s*['"]\.\/tsconfig\.json['"]/;
    if (wrongRef.test(content)) {
      violations.push({
        rule: 'RULE-05',
        path: rel(repoRoot, configPath),
        message: "tsconfig: './tsconfig.json' must be './tsconfig.build.json'",
      });
    }
  }

  // ── RULE-06: Root tsconfig references must be valid library packages ─────────
  if (existsSync(rootTsconfig)) {
    const tsconfig = readJson(rootTsconfig);
    const refs = (tsconfig['references'] ?? []) as Array<{ path: string }>;
    for (const ref of refs) {
      const absPath = resolve(repoRoot, ref.path);
      const refTsconfig = join(absPath, 'tsconfig.json');
      if (!existsSync(refTsconfig)) {
        violations.push({ rule: 'RULE-06', path: 'tsconfig.json', message: `references "${ref.path}" but tsconfig.json not found there` });
        continue;
      }
      const refConfig = readJson(refTsconfig);
      const opts = (refConfig['compilerOptions'] ?? {}) as Record<string, unknown>;
      if (opts['composite'] === false) {
        violations.push({ rule: 'RULE-06', path: 'tsconfig.json', message: `references "${ref.path}" but its tsconfig.json has composite:false` });
      }
    }
  }

  return { ok: violations.length === 0, violations, checked };
}

export function printTsCheckResult(result: TsCheckResult, repoRoot: string): void {
  const { ok, violations, checked } = result;

  log.bold('\nafenda doctor ts — TypeScript & tsup configuration audit\n');
  log.dim(`  Checked ${checked} packages across packages/ + business-domain/ + tools/\n`);

  if (ok) {
    log.success('✅ All checks passed — configuration is compliant.\n');
    return;
  }

  const byRule = new Map<string, Violation[]>();
  for (const v of violations) {
    const list = byRule.get(v.rule) ?? [];
    list.push(v);
    byRule.set(v.rule, list);
  }

  const ruleDescriptions: Record<string, string> = {
    'RULE-01': 'Source-first domain packages must not use build-mode tsconfig',
    'RULE-02': 'Source-first domain packages must point main/types to ./src/',
    'RULE-03': 'Domain packages must not appear in root tsconfig references',
    'RULE-04': 'Library packages with tsup must have tsconfig.build.json',
    'RULE-05': 'All tsup.config.ts files must reference tsconfig.build.json',
    'RULE-06': 'Root tsconfig references must be valid library packages',
  };

  for (const [rule, vs] of byRule) {
    log.warn(`\n  ${rule}: ${ruleDescriptions[rule] ?? rule}`);
    for (const v of vs) {
      const relP = v.path.replace(repoRoot + '\\', '').replace(repoRoot + '/', '');
      log.error(`    ✗ ${relP}`);
      log.dim(`      ${v.message}`);
    }
  }

  log.info(`\n  ${violations.length} violation(s) found. See .agents/skills/ts-tsup-config/SKILL.md for fixes.\n`);
}
