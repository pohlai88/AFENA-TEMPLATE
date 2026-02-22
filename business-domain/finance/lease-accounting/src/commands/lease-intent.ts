import type { DomainIntent, LeaseAmortizePayload, LeaseModifyPayload } from 'afenda-canon';

export function buildLeaseAmortizeIntent(
  payload: LeaseAmortizePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'lease.amortize', payload, idempotencyKey };
}

export function buildLeaseModifyIntent(
  payload: LeaseModifyPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'lease.modify', payload, idempotencyKey };
}
