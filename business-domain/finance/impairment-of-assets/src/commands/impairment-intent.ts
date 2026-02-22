/**
 * Impairment Intent Builders
 *
 * Intent types: impairment.test, impairment.recognise, impairment.reverse
 */
import type {
  DomainIntent,
  ImpairmentRecognisePayload,
  ImpairmentReversePayload,
  ImpairmentTestPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildImpairmentTestIntent(
  payload: ImpairmentTestPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'impairment.test',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, periodKey: payload.periodKey }),
  };
}

export function buildImpairmentRecogniseIntent(
  payload: ImpairmentRecognisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'impairment.recognise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, impairmentDate: payload.impairmentDate }),
  };
}

export function buildImpairmentReverseIntent(
  payload: ImpairmentReversePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'impairment.reverse',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, reversalDate: payload.reversalDate }),
  };
}
