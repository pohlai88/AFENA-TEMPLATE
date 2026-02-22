import type { Command } from 'commander';

import { findRepoRoot } from '../core/paths';
import { printTsCheckResult, runTsCheck } from './ts-checker';

export function registerDoctorCommand(program: Command): void {
  const doctorCmd = program
    .command('doctor')
    .description('Audit monorepo configuration for common issues');

  doctorCmd
    .command('ts')
    .description('Audit TypeScript & tsup configuration against governance rules')
    .option('--fix', 'Show fix instructions for each violation (read-only, no auto-fix)')
    .action(() => {
      const repoRoot = findRepoRoot();
      const result = runTsCheck(repoRoot);
      printTsCheckResult(result, repoRoot);
      if (!result.ok) process.exitCode = 1;
    });
}
