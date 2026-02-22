import { describe, expect, it } from 'vitest';
import { checkCreditLimit } from '../calculators/credit-check';

describe('checkCreditLimit', () => {
  it('approves within limit', () => {
    const r = checkCreditLimit(100_000, 30_000, 20_000).result;
    expect(r.approved).toBe(true);
    expect(r.availableMinor).toBe(70_000);
    expect(r.overLimitMinor).toBe(0);
  });

  it('rejects over limit', () => {
    const r = checkCreditLimit(100_000, 80_000, 30_000).result;
    expect(r.approved).toBe(false);
    expect(r.overLimitMinor).toBe(10_000);
  });

  it('approves at exact limit', () => {
    const r = checkCreditLimit(100_000, 50_000, 50_000).result;
    expect(r.approved).toBe(true);
    expect(r.overLimitMinor).toBe(0);
  });

  it('zero credit limit always rejects', () => {
    const r = checkCreditLimit(0, 0, 1_000).result;
    expect(r.approved).toBe(false);
    expect(r.utilizationPercent).toBe(1);
  });

  it('throws on negative values', () => {
    expect(() => checkCreditLimit(-1, 0, 0)).toThrow('creditLimitMinor');
    expect(() => checkCreditLimit(100_000, -1, 0)).toThrow('currentExposureMinor');
    expect(() => checkCreditLimit(100_000, 0, -1)).toThrow('orderAmountMinor');
  });
});
