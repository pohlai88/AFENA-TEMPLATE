/**
 * Capability Registry
 *
 * Re-exports the CAPABILITY_CATALOG from types/ for logical grouping in the registries module.
 * No code changes - this provides a convenient location for capability-related constants while
 * maintaining backward compatibility with existing imports.
 */

export {
    ACTION_FAMILY_TO_TIER, CAPABILITY_CATALOG, CAPABILITY_DOMAINS, CAPABILITY_KINDS, CAPABILITY_NAMESPACES,
    CAPABILITY_VERBS, KIND_TO_SCOPE, KIND_TO_TIER, VERB_TO_KIND, VIS_POLICY, type CapabilityDescriptor, type CapabilityDomain, type CapabilityKind, type CapabilityNamespace, type CapabilityRisk, type CapabilityScope, type CapabilityStatus, type RbacScope, type RbacTier, type VisPolicy
} from '../types/capability';

