import { describe, expect, it } from 'vitest';

import { computePlanAssetReturn } from '../calculators/plan-asset-return';
import { computeCurtailmentGain } from '../calculators/curtailment-gain';
import { computePastServiceCost } from '../calculators/past-service-cost';
import { computeEmpBenefitDisclosure } from '../calculators/emp-benefit-disclosure';

describe('computePlanAssetReturn', () => {
  it('computes expected return and remeasurement', () => {
    const { result } = computePlanAssetReturn({
      openingPlanAssetsMinor: 1_000_000, contributionsMinor: 50_000,
      benefitsPaidMinor: 30_000, discountRate: 0.05, actualReturnMinor: 70_000,
    });
    expect(result.expectedReturnMinor).toBe(50_000);
    expect(result.remeasurementMinor).toBe(20_000);
    expect(result.closingPlanAssetsMinor).toBe(1_090_000);
  });

  it('throws on negative opening assets', () => {
    expect(() => computePlanAssetReturn({
      openingPlanAssetsMinor: -1, contributionsMinor: 0,
      benefitsPaidMinor: 0, discountRate: 0.05, actualReturnMinor: 0,
    })).toThrow('cannot be negative');
  });
});

describe('computeCurtailmentGain', () => {
  it('computes gain on curtailment', () => {
    const { result } = computeCurtailmentGain({
      preCurtailmentDboMinor: 500_000, postCurtailmentDboMinor: 350_000,
      unrecognisedPastServiceCostMinor: 20_000, planAssetsSettledMinor: 30_000,
    });
    expect(result.dboReductionMinor).toBe(150_000);
    expect(result.curtailmentGainLossMinor).toBe(100_000);
    expect(result.isGain).toBe(true);
  });

  it('identifies loss when costs exceed reduction', () => {
    const { result } = computeCurtailmentGain({
      preCurtailmentDboMinor: 500_000, postCurtailmentDboMinor: 480_000,
      unrecognisedPastServiceCostMinor: 30_000, planAssetsSettledMinor: 0,
    });
    expect(result.isGain).toBe(false);
  });
});

describe('computePastServiceCost', () => {
  it('computes cost on benefit increase', () => {
    const { result } = computePastServiceCost({
      priorDboMinor: 400_000, revisedDboMinor: 450_000,
      amendmentType: 'benefit-increase',
    });
    expect(result.pastServiceCostMinor).toBe(50_000);
    expect(result.isCredit).toBe(false);
    expect(result.recogniseTo).toBe('pnl');
  });

  it('computes credit on benefit decrease', () => {
    const { result } = computePastServiceCost({
      priorDboMinor: 400_000, revisedDboMinor: 350_000,
      amendmentType: 'benefit-decrease',
    });
    expect(result.pastServiceCostMinor).toBe(-50_000);
    expect(result.isCredit).toBe(true);
  });
});

describe('computeEmpBenefitDisclosure', () => {
  it('reconciles DBO and plan assets', () => {
    const { result } = computeEmpBenefitDisclosure({
      openingDboMinor: 1_000_000, serviceCostMinor: 80_000,
      interestCostMinor: 50_000, actuarialGainLossMinor: -20_000,
      benefitsPaidMinor: 60_000, pastServiceCostMinor: 0,
      openingPlanAssetsMinor: 800_000, expectedReturnMinor: 40_000,
      contributionsMinor: 100_000, assetRemeasurementMinor: 10_000,
    });
    expect(result.closingDboMinor).toBe(1_050_000);
    expect(result.closingPlanAssetsMinor).toBe(890_000);
    expect(result.netDefinedBenefitMinor).toBe(160_000);
    expect(result.isFunded).toBe(true);
  });
});
