/**
 * Posting Lock Enforcement (ERP Safety Pattern)
 *
 * Prevents mutations to posted financial documents.
 * Posted documents must go through reversal workflow instead of direct edits.
 *
 * Why this matters:
 *   - Audit trail integrity (posted docs are immutable records)
 *   - Regulatory compliance (financial documents cannot be altered after posting)
 *   - Double-entry accounting correctness (posted entries are locked)
 *
 * Pattern:
 *   - Check if entity has `postingStatus` field
 *   - If status is 'posted', reject update/delete operations
 *   - Allow only reversal workflow (separate verb)
 */

import type { MutationContext } from '../../context';

/**
 * Enforce posting lock for financial documents.
 *
 * @param current - Current entity state (null for create operations)
 * @param verb - Mutation verb (create, update, delete, restore, etc.)
 * @param ctx - Mutation context for error reporting
 * @throws Error with code POSTED_DOCUMENT_IMMUTABLE if lock violated
 */
export function enforcePostingLock(
  current: Record<string, unknown> | null,
  verb: string,
  ctx: MutationContext,
): void {
  // Create operations don't need lock check
  if (!current) return;

  // Only check update/delete operations
  if (verb !== 'update' && verb !== 'delete') return;

  // Check if entity has posting status
  const postingStatus = current.postingStatus as string | undefined;
  if (!postingStatus) return; // Not a postable document

  // Enforce immutability for posted documents
  if (postingStatus === 'posted') {
    const err: any = new Error(
      'Posted documents cannot be edited or deleted. Create a reversal instead.',
    );
    err.code = 'POSTED_DOCUMENT_IMMUTABLE';
    err.entityType = current.entityType || 'unknown';
    err.entityId = current.id;
    err.postingStatus = postingStatus;
    err.requestId = ctx.requestId;
    throw err;
  }

  // Also block mutations during posting transition
  if (postingStatus === 'posting') {
    const err: any = new Error(
      'Document is currently being posted. Wait for posting to complete.',
    );
    err.code = 'POSTING_IN_PROGRESS';
    err.entityType = current.entityType || 'unknown';
    err.entityId = current.id;
    err.postingStatus = postingStatus;
    err.requestId = ctx.requestId;
    throw err;
  }

  // Block mutations during reversal transition
  if (postingStatus === 'reversing') {
    const err: any = new Error(
      'Document is currently being reversed. Wait for reversal to complete.',
    );
    err.code = 'REVERSAL_IN_PROGRESS';
    err.entityType = current.entityType || 'unknown';
    err.entityId = current.id;
    err.postingStatus = postingStatus;
    err.requestId = ctx.requestId;
    throw err;
  }
}

/**
 * Check if an entity is a postable document.
 *
 * @param entity - Entity to check
 * @returns True if entity has postingStatus field
 */
export function isPostableDocument(entity: Record<string, unknown> | null): boolean {
  if (!entity) return false;
  return 'postingStatus' in entity;
}

/**
 * Check if a document is currently posted.
 *
 * @param entity - Entity to check
 * @returns True if entity is posted
 */
export function isPosted(entity: Record<string, unknown> | null): boolean {
  if (!entity) return false;
  return entity.postingStatus === 'posted';
}

/**
 * Check if a document is in a transitional posting state.
 *
 * @param entity - Entity to check
 * @returns True if entity is posting or reversing
 */
export function isPostingTransition(entity: Record<string, unknown> | null): boolean {
  if (!entity) return false;
  const status = entity.postingStatus as string | undefined;
  return status === 'posting' || status === 'reversing';
}
