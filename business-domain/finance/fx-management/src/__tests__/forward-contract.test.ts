import { describe, expect, it } from 'vitest';
import { computeForwardContractFairValue } from '../calculators/forward-contract';

describe('FX-04 — Forward Contract Fair Value', () => {
  it('computes fair value gain', () => {
    const { result } = computeForwardContractFairValue({
      contractId: 'FWD-1',
      buyCurrency: 'EUR',
      sellCurrency: 'USD',
      notionalMinor: 1_000_000,
      contractedForwardRate: 1.0800,
      currentSpotRate: 1.0900,
      currentForwardPoints: 0.0050,
      remainingDays: 90,
      annualDiscountRatePct: 5,
    });
    expect(result.gainOrLoss).toBe('gain');
    expect(result.fairValueMinor).toBeGreaterThan(0);
    expect(result.currentForwardRate).toBeCloseTo(1.095, 3);
    expect(result.discountFactor).toBeLessThan(1);
  });

  it('computes fair value loss', () => {
    const { result } = computeForwardContractFairValue({
      contractId: 'FWD-2',
      buyCurrency: 'EUR',
      sellCurrency: 'USD',
      notionalMinor: 1_000_000,
      contractedForwardRate: 1.1000,
      currentSpotRate: 1.0800,
      currentForwardPoints: 0.0050,
      remainingDays: 60,
      annualDiscountRatePct: 4,
    });
    expect(result.gainOrLoss).toBe('loss');
    expect(result.fairValueMinor).toBeLessThan(0);
  });

  it('returns zero when rates match', () => {
    const { result } = computeForwardContractFairValue({
      contractId: 'FWD-3',
      buyCurrency: 'EUR',
      sellCurrency: 'USD',
      notionalMinor: 500_000,
      contractedForwardRate: 1.0850,
      currentSpotRate: 1.0800,
      currentForwardPoints: 0.0050,
      remainingDays: 30,
      annualDiscountRatePct: 3,
    });
    expect(result.gainOrLoss).toBe('zero');
  });

  it('returns CalculatorResult shape', () => {
    const res = computeForwardContractFairValue({
      contractId: 'X', buyCurrency: 'A', sellCurrency: 'B',
      notionalMinor: 100, contractedForwardRate: 1, currentSpotRate: 1,
      currentForwardPoints: 0, remainingDays: 0, annualDiscountRatePct: 0,
    });
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on non-positive notional', () => {
    expect(() => computeForwardContractFairValue({
      contractId: 'X', buyCurrency: 'A', sellCurrency: 'B',
      notionalMinor: 0, contractedForwardRate: 1, currentSpotRate: 1,
      currentForwardPoints: 0, remainingDays: 0, annualDiscountRatePct: 0,
    })).toThrow('notionalMinor must be positive');
  });
});
