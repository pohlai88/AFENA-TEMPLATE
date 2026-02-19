/**
 * Capability System - Barrel Export
 * 
 * Exports all capability-related types, constants, and functions.
 */

// Kinds
export { CAPABILITY_KINDS, type CapabilityKind } from './kinds';

// Domains and Namespaces
export { CAPABILITY_DOMAINS, CAPABILITY_NAMESPACES, type CapabilityDomain, type CapabilityNamespace } from './domains';

// Verbs
export { CAPABILITY_VERBS, VERB_TO_KIND, inferKindFromVerb } from './verbs';

// Parser
export { parseCapabilityKey, validateCapabilityKey, type ParsedCapabilityKey } from './parser';

// RBAC
export { RBAC_TIERS, RBAC_SCOPES, ACTION_FAMILY_TO_TIER, KIND_TO_TIER, KIND_TO_SCOPE, type RbacTier, type RbacScope } from './rbac';

// VIS Policy
export { VIS_POLICY, type VisPolicy } from './vis-policy';

// Catalog
export {
  CAPABILITY_CATALOG,
  CAPABILITY_KEYS,
  type CapabilityKey,
  type CapabilityDescriptor,
  type CapabilityStatus,
  type CapabilityScope,
  type CapabilityRisk,
} from './catalog';
