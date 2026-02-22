/**
 * Run meta check programmatically (for bundle integration).
 * Runs VIS-00 through VIS-04 and returns pass/fail without process.exit.
 */

import { loadExceptions } from './exceptions';
import { checkVis00 } from './checks/vis-00-completeness';
import { checkVis01 } from './checks/vis-01-kernel';
import { checkVis02 } from './checks/vis-02-surface';
import { checkVis03 } from './checks/vis-03-ui-truth';
import { checkVis04 } from './checks/vis-04-dead-active';
import { scanSurfacesWithCache } from './meta-scan-cache';

export interface MetaCheckResult {
  ok: boolean;
  message: string;
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Run meta capability checks. Returns result without exiting.
 */
export async function runMetaCheck(repoRoot: string): Promise<MetaCheckResult> {
  const { exceptions, expired } = loadExceptions(repoRoot);
  if (expired.length > 0) {
    return {
      ok: false,
      message: `${expired.length} expired exception(s)`,
      hasErrors: true,
      hasWarnings: false,
    };
  }

  const scanResult = await scanSurfacesWithCache(repoRoot);
  let hasErrors = false;
  let hasWarnings = false;

  // VIS-00
  const vis00 = await checkVis00(repoRoot, exceptions);
  const vis00Errors = vis00.filter((v) => !v.exceptionId);
  if (vis00Errors.length > 0) hasErrors = true;

  // VIS-01
  const vis01 = checkVis01(exceptions);
  if (vis01.length > 0) hasErrors = true;

  // VIS-02
  const vis02 = checkVis02(scanResult, exceptions);
  const vis02Errors = vis02.filter((v) => v.severity === 'error');
  const vis02Warns = vis02.filter((v) => v.severity === 'warn');
  if (vis02Errors.length > 0) hasErrors = true;
  if (vis02Warns.length > 0) hasWarnings = true;

  // VIS-03
  const vis03 = checkVis03(scanResult.uiSurfaces);
  if (vis03.length > 0) hasErrors = true;

  // VIS-04
  const vis04 = checkVis04(scanResult, exceptions);
  if (vis04.length > 0) hasErrors = true;

  const msg = hasErrors
    ? `VIS checks failed (${vis00Errors.length + vis01.length + vis02Errors.length + vis03.length + vis04.length} errors)`
    : hasWarnings
      ? 'Capability checks passed with warnings'
      : 'All capability checks passed';

  return {
    ok: !hasErrors,
    message: msg,
    hasErrors,
    hasWarnings,
  };
}
