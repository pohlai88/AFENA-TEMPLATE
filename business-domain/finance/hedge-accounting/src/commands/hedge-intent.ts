/**
 * Hedge Accounting Intent Builders
 *
 * Intent types: hedge.designate, hedge.effectiveness, hedge.oci.reclass
 */
import type {
  DomainIntent,
  HedgeDesignatePayload,
  HedgeEffectivenessPayload,
  HedgeOciReclassPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildHedgeDesignateIntent(
  payload: HedgeDesignatePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'hedge.designate',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        hedgingInstrumentId: payload.hedgingInstrumentId,
        hedgedItem: payload.hedgedItem,
        designationDate: payload.designationDate,
      }),
  };
}

export function buildHedgeEffectivenessIntent(
  payload: HedgeEffectivenessPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'hedge.effectiveness',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        designationId: payload.designationId,
        testType: payload.testType,
        periodKey: payload.periodKey,
      }),
  };
}

export function buildOciReclassIntent(
  payload: HedgeOciReclassPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'hedge.oci.reclass',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        designationId: payload.designationId,
        periodKey: payload.periodKey,
      }),
  };
}
