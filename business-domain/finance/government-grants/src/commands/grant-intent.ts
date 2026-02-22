import type { DomainIntent, GrantAmortisePayload, GrantRecognisePayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildGrantRecogniseIntent(
  payload: GrantRecognisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'grant.recognise',
    payload,
    idempotencyKey: idempotencyKey ?? stableCanonicalJson({ grantId: payload.grantId }),
  };
}

export function buildGrantAmortiseIntent(
  payload: GrantAmortisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'grant.amortise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ grantId: payload.grantId, periodKey: payload.periodKey }),
  };
}
