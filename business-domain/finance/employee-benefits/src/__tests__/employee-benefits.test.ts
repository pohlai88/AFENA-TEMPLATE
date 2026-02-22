import { describe, expect, it, vi } from 'vitest';

import { computeDefinedBenefitCost, remeasureObligation } from '../calculators/emp-benefit-calc';
import {
  buildEmpBenefitAccrueIntent,
  buildEmpBenefitRemeasureIntent,
} from '../commands/emp-benefit-intent';
import { accrueBenefitCost, remeasurePlan } from '../services/emp-benefit-service';

vi.mock('afenda-database', () => ({ db: {}, dbSession: vi.fn() }));

describe('computeDefinedBenefitCost', () => {
  it('computes net period cost', () => {
    const { result: r } = computeDefinedBenefitCost({
      serviceCostMinor: 50_000,
      interestCostMinor: 30_000,
      expectedReturnMinor: 20_000,
    });
    expect(r.serviceCostMinor).toBe(50_000);
    expect(r.netInterestMinor).toBe(10_000);
    expect(r.netPeriodCostMinor).toBe(60_000);
  });

  it('negative net interest when return exceeds interest', () => {
    const { result: r } = computeDefinedBenefitCost({
      serviceCostMinor: 50_000,
      interestCostMinor: 10_000,
      expectedReturnMinor: 30_000,
    });
    expect(r.netInterestMinor).toBe(-20_000);
    expect(r.netPeriodCostMinor).toBe(30_000);
  });
});

describe('remeasureObligation', () => {
  it('detects actuarial loss', () => {
    const { result: r } = remeasureObligation({
      dboMinor: 1_000_000,
      planAssetsMinor: 800_000,
      prevNetLiabilityMinor: 180_000,
      periodCostMinor: 10_000,
      contributionsMinor: 5_000,
    });
    expect(r.netLiabilityMinor).toBe(200_000);
    // expected = 180k + 10k - 5k = 185k
    expect(r.actuarialGainLossMinor).toBe(15_000);
    expect(r.recogniseTo).toBe('oci');
  });

  it('detects actuarial gain', () => {
    const { result: r } = remeasureObligation({
      dboMinor: 900_000,
      planAssetsMinor: 800_000,
      prevNetLiabilityMinor: 120_000,
      periodCostMinor: 10_000,
      contributionsMinor: 5_000,
    });
    expect(r.netLiabilityMinor).toBe(100_000);
    // expected = 120k + 10k - 5k = 125k
    expect(r.actuarialGainLossMinor).toBe(-25_000);
  });
});

describe('buildEmpBenefitAccrueIntent', () => {
  it('builds emp-benefit.accrue intent', () => {
    const intent = buildEmpBenefitAccrueIntent({
      planId: 'plan-1',
      benefitType: 'defined-benefit',
      periodKey: '2025-P06',
      effectiveAt: '2025-06-30T23:59:59Z',
      serviceCostMinor: 50_000,
      interestCostMinor: 30_000,
      expectedReturnMinor: 20_000,
    });
    expect(intent.type).toBe('emp-benefit.accrue');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildEmpBenefitRemeasureIntent', () => {
  it('builds emp-benefit.remeasure intent', () => {
    const intent = buildEmpBenefitRemeasureIntent({
      planId: 'plan-1',
      periodKey: '2025-P06',
      dboMinor: 1_000_000,
      planAssetsMinor: 800_000,
      actuarialGainLossMinor: 15_000,
      recogniseTo: 'oci',
      assumptions: { discountRate: 0.05, salaryGrowthRate: 0.03 },
    });
    expect(intent.type).toBe('emp-benefit.remeasure');
  });
});

describe('accrueBenefitCost (service)', () => {
  it('returns emp-benefit.accrue intent', async () => {
    const r = await accrueBenefitCost({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      planId: 'plan-1',
      benefitType: 'defined-benefit',
      periodKey: '2025-P06',
      effectiveAt: '2025-06-30T23:59:59Z',
      serviceCostMinor: 50_000,
      interestCostMinor: 30_000,
      expectedReturnMinor: 20_000,
    });
    expect(r.kind).toBe('intent');
  });
});

describe('remeasurePlan (service)', () => {
  it('returns emp-benefit.remeasure intent', async () => {
    const r = await remeasurePlan({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      planId: 'plan-1',
      periodKey: '2025-P06',
      dboMinor: 1_000_000,
      planAssetsMinor: 800_000,
      actuarialGainLossMinor: 15_000,
      recogniseTo: 'oci',
      assumptions: { discountRate: 0.05, salaryGrowthRate: 0.03 },
    });
    expect(r.kind).toBe('intent');
  });
});
