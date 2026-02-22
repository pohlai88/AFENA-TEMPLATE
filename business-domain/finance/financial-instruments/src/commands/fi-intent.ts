/**
 * Financial Instrument Intent Builders
 *
 * Intent types: fi.fv.change, fi.eir.accrue
 */
import type { DomainIntent, FiEirAccrualPayload, FiFvChangePayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildFvChangeIntent(
  payload: FiFvChangePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'fi.fv.change',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        instrumentId: payload.instrumentId,
        periodKey: payload.periodKey,
      }),
  };
}

export function buildEirAccrualIntent(
  payload: FiEirAccrualPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'fi.eir.accrue',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        instrumentId: payload.instrumentId,
        periodKey: payload.periodKey,
      }),
  };
}
