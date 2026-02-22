/**
 * Project validator — run validation commands and capture results for PROJECT.md.
 * Uses execa (async) with timeout for consistent behavior and cancellation.
 */

import { execCommand } from '../core/exec';

export interface ValidationResult {
  command: string;
  status: 'pass' | 'fail' | 'warn' | 'partial';
  notes: string;
  exitCode?: number;
}

const VALIDATION_TIMEOUT_MS = 120_000; // 2 min per validation

/**
 * Run a pnpm script and capture exit code + stderr for notes.
 */
async function runCommand(
  repoRoot: string,
  script: string,
): Promise<{ exitCode: number; stderr: string }> {
  const result = await execCommand({
    cmd: 'pnpm',
    args: ['run', script],
    cwd: repoRoot,
    output: 'piped',
    shell: true,
    timeout: VALIDATION_TIMEOUT_MS,
  });
  return {
    exitCode: result.exitCode,
    stderr: (result.stderr ?? '').trim().slice(0, 500),
  };
}

/**
 * Run all validation commands and return results.
 */
export async function runValidations(
  repoRoot: string,
  options?: { skipMeta?: boolean; skipReadme?: boolean; skipCatalog?: boolean; skipDeps?: boolean },
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];
  const opts = options ?? {};

  // housekeeping
  const hk = await runCommand(repoRoot, 'housekeeping');
  results.push({
    command: 'housekeeping',
    status: hk.exitCode === 0 ? 'pass' : 'fail',
    notes: hk.exitCode === 0 ? 'Invariant checks passed' : hk.stderr || `Exit code ${hk.exitCode}`,
    exitCode: hk.exitCode,
  });

  // meta:check
  if (!opts.skipMeta) {
    const meta = await runCommand(repoRoot, 'meta:check');
    const metaFail = meta.exitCode !== 0;
    let notes = metaFail ? (meta.stderr || `Exit code ${meta.exitCode}`) : 'Capability checks passed';
    if (metaFail && meta.stderr.includes('VIS-00')) {
      notes = 'VIS-00 violations: write boundaries without CAPABILITIES';
    }
    results.push({
      command: 'meta:check',
      status: metaFail ? 'fail' : 'pass',
      notes,
      exitCode: meta.exitCode,
    });
  }

  // readme:check
  if (!opts.skipReadme) {
    const readme = await runCommand(repoRoot, 'readme:check');
    const readmeFail = readme.exitCode !== 0;
    let notes = readmeFail ? (readme.stderr || `Exit code ${readme.exitCode}`) : 'READMEs passed';
    if (readmeFail && readme.stderr.includes('Install section')) {
      notes = 'Install section does not use workspace policy';
    }
    results.push({
      command: 'readme:check',
      status: readmeFail ? 'fail' : 'pass',
      notes,
      exitCode: readme.exitCode,
    });
  }

  // validate:catalog
  if (!opts.skipCatalog) {
    const catalog = await runCommand(repoRoot, 'validate:catalog');
    const catalogFail = catalog.exitCode !== 0;
    let notes = catalogFail ? (catalog.stderr || `Exit code ${catalog.exitCode}`) : 'Catalog compliant';
    if (catalogFail && catalog.stderr.includes('catalog protocol')) {
      notes = 'Dependencies not using catalog protocol';
    }
    results.push({
      command: 'validate:catalog',
      status: catalogFail ? 'fail' : 'pass',
      notes,
      exitCode: catalog.exitCode,
    });
  }

  // validate:deps
  if (!opts.skipDeps) {
    const deps = await runCommand(repoRoot, 'validate:deps');
    const depsFail = deps.exitCode !== 0;
    let notes = depsFail ? (deps.stderr || `Exit code ${deps.exitCode}`) : 'No circular dependencies';
    if (!depsFail && deps.stderr.includes('warnings')) {
      notes = '0 errors, warnings present; no circular dependencies';
    }
    results.push({
      command: 'validate:deps',
      status: depsFail ? 'fail' : 'warn',
      notes,
      exitCode: deps.exitCode,
    });
  }

  return results;
}
