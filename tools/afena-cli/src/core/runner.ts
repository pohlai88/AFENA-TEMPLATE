import { execCommand } from '../core/exec';
import { log } from '../core/logger';

import { resolveCommand } from './resolver';

import type { CommandEntry, Registry } from '../types';

/**
 * Run a command from the registry by name.
 * Supports "types", "types:next", "docs:readme", etc.
 */
export async function runRegistryCommand(
  commandPath: string,
  registry: Registry,
  repoRoot: string,
  extraArgs: string[] = []
): Promise<number> {
  const parts = commandPath.split(':');
  const group = parts[0];
  const sub = parts[1];

  const cmd = registry.commands[group];
  if (!cmd) {
    const available = Object.keys(registry.commands).sort();
    log.error(`Unknown command group: ${group}`);
    if (available.length > 0) log.dim(`Available: ${available.join(', ')}`);
    return 1;
  }

  let entry: CommandEntry | undefined;

  if (sub) {
    const subs = cmd.subcommands ?? {};
    entry = subs[sub];
    if (!entry) {
      log.error(`Unknown subcommand: ${group}:${sub}`);
      const available = Object.keys(subs).sort();
      if (available.length > 0) {
        log.dim(`Available: ${available.map((s) => `${group}:${s}`).join(', ')}`);
      }
      return 1;
    }
  } else if (cmd.default) {
    entry = cmd.default;
  } else {
    // No default — run all subcommands
    const subs = cmd.subcommands ?? {};
    const subKeys = Object.keys(subs).sort();
    if (subKeys.length === 0) {
      log.error(`Command "${group}" has no default and no subcommands`);
      return 1;
    }

    log.bold(`Running all ${group} subcommands...`);
    let exitCode = 0;
    for (const key of subKeys) {
      log.info(`\n→ ${group}:${key}`);
      const code = await runRegistryCommand(`${group}:${key}`, registry, repoRoot, extraArgs);
      if (code !== 0) exitCode = code;
    }
    return exitCode;
  }

  const resolved = resolveCommand(entry, repoRoot);

  // Extra args behavior:
  // - object command: append args
  // - string command (shell): warn and ignore (safer + deterministic)
  const isStringEntry = typeof entry === 'string';
  const finalResolved = {
    ...resolved,
    args:
      !isStringEntry && extraArgs.length > 0
        ? [...resolved.args, ...extraArgs]
        : resolved.args,
  };

  if (isStringEntry && extraArgs.length > 0) {
    log.warn(`Extra args ignored for shell-string command "${commandPath}" (use object form to append args).`);
  }

  const printable =
    finalResolved.shell && finalResolved.args.length === 0
      ? finalResolved.cmd
      : `${finalResolved.cmd} ${finalResolved.args.join(' ')}`;

  log.debug(`Executing: ${printable} (cwd: ${finalResolved.cwd})`);

  const result = await execCommand(finalResolved);

  const allowFail = typeof entry !== 'string' && (entry.allowFail ?? false);
  if (result.exitCode !== 0 && allowFail) {
    log.warn(`Command "${commandPath}" exited with code ${result.exitCode} (allowFail=true)`);
    return 0;
  }

  return result.exitCode;
}
