import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { log } from '../core/logger';
import { safeReadJson } from '../core/parse-json';
import { DiscoveryOutputSchema, RegistrySchema } from '../types';

import type { DiscoveryOutput, Registry, UngroupedScript } from '../types';

/**
 * Register discovered ungrouped scripts into afenda.registry.json.
 * By default, only writes to registry file — never edits package.json.
 */
export function registerDiscovered(
  repoRoot: string,
  options: { dryRun?: boolean; apply?: boolean; interactive?: boolean }
): void {
  const discoveryPath = join(repoRoot, '.afenda', 'discovery.json');
  if (!existsSync(discoveryPath)) {
    log.warn('No discovery.json found. Run `pnpm afenda discover` first.');
    return;
  }

  const discovery: DiscoveryOutput = safeReadJson(repoRoot, ['.afenda', 'discovery.json'], DiscoveryOutputSchema);
  if (discovery.ungrouped.length === 0) {
    log.success('No ungrouped scripts found. Registry is up to date.');
    return;
  }

  // Load current registry
  const registryPath = join(repoRoot, 'afenda.registry.json');
  let registry: Registry;
  if (existsSync(registryPath)) {
    registry = safeReadJson(repoRoot, ['afenda.registry.json'], RegistrySchema);
  } else {
    registry = RegistrySchema.parse({});
  }

  // Build proposed changes
  const changes: Array<{ script: UngroupedScript; group: string; subcommand?: string }> = [];

  for (const ungrouped of discovery.ungrouped) {
    const suggestion = ungrouped.suggestedCommand.replace('afenda ', '');
    const parts = suggestion.split(' ');
    const group = parts[0] || 'misc';

    changes.push({
      script: ungrouped,
      group,
      ...(ungrouped.currentScript ? { subcommand: ungrouped.currentScript } : {}),
    });
  }

  if (options.dryRun) {
    log.bold('Dry run — proposed registry changes:');
    log.info('');
    for (const change of changes) {
      const target = change.subcommand
        ? `${change.group}.subcommands.${change.subcommand}`
        : `${change.group}.default`;
      log.info(`  + ${target} → "${change.script.source}"`);
    }
    log.info('');
    log.dim(`Run without --dry-run to apply.`);
    return;
  }

  // Apply changes to registry
  for (const change of changes) {
    if (!registry.commands[change.group]) {
      registry.commands[change.group] = { subcommands: {} };
    }

    const cmd = registry.commands[change.group];
    if (!cmd) continue;
    if (change.subcommand) {
      cmd.subcommands ??= {};
      const scriptValue = change.script.currentScript
        ? `pnpm run ${change.script.currentScript}`
        : change.script.source;
      cmd.subcommands[change.subcommand] = scriptValue;
    } else {
      cmd.default = change.script.source;
    }
  }

  // Write updated registry
  const output = `${JSON.stringify(registry, null, 2)}\n`;

  if (options.dryRun) {
    log.info(output);
    return;
  }

  // Backup existing registry
  if (existsSync(registryPath)) {
    const backup = `${registryPath}.bak`;
    writeFileSync(backup, readFileSync(registryPath));
    log.dim(`Backup: ${backup}`);
  }

  writeFileSync(registryPath, output);
  log.success(`Registry updated: ${registryPath}`);
  log.info(`  ${changes.length} command(s) registered.`);
}
