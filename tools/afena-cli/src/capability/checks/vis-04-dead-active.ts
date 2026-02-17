/**
 * VIS-04 — No Dead Active Capabilities.
 * If status === 'active', the capability must be observed in at least one app surface.
 * headlessOnly + kind rules apply (system/storage may be engine-only).
 *
 * Severity: error (promoted in Phase 4).
 */

import {
  CAPABILITY_CATALOG,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afena-canon';

import type { ScanResult } from '../collectors/surface-scanner';
import type { CapabilityException } from 'afena-canon';

export interface Vis04Violation {
  key: string;
  reason: string;
  severity: 'error';
}

/**
 * Run VIS-04 check — no dead active capabilities.
 * Returns warnings for active capabilities not observed in any surface.
 */
export function checkVis04(
  scanResult: ScanResult,
  exceptions: CapabilityException[],
): Vis04Violation[] {
  // Phase 4: promoted from warn → error
  const violations: Vis04Violation[] = [];
  const now = new Date().toISOString().slice(0, 10);

  // Build observed set from app surfaces only (not UI — headless is fine)
  const observedKeys = new Set<string>();
  for (const cap of scanResult.capabilities) {
    for (const key of cap.capabilities) {
      observedKeys.add(key);
    }
  }
  // Also count UI surfaces as observed
  for (const ui of scanResult.uiSurfaces) {
    for (const key of ui.exposes) {
      observedKeys.add(key);
    }
  }

  for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
    if (descriptor.status !== 'active') continue;

    // Skip headlessOnly — these are engine-internal
    if (descriptor.headlessOnly) continue;

    // Skip if excepted
    const isExcepted = exceptions.some(
      (e) => e.key === key && e.rule === 'VIS-04' && e.expiresOn >= now,
    );
    if (isExcepted) continue;

    if (!observedKeys.has(key)) {
      const parsed = parseCapabilityKey(key);
      const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);
      violations.push({
        key,
        reason: `Active capability "${key}" (${kind}) not observed in any surface — consider annotating or marking as planned/headlessOnly`,
        severity: 'error',
      });
    }
  }

  return violations;
}
