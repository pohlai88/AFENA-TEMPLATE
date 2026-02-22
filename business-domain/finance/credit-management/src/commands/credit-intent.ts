import type { CreditLimitUpdatePayload, DomainIntent } from 'afenda-canon';

export function buildCreditLimitUpdateIntent(
  payload: CreditLimitUpdatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'credit.limit.update', payload, idempotencyKey };
}
