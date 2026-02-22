import { describe, expect, it } from 'vitest';

import { computeIntangibleRevaluation } from '../calculators/intangible-revaluation';
import { reviewUsefulLife } from '../calculators/useful-life-review';

describe('computeIntangibleRevaluation', () => {
  it('recognises increase to OCI', () => {
    const { result } = computeIntangibleRevaluation({
      assetId: 'a1', carryingAmountMinor: 80_000,
      fairValueMinor: 100_000, priorRevaluationSurplusMinor: 0,
    });
    expect(result.revaluationMinor).toBe(20_000);
    expect(result.toOciMinor).toBe(20_000);
    expect(result.toPnlMinor).toBe(0);
    expect(result.newCarryingMinor).toBe(100_000);
  });

  it('recognises decrease to P&L when no surplus', () => {
    const { result } = computeIntangibleRevaluation({
      assetId: 'a1', carryingAmountMinor: 100_000,
      fairValueMinor: 80_000, priorRevaluationSurplusMinor: 0,
    });
    expect(result.revaluationMinor).toBe(-20_000);
    expect(result.toPnlMinor).toBe(-20_000);
    expect(result.toOciMinor).toBe(0);
  });

  it('offsets decrease against prior surplus', () => {
    const { result } = computeIntangibleRevaluation({
      assetId: 'a1', carryingAmountMinor: 100_000,
      fairValueMinor: 85_000, priorRevaluationSurplusMinor: 10_000,
    });
    expect(result.toOciMinor).toBe(-10_000);
    expect(result.toPnlMinor).toBe(-5_000);
    expect(result.newSurplusMinor).toBe(0);
  });

  it('throws on negative carrying', () => {
    expect(() => computeIntangibleRevaluation({
      assetId: 'a1', carryingAmountMinor: -1,
      fairValueMinor: 100_000, priorRevaluationSurplusMinor: 0,
    })).toThrow('cannot be negative');
  });
});

describe('reviewUsefulLife', () => {
  it('recommends indefinite when all criteria met', () => {
    const { result } = reviewUsefulLife({
      assetId: 'a1', currentClassification: 'indefinite',
      hasContractualLimit: false, hasCompetitiveObsolescence: false,
      hasTechnologicalObsolescence: false, hasStableMarketDemand: true,
    });
    expect(result.recommendedClassification).toBe('indefinite');
    expect(result.recommendedLifeMonths).toBeNull();
    expect(result.classificationChanged).toBe(false);
  });

  it('recommends finite when contractual limit exists', () => {
    const { result } = reviewUsefulLife({
      assetId: 'a1', currentClassification: 'indefinite',
      hasContractualLimit: true, contractualLimitMonths: 60,
      hasCompetitiveObsolescence: false, hasTechnologicalObsolescence: false,
      hasStableMarketDemand: true,
    });
    expect(result.recommendedClassification).toBe('finite');
    expect(result.recommendedLifeMonths).toBe(60);
    expect(result.classificationChanged).toBe(true);
  });

  it('caps at contractual limit', () => {
    const { result } = reviewUsefulLife({
      assetId: 'a1', currentClassification: 'finite',
      proposedUsefulLifeMonths: 120,
      hasContractualLimit: true, contractualLimitMonths: 60,
      hasCompetitiveObsolescence: false, hasTechnologicalObsolescence: false,
      hasStableMarketDemand: true,
    });
    expect(result.recommendedLifeMonths).toBe(60);
  });

  it('throws when contractual limit missing months', () => {
    expect(() => reviewUsefulLife({
      assetId: 'a1', currentClassification: 'finite',
      hasContractualLimit: true,
      hasCompetitiveObsolescence: false, hasTechnologicalObsolescence: false,
      hasStableMarketDemand: true,
    })).toThrow('Contractual limit months required');
  });
});
