import { describe, expect, it } from 'vitest';

import { computeRatableRecognition } from '../calculators/ratable-recognition';

describe('SB-02 — Ratable revenue recognition over service period', () => {
  it('recognises half at midpoint of 30-day period', () => {
    const r = computeRatableRecognition(30_000, 30, 15);
    expect(r.result.recognizedMinor).toBe(15_000);
    expect(r.result.deferredMinor).toBe(15_000);
    expect(r.result.percentRecognized).toBe(0.5);
  });

  it('recognises nothing at day 0', () => {
    const r = computeRatableRecognition(30_000, 30, 0);
    expect(r.result.recognizedMinor).toBe(0);
    expect(r.result.deferredMinor).toBe(30_000);
  });

  it('recognises full amount at end of period', () => {
    const r = computeRatableRecognition(30_000, 30, 30);
    expect(r.result.recognizedMinor).toBe(30_000);
    expect(r.result.deferredMinor).toBe(0);
    expect(r.result.percentRecognized).toBe(1);
  });

  it('computes daily rate correctly', () => {
    const r = computeRatableRecognition(365_00, 365, 1);
    expect(r.result.dailyRateMinor).toBe(100);
    expect(r.result.recognizedMinor).toBe(100);
  });

  it('handles rounding for non-divisible amounts', () => {
    const r = computeRatableRecognition(10_000, 3, 1);
    expect(r.result.dailyRateMinor).toBe(3333);
    expect(r.result.recognizedMinor).toBe(3333);
  });

  it('throws on negative totalAmountMinor', () => {
    expect(() => computeRatableRecognition(-100, 30, 15)).toThrow('totalAmountMinor');
  });

  it('throws when elapsedDays exceeds servicePeriodDays', () => {
    expect(() => computeRatableRecognition(30_000, 30, 31)).toThrow('cannot exceed');
  });

  it('includes explanation string', () => {
    const r = computeRatableRecognition(30_000, 30, 15);
    expect(r.explanation).toContain('Ratable');
    expect(r.explanation).toContain('deferred');
  });
});
