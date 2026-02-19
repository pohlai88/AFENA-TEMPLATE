/**
 * Registries Barrel Export
 *
 * Entity contracts and capability registry - canonical definitions of system capabilities
 * and entity lifecycle rules.
 */

// Entity Registry - Built and validated
export {
    ENTITY_CONTRACT_BUILD_EVENTS,
    ENTITY_CONTRACT_REGISTRY,
    ENTITY_CONTRACT_VALIDATION_REPORT
} from './entity-registry';

// Entity Contract Registry - Types and functions
export {
    buildEntityContractRegistry,
    findByLabel,
    findByVerb,
    findContracts,
    findWithLifecycle,
    findWithSoftDelete,
    getContract,
    getSize,
    hasContract,
    listContracts,
    type BuildOptions,
    type EntityContractMap,
    type RegistryBuildResult,
    type RegistryEvent,
    type ValidationReport
} from './entity-contract-registry';

// Entity Contracts Data
export {
    companiesContract,
    contactsContract,
    costCentersContract,
    currenciesContract,
    customersContract,
    deliveryNotesContract,
    employeesContract,
    ENTITY_CONTRACTS,
    goodsReceiptsContract,
    invoicesContract,
    journalEntriesContract, paymentsContract, paymentTermsContract, productsContract,
    projectsContract,
    purchaseInvoicesContract,
    purchaseOrdersContract,
    quotationsContract,
    salesOrdersContract,
    sitesContract,
    suppliersContract,
    taxCodesContract,
    uomContract,
    warehousesContract
} from './entity-contracts.data';

// Validation
export {
    entityContractSchema,
    lifecycleTransitionSchema
} from './validation/entity-contract.schema';

export {
    validateLifecycleGraph,
    type ValidationIssue,
    type ValidationSeverity
} from './validation/lifecycle-graph';

// Utilities
export { deepFreeze } from './utils/deep-freeze';

// Errors
export { EntityContractRegistryError } from './errors';

// Capability Registry (re-exports from types/capability for logical grouping)
export {
    ACTION_FAMILY_TO_TIER, CAPABILITY_CATALOG, CAPABILITY_DOMAINS, CAPABILITY_KINDS, CAPABILITY_NAMESPACES,
    CAPABILITY_VERBS, KIND_TO_SCOPE, KIND_TO_TIER, VERB_TO_KIND, VIS_POLICY, type CapabilityDescriptor, type CapabilityDomain, type CapabilityKind, type CapabilityNamespace, type CapabilityRisk, type CapabilityScope, type CapabilityStatus, type RbacScope, type RbacTier, type VisPolicy
} from './capability-registry';

