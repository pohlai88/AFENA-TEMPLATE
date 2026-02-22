/**
 * IAS 20.24 — Capital Approach Grant
 *
 * Grants related to assets are presented as deferred income and
 * recognised in P&L on a systematic basis over the useful life
 * of the related asset.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type CapitalApproachGrantInput = {
  grantAmountMinor: number;
  relatedAssetUsefulLifeMonths: number;
  elapsedMonths: number;
  priorAmortisedMinor: number;
};

export type CapitalApproachGrantResult = {
  periodAmortisationMinor: number;
  cumulativeAmortisedMinor: number;
  deferredIncomeBalanceMinor: number;
  explanation: string;
};

export function computeCapitalApproachGrant(
  inputs: CapitalApproachGrantInput,
): CalculatorResult<CapitalApproachGrantResult> {
  const { grantAmountMinor, relatedAssetUsefulLifeMonths, elapsedMonths, priorAmortisedMinor } = inputs;

  if (grantAmountMinor <= 0) throw new DomainError('VALIDATION_FAILED', 'Grant amount must be positive');
  if (relatedAssetUsefulLifeMonths <= 0) throw new DomainError('VALIDATION_FAILED', 'Useful life must be positive');

  const periodAmortisationMinor = Math.round(grantAmountMinor / relatedAssetUsefulLifeMonths);
  const maxAmortised = Math.round((grantAmountMinor * Math.min(elapsedMonths, relatedAssetUsefulLifeMonths)) / relatedAssetUsefulLifeMonths);
  const cumulativeAmortisedMinor = Math.min(
    grantAmountMinor,
    Math.max(priorAmortisedMinor + periodAmortisationMinor, maxAmortised),
  );
  const deferredIncomeBalanceMinor = grantAmountMinor - cumulativeAmortisedMinor;

  const explanation =
    `Capital approach (IAS 20.24): grant ${grantAmountMinor} over ${relatedAssetUsefulLifeMonths}m, ` +
    `period amortisation ${periodAmortisationMinor}, deferred balance ${deferredIncomeBalanceMinor}`;

  return {
    result: { periodAmortisationMinor, cumulativeAmortisedMinor, deferredIncomeBalanceMinor, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
