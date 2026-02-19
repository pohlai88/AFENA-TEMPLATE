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
export { buildCapabilityKey, parseCapabilityKey, validateCapabilityKey, type ParsedCapabilityKey } from './parser';

// RBAC
export { ACTION_FAMILY_TO_TIER, KIND_TO_SCOPE, KIND_TO_TIER, RBAC_SCOPES, RBAC_TIERS, type RbacScope, type RbacTier } from './rbac';

// VIS Policy
export { VIS_POLICY, type VisPolicy } from './vis-policy';

// Catalog
export {
    CAPABILITY_CATALOG,
    CAPABILITY_KEYS,
    getCapabilitiesForEntity,
    hasCapability,
    resolveCapabilityDescriptor,
    type CapabilityDescriptor,
    type CapabilityKey,
    type CapabilityRisk,
    type CapabilityScope,
    type CapabilityStatus
} from './catalog';

