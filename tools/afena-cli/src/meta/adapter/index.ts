/**
 * ERP Refactor Adapter Pipeline — 6-stage flow.
 * afena meta scan | transform | analyze | map | adopt | run | validate
 */

import { Command } from 'commander';
import pc from 'picocolors';
import { findRepoRoot } from '../../utils/paths';
import { runScan } from './scan';
import { runTransform } from './transform';
import { runAnalyze } from './analyze';
import { runMap } from './map';
import { runAdopt } from './adopt';
import { runFullPipeline } from './run';
import { runValidate } from './validate';

export function registerAdapterCommands(meta: Command): void {
  meta
    .command('scan')
    .description('Stage 1: Ingest refactor canon + manifest; output .afena/meta/raw/')
    .action(async () => {
      const repoRoot = findRepoRoot();
      await runScan(repoRoot);
      console.log(pc.green('  ✓ Stage 1 complete'));
    });

  meta
    .command('transform')
    .description('Stage 2: Transform to neutral canonical intermediate')
    .action(async () => {
      const repoRoot = findRepoRoot();
      await runTransform(repoRoot);
      console.log(pc.green('  ✓ Stage 2 complete'));
    });

  meta
    .command('analyze')
    .description('Stage 3: Analyze collisions, spine lock, link targets')
    .action(async () => {
      const repoRoot = findRepoRoot();
      await runAnalyze(repoRoot);
      console.log(pc.green('  ✓ Stage 3 complete'));
    });

  meta
    .command('map')
    .description('Stage 5: Apply mapping table + policies → LocalEntitySpec candidates')
    .action(async () => {
      const repoRoot = findRepoRoot();
      await runMap(repoRoot);
      console.log(pc.green('  ✓ Stage 5 complete'));
    });

  meta
    .command('adopt')
    .description('Stage 6: Validate spec, write to packages/canon/src/specs/entities/')
    .option('--entity <entityType>', 'Adopt specific entity only')
    .action(async (opts: { entity?: string }) => {
      const repoRoot = findRepoRoot();
      await runAdopt(repoRoot, opts.entity);
      console.log(pc.green('  ✓ Stage 6 complete'));
    });

  meta
    .command('run')
    .description('Full pipeline: scan → transform → analyze → transfer → map → adopt')
    .option('--entity <entityType>', 'Run for specific entity only (e.g. video-settings)')
    .option('--dry-run', 'Run through map only; skip adopt (no spec writes)')
    .option(
      '--emit-locked-specs <mode>',
      'Include locked entities in spec candidates: none (default), ui (spec for UI mining), all',
    )
    .action(async (opts: { entity?: string; dryRun?: boolean; emitLockedSpecs?: string }) => {
      const repoRoot = findRepoRoot();
      const emitLocked =
        (opts.emitLockedSpecs as 'none' | 'ui' | 'all') ?? 'none';
      await runFullPipeline(repoRoot, opts.entity, opts.dryRun, emitLocked);
      console.log(pc.green(opts.dryRun ? '  ✓ Dry run complete (no specs written)' : '  ✓ Full pipeline complete'));
    });

  meta
    .command('validate')
    .description('Contract + drift checks on specs')
    .action(async () => {
      const repoRoot = findRepoRoot();
      const ok = await runValidate(repoRoot);
      if (!ok) process.exit(1);
      console.log(pc.green('  ✓ Validation passed'));
    });
}
