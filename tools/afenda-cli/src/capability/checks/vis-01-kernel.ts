/**
 * VIS-01 — Kernel Coverage.
 * Every mutation capability must map to ACTION_TYPE + HANDLER_REGISTRY.
 *
 * Scanner logic:
 * 1. Collect capabilities where kind === 'mutation'
 * 2. Verify matching ACTION_TYPES entry (canon)
 * 3. Verify matching HANDLER_REGISTRY entry (derived from ENTITY_TYPES)
 *
 * Severity: error.
 */

import {
  ACTION_TYPES,
  CAPABILITY_CATALOG,
  ENTITY_TYPES,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afenda-canon';

import type { CapabilityException } from 'afenda-canon';

export interface Vis01Violation {
  key: string;
  reason: string;
  severity: 'error';
}

/**
 * Run VIS-01 check — every mutation capability must have kernel backing.
 */
export function checkVis01(
  _exceptions: CapabilityException[],
): Vis01Violation[] {
  const violations: Vis01Violation[] = [];
  const actionTypeSet = new Set<string>(ACTION_TYPES as readonly string[]);
  const entityTypeSet = new Set<string>(ENTITY_TYPES as readonly string[]);

  for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
    const parsed = parseCapabilityKey(key);
    const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);

    if (kind !== 'mutation') continue;

    if (!actionTypeSet.has(key)) {
      violations.push({
        key,
        reason: `Mutation capability "${key}" has no matching ACTION_TYPES entry`,
        severity: 'error',
      });
    }

    if (parsed.domain !== null && !entityTypeSet.has(parsed.domain)) {
      violations.push({
        key,
        reason: `Mutation capability "${key}" — entity "${parsed.domain}" not in ENTITY_TYPES (no HANDLER_REGISTRY entry)`,
        severity: 'error',
      });
    }
  }

  return violations;
}
