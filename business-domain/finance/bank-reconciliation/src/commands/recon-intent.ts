import type { BankReconConfirmPayload, DomainIntent } from 'afenda-canon';

export function buildReconConfirmIntent(
  payload: BankReconConfirmPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'bank-recon.confirm', payload, idempotencyKey };
}
