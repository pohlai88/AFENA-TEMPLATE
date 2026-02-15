// ── Types ────────────────────────────────────────────────
export type { EntityType, EntityRef, BaseEntity } from './types/entity';
export { ENTITY_TYPES } from './types/entity';

export type { ActorRef } from './types/actor';
export { SYSTEM_ACTOR_USER_ID } from './types/actor';

export type {
  PermissionVerb,
  PolicyDecision,
  PolicyDenyReason,
  FieldRules,
  ResolvedPermission,
  UserScopeAssignment,
  ResolvedActor,
  AuthoritySnapshotV2,
} from './types/policy';

export { LifecycleError } from './types/lifecycle';
export type { LifecycleDenyReason } from './types/lifecycle';

export type { ActionVerb, ActionType, ActionFamily } from './types/action';
export {
  ACTION_VERBS,
  ACTION_TYPES,
  ACTION_FAMILIES,
  extractVerb,
  extractEntityNamespace,
  getActionFamily,
} from './types/action';

export type {
  ActionKind,
  ActionGroup,
  ResolvedAction,
  ResolvedUpdateMode,
  ResolvedActions,
  ActionEnvelope,
} from './types/action-spec';

export type {
  EntityContract,
  LifecycleTransition,
} from './types/entity-contract';

export type { JsonValue, MutationSpec } from './types/mutation';

export type { ReceiptStatus, Receipt } from './types/receipt';

export type { ApiResponse } from './types/envelope';

export type { ErrorCode, KernelError } from './types/errors';
export { ERROR_CODES, RateLimitError } from './types/errors';

export type { AuditLogEntry } from './types/audit';

export type {
  CapabilityKind,
  CapabilityKey,
  CapabilityDomain,
  CapabilityNamespace,
  RbacTier,
  RbacScope,
  ParsedCapabilityKey,
  CapabilityDescriptor,
  CapabilityStatus,
  CapabilityScope,
  CapabilityRisk,
  VisPolicy,
} from './types/capability';
export {
  CAPABILITY_KINDS,
  CAPABILITY_DOMAINS,
  CAPABILITY_NAMESPACES,
  CAPABILITY_VERBS,
  CAPABILITY_CATALOG,
  CAPABILITY_KEYS,
  RBAC_TIERS,
  RBAC_SCOPES,
  VERB_TO_KIND,
  VIS_POLICY,
  ACTION_FAMILY_TO_TIER,
  KIND_TO_TIER,
  KIND_TO_SCOPE,
  parseCapabilityKey,
  validateCapabilityKey,
  inferKindFromVerb,
} from './types/capability';

// ── ERP Enums ────────────────────────────────────────────
export * from './enums/index';

// ── Zod Schemas ──────────────────────────────────────────
export { entityTypeSchema, entityRefSchema } from './schemas/entity';
export { actionTypeSchema, actionFamilySchema } from './schemas/action';
export { errorCodeSchema, kernelErrorSchema } from './schemas/errors';
export { mutationSpecSchema } from './schemas/mutation';
export { receiptStatusSchema, receiptSchema } from './schemas/receipt';
export { apiResponseSchema } from './schemas/envelope';
export { auditLogEntrySchema } from './schemas/audit';
export {
  capabilityKindSchema,
  capabilityStatusSchema,
  capabilityScopeSchema,
  capabilityRiskSchema,
  rbacTierSchema,
  rbacScopeSchema,
  capabilityDescriptorSchema,
  exceptionScopeSchema,
  capabilityExceptionSchema,
  capabilityExceptionsFileSchema,
  capabilityDomainSchema,
  capabilityNamespaceSchema,
} from './schemas/capability';
export type {
  ExceptionScope,
  CapabilityException,
} from './schemas/capability';

// ── Data Type Schemas ────────────────────────────────────
export {
  TYPE_CONFIG_SCHEMAS,
  getTypeConfigSchema,
  validateTypeConfig,
} from './schemas/data-types';
export type { TypeConfigSchemas } from './schemas/data-types';

// ── Serialization (GAP-DB-006 / SER-01) ─────────────────
export { coerceMutationInput, coerceValue } from './serialization';

// ── Validators ───────────────────────────────────────────
export {
  validateFieldValue,
  DATA_TYPE_VALUE_COLUMN_MAP,
} from './validators/custom-field-value';
export type { FieldValidationResult } from './validators/custom-field-value';

// ── Contracts (LocalEntitySpec) ───────────────────────────
export {
  localEntitySpecSchema,
  validateLocalEntitySpec,
  safeParseLocalEntitySpec,
} from './contracts';
export type { LocalEntitySpec, EntityKind, FieldType, FieldDef } from './contracts';

// ── Utilities ────────────────────────────────────────────
export { invariant } from './invariant';

// ── Adapter policies (ERP refactor) ──────────────────────
export { MONEY_POLICY, RESERVED_WORD_POLICY } from './adapters/erpnext';
