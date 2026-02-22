import { describe, expect, it } from 'vitest';
import { splitCompoundInstrument } from '../calculators/compound-instrument';

describe('splitCompoundInstrument', () => {
  it('splits convertible bond into liability and equity', () => {
    const r = splitCompoundInstrument({ instrumentId: 'CB1', faceValueMinor: 1000000, couponRateBps: 500, termYears: 5, marketRateBps: 800, paymentFrequency: 1 });
    expect(r.result.liabilityMinor).toBeLessThan(1000000);
    expect(r.result.equityMinor).toBeGreaterThan(0);
    expect(r.result.liabilityMinor + r.result.equityMinor).toBe(1000000);
  });

  it('liability equals face when coupon equals market rate', () => {
    const r = splitCompoundInstrument({ instrumentId: 'CB2', faceValueMinor: 100000, couponRateBps: 600, termYears: 3, marketRateBps: 600, paymentFrequency: 1 });
    expect(Math.abs(r.result.liabilityMinor - 100000)).toBeLessThan(5);
  });

  it('throws on zero face value', () => {
    expect(() => splitCompoundInstrument({ instrumentId: 'CB3', faceValueMinor: 0, couponRateBps: 500, termYears: 5, marketRateBps: 800, paymentFrequency: 1 })).toThrow();
  });

  it('throws on zero term', () => {
    expect(() => splitCompoundInstrument({ instrumentId: 'CB4', faceValueMinor: 100000, couponRateBps: 500, termYears: 0, marketRateBps: 800, paymentFrequency: 1 })).toThrow();
  });
});
