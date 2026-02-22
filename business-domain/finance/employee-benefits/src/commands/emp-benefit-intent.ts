import type {
  DomainIntent,
  EmpBenefitAccruePayload,
  EmpBenefitRemeasurePayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildEmpBenefitAccrueIntent(
  payload: EmpBenefitAccruePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'emp-benefit.accrue',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ planId: payload.planId, periodKey: payload.periodKey }),
  };
}

export function buildEmpBenefitRemeasureIntent(
  payload: EmpBenefitRemeasurePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'emp-benefit.remeasure',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ planId: payload.planId, periodKey: payload.periodKey }),
  };
}
