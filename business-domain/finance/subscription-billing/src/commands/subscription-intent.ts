import type { DomainIntent, SubscriptionInvoicePayload } from 'afenda-canon';

export function buildSubscriptionInvoiceIntent(
  payload: SubscriptionInvoicePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'subscription.invoice', payload, idempotencyKey };
}
