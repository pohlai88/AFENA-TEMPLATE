import { createHash } from 'crypto';

import fg from 'fast-glob';

import { collectArchitectureData } from '../capability/collectors/architecture-introspector';
import { generateArchitectureDocs, writeArchitectureDocs } from '../capability/emitters/architecture';
import { safeExists, safeReadFile, safeWriteFile } from '../core/fs-safe';
import { log } from '../core/logger';
import { parseJson, PackageJsonSchema } from '../core/parse-json';
import { toPosix } from '../core/paths';

import { analyzePackage } from './analyzer';
import { renderReadme } from './renderer';
import { computeReadmeSignature, loadReadmeSignature, saveReadmeSignature } from './signature';
import { AUTOGEN_START, AUTOGEN_END, TEMPLATE_VERSION, renderRootReadme } from './templates';
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
    ['apps/*/package.json', 'packages/*/package.json', 'tools/*/package.json'],
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
        const pkg = parseJson(
          safeReadFile(repoRoot, ...d.split('/'), 'package.json'),
          PackageJsonSchema
        );
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
export function runReadmeCommand(
  options: ReadmeCommandOptions
): ReadmeCommandResult {
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
    const readmeExists = safeExists(repoRoot, ...pkgDir.split('/'), 'README.md');

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

  // Root README (only when no specific packages targeted)
  if (!options.packages || options.packages.length === 0) {
    const rootAction = generateRootReadme(repoRoot, pkgDirs, mode, dryRun);
    if (rootAction === 'generated') result.generated.push('(root)');
    else if (rootAction === 'updated') result.updated.push('(root)');
    else if (rootAction === 'skipped') result.skipped.push('(root)');
    else if (rootAction === 'failed') {
      result.failures.push({ pkg: '(root)', reasons: ['Root README generation failed'] });
    }
  }

  // Architecture docs (gen mode only, full workspace run)
  if (mode === 'gen' && (!options.packages || options.packages.length === 0)) {
    generateArchitectureDocuments(repoRoot, dryRun);
  }

  // Print summary
  printSummary(mode, result, dryRun);

  return result;
}

/**
 * Generate or update the root monorepo README autogen block.
 */
function generateRootReadme(
  repoRoot: string,
  pkgDirs: string[],
  mode: 'gen' | 'sync' | 'check',
  dryRun?: boolean
): 'generated' | 'updated' | 'skipped' | 'failed' {
  const readmeExists = safeExists(repoRoot, 'README.md');

  if (mode === 'sync' && !readmeExists) return 'skipped';
  if (mode === 'check') return 'skipped';

  // Read root package.json
  const rootPkg = parseJson(safeReadFile(repoRoot, 'package.json'), PackageJsonSchema);
  const rootName = rootPkg.name ?? 'monorepo';
  const rootScripts = rootPkg.scripts ?? {};

  // Analyze all packages for the root overview
  const packages = pkgDirs.map((dir) => {
    const model = analyzePackage(dir, repoRoot);
    return {
      dir,
      name: model.identity.name,
      description: model.identity.description,
      packageType: model.identity.packageType,
    };
  });

  // Compute signature for root
  const payload = JSON.stringify({ packages, rootScripts, v: TEMPLATE_VERSION });
  const sig = `sha256:${createHash('sha256').update(payload).digest('hex')}`;

  // Check cached signature
  const oldSig = loadReadmeSignature('__root__', repoRoot);
  if (sig === oldSig && readmeExists) return 'skipped';

  // Render
  const markdown = renderRootReadme({
    name: rootName,
    packages,
    scripts: rootScripts,
    signature: sig,
  });
  const autogenBlock = `${AUTOGEN_START}\n${markdown}\n${AUTOGEN_END}`;

  if (dryRun) {
    log.bold(`\n--- (root) (${readmeExists ? 'update' : 'create'}) ---`);
    log.info(autogenBlock);
    log.bold(`--- end (root) ---\n`);
    return readmeExists ? 'updated' : 'generated';
  }

  if (!readmeExists) {
    safeWriteFile(repoRoot, `${autogenBlock}\n`, 'README.md');
    saveReadmeSignature('__root__', repoRoot, sig);
    return 'generated';
  }

  const existing = safeReadFile(repoRoot, 'README.md');
  const hasStart = existing.includes(AUTOGEN_START);
  const hasEnd = existing.includes(AUTOGEN_END);

  if (hasStart && hasEnd) {
    const startIdx = existing.indexOf(AUTOGEN_START);
    const endIdx = existing.indexOf(AUTOGEN_END);
    if (startIdx >= 0 && endIdx > startIdx) {
      const before = existing.substring(0, startIdx);
      const after = existing.substring(endIdx + AUTOGEN_END.length);
      safeWriteFile(repoRoot, `${before}${autogenBlock}${after}`, 'README.md');
      saveReadmeSignature('__root__', repoRoot, sig);
      return 'updated';
    }
  }

  // No markers — prepend autogen block, keep existing content below
  safeWriteFile(repoRoot, `${autogenBlock}\n\n${existing}`, 'README.md');
  saveReadmeSignature('__root__', repoRoot, sig);
  return 'updated';
}

/**
 * Collect architecture data and generate .architecture/*.architecture.md files.
 */
function generateArchitectureDocuments(
  repoRoot: string,
  dryRun?: boolean,
): void {
  const packages = collectArchitectureData(repoRoot);
  const docs = generateArchitectureDocs(packages);

  if (docs.size === 0) {
    log.dim('No architecture documents to generate.');
    return;
  }

  if (dryRun) {
    log.bold(`\n[dry-run] Would generate ${docs.size} architecture doc(s):`);
    for (const filename of docs.keys()) {
      log.info(`  .architecture/${filename}`);
    }
    return;
  }

  const written = writeArchitectureDocs(repoRoot, docs);
  log.success(`Generated ${written.length} architecture doc(s): ${written.join(', ')}`);
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
