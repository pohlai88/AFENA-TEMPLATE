/**
 * Navigation generation — derive visible navigation items from capabilities.
 *
 * Phase 5, Step 40: "show all capabilities for Sales role"
 * Given a user's RBAC tier, returns the capabilities they can access,
 * grouped by domain for navigation rendering.
 */

import {
  CAPABILITY_CATALOG,
  CAPABILITY_KEYS,
  inferKindFromVerb,
  parseCapabilityKey,
} from 'afena-canon';

import type { CapabilityKind, RbacTier } from 'afena-canon';

export interface NavCapability {
  key: string;
  intent: string;
  kind: CapabilityKind;
}

export interface NavGroup {
  domain: string;
  capabilities: NavCapability[];
}

// Tier hierarchy: public < viewer < editor < manager < admin < system
const TIER_RANK: Record<RbacTier, number> = {
  public: 0,
  viewer: 1,
  editor: 2,
  manager: 3,
  admin: 4,
  system: 5,
};

/**
 * Check if a user tier has access to a capability tier.
 * A user can access capabilities at or below their tier level.
 */
export function tierHasAccess(userTier: RbacTier, requiredTier: RbacTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[requiredTier];
}

/**
 * Get all capabilities accessible by a given RBAC tier,
 * grouped by domain for navigation rendering.
 */
export function getNavigationForTier(userTier: RbacTier): NavGroup[] {
  const groups = new Map<string, NavCapability[]>();

  for (const key of CAPABILITY_KEYS) {
    const descriptor = CAPABILITY_CATALOG[key];
    if (!descriptor) continue;
    if (descriptor.status !== 'active') continue;
    if (descriptor.headlessOnly) continue;

    const requiredTier = descriptor.rbacTier ?? 'viewer';
    if (!tierHasAccess(userTier, requiredTier)) continue;

    const parsed = parseCapabilityKey(key);
    const kind = descriptor.kind ?? inferKindFromVerb(parsed.verb);
    const domain = parsed.domain ?? parsed.ns ?? 'general';

    const group = groups.get(domain) ?? [];
    group.push({ key, intent: descriptor.intent, kind });
    groups.set(domain, group);
  }

  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([domain, capabilities]) => ({ domain, capabilities }));
}

/**
 * Get a flat list of capability keys accessible by a given tier.
 */
export function getAccessibleCapabilities(userTier: RbacTier): string[] {
  return CAPABILITY_KEYS.filter((key) => {
    const descriptor = CAPABILITY_CATALOG[key];
    if (!descriptor) return false;
    if (descriptor.status !== 'active') return false;

    const requiredTier = descriptor.rbacTier ?? 'viewer';
    return tierHasAccess(userTier, requiredTier);
  });
}
