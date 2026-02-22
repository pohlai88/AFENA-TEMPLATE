/**
 * Branded ID types for compile-time safety at boundaries
 * 
 * Internal code can use string; brand when crossing API boundaries.
 * This prevents UUID mixing (entityId vs orgId) at compile time with zero runtime overhead.
 */

import { CanonValidationError } from './errors';

// Branded type definitions (compile-time only)
export type EntityId = string & { readonly __brand: 'EntityId' };
export type OrgId = string & { readonly __brand: 'OrgId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type BatchId = string & { readonly __brand: 'BatchId' };
export type MutationId = string & { readonly __brand: 'MutationId' };
export type AuditLogId = string & { readonly __brand: 'AuditLogId' };
export type AssetKey = string & { readonly __brand: 'AssetKey' };

// UUID validation regex (RFC 4122)
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Type guard for EntityId
 */
export function isEntityId(value: string): value is EntityId {
  return UUID_REGEX.test(value);
}

/**
 * Brand a string as EntityId with validation
 * 
 * Use at boundaries when receiving UUIDs from external sources (forms, APIs, databases).
 * Provides compile-time type safety to prevent mixing different ID types.
 * 
 * @param value - UUID string to brand as EntityId
 * @returns Branded EntityId
 * @throws CanonValidationError if value is not a valid UUID v4
 * 
 * @example
 * ```typescript
 * const id = asEntityId('123e4567-e89b-12d3-a456-426614174000');
 * 
 * // Compile error: can't mix EntityId with OrgId
 * function process(entityId: EntityId, orgId: OrgId) {}
 * process(orgId, entityId); // ❌ Type error
 * ```
 */
export function asEntityId(value: string): EntityId {
  if (!isEntityId(value)) {
    throw new CanonValidationError(
      `Invalid EntityId: ${value}`,
      'INVALID_UUID',
      'entityId'
    );
  }
  return value;
}

/**
 * Safe branding for EntityId (returns undefined instead of throwing)
 */
export function tryAsEntityId(value: string): EntityId | undefined {
  return isEntityId(value) ? value : undefined;
}

/**
 * Type guard for OrgId
 */
export function isOrgId(value: string): value is OrgId {
  return UUID_REGEX.test(value);
}

/**
 * Brand a string as OrgId (with validation)
 * @throws CanonValidationError if value is not a valid UUID
 */
export function asOrgId(value: string): OrgId {
  if (!isOrgId(value)) {
    throw new CanonValidationError(
      `Invalid OrgId: ${value}`,
      'INVALID_UUID',
      'orgId'
    );
  }
  return value;
}

/**
 * Safe branding for OrgId (returns undefined instead of throwing)
 */
export function tryAsOrgId(value: string): OrgId | undefined {
  return isOrgId(value) ? value : undefined;
}

/**
 * Type guard for UserId
 */
export function isUserId(value: string): value is UserId {
  return UUID_REGEX.test(value);
}

/**
 * Brand a string as UserId (with validation)
 * @throws CanonValidationError if value is not a valid UUID
 */
export function asUserId(value: string): UserId {
  if (!isUserId(value)) {
    throw new CanonValidationError(
      `Invalid UserId: ${value}`,
      'INVALID_UUID',
      'userId'
    );
  }
  return value;
}

/**
 * Safe branding for UserId (returns undefined instead of throwing)
 */
export function tryAsUserId(value: string): UserId | undefined {
  return isUserId(value) ? value : undefined;
}

/**
 * Type guard for BatchId
 */
export function isBatchId(value: string): value is BatchId {
  return UUID_REGEX.test(value);
}

/**
 * Brand a string as BatchId (with validation)
 * @throws CanonValidationError if value is not a valid UUID
 */
export function asBatchId(value: string): BatchId {
  if (!isBatchId(value)) {
    throw new CanonValidationError(
      `Invalid BatchId: ${value}`,
      'INVALID_UUID',
      'batchId'
    );
  }
  return value;
}

/**
 * Safe branding for BatchId (returns undefined instead of throwing)
 */
export function tryAsBatchId(value: string): BatchId | undefined {
  return isBatchId(value) ? value : undefined;
}

/**
 * Type guard for MutationId
 */
export function isMutationId(value: string): value is MutationId {
  return UUID_REGEX.test(value);
}

/**
 * Brand a string as MutationId (with validation)
 * @throws CanonValidationError if value is not a valid UUID
 */
export function asMutationId(value: string): MutationId {
  if (!isMutationId(value)) {
    throw new CanonValidationError(
      `Invalid MutationId: ${value}`,
      'INVALID_UUID',
      'mutationId'
    );
  }
  return value;
}

/**
 * Safe branding for MutationId (returns undefined instead of throwing)
 */
export function tryAsMutationId(value: string): MutationId | undefined {
  return isMutationId(value) ? value : undefined;
}

/**
 * Type guard for AuditLogId
 */
export function isAuditLogId(value: string): value is AuditLogId {
  return UUID_REGEX.test(value);
}

/**
 * Brand a string as AuditLogId (with validation)
 * @throws CanonValidationError if value is not a valid UUID
 */
export function asAuditLogId(value: string): AuditLogId {
  if (!isAuditLogId(value)) {
    throw new CanonValidationError(
      `Invalid AuditLogId: ${value}`,
      'INVALID_UUID',
      'auditLogId'
    );
  }
  return value;
}

/**
 * Safe branding for AuditLogId (returns undefined instead of throwing)
 */
export function tryAsAuditLogId(value: string): AuditLogId | undefined {
  return isAuditLogId(value) ? value : undefined;
}
