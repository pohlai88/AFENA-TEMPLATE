/**
 * VIS-02 — Surface Coverage (kind-aware, phase-aware).
 * Every active capability must be reachable from appropriate surfaces.
 *
 * Phase policy is encoded in VIS_POLICY (canon). Severity depends on kind:
 * - mutation: error (kernelRequired + appRequired + uiSeverity: error)
 * - read/search/admin/system/storage: warn in Phase 1
 * - auth: error
 *
 * Capabilities with status 'planned' or headlessOnly do not participate.
 */

import {
  CAPABILITY_CATALOG,
  ENTITY_TYPES,
  ACTION_TYPES,
  VIS_POLICY,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afena-canon';
import type { CapabilityException, CapabilityKind } from 'afena-canon';
import type { ScanResult } from '../collectors/surface-scanner';

export type Vis02Severity = 'error' | 'warn';

export interface Vis02Violation {
  key: string;
  kind: CapabilityKind;
  reason: string;
  severity: Vis02Severity;
}

/**
 * Run VIS-02 check — phase-aware surface coverage.
 */
export function checkVis02(
  scanResult: ScanResult,
  exceptions: CapabilityException[],
): Vis02Violation[] {
  const violations: Vis02Violation[] = [];
  const now = new Date().toISOString().slice(0, 10);

  // Build observed sets
  const observedAppKeys = new Set<string>();
  const observedUiKeys = new Set<string>();

  for (const cap of scanResult.capabilities) {
    for (const key of cap.capabilities) {
      observedAppKeys.add(key);
    }
  }
  for (const ui of scanResult.uiSurfaces) {
    for (const key of ui.exposes) {
      observedUiKeys.add(key);
    }
  }

  const actionTypeSet = new Set<string>(ACTION_TYPES as readonly string[]);
  const entityTypeSet = new Set<string>(ENTITY_TYPES as readonly string[]);

  for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
    // Skip planned capabilities
    if (descriptor.status === 'planned') continue;

    // Skip headlessOnly capabilities (system/storage engines don't need UI)
    if (descriptor.headlessOnly) continue;

    // Skip if excepted
    const isExcepted = exceptions.some(
      (e) => e.key === key && e.rule === 'VIS-02' && e.expiresOn >= now,
    );
    if (isExcepted) continue;

    const parsed = parseCapabilityKey(key);
    const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);
    const policy = VIS_POLICY.rules[kind];

    // Check kernel coverage for mutations
    if (policy.kernelRequired && kind === 'mutation') {
      if (!actionTypeSet.has(key)) {
        violations.push({
          key,
          kind,
          reason: `Mutation "${key}" missing from ACTION_TYPES`,
          severity: 'error',
        });
      }
      if (parsed.domain !== null && !entityTypeSet.has(parsed.domain)) {
        violations.push({
          key,
          kind,
          reason: `Mutation "${key}" — entity "${parsed.domain}" not in ENTITY_TYPES`,
          severity: 'error',
        });
      }
    }

    // Check app surface coverage
    if (policy.appRequired && !observedAppKeys.has(key)) {
      violations.push({
        key,
        kind,
        reason: `Capability "${key}" (${kind}) not found in any app surface (action/route/engine)`,
        severity: policy.uiSeverity as Vis02Severity,
      });
    }

    // Check UI surface coverage (severity from policy)
    if (!observedUiKeys.has(key)) {
      violations.push({
        key,
        kind,
        reason: `Capability "${key}" (${kind}) not found in any UI surface`,
        severity: policy.uiSeverity as Vis02Severity,
      });
    }
  }

  return violations;
}
