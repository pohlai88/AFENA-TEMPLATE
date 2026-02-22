/**
 * Transfer Pricing Intent Builders
 *
 * Constructs DomainIntent objects for TP operations.
 * Intent types: tp.policy.publish, tp.price.compute
 */
import type { DomainIntent, TpPolicyPublishPayload, TpPriceComputePayload } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildPublishPolicyIntent(
  payload: TpPolicyPublishPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'tp.policy.publish',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        policyId: payload.policyId,
        version: payload.version,
      }),
  };
}

export function buildComputePriceIntent(
  payload: TpPriceComputePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'tp.price.compute',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        transactionId: payload.transactionId,
        policyId: payload.policyId,
      }),
  };
}
