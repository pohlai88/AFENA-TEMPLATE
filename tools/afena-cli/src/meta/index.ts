/**
 * Meta CLI commands — afena meta [gen|check|fix|matrix|manifest]
 *
 * gen      — scan surfaces, load exceptions, generate ledger + matrix + manifest + mermaid
 * check    — run VIS-00 through VIS-04, exit non-zero on failure
 * fix      — autofix missing annotations (--dry-run supported)
 * matrix   — shortcut to generate and print the matrix only
 * manifest — generate codebase manifest only
 */

import { Command } from 'commander';
import pc from 'picocolors';
import {
  CAPABILITY_CATALOG,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afena-canon';
import { findRepoRoot } from '../utils/paths';
import { scanSurfaces } from './collectors/surface-scanner';
import { collectPackageGraph } from './collectors/package-graph';
import { collectSchemaCatalog } from './collectors/schema-catalog';
import { collectStats } from './collectors/stats';
import { loadExceptions } from './exceptions';
import { checkVis00 } from './checks/vis-00-completeness';
import { checkVis01 } from './checks/vis-01-kernel';
import { checkVis02 } from './checks/vis-02-surface';
import { checkVis03 } from './checks/vis-03-ui-truth';
import { checkVis04 } from './checks/vis-04-dead-active';
import { generateLedger, writeLedger } from './emitters/ledger';
import { generateMatrix, writeMatrix } from './emitters/matrix';
import { generateManifest, writeManifest } from './emitters/manifest';
import { generateCapabilityMermaid, generateDependencyMermaid, writeMermaid } from './emitters/mermaid';
import { runAutofix } from './autofix';

/**
 * Step 23 — Kind inference validation.
 * Warns if a catalog entry has explicit `kind` that disagrees with inferKindFromVerb().
 */
function checkKindInference(): string[] {
  const warnings: string[] = [];
  for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
    if (!descriptor.kind) continue;
    const parsed = parseCapabilityKey(key);
    try {
      const inferred = inferKindFromVerb(parsed.verb);
      if (inferred !== descriptor.kind) {
        warnings.push(
          `"${key}": explicit kind "${descriptor.kind}" disagrees with inferred "${inferred}" (from verb "${parsed.verb}")`,
        );
      }
    } catch {
      // Unknown verb — already caught by validateCapabilityKey at module init
    }
  }
  return warnings;
}

export function registerMetaCommand(program: Command): void {
  const meta = program
    .command('meta')
    .description('Capability Truth Ledger — scan, check, generate, fix');

  // ── afena meta gen ──────────────────────────────────────
  meta
    .command('gen')
    .description('Scan surfaces + generate ledger and matrix')
    .action(async () => {
      const repoRoot = findRepoRoot();
      console.log(pc.cyan('Scanning surfaces...'));

      const scanResult = await scanSurfaces(repoRoot);
      console.log(
        `  Found ${pc.bold(String(scanResult.capabilities.length))} capability surfaces, ` +
        `${pc.bold(String(scanResult.uiSurfaces.length))} UI surfaces`,
      );

      const { exceptions, expired, reviewOverdue } = loadExceptions(repoRoot);
      if (expired.length > 0) {
        console.log(pc.yellow(`  ⚠ ${expired.length} expired exception(s)`));
      }
      if (reviewOverdue.length > 0) {
        console.log(pc.yellow(`  ⚠ ${reviewOverdue.length} review-overdue exception(s)`));
      }

      // Kind inference validation (step 23)
      const kindWarnings = checkKindInference();
      if (kindWarnings.length > 0) {
        console.log(pc.yellow(`\n  ⚠ Kind inference mismatches:`));
        for (const w of kindWarnings) {
          console.log(pc.yellow(`    ${w}`));
        }
      }

      const ledger = generateLedger(scanResult, exceptions);
      writeLedger(repoRoot, ledger);
      console.log(pc.green(`  ✓ Wrote .afena/capability.ledger.json`));

      const matrix = generateMatrix(ledger);
      writeMatrix(repoRoot, matrix);
      console.log(pc.green(`  ✓ Wrote .afena/capability.matrix.md`));

      // Collect structural metadata
      console.log(pc.cyan('\nCollecting structural metadata...'));
      const [packageGraph, schemaCatalog, repoStats] = await Promise.all([
        collectPackageGraph(repoRoot),
        collectSchemaCatalog(repoRoot),
        collectStats(repoRoot),
      ]);

      const manifest = generateManifest(packageGraph, schemaCatalog, repoStats);
      writeManifest(repoRoot, manifest);
      console.log(pc.green(`  ✓ Wrote .afena/codebase.manifest.json`));
      console.log(`    ${packageGraph.nodes.length} packages, ${schemaCatalog.tables.length} tables, ${repoStats.totalLoc} LOC`);

      // Generate Mermaid diagrams
      const capMermaid = generateCapabilityMermaid(ledger);
      const depMermaid = generateDependencyMermaid(packageGraph);
      writeMermaid(repoRoot, capMermaid, depMermaid);
      console.log(pc.green(`  ✓ Wrote .afena/capability.mermaid.md`));

      // Print summary
      console.log('');
      console.log(pc.bold('Summary:'));
      console.log(`  Covered:  ${ledger.summary.covered}`);
      console.log(`  Orphaned: ${ledger.summary.orphaned}`);
      console.log(`  Phantom:  ${ledger.summary.phantom}`);
      console.log(`  Excepted: ${ledger.summary.excepted}`);
      console.log(`  Planned:  ${ledger.summary.planned}`);
      console.log(`  Total:    ${ledger.summary.total}`);
    });

  // ── afena meta check ────────────────────────────────────
  meta
    .command('check')
    .description('Run VIS-00 through VIS-03 checks (exits non-zero on failure)')
    .action(async () => {
      const repoRoot = findRepoRoot();
      let hasErrors = false;
      let hasWarnings = false;

      console.log(pc.cyan('Running capability checks...'));

      // Load exceptions + scan
      const { exceptions, expired } = loadExceptions(repoRoot);
      if (expired.length > 0) {
        console.log(pc.red(`✗ ${expired.length} expired exception(s) — must renew or remove`));
        for (const exc of expired) {
          console.log(pc.red(`  ${exc.id}: ${exc.key} (expired ${exc.expiresOn})`));
        }
        hasErrors = true;
      }

      const scanResult = await scanSurfaces(repoRoot);

      // VIS-00
      console.log(pc.cyan('\nVIS-00: Canon Completeness for Mutations'));
      const vis00 = await checkVis00(repoRoot, exceptions);
      const vis00Errors = vis00.filter((v) => !v.exceptionId);
      if (vis00Errors.length > 0) {
        console.log(pc.red(`  ✗ ${vis00Errors.length} violation(s)`));
        for (const v of vis00Errors) {
          console.log(pc.red(`    ${v.file}: ${v.reason}`));
        }
        hasErrors = true;
      } else {
        console.log(pc.green(`  ✓ No violations`));
      }

      // VIS-01
      console.log(pc.cyan('\nVIS-01: Kernel Coverage'));
      const vis01 = checkVis01(exceptions);
      if (vis01.length > 0) {
        console.log(pc.red(`  ✗ ${vis01.length} violation(s)`));
        for (const v of vis01) {
          console.log(pc.red(`    ${v.key}: ${v.reason}`));
        }
        hasErrors = true;
      } else {
        console.log(pc.green(`  ✓ All mutation capabilities have kernel backing`));
      }

      // VIS-02
      console.log(pc.cyan('\nVIS-02: Surface Coverage'));
      const vis02 = checkVis02(scanResult, exceptions);
      const vis02Errors = vis02.filter((v) => v.severity === 'error');
      const vis02Warns = vis02.filter((v) => v.severity === 'warn');
      if (vis02Errors.length > 0) {
        console.log(pc.red(`  ✗ ${vis02Errors.length} error(s)`));
        for (const v of vis02Errors) {
          console.log(pc.red(`    ${v.key}: ${v.reason}`));
        }
        hasErrors = true;
      }
      if (vis02Warns.length > 0) {
        console.log(pc.yellow(`  ⚠ ${vis02Warns.length} warning(s)`));
        for (const v of vis02Warns) {
          console.log(pc.yellow(`    ${v.key}: ${v.reason}`));
        }
        hasWarnings = true;
      }
      if (vis02Errors.length === 0 && vis02Warns.length === 0) {
        console.log(pc.green(`  ✓ All active capabilities have surface coverage`));
      }

      // VIS-03
      console.log(pc.cyan('\nVIS-03: UI Rendering Truth'));
      const vis03 = checkVis03(scanResult.uiSurfaces);
      if (vis03.length > 0) {
        console.log(pc.red(`  ✗ ${vis03.length} phantom capability(ies)`));
        for (const v of vis03) {
          console.log(pc.red(`    ${v.file}: ${v.reason}`));
        }
        hasErrors = true;
      } else {
        console.log(pc.green(`  ✓ No phantom capabilities`));
      }

      // VIS-04
      console.log(pc.cyan('\nVIS-04: No Dead Active Capabilities'));
      const vis04 = checkVis04(scanResult, exceptions);
      if (vis04.length > 0) {
        console.log(pc.yellow(`  ⚠ ${vis04.length} warning(s)`));
        for (const v of vis04) {
          console.log(pc.yellow(`    ${v.key}: ${v.reason}`));
        }
        hasWarnings = true;
      } else {
        console.log(pc.green(`  ✓ No dead active capabilities`));
      }

      // Kind inference validation
      const kindWarnings = checkKindInference();
      if (kindWarnings.length > 0) {
        console.log(pc.yellow(`\n  ⚠ Kind inference mismatches:`));
        for (const w of kindWarnings) {
          console.log(pc.yellow(`    ${w}`));
        }
        hasWarnings = true;
      }

      console.log('');
      if (hasErrors) {
        console.log(pc.red(pc.bold('FAIL — capability checks found errors')));
        process.exit(1);
      } else if (hasWarnings) {
        console.log(pc.yellow(pc.bold('PASS with warnings — capability checks found non-blocking issues')));
      } else {
        console.log(pc.green(pc.bold('PASS — all capability checks passed')));
      }
    });

  // ── afena meta fix ──────────────────────────────────────
  meta
    .command('fix')
    .description('Autofix missing capability annotations')
    .option('--dry-run', 'Preview changes without writing files', false)
    .action(async (opts: { dryRun: boolean }) => {
      const repoRoot = findRepoRoot();
      const dryRun = opts.dryRun;

      console.log(pc.cyan(dryRun ? 'Autofix (dry run)...' : 'Autofix...'));

      const report = await runAutofix(repoRoot, dryRun);

      if (report.files.length === 0) {
        console.log(pc.green('  ✓ No files need fixing'));
      } else {
        for (const f of report.files) {
          const action = dryRun ? 'would' : 'did';
          console.log(
            pc.yellow(`  ${action} ${f.action} → ${f.path}`) +
            (f.keysAdded.length > 0 ? ` (${f.keysAdded.join(', ')})` : ''),
          );
        }
        console.log(pc.green(`\n  ✓ Wrote .afena/meta.fix.report.json`));
      }

      console.log(`\n  ${report.files.length} file(s) ${dryRun ? 'would be' : ''} touched`);
    });

  // ── afena meta matrix ───────────────────────────────────
  meta
    .command('matrix')
    .description('Generate and print the capability matrix')
    .action(async () => {
      const repoRoot = findRepoRoot();

      const scanResult = await scanSurfaces(repoRoot);
      const { exceptions } = loadExceptions(repoRoot);
      const ledger = generateLedger(scanResult, exceptions);
      const matrix = generateMatrix(ledger);

      writeMatrix(repoRoot, matrix);
      console.log(matrix);
    });

  // ── afena meta manifest ────────────────────────────────
  meta
    .command('manifest')
    .description('Generate codebase manifest (package graph, schema catalog, stats)')
    .action(async () => {
      const repoRoot = findRepoRoot();
      console.log(pc.cyan('Collecting structural metadata...'));

      const [packageGraph, schemaCatalog, repoStats] = await Promise.all([
        collectPackageGraph(repoRoot),
        collectSchemaCatalog(repoRoot),
        collectStats(repoRoot),
      ]);

      const manifest = generateManifest(packageGraph, schemaCatalog, repoStats);
      writeManifest(repoRoot, manifest);
      console.log(pc.green(`  ✓ Wrote .afena/codebase.manifest.json`));
      console.log(`    ${packageGraph.nodes.length} packages, ${schemaCatalog.tables.length} tables, ${repoStats.totalLoc} LOC`);
    });
}
