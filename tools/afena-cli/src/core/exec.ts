import execa from 'execa';

import type { ResolvedExecParams } from '../types';

/**
 * Execute a resolved command. Returns exit code.
 *
 * Output mapping:
 *   'inherit' → stdio: 'inherit'
 *   'piped'   → stdio: 'pipe'
 *   'json'    → stdio: 'pipe' + parsedJson in result
 */
export async function execCommand(params: ResolvedExecParams): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
  parsedJson?: unknown;
}> {
  const { cmd, args, cwd, env, output, shell } = params;

  const stdio = output === 'inherit' ? 'inherit' as const : 'pipe' as const;

  // reject:false => never throw on non-zero exit codes
  const result = await execa(cmd, args, {
    cwd,
    env: env ? { ...process.env, ...env } : process.env,
    stdio,
    shell: Boolean(shell),
    reject: false,
  });

  let parsedJson: unknown = undefined;
  if (output === 'json') {
    const out = (result.stdout ?? '').trim();
    if (out.length > 0) {
      try {
        parsedJson = JSON.parse(out);
      } catch {
        // not valid JSON; leave undefined (do not fail)
      }
    }
  }

  return {
    exitCode: result.exitCode ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    parsedJson,
  };
}

/**
 * Check if a command exists on the system.
 */
export async function commandExists(cmd: string): Promise<boolean> {
  try {
    const which = process.platform === 'win32' ? 'where' : 'which';
    const result = await execa(which, [cmd], {
      reject: false,
      shell: false,
      stdio: 'pipe',
    });
    return result.exitCode === 0;
  } catch {
    return false;
  }
}
