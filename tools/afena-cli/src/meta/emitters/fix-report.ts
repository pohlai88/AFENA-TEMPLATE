/**
 * Fix report emitter — writes .afena/meta.fix.report.json
 * documenting every file touched by autofix and what changed.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export interface FixAction {
  path: string;
  action: 'insert_capabilities' | 'append_capabilities' | 'insert_surface';
  keysAdded: string[];
}

export interface FixReport {
  version: '1.0';
  generatedAt: string;
  dryRun: boolean;
  files: FixAction[];
}

/**
 * Write the fix report to .afena/meta.fix.report.json.
 */
export function writeFixReport(
  repoRoot: string,
  report: FixReport,
): void {
  const outPath = join(repoRoot, '.afena', 'meta.fix.report.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n', 'utf-8');
}
