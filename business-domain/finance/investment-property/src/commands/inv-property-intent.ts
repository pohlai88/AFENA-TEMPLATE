import type {
  DomainIntent,
  InvPropertyMeasurePayload,
  InvPropertyTransferPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildInvPropertyMeasureIntent(
  payload: InvPropertyMeasurePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'inv-property.measure',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ propertyId: payload.propertyId, periodKey: payload.periodKey }),
  };
}

export function buildInvPropertyTransferIntent(
  payload: InvPropertyTransferPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'inv-property.transfer',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ propertyId: payload.propertyId, transferDate: payload.transferDate }),
  };
}
