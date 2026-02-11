import { existsSync } from 'fs';
import { join } from 'path';
import fg from 'fast-glob';
import { log } from '../utils/logger';
import { toPosix } from '../utils/paths';
import { analyzePackage } from './analyzer';
import { computeReadmeSignature, loadReadmeSignature, saveReadmeSignature } from './signature';
import { renderReadme } from './renderer';
import { writeReadme, validateReadme } from './writer';
import type { AfenaConfig } from '../types';

export interface ReadmeCommandOptions {
  mode: 'gen' | 'sync' | 'check';
  packages?: string[];
  repoRoot: string;
  config: AfenaConfig;
  dryRun?: boolean;
}

export interface ReadmeCommandResult {
  generated: string[];
  updated: string[];
  skipped: string[];
  failures: Array<{ pkg: string; reasons: string[] }>;
  checkPassed: boolean;
}

/**
 * Resolve package targets from CLI options.
 * --package <name> → scan workspace for matching name
 * --dir <path> → use directly
 * no flag → all workspace packages
 */
function resolvePackages(
  repoRoot: string,
  config: AfenaConfig,
  packages?: string[]
): string[] {
  // Find all workspace package directories
  const pkgJsons: string[] = fg.sync(
    ['apps/*/package.json', 'packages/*/package.json'],
    { cwd: repoRoot, absolute: false }
  );

  const allPkgDirs = pkgJsons
    .map((p) => toPosix(p).replace('/package.json', ''))
    .sort();

  if (!packages || packages.length === 0) {
    // Filter out ignored
    const ignoreSet = new Set(config.docs.readme.ignore.map(toPosix));
    return allPkgDirs.filter((d) => !ignoreSet.has(d));
  }

  // Resolve each target
  const resolved: string[] = [];
  for (const target of packages) {
    // Try as directory first
    const posixTarget = toPosix(target);
    if (allPkgDirs.includes(posixTarget)) {
      resolved.push(posixTarget);
      continue;
    }

    // Try as package name
    const match = allPkgDirs.find((d) => {
      try {
        const pkgPath = join(repoRoot, d, 'package.json');
        const pkg = JSON.parse(require('fs').readFileSync(pkgPath, 'utf-8'));
        return pkg.name === target;
      } catch {
        return false;
      }
    });

    if (match) {
      resolved.push(match);
    } else {
      log.warn(`Could not resolve package target: ${target}`);
    }
  }

  return resolved;
}

/**
 * Shared engine for all readme entrypoints.
 * Called by `afena readme gen|sync|check` and `discover --fix-readmes`.
 */
export async function runReadmeCommand(
  options: ReadmeCommandOptions
): Promise<ReadmeCommandResult> {
  const { mode, repoRoot, config, dryRun } = options;
  const pkgDirs = resolvePackages(repoRoot, config, options.packages);

  const result: ReadmeCommandResult = {
    generated: [],
    updated: [],
    skipped: [],
    failures: [],
    checkPassed: true,
  };

  for (const pkgDir of pkgDirs) {
    // 1. Analyze
    const model = analyzePackage(pkgDir, repoRoot);

    // 2. Compute signature
    const newSig = computeReadmeSignature(model);
    const oldSig = loadReadmeSignature(pkgDir, repoRoot);

    // 3. Check mode — validate only, no writes
    if (mode === 'check') {
      const reasons = validateReadme(pkgDir, repoRoot, newSig, model.identity.name);
      if (reasons.length > 0) {
        result.failures.push({ pkg: pkgDir, reasons });
        result.checkPassed = false;
      } else {
        result.skipped.push(pkgDir);
      }
      continue;
    }

    // 4. Signature unchanged → skip (gen/sync)
    const readmeExists = existsSync(join(repoRoot, pkgDir, 'README.md'));

    if (newSig === oldSig && readmeExists) {
      result.skipped.push(pkgDir);
      continue;
    }

    // 5. Sync mode: skip missing (don't create new files)
    if (mode === 'sync' && !readmeExists) {
      result.skipped.push(pkgDir);
      continue;
    }

    // 6. Render
    const markdown = renderReadme(model, newSig);

    if (dryRun) {
      log.bold(`\n--- ${pkgDir} (${readmeExists ? 'update' : 'create'}) ---`);
      log.info(markdown);
      log.bold(`--- end ${pkgDir} ---\n`);
      if (readmeExists) {
        result.updated.push(pkgDir);
      } else {
        result.generated.push(pkgDir);
      }
      continue;
    }

    // 7. Write
    const writeResult = writeReadme(pkgDir, repoRoot, markdown);

    if (writeResult.error) {
      result.failures.push({ pkg: pkgDir, reasons: [writeResult.error] });
      continue;
    }

    // 8. Save signature cache
    saveReadmeSignature(pkgDir, repoRoot, newSig);

    if (writeResult.action === 'created') {
      result.generated.push(pkgDir);
    } else if (writeResult.action === 'updated') {
      result.updated.push(pkgDir);
    } else {
      result.skipped.push(pkgDir);
    }
  }

  // Print summary
  printSummary(mode, result, dryRun);

  return result;
}

function printSummary(
  mode: string,
  result: ReadmeCommandResult,
  dryRun?: boolean
): void {
  const prefix = dryRun ? '[dry-run] ' : '';

  if (result.generated.length > 0) {
    log.success(`${prefix}Generated ${result.generated.length} README(s): ${result.generated.join(', ')}`);
  }
  if (result.updated.length > 0) {
    log.success(`${prefix}Updated ${result.updated.length} README(s): ${result.updated.join(', ')}`);
  }
  if (result.skipped.length > 0 && mode !== 'check') {
    log.dim(`${prefix}Skipped ${result.skipped.length} (unchanged): ${result.skipped.join(', ')}`);
  }
  if (result.failures.length > 0) {
    for (const f of result.failures) {
      log.error(`${f.pkg}: ${f.reasons.join('; ')}`);
    }
  }
  if (mode === 'check') {
    if (result.checkPassed) {
      log.success('All READMEs pass validation.');
    } else {
      log.error(`${result.failures.length} package(s) failed validation.`);
    }
  }
}
