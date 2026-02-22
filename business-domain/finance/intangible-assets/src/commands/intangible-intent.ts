/**
 * Intangible Asset Intent Builders
 *
 * Intent types: intangible.capitalise, intangible.amortise, intangible.impair
 */
import type {
  DomainIntent,
  IntangibleAmortisePayload,
  IntangibleCapitalisePayload,
  IntangibleImpairPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildCapitaliseIntent(
  payload: IntangibleCapitalisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'intangible.capitalise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, periodKey: payload.periodKey }),
  };
}

export function buildAmortiseIntent(
  payload: IntangibleAmortisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'intangible.amortise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, periodKey: payload.periodKey }),
  };
}

export function buildImpairIntent(
  payload: IntangibleImpairPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'intangible.impair',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, impairmentDate: payload.impairmentDate }),
  };
}
