/**
 * Capability feature flags — admin toggles per capability key.
 *
 * Phase 5: In-memory flag store seeded from CAPABILITY_CATALOG.
 * All active capabilities default to enabled. Planned/deprecated default to disabled.
 * Can be extended to DB-backed storage (e.g. org-level overrides) in future.
 */

import {
  CAPABILITY_CATALOG,
  CAPABILITY_KEYS,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afenda-canon';

import type { CapabilityKind, RbacTier } from 'afenda-canon';

export interface CapabilityFlag {
  key: string;
  enabled: boolean;
  kind: CapabilityKind;
  rbacTier: RbacTier;
}

// In-memory flag store — seeded from catalog
const flagStore = new Map<string, boolean>();

// Seed: active = enabled, planned/deprecated = disabled
for (const key of CAPABILITY_KEYS) {
  const descriptor = CAPABILITY_CATALOG[key];
  flagStore.set(key, descriptor?.status === 'active');
}

/**
 * Check if a capability is enabled.
 */
export function isCapabilityEnabled(key: string): boolean {
  return flagStore.get(key) ?? false;
}

/**
 * Enable or disable a capability flag.
 */
export function setCapabilityFlag(key: string, enabled: boolean): void {
  if (!CAPABILITY_CATALOG[key]) {
    throw new Error(`Unknown capability key: "${key}"`);
  }
  flagStore.set(key, enabled);
}

/**
 * Get all capability flags with metadata.
 */
export function getAllCapabilityFlags(): CapabilityFlag[] {
  return CAPABILITY_KEYS.map((key) => {
    const descriptor = CAPABILITY_CATALOG[key];
    if (!descriptor) return { key, enabled: false, kind: 'read' as const, rbacTier: 'viewer' as const };
    const parsed = parseCapabilityKey(key);
    const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);
    return {
      key,
      enabled: flagStore.get(key) ?? false,
      kind,
      rbacTier: descriptor.rbacTier ?? 'viewer',
    };
  });
}

/**
 * Get enabled capabilities filtered by kind and/or tier.
 */
export function getEnabledCapabilities(filters?: {
  kind?: CapabilityKind;
  tier?: RbacTier;
}): string[] {
  return CAPABILITY_KEYS.filter((key) => {
    if (!flagStore.get(key)) return false;
    if (!filters) return true;

    const descriptor = CAPABILITY_CATALOG[key];
    if (!descriptor) return false;
    const parsed = parseCapabilityKey(key);
    const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);

    if (filters.kind && kind !== filters.kind) return false;
    if (filters.tier && descriptor.rbacTier !== filters.tier) return false;
    return true;
  });
}
