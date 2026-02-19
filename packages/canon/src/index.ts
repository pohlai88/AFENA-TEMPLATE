// ── Types ────────────────────────────────────────────────
export { ENTITY_TYPES } from './types/entity';
export type { BaseEntity, EntityRef, EntityType } from './types/entity';

export { SYSTEM_ACTOR_USER_ID } from './types/actor';
export type { ActorRef } from './types/actor';

export type {
    AuthoritySnapshotV2, FieldRules, PermissionVerb,
    PolicyDecision,
    PolicyDenyReason, ResolvedActor, ResolvedPermission,
    UserScopeAssignment
} from './types/policy';

export { LifecycleError } from './types/lifecycle';
export type { LifecycleDenyReason } from './types/lifecycle';

export {
    ACTION_FAMILIES, ACTION_TYPES, ACTION_VERBS, extractEntityNamespace, extractVerb, getActionFamily
} from './types/action';
export type { ActionFamily, ActionType, ActionVerb } from './types/action';

export type {
    ActionEnvelope, ActionGroup, ActionKind, ResolvedAction, ResolvedActions, ResolvedUpdateMode
} from './types/action-spec';

export type {
    EntityContract,
    FieldWriteRules,
    LifecycleTransition
} from './types/entity-contract';

export type { JsonValue, MutationPlan, MutationSpec } from './types/mutation';

export type {
    MutationReceipt,
    MutationReceiptError,
    MutationReceiptOk,
    MutationReceiptRejected,
    ReceiptStatus
} from './types/receipt';

export type { ApiResponse } from './types/envelope';

// ── Event Vocabulary (Phase 2) ───────────────────────────
export { CANON_EVENT_NAMES, assertCanonEventName } from './types/events';
export type { CanonEventName, OutboxIntent } from './types/events';

export { CanonParseError, CanonValidationError, ERROR_CODES, RateLimitError } from './types/errors';
export type { ErrorCode, KernelError, RetryableReason } from './types/errors';

export type { AuditLogEntry } from './types/audit';

export {
    ACTION_FAMILY_TO_TIER, CAPABILITY_CATALOG, CAPABILITY_DOMAINS, CAPABILITY_KEYS, CAPABILITY_KINDS, CAPABILITY_NAMESPACES,
    CAPABILITY_VERBS, KIND_TO_SCOPE, KIND_TO_TIER, RBAC_SCOPES, RBAC_TIERS, VERB_TO_KIND,
    VIS_POLICY, buildCapabilityKey, getCapabilitiesForEntity, hasCapability, inferKindFromVerb, parseCapabilityKey, resolveCapabilityDescriptor, validateCapabilityKey
} from './types/capability';
export type {
    CapabilityDescriptor, CapabilityDomain, CapabilityKey, CapabilityKind, CapabilityNamespace, CapabilityRisk, CapabilityScope, CapabilityStatus, ParsedCapabilityKey, RbacScope, RbacTier, VisPolicy
} from './types/capability';

// ── Branded IDs ─────────────────────────────────────────────
export {
    asAuditLogId, asBatchId, asEntityId, asMutationId, asOrgId, asUserId,
    isAuditLogId, isBatchId, isEntityId, isMutationId, isOrgId, isUserId,
    tryAsAuditLogId, tryAsBatchId, tryAsEntityId, tryAsMutationId, tryAsOrgId, tryAsUserId
} from './types/ids';
export type {
    AssetKey, AuditLogId, BatchId, EntityId, MutationId, OrgId, UserId
} from './types/ids';

// ── Result Types ────────────────────────────────────────────
export {
    CANON_ISSUE_CODES, createIssue, err, errSingle, ok, zodErrorToCanonIssues
} from './types/result';
export type { CanonIssue, CanonIssueCode, CanonResult, WellKnownIssueCode } from './types/result';

// ── ERP Enums ────────────────────────────────────────────
export * from './enums/index';

// ── Zod Schemas ──────────────────────────────────────────
export { actionFamilySchema, actionTypeSchema } from './schemas/action';
export { auditLogEntrySchema } from './schemas/audit';
export {
    capabilityDescriptorSchema, capabilityDomainSchema, capabilityExceptionSchema,
    capabilityExceptionsFileSchema, capabilityKindSchema, capabilityNamespaceSchema, capabilityRiskSchema, capabilityScopeSchema, capabilityStatusSchema, exceptionScopeSchema, rbacScopeSchema, rbacTierSchema
} from './schemas/capability';
export type {
    CapabilityException, ExceptionScope
} from './schemas/capability';
export { entityRefSchema, entityTypeSchema } from './schemas/entity';
export { apiResponseSchema } from './schemas/envelope';
export { errorCodeSchema, kernelErrorSchema } from './schemas/errors';
export { mutationSpecSchema } from './schemas/mutation';
export { mutationReceiptSchema, receiptSchema, receiptStatusSchema, retryableReasonSchema } from './schemas/receipt';

// ── Branded ID Schemas (Phase 1) ─────────────────────────
export {
    auditLogIdSchema, batchIdSchema, entityIdSchema, mutationIdSchema, orgIdSchema,
    userIdSchema
} from './schemas/branded';

// ── Schema Helpers (Phase 1) ─────────────────────────────
export {
    createEnumSchema, primitives, withMeta
} from './schemas/helpers';

// ── Cache Utilities (Phase 2) ────────────────────────────
export { BoundedLRU, assetKeyCache, postgresTypeCache, typeDerivationCache } from './utils/cache';

// ── Data Type Schemas ────────────────────────────────────
export { TYPE_CONFIG_SCHEMAS, getTypeConfigSchema, validateTypeConfig } from './schemas/data-types';
export type { TypeConfigSchemas } from './schemas/data-types';

// ── Validators ───────────────────────────────────────────
export {
    CUSTOM_FIELD_VALIDATORS,
    getFieldValidator,
    validateCustomFieldValue
} from './validators/presets/custom-field-value';

// Legacy validator adapter (backward-compat with crud/plan/validate/custom-fields.ts)
export { DATA_TYPE_VALUE_COLUMN_MAP, validateFieldValue } from './validators/custom-field-value';

// ── Mutation Input Coercion (Phase 3) ────────────────────
export { coerceMutationInput } from './coerce';

// ── Constants ────────────────────────────────────────────
export {
    CANON_KEYSPACE_VERSION,
    CANON_LAYER_RULES,
    type CanonLayerKey
} from './constants';

// ── LiteMetadata (Asset Keys, Aliases, Lineage, Quality, Classification, Glossary) ──
export {
    ALIAS_SCOPE_SPECIFICITY, ASSET_KEY_PREFIX_SPECS, DIMENSION_TO_RULES, PII_PATTERNS, analyzeAssetKey, assertAssetTypeMatchesKey, assetFingerprint, buildAssetKey,
    canonicalizeKey, classifyColumn,
    classifyColumns, compileQualityRule, deriveAssetTypeFromKey, descriptorsEqual, explainLineageEdge, inferEdgeType, matchAlias, parseAssetKey, resolveAlias, scoreQualityTier, slugify, topoSortLineage, validateAssetKey, validateLineageEdge,
    // Alias Resolution
    type AliasCandidate,
    type AliasMatch, type AliasTrace,
    // Asset Fingerprint
    type AssetDescriptor,
    // Asset Keys
    type AssetKeyPrefix,
    // Glossary
    type GlossaryTerm,
    // Lineage
    type LineageEdge,
    // Classification
    type PIIPattern, type ParsedAssetKey, type QualityCheckResult, type QualityDimension, type QualityPlan, type QualityRule,
    // Quality Rules
    type QualityRuleType, type ResolutionContext, type ResolutionResult, type ResolutionRule, type TermLink
} from './lite-meta/index';

// ── Mappings (Postgres, CSV, Type Compatibility) ────────────
export {
    CONFIDENCE_SEMANTICS,
    // Postgres Types
    POSTGRES_TO_CANON, TYPE_COMPAT_MATRIX, getCompatLevel,
    // CSV Type Inference
    inferCsvColumnType, isCompatible, mapPostgresColumn, mapPostgresType, normalizePgType, requiresTransform,
    // Type Compatibility
    type CompatLevel, type MapPostgresColumnInput,
    type MapPostgresColumnOutput
} from './mappings/index';

// ── Registries (Entity Contracts, Capability Catalog) ────────
export {
    ENTITY_CONTRACTS,
    // Entity Registry - Built and validated
    ENTITY_CONTRACT_BUILD_EVENTS,
    ENTITY_CONTRACT_REGISTRY,
    ENTITY_CONTRACT_VALIDATION_REPORT,
    // Errors
    EntityContractRegistryError,
    // Entity Contract Registry - Types and functions
    buildEntityContractRegistry,
    // Entity Contracts Data
    companiesContract,
    contactsContract,
    costCentersContract,
    currenciesContract,
    customersContract,
    // Utilities
    deepFreeze, deliveryNotesContract,
    employeesContract,
    // Validation
    entityContractSchema, findByLabel,
    findByVerb,
    findContracts,
    findWithLifecycle,
    findWithSoftDelete,
    getContract,
    getSize, goodsReceiptsContract, hasContract, invoicesContract,
    journalEntriesContract, lifecycleTransitionSchema, listContracts, paymentTermsContract, paymentsContract, productsContract,
    projectsContract,
    purchaseInvoicesContract,
    purchaseOrdersContract,
    quotationsContract,
    salesOrdersContract,
    sitesContract,
    suppliersContract,
    taxCodesContract,
    uomContract, validateLifecycleGraph, warehousesContract, type BuildOptions,
    type EntityContractMap,
    type RegistryBuildResult,
    type RegistryEvent, type ValidationIssue, type ValidationReport, type ValidationSeverity
} from './registries/index';
// Note: Capability exports (CAPABILITY_CATALOG, etc.) are already exported above
// from types/capability for backward compatibility.

// ── LiteMetadata Schemas (Zod v4) ────────────────────────
export {
    assetDescriptorSchema, assetKeyInputSchema, assetKeySchema, parsedAssetKeySchema,
    qualityDimensionSchema,
    qualityRuleSchema,
    qualityRuleTypeSchema
} from './schemas/lite-meta';

// ── Shared JSON Value Schema (v4) ────────────────────────
export { jsonValueSchema } from './schemas/json-value';

// ── Schema Catalog ──────────────────────────────────────────
export { CANON_SCHEMAS, CANON_SCHEMA_BY_CATEGORY, CANON_SCHEMA_MAP } from './schemas/catalog';
export {
    findSchemas, getSchema, getSchemaMeta, getSchemasByCategory, hasSchema, listSchemas
} from './schemas/catalog/discovery';
export {
    extractOpenApiSeeds, getOpenApiSeed
} from './schemas/catalog/openapi';
export type { OpenApiSchemaSeed } from './schemas/catalog/openapi';
export type {
    CanonSchemaItem, OpenApiSeed, SchemaCategory, SchemaFilters, SchemaId, SchemaMeta, SchemaTag
} from './schemas/catalog/types';

// ── Schema Utilities ────────────────────────────────────────
export { SchemaBuilder, createSchemaBuilder } from './schemas/builders';
export { clearSchemaCache, getSchemaCacheStats, memoizeSchema } from './schemas/cache';
export { SCHEMA_ERROR_CODES, isSchemaErrorCode } from './schemas/error-codes';
export type { SchemaErrorCode } from './schemas/error-codes';
export { commonFields } from './schemas/fields';
export { SchemaValidationError, parseOrThrow, safeParse } from './schemas/safe-parse';
export type { ParseResult } from './schemas/safe-parse';

// ── Validator Core ──────────────────────────────────────────
export { VAL_CODES, isValidationCode } from './validators/core/codes';
export type { ValidationCode } from './validators/core/codes';
export type { NormalizingValidator, ValidationContext, ValidationResult, Validator, ValidationIssue as ValidatorIssue, ValidationSeverity as ValidatorSeverity } from './validators/core/types';

