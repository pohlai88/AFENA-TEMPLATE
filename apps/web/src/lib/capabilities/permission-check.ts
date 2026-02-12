/**
 * Permission pre-check — UI uses rbacTier + rbacScope to hide/show buttons per user role.
 *
 * Phase 5, Step 41: Client-side permission helpers that consume the
 * RBAC derivation from CAPABILITY_CATALOG to determine visibility.
 */

import { CAPABILITY_CATALOG } from 'afena-canon';

import { tierHasAccess } from './navigation';

import type { RbacScope, RbacTier } from 'afena-canon';


export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Check if a user with the given tier can perform a capability.
 */
export function canPerform(
  capabilityKey: string,
  userTier: RbacTier,
): PermissionCheckResult {
  const descriptor = CAPABILITY_CATALOG[capabilityKey];
  if (!descriptor) {
    return { allowed: false, reason: `Unknown capability: "${capabilityKey}"` };
  }

  if (descriptor.status !== 'active') {
    return { allowed: false, reason: `Capability "${capabilityKey}" is ${descriptor.status}` };
  }

  const requiredTier = descriptor.rbacTier ?? 'viewer';
  if (!tierHasAccess(userTier, requiredTier)) {
    return {
      allowed: false,
      reason: `Requires "${requiredTier}" tier, user has "${userTier}"`,
    };
  }

  return { allowed: true };
}

/**
 * Check if a user has write access for a given capability.
 */
export function canWrite(
  capabilityKey: string,
  userTier: RbacTier,
): boolean {
  const descriptor = CAPABILITY_CATALOG[capabilityKey];
  if (!descriptor) return false;

  const requiredScope = descriptor.rbacScope ?? 'read';
  if (requiredScope !== 'write' && requiredScope !== 'admin' && requiredScope !== 'system') {
    return true; // read-only capabilities don't need write check
  }

  const requiredTier = descriptor.rbacTier ?? 'viewer';
  return tierHasAccess(userTier, requiredTier);
}

/**
 * Batch check: given a list of capability keys and a user tier,
 * return a map of key → allowed. Useful for UI rendering.
 */
export function checkPermissions(
  capabilityKeys: string[],
  userTier: RbacTier,
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const key of capabilityKeys) {
    result[key] = canPerform(key, userTier).allowed;
  }
  return result;
}

/**
 * Get the required RBAC tier for a capability.
 * Returns undefined if the capability is unknown.
 */
export function getRequiredTier(capabilityKey: string): RbacTier | undefined {
  return CAPABILITY_CATALOG[capabilityKey]?.rbacTier;
}

/**
 * Get the required RBAC scope for a capability.
 * Returns undefined if the capability is unknown.
 */
export function getRequiredScope(capabilityKey: string): RbacScope | undefined {
  return CAPABILITY_CATALOG[capabilityKey]?.rbacScope;
}
