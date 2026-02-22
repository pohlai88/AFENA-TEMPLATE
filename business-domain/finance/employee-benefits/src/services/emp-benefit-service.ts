import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import {
  buildEmpBenefitAccrueIntent,
  buildEmpBenefitRemeasureIntent,
} from '../commands/emp-benefit-intent';

export async function accrueBenefitCost(
  db: DbSession,
  ctx: DomainContext,
  input: {
    planId: string;
    benefitType: 'short-term' | 'post-employment-db' | 'post-employment-dc' | 'termination' | 'other-long-term';
    periodKey: string;
    effectiveAt: string;
    serviceCostMinor: number;
    interestCostMinor: number;
    expectedReturnMinor: number;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildEmpBenefitAccrueIntent({
        planId: input.planId,
        benefitType: input.benefitType,
        periodKey: input.periodKey,
        effectiveAt: input.effectiveAt,
        serviceCostMinor: input.serviceCostMinor,
        interestCostMinor: input.interestCostMinor,
        expectedReturnMinor: input.expectedReturnMinor,
      }),
    ],
  };
}

export async function remeasurePlan(
  db: DbSession,
  ctx: DomainContext,
  input: {
    planId: string;
    periodKey: string;
    dboMinor: number;
    planAssetsMinor: number;
    actuarialGainLossMinor: number;
    recogniseTo: 'oci';
    assumptions: {
      discountRate: number;
      salaryGrowthRate: number;
      mortalityTable?: string;
    };
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildEmpBenefitRemeasureIntent({
        planId: input.planId,
        periodKey: input.periodKey,
        dboMinor: input.dboMinor,
        planAssetsMinor: input.planAssetsMinor,
        actuarialGainLossMinor: input.actuarialGainLossMinor,
        recogniseTo: input.recogniseTo,
        assumptions: input.assumptions,
      }),
    ],
  };
}
