import { LifecycleError } from 'afenda-canon';

import type { MutationSpec } from 'afenda-canon';

/**
 * Lifecycle guard — enforced BEFORE policy, absolute.
 * Prevents illegal state transitions on doc entities.
 *
 * Enterprise state machine:
 *   Draft     → create, update, delete, submit (subject to policy)
 *   Submitted → approve, reject, cancel, amend (update/delete/submit denied)
 *   Active    → update, cancel (submit/approve/reject denied)
 *   Cancelled → restore only (everything else denied)
 *   Amended   → read-only (everything denied)
 *
 * Non-doc entities (no doc_status column) pass through unchanged.
 * Create operations (no existing row) pass through unchanged.
 */
export function enforceLifecycle(
  _spec: MutationSpec,
  verb: string,
  existing: Record<string, unknown> | null,
): void {
  if (!existing) return; // create — no existing row

  const status = (existing.doc_status ?? existing.docStatus) as
    | 'draft'
    | 'submitted'
    | 'active'
    | 'cancelled'
    | 'amended'
    | undefined;

  if (!status) return; // non-doc entity — no lifecycle

  if (status === 'submitted') {
    if (verb === 'update' || verb === 'delete') {
      throw LifecycleError.submittedImmutable();
    }
    if (verb === 'submit') {
      throw LifecycleError.alreadySubmitted();
    }
    // allow: approve, reject, cancel, amend
    return;
  }

  if (status === 'active') {
    if (verb === 'submit' || verb === 'approve' || verb === 'reject') {
      throw LifecycleError.activeNoResubmit();
    }
    // allow: update, cancel, delete
    return;
  }

  if (status === 'cancelled') {
    if (verb === 'restore') return; // allow restore from cancelled
    throw LifecycleError.cancelledReadOnly();
  }

  if (status === 'amended') {
    throw LifecycleError.amendedReadOnly();
  }

  // draft — all verbs allowed (subject to policy)
}
