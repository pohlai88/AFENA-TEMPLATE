import execa from 'execa';

import type { ResolvedExecParams } from '../types';

const DEFAULT_TIMEOUT_MS = Number(process.env.AFENDA_TIMEOUT) || 300_000; // 5 min for long commands

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a resolved command. Returns exit code.
 * Supports optional retry with exponential backoff for transient failures.
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
  timedOut?: boolean;
}> {
  const {
    cmd,
    args,
    cwd,
    env,
    output,
    shell,
    timeout = DEFAULT_TIMEOUT_MS,
    maxRetries = 0,
    retryDelayMs = 1000,
  } = params;

  const stdio = output === 'inherit' ? 'inherit' as const : 'pipe' as const;

  let lastResult: Awaited<ReturnType<typeof execa>> & { timedOut?: boolean } = null!;
  let attempt = 0;

  while (true) {
    lastResult = await execa(cmd, args, {
      cwd,
      env: env ? { ...process.env, ...env } : process.env,
      stdio,
      shell: Boolean(shell),
      reject: false,
      timeout,
    }) as typeof lastResult;

    const exitCode = lastResult.exitCode ?? 1;
    // Retry on exit 124 (timeout) or 1 (generic failure) if retries configured
    const shouldRetry =
      maxRetries > 0 &&
      attempt < maxRetries &&
      (exitCode === 124 || exitCode === 1);

    if (!shouldRetry) break;

    const delay = retryDelayMs * Math.pow(2, attempt);
    await sleep(delay);
    attempt++;
  }

  const result = lastResult;
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

  const timedOut = result.timedOut === true;
  return {
    exitCode: timedOut ? 124 : (result.exitCode ?? 1),
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    parsedJson,
    timedOut,
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
