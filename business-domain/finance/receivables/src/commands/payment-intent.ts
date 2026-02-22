import type { DomainIntent, PaymentCreatePayload } from 'afenda-canon';

/**
 * Build an intent to create a payment document.
 *
 * @see PAY-01 — Payment creation via intent
 */
export function buildPaymentCreateIntent(
  payload: PaymentCreatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'payment.create', payload, idempotencyKey };
}
