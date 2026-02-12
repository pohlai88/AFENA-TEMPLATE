/**
 * VIS-03 — UI Rendering Truth.
 * UI surfaces must not expose undeclared capabilities.
 *
 * Scanner logic:
 * 1. Collect all SURFACE.exposes arrays from UI surface files
 * 2. Verify every key exists in CAPABILITY_KEYS
 */

import { CAPABILITY_KEYS } from 'afena-canon';
import type { UiSurface } from '../collectors/surface-scanner';

export interface Vis03Violation {
  file: string;
  surfaceId: string;
  phantomKey: string;
  reason: string;
}

/**
 * Run VIS-03 check — no phantom UI capabilities.
 * Returns violations for UI surfaces that expose keys not in CAPABILITY_KEYS.
 */
export function checkVis03(uiSurfaces: UiSurface[]): Vis03Violation[] {
  const validKeys = new Set(CAPABILITY_KEYS);
  const violations: Vis03Violation[] = [];

  for (const surface of uiSurfaces) {
    for (const key of surface.exposes) {
      if (!validKeys.has(key)) {
        violations.push({
          file: surface.file,
          surfaceId: surface.surfaceId,
          phantomKey: key,
          reason: `UI surface "${surface.surfaceId}" exposes "${key}" which is not in CAPABILITY_KEYS`,
        });
      }
    }
  }

  return violations;
}
