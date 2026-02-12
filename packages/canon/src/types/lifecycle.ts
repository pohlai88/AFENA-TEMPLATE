/**
 * Lifecycle error — thrown by enforceLifecycle() before handler.
 * Typed error with deterministic code for audit trail.
 */
export class LifecycleError extends Error {
  readonly code = 'LIFECYCLE_DENIED' as const;
  readonly lifecycleReason: LifecycleDenyReason;

  constructor(message: string, reason: LifecycleDenyReason) {
    super(message);
    this.name = 'LifecycleError';
    this.lifecycleReason = reason;
  }

  static submittedImmutable(): LifecycleError {
    return new LifecycleError(
      'Submitted documents cannot be updated or deleted. Use cancel or amend.',
      'SUBMITTED_IMMUTABLE',
    );
  }

  static alreadySubmitted(): LifecycleError {
    return new LifecycleError(
      'Document is already submitted.',
      'ALREADY_SUBMITTED',
    );
  }

  static cancelledReadOnly(): LifecycleError {
    return new LifecycleError(
      'Cancelled documents are read-only.',
      'CANCELLED_READ_ONLY',
    );
  }
}

export type LifecycleDenyReason =
  | 'SUBMITTED_IMMUTABLE'
  | 'ALREADY_SUBMITTED'
  | 'CANCELLED_READ_ONLY';
