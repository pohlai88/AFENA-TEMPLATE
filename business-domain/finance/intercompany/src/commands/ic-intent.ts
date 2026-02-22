import type { DomainIntent, IcEliminatePayload, IcMatchPayload, IcMirrorPayload } from 'afenda-canon';

export function buildIcMatchIntent(payload: IcMatchPayload, idempotencyKey: string): DomainIntent {
  return { type: 'ic.match', payload, idempotencyKey };
}

export function buildIcMirrorIntent(payload: IcMirrorPayload, idempotencyKey: string): DomainIntent {
  return { type: 'ic.mirror', payload, idempotencyKey };
}

export function buildIcEliminateIntent(
  payload: IcEliminatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'ic.eliminate', payload, idempotencyKey };
}
