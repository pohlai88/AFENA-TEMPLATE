import type { Command } from 'commander';

import { findRepoRoot } from '../core/paths';
import { runDomainNew } from './generator';

interface DomainNewOpts {
  dryRun?: boolean;
}

export function registerDomainCommand(program: Command): void {
  const domainCmd = program
    .command('domain')
    .description('Business domain package commands');

  domainCmd
    .command('new <family/name>')
    .description('Scaffold a new domain package at business-domain/<family>/<name>')
    .option('--dry-run', 'Preview files without writing')
    .action((familySlashName: string, opts: DomainNewOpts) => {
      const parts = familySlashName.split('/');
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        console.error(
          `Error: argument must be in the form <family>/<name>, e.g. "finance/payroll"\n`,
        );
        process.exitCode = 1;
        return;
      }

      const [familyName, packageName] = parts;
      const repoRoot = findRepoRoot();

      runDomainNew({
        repoRoot,
        familyName,
        packageName,
        dryRun: opts.dryRun,
      });
    });
}
