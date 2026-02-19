/**
 * RBAC Derivation Maps
 * 
 * Maps capability kinds and action families to RBAC tiers and scopes.
 */

import type { ActionFamily } from '../action';
import type { CapabilityKind } from './kinds';

export const RBAC_TIERS = [
  'public',
  'viewer',
  'editor',
  'manager',
  'admin',
  'system',
] as const;

export type RbacTier = (typeof RBAC_TIERS)[number];

export const RBAC_SCOPES = ['read', 'write', 'admin', 'system'] as const;

export type RbacScope = (typeof RBAC_SCOPES)[number];

/** Maps ACTION_FAMILY → RBAC tier for mutation capabilities. */
export const ACTION_FAMILY_TO_TIER: Record<ActionFamily, RbacTier> = {
  field_mutation: 'editor',
  lifecycle: 'editor',
  state_transition: 'manager',
  ownership: 'admin',
  annotation: 'editor',
  system: 'system',
};

/** Maps CapabilityKind → default RBAC tier (non-mutations, or mutation fallback). */
export const KIND_TO_TIER: Record<CapabilityKind, RbacTier> = {
  mutation: 'editor',
  read: 'viewer',
  search: 'viewer',
  admin: 'admin',
  system: 'system',
  auth: 'public',
  storage: 'editor',
};

/** Maps CapabilityKind → RBAC scope for backend policy. */
export const KIND_TO_SCOPE: Record<CapabilityKind, RbacScope> = {
  mutation: 'write',
  read: 'read',
  search: 'read',
  admin: 'admin',
  system: 'system',
  auth: 'system',
  storage: 'system',
};
