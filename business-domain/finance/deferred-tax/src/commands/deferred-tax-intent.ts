/**
 * Deferred Tax Intent Builders
 *
 * Intent types: deferred-tax.calculate, deferred-tax.recognise
 */
import type {
  DeferredTaxCalculatePayload,
  DeferredTaxRecognisePayload,
  DomainIntent,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildDeferredTaxCalculateIntent(
  payload: DeferredTaxCalculatePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'deferred-tax.calculate',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        entityId: payload.entityId,
        periodKey: payload.periodKey,
      }),
  };
}

export function buildDeferredTaxRecogniseIntent(
  payload: DeferredTaxRecognisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'deferred-tax.recognise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        entityId: payload.entityId,
        periodKey: payload.periodKey,
      }),
  };
}
