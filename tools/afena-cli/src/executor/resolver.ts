import path from 'path';
import { resolve } from 'path';
import type { CommandEntry, CommandEntryObject, ResolvedExecParams } from '../types';

/**
 * Resolve a registry command entry (string or object) into execution params.
 *
 * Canon rules:
 *   - string  → shell command (shell: true, output: inherit, cwd: repoRoot)
 *   - object  → structured (shell from field, output from field, cwd relative to repoRoot)
 */
export function resolveCommand(
  entry: CommandEntry,
  repoRoot: string
): ResolvedExecParams {
  if (typeof entry === 'string') {
    return resolveStringCommand(entry, repoRoot);
  }

  return resolveObjectCommand(entry, repoRoot);
}

/**
 * Resolve an object-form command entry into execution params.
 */
function resolveObjectCommand(
  entry: CommandEntryObject,
  repoRoot: string
): ResolvedExecParams {
  const cwdInput = entry.cwd ?? '.';
  const cwd = path.isAbsolute(cwdInput) ? repoRoot : resolve(repoRoot, cwdInput);

  const env =
    entry.env && Object.keys(entry.env).length > 0
      ? entry.env
      : undefined;

  return {
    cmd: entry.cmd,
    args: entry.args ?? [],
    cwd,
    env,
    output: entry.output ?? 'inherit',
    shell: entry.shell ?? false,
  };
}

/**
 * Canon rule: string command → shell execution with inherited stdio.
 * The full string is passed as cmd with shell: true so the OS shell
 * handles parsing (pipes, redirects, &&, etc.).
 */
function resolveStringCommand(
  command: string,
  repoRoot: string
): ResolvedExecParams {
  return {
    cmd: command,
    args: [],
    cwd: repoRoot,
    env: undefined,
    output: 'inherit',
    shell: true,
  };
}
