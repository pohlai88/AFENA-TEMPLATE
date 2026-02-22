export type DomainErrorCode =
  | 'FX_RATE_NOT_FOUND'
  | 'ALREADY_POSTING'
  | 'PERIOD_CLOSED'
  | 'VALIDATION_FAILED'
  | 'NOT_AUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'IDEMPOTENCY_CONFLICT'
  | 'OVERLAY_NOT_ACTIVE'
  | 'SHARED_KERNEL_VIOLATION'
  | 'IC_SAME_COMPANY';

export class DomainError extends Error {
  override readonly name = 'DomainError';
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message);
  }
}
