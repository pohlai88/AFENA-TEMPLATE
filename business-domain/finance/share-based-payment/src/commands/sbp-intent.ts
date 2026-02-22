import type {
  DomainIntent,
  SbpExpensePayload,
  SbpGrantPayload,
  SbpVestPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildSbpGrantIntent(
  payload: SbpGrantPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'sbp.grant',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ grantId: payload.grantId, grantDate: payload.grantDate }),
  };
}

export function buildSbpVestIntent(payload: SbpVestPayload, idempotencyKey?: string): DomainIntent {
  return {
    type: 'sbp.vest',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ grantId: payload.grantId, periodKey: payload.periodKey }),
  };
}

export function buildSbpExpenseIntent(
  payload: SbpExpensePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'sbp.expense',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ grantId: payload.grantId, periodKey: payload.periodKey }),
  };
}
