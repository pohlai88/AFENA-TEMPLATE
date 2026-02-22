import type { DomainIntent, DunningRunCreatePayload } from 'afenda-canon';

export function buildDunningRunCreateIntent(
  payload: DunningRunCreatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'credit.dunning.create', payload, idempotencyKey };
}
