/**
 * Full pipeline: scan → transform → analyze → (transfer internal) → map → adopt
 */

import { runScan } from './scan';
import { runTransform } from './transform';
import { runAnalyze } from './analyze';
import { runMap, type EmitLockedSpecs } from './map';
import { runAdopt } from './adopt';
import { initIrregulars } from './utils';
import pc from 'picocolors';

export async function runFullPipeline(
  repoRoot: string,
  entityFilter?: string,
  dryRun?: boolean,
  emitLockedSpecs: EmitLockedSpecs = 'none',
): Promise<void> {
  initIrregulars(repoRoot);
  console.log(pc.cyan('Stage 1: Ingest'));
  await runScan(repoRoot);
  console.log(pc.cyan('Stage 2: Transform'));
  await runTransform(repoRoot);
  console.log(pc.cyan('Stage 3: Analyze'));
  await runAnalyze(repoRoot);
  console.log(pc.cyan('Stage 5: Map'));
  await runMap(repoRoot, emitLockedSpecs);
  if (!dryRun) {
    console.log(pc.cyan('Stage 6: Adopt'));
    await runAdopt(repoRoot, entityFilter);
  } else {
    console.log(pc.dim('  [dry-run] Skipping adopt'));
  }
}
