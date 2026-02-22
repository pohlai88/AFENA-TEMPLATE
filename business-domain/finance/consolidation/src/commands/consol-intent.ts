import type {
  ConsolidationEliminatePayload,
  ConsolidationTranslatePayload,
  DomainIntent,
} from 'afenda-canon';

export function buildConsolidationEliminateIntent(
  payload: ConsolidationEliminatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'consolidation.eliminate', payload, idempotencyKey };
}

export function buildConsolidationTranslateIntent(
  payload: ConsolidationTranslatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'consolidation.translate', payload, idempotencyKey };
}
