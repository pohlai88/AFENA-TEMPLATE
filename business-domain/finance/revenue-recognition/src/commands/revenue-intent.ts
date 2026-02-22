import type { DomainIntent, RevenueDeferPayload, RevenueRecognizePayload } from 'afenda-canon';

export function buildRecognizeRevenueIntent(
  payload: RevenueRecognizePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'revenue.recognize', payload, idempotencyKey };
}

export function buildDeferRevenueIntent(
  payload: RevenueDeferPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'revenue.defer', payload, idempotencyKey };
}
