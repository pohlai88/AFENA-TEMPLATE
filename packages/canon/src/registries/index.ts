/**
 * Registries Barrel Export
 *
 * Entity contracts and capability registry - canonical definitions of system capabilities
 * and entity lifecycle rules.
 */

// Entity Registry
export {
    ENTITY_CONTRACT_REGISTRY
} from './entity-registry';

// Capability Registry (re-exports from types/capability for logical grouping)
export {
    ACTION_FAMILY_TO_TIER, CAPABILITY_CATALOG, CAPABILITY_DOMAINS, CAPABILITY_KINDS, CAPABILITY_NAMESPACES,
    CAPABILITY_VERBS, KIND_TO_SCOPE, KIND_TO_TIER, VERB_TO_KIND, VIS_POLICY, type CapabilityDescriptor, type CapabilityDomain, type CapabilityKind, type CapabilityNamespace, type CapabilityRisk, type CapabilityScope, type CapabilityStatus, type RbacScope, type RbacTier, type VisPolicy
} from './capability-registry';

