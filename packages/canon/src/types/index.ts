/**
 * Types Barrel Export
 * 
 * Core types, branded IDs, and result types for Canon.
 */

// Branded IDs (Phase 1)
export {
  asAuditLogId, asBatchId, asEntityId, asMutationId, asOrgId, asUserId,
  isAuditLogId, isBatchId, isEntityId, isMutationId, isOrgId, isUserId,
  tryAsAuditLogId, tryAsBatchId, tryAsEntityId, tryAsMutationId, tryAsOrgId, tryAsUserId
} from './ids';
export type {
  AssetKey, AuditLogId, BatchId, EntityId, MutationId, OrgId,
  UserId
} from './ids';

// Result Types (Phase 1)
export {
  CANON_ISSUE_CODES, createIssue, err,
  errSingle, ok, zodErrorToCanonIssues
} from './result';
export type { CanonIssue, CanonIssueCode, CanonResult, WellKnownIssueCode } from './result';

// Error Types
export { CanonParseError, CanonValidationError, ERROR_CODES, RateLimitError } from './errors';
export type { ErrorCode, KernelError } from './errors';

// Core Entity Types
export { ENTITY_TYPES } from './entity';
export type {
  BaseEntity,
  EntityRef,
  EntityType
} from './entity';

// Actor Types
export { SYSTEM_ACTOR_USER_ID } from './actor';
export type { ActorRef } from './actor';

// Action Types
export {
  ACTION_FAMILIES, ACTION_TYPES,
  ACTION_VERBS, extractEntityNamespace, extractVerb, getActionFamily
} from './action';
export type {
  ActionFamily, ActionType,
  ActionVerb
} from './action';

// Policy Types
export type {
  AuthoritySnapshotV2, FieldRules, PermissionVerb,
  PolicyDecision, PolicyDenyReason, ResolvedActor,
  ResolvedPermission, UserScopeAssignment
} from './policy';

// Lifecycle Types
export { LifecycleError } from './lifecycle';
export type { LifecycleDenyReason } from './lifecycle';

// Action Spec Types
export type {
  ActionEnvelope, ActionGroup, ActionKind,
  ResolvedAction, ResolvedActions, ResolvedUpdateMode
} from './action-spec';

// Entity Contract Types
export type { EntityContract, LifecycleTransition } from './entity-contract';

// Envelope Types
export type { ApiResponse } from './envelope';

// Mutation Types
export type { JsonValue, MutationSpec } from './mutation';

// Receipt Types
export type { Receipt, ReceiptStatus } from './receipt';

// Audit Types
export type { AuditLogEntry } from './audit';

// Capability Types
export {
  ACTION_FAMILY_TO_TIER,
  CAPABILITY_CATALOG,
  CAPABILITY_DOMAINS,
  CAPABILITY_KEYS,
  CAPABILITY_KINDS,
  CAPABILITY_NAMESPACES,
  CAPABILITY_VERBS,
  inferKindFromVerb,
  KIND_TO_SCOPE,
  KIND_TO_TIER,
  parseCapabilityKey,
  RBAC_SCOPES,
  RBAC_TIERS,
  validateCapabilityKey,
  VERB_TO_KIND,
  VIS_POLICY
} from './capability';
export type {
  CapabilityDescriptor,
  CapabilityDomain,
  CapabilityKey,
  CapabilityKind,
  CapabilityNamespace,
  CapabilityRisk,
  CapabilityScope,
  CapabilityStatus,
  ParsedCapabilityKey,
  RbacScope,
  RbacTier,
  VisPolicy
} from './capability';

