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
    LifecycleTransition
} from './types/entity-contract';

export type { JsonValue, MutationSpec } from './types/mutation';

export type { Receipt, ReceiptStatus } from './types/receipt';

export type { ApiResponse } from './types/envelope';

export { CanonParseError, CanonValidationError, ERROR_CODES, RateLimitError } from './types/errors';
export type { ErrorCode, KernelError } from './types/errors';

export type { AuditLogEntry } from './types/audit';

export {
    ACTION_FAMILY_TO_TIER, CAPABILITY_CATALOG, CAPABILITY_DOMAINS, CAPABILITY_KEYS, CAPABILITY_KINDS, CAPABILITY_NAMESPACES,
    CAPABILITY_VERBS, inferKindFromVerb, KIND_TO_SCOPE, KIND_TO_TIER, parseCapabilityKey, RBAC_SCOPES, RBAC_TIERS, validateCapabilityKey, VERB_TO_KIND,
    VIS_POLICY
} from './types/capability';
export type {
    CapabilityDescriptor, CapabilityDomain, CapabilityKey, CapabilityKind, CapabilityNamespace, CapabilityRisk, CapabilityScope, CapabilityStatus, ParsedCapabilityKey, RbacScope, RbacTier, VisPolicy
} from './types/capability';

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
export { receiptSchema, receiptStatusSchema } from './schemas/receipt';

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
export {
    assetKeyCache, BoundedLRU, postgresTypeCache, typeDerivationCache
} from './utils/cache';

// ── Data Type Schemas ────────────────────────────────────
export {
    getTypeConfigSchema, TYPE_CONFIG_SCHEMAS, validateTypeConfig
} from './schemas/data-types';
export type { TypeConfigSchemas } from './schemas/data-types';

// ── Validators ───────────────────────────────────────────
export {
    DATA_TYPE_VALUE_COLUMN_MAP, validateFieldValue
} from './validators/custom-field-value';
export type { FieldValidationResult } from './validators/custom-field-value';

// ── Constants ────────────────────────────────────────────
export {
    CANON_KEYSPACE_VERSION,
    CANON_LAYER_RULES,
    type CanonLayerKey
} from './constants';

// ── LiteMetadata (Asset Keys, Aliases, Lineage, Quality, Classification, Glossary) ──
export {
    ALIAS_SCOPE_SPECIFICITY, analyzeAssetKey, assertAssetTypeMatchesKey, ASSET_KEY_PREFIX_SPECS, assetFingerprint, buildAssetKey,
    canonicalizeKey, classifyColumn,
    classifyColumns, compileQualityRule, deriveAssetTypeFromKey, descriptorsEqual, DIMENSION_TO_RULES, explainLineageEdge, inferEdgeType, matchAlias, parseAssetKey, PII_PATTERNS, resolveAlias, scoreQualityTier, slugify, topoSortLineage, validateAssetKey, validateLineageEdge,
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
    type LineageEdge, type ParsedAssetKey,
    // Classification
    type PIIPattern, type QualityCheckResult, type QualityDimension, type QualityPlan, type QualityRule,
    // Quality Rules
    type QualityRuleType, type ResolutionContext, type ResolutionResult, type ResolutionRule, type TermLink
} from './lite-meta/index';

// ── Mappings (Postgres, CSV, Type Compatibility) ────────────
export {
    CONFIDENCE_SEMANTICS, getCompatLevel,
    // CSV Type Inference
    inferCsvColumnType, isCompatible, mapPostgresColumn, mapPostgresType, normalizePgType,
    // Postgres Types
    POSTGRES_TO_CANON, requiresTransform, TYPE_COMPAT_MATRIX,
    // Type Compatibility
    type CompatLevel, type MapPostgresColumnInput,
    type MapPostgresColumnOutput
} from './mappings/index';

// ── Registries (Entity Contracts, Capability Catalog) ────────
export {
    // Entity Registry
    ENTITY_CONTRACT_REGISTRY
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
