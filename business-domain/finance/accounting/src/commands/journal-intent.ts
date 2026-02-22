import type { DomainIntent, JournalPostPayload } from 'afenda-canon';

export function buildPostJournalIntent(
  payload: JournalPostPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'accounting.post', payload, idempotencyKey };
}
