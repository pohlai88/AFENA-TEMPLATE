/**
 * Provision Intent Builders
 *
 * Constructs DomainIntent objects for provision operations.
 * Intent types: provision.recognise, provision.utilise, provision.reverse
 */
import type {
  DomainIntent,
  ProvisionRecognisePayload,
  ProvisionReversePayload,
  ProvisionUtilisePayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildProvisionIntent(
  payload: ProvisionRecognisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'provision.recognise',
    payload,
    idempotencyKey: idempotencyKey ?? stableCanonicalJson({ provisionId: payload.provisionId }),
  };
}

export function buildProvisionUtiliseIntent(
  payload: ProvisionUtilisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'provision.utilise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        provisionId: payload.provisionId,
        utilisationDate: payload.utilisationDate,
      }),
  };
}

export function buildProvisionReverseIntent(
  payload: ProvisionReversePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'provision.reverse',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        provisionId: payload.provisionId,
        reversalDate: payload.reversalDate,
      }),
  };
}
