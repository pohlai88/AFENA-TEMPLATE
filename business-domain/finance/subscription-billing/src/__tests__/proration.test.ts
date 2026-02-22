import { describe, expect, it } from 'vitest';
import { prorateBilling } from '../calculators/proration';

describe('prorateBilling', () => {
  it('full cycle', () => {
    const r = prorateBilling(30_000, 30, 30).result;
    expect(r.proratedMinor).toBe(30_000);
    expect(r.unusedDays).toBe(0);
  });

  it('partial cycle', () => {
    const r = prorateBilling(30_000, 30, 15).result;
    expect(r.proratedMinor).toBe(15_000);
    expect(r.unusedDays).toBe(15);
  });

  it('single day', () => {
    const r = prorateBilling(30_000, 30, 1).result;
    expect(r.proratedMinor).toBe(1_000);
    expect(r.dailyRateMinor).toBe(1_000);
  });

  it('zero days used', () => {
    const r = prorateBilling(30_000, 30, 0).result;
    expect(r.proratedMinor).toBe(0);
  });

  it('throws on invalid cycle days', () => {
    expect(() => prorateBilling(30_000, 0, 0)).toThrow('billingCycleDays');
  });

  it('throws on used > cycle', () => {
    expect(() => prorateBilling(30_000, 30, 31)).toThrow('usedDays');
  });
});
