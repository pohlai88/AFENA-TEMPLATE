/**
 * Types Barrel Export
 * 
 * Core types, branded IDs, and result types for Canon.
 */

// Branded IDs (Phase 1)
export {
  asAuditLogId, asBatchId, asEntityId, asMutationId, asOrgId, asUserId, isAuditLogId, isBatchId, isEntityId, isMutationId, isOrgId, isUserId
} from './ids';
export type {
  AssetKey, AuditLogId, BatchId, EntityId, MutationId, OrgId,
  UserId
} from './ids';

// Result Types (Phase 1)
export {
  createIssue, err,
  errSingle, ok, zodErrorToCanonIssues
} from './result';
export type { CanonIssue, CanonResult } from './result';

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

// Mutation Types
export type { MutationSpec } from './mutation';

// Receipt Types
export type { Receipt, ReceiptStatus } from './receipt';

// Audit Types
export type { AuditLogEntry } from './audit';

// Capability Types
export { CAPABILITY_CATALOG } from './capability';
export type {
  CapabilityKey
} from './capability';

