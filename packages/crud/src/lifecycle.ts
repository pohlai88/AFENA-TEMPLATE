import { LifecycleError } from 'afena-canon';

import type { MutationSpec } from 'afena-canon';

/**
 * Lifecycle guard — enforced BEFORE policy, absolute.
 * Prevents illegal state transitions on doc entities.
 *
 * State machine:
 *   Draft     → create, update, delete, submit (subject to policy)
 *   Submitted → cancel, amend only (update/delete/submit denied)
 *   Cancelled → read-only (everything denied)
 *
 * Non-doc entities (no doc_status column) pass through unchanged.
 * Create operations (no existing row) pass through unchanged.
 */
export function enforceLifecycle(
  spec: MutationSpec,
  verb: string,
  existing: Record<string, unknown> | null,
): void {
  if (!existing) return; // create — no existing row

  const status = (existing.doc_status ?? existing.docStatus) as
    | 'draft'
    | 'submitted'
    | 'cancelled'
    | undefined;

  if (!status) return; // non-doc entity — no lifecycle

  if (status === 'submitted') {
    if (verb === 'update' || verb === 'delete') {
      throw LifecycleError.submittedImmutable();
    }
    if (verb === 'submit') {
      throw LifecycleError.alreadySubmitted();
    }
    // allow: cancel, amend
    return;
  }

  if (status === 'cancelled') {
    throw LifecycleError.cancelledReadOnly();
  }

  // draft — all verbs allowed (subject to policy)
}
