import type { DomainIntent, TreasuryTransferPayload } from 'afenda-canon';

export function buildCashTransferIntent(
  payload: TreasuryTransferPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'treasury.transfer', payload, idempotencyKey };
}
