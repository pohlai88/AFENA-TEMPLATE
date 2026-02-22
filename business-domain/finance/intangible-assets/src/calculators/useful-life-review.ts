/**
 * IAS 38.104 — Useful Life Review
 *
 * The useful life of an intangible asset that is not being amortised
 * shall be reviewed each period to determine whether events continue
 * to support an indefinite useful life assessment.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type UsefulLifeReviewInput = {
  assetId: string;
  currentClassification: 'finite' | 'indefinite';
  proposedUsefulLifeMonths?: number;
  hasContractualLimit: boolean;
  contractualLimitMonths?: number;
  hasCompetitiveObsolescence: boolean;
  hasTechnologicalObsolescence: boolean;
  hasStableMarketDemand: boolean;
};

export type UsefulLifeReviewResult = {
  recommendedClassification: 'finite' | 'indefinite';
  recommendedLifeMonths: number | null;
  classificationChanged: boolean;
  explanation: string;
};

export function reviewUsefulLife(
  inputs: UsefulLifeReviewInput,
): CalculatorResult<UsefulLifeReviewResult> {
  const {
    currentClassification, proposedUsefulLifeMonths,
    hasContractualLimit, contractualLimitMonths,
    hasCompetitiveObsolescence, hasTechnologicalObsolescence, hasStableMarketDemand,
  } = inputs;

  if (hasContractualLimit && (!contractualLimitMonths || contractualLimitMonths <= 0)) {
    throw new DomainError('VALIDATION_FAILED', 'Contractual limit months required when contractual limit exists');
  }

  const supportsIndefinite = !hasContractualLimit && !hasCompetitiveObsolescence &&
    !hasTechnologicalObsolescence && hasStableMarketDemand;

  let recommendedClassification: 'finite' | 'indefinite';
  let recommendedLifeMonths: number | null;

  if (supportsIndefinite) {
    recommendedClassification = 'indefinite';
    recommendedLifeMonths = null;
  } else {
    recommendedClassification = 'finite';
    if (hasContractualLimit && contractualLimitMonths) {
      recommendedLifeMonths = proposedUsefulLifeMonths
        ? Math.min(proposedUsefulLifeMonths, contractualLimitMonths)
        : contractualLimitMonths;
    } else {
      recommendedLifeMonths = proposedUsefulLifeMonths ?? 120;
    }
  }

  const classificationChanged = recommendedClassification !== currentClassification;

  const explanation = classificationChanged
    ? `Useful life review (IAS 38.104): classification changed ${currentClassification} → ${recommendedClassification}` +
      (recommendedLifeMonths ? `, life ${recommendedLifeMonths}m` : '')
    : `Useful life review (IAS 38.104): classification unchanged (${currentClassification})` +
      (recommendedLifeMonths ? `, life ${recommendedLifeMonths}m` : '');

  return {
    result: { recommendedClassification, recommendedLifeMonths, classificationChanged, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
