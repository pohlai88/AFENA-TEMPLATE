import type { DomainIntent, TaxAdjustPayload } from 'afenda-canon';

export type { TaxAdjustPayload } from 'afenda-canon';

export function buildTaxAdjustIntent(
  payload: TaxAdjustPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'tax.adjust', payload, idempotencyKey };
}
