import type { ErrorCode, RetryableReason } from './errors';

/**
 * Deterministic status discriminant for every mutation outcome.
 * K-07: status is always one of these three values.
 */
export type ReceiptStatus = 'ok' | 'rejected' | 'error';

/** Fields shared across all MutationReceipt variants. */
interface MutationReceiptBase {
  requestId: string;
  mutationId: string;
  batchId?: string | undefined;
  entityId: string | null;
  entityType: string;
}

/**
 * Outcome when the mutation succeeded.
 *
 * - `entityId` is always a non-null string (narrowed from base)
 * - `versionAfter` is always a number (narrowed from nullable)
 * - No error fields present
 */
export interface MutationReceiptOk extends MutationReceiptBase {
  readonly status: 'ok';
  readonly entityId: string;
  readonly versionBefore: number | null;
  readonly versionAfter: number;
  readonly auditLogId: string | null;
}

/**
 * Outcome when the mutation was deterministically rejected (client fault).
 *
 * Retrying the same request without adjustment will always fail.
 * Covers: VALIDATION_FAILED, POLICY_DENIED, LIFECYCLE_DENIED, NOT_FOUND, CONFLICT_VERSION.
 */
export interface MutationReceiptRejected extends MutationReceiptBase {
  readonly status: 'rejected';
  readonly versionBefore: null;
  readonly versionAfter: null;
  readonly auditLogId: null;
  /** Stable error fingerprint: `"${errorCode}:${mutationId}"`. */
  readonly errorId: string;
  readonly errorCode: ErrorCode;
  /** Always `true` — the client sent an invalid or unauthorised request. */
  readonly isClientFault: true;
  /** Always `false` — retrying the same request will not help. */
  readonly retryable: false;
}

/**
 * Outcome when a transient or infrastructure error prevented the mutation.
 *
 * When `retryable` is `true`, the caller should honour `retryAfterMs` if present.
 * Covers: INTERNAL_ERROR, RATE_LIMITED, DB timeouts.
 */
export interface MutationReceiptError extends MutationReceiptBase {
  readonly status: 'error';
  readonly versionBefore: null;
  readonly versionAfter: null;
  readonly auditLogId: null;
  /** Stable error fingerprint: `"${errorCode}:${mutationId}"`. */
  readonly errorId: string;
  readonly errorCode: ErrorCode;
  /** Always `false` — the failure was server- or infrastructure-side. */
  readonly isClientFault: false;
  /** Whether retrying the same request (after a delay) may succeed. */
  readonly retryable: boolean;
  /** Milliseconds to wait before retrying. Present when `RATE_LIMITED`. */
  readonly retryAfterMs?: number | undefined;
  /** Machine-readable retry reason. Absent when `retryable` is `false`. */
  readonly retryableReason?: RetryableReason | undefined;
}

/**
 * Discriminated union receipt returned by `mutate()`.
 *
 * Replaces the flat `Receipt` type. Narrow on `status` to access variant-specific fields:
 *
 * ```ts
 * if (response.meta.receipt?.status === 'ok') {
 *   console.log(receipt.versionAfter); // number, not number | null
 * }
 * ```
 */
export type MutationReceipt =
  | MutationReceiptOk
  | MutationReceiptRejected
  | MutationReceiptError;


