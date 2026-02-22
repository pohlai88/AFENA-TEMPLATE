import { describe, expect, it } from 'vitest';

import { computeImpairment } from '../calculators/impairment';

describe('FA-06 — Impairment testing: recoverable amount vs carrying amount', () => {
  it('detects impairment when carrying exceeds recoverable', () => {
    const r = computeImpairment(100_000, 60_000, 70_000);
    expect(r.result.isImpaired).toBe(true);
    expect(r.result.impairmentLossMinor).toBe(30_000);
    expect(r.result.recoverableAmountMinor).toBe(70_000);
  });

  it('returns no impairment when carrying equals recoverable', () => {
    const r = computeImpairment(100_000, 100_000, 80_000);
    expect(r.result.isImpaired).toBe(false);
    expect(r.result.impairmentLossMinor).toBe(0);
  });

  it('returns no impairment when carrying is below recoverable', () => {
    const r = computeImpairment(50_000, 80_000, 60_000);
    expect(r.result.isImpaired).toBe(false);
    expect(r.result.recoverableAmountMinor).toBe(80_000);
  });

  it('uses higher of fair value and value in use', () => {
    const r = computeImpairment(100_000, 90_000, 95_000);
    expect(r.result.recoverableAmountMinor).toBe(95_000);
    expect(r.result.impairmentLossMinor).toBe(5_000);
  });

  it('passes through cguId', () => {
    const r = computeImpairment(100_000, 80_000, 70_000, 'CGU-EMEA');
    expect(r.result.cguId).toBe('CGU-EMEA');
  });

  it('throws on negative carrying amount', () => {
    expect(() => computeImpairment(-1, 100, 100)).toThrow('carryingAmountMinor');
  });

  it('throws on non-integer fair value', () => {
    expect(() => computeImpairment(100, 50.5, 60)).toThrow('fairValueLessCostsMinor');
  });

  it('includes explanation for impaired asset', () => {
    const r = computeImpairment(100_000, 60_000, 70_000);
    expect(r.explanation).toContain('Impaired');
    expect(r.explanation).toContain('loss=30000');
  });
});
