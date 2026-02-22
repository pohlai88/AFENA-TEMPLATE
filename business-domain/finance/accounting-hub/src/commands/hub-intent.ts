/**
 * Accounting Hub Intent Builders
 *
 * Pure data construction — zero side effects.
 * Builds typed DomainIntents for the accounting hub domain.
 */
import type {
  AcctDeriveCommitPayload,
  AcctMappingPublishPayload,
  DomainIntent,
  GlAccrualRunPayload,
  GlAllocationRunPayload,
  GlReclassRunPayload,
} from 'afenda-canon';

export function buildDeriveCommitIntent(
  payload: AcctDeriveCommitPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'acct.derive.commit', payload, idempotencyKey };
}

export function buildPublishMappingIntent(
  payload: AcctMappingPublishPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'acct.mapping.publish', payload, idempotencyKey };
}

export function buildReclassRunIntent(
  payload: GlReclassRunPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'gl.reclass.run', payload, idempotencyKey };
}

export function buildAllocationRunIntent(
  payload: GlAllocationRunPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'gl.allocation.run', payload, idempotencyKey };
}

export function buildAccrualRunIntent(
  payload: GlAccrualRunPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'gl.accrual.run', payload, idempotencyKey };
}
