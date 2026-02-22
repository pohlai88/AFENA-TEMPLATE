import { describe, expect, it } from 'vitest';
import { forecastRenewals } from '../calculators/renewal-forecast';

describe('forecastRenewals', () => {
  it('no churn — all retained', () => {
    const r = forecastRenewals([
      { id: 's1', mrrMinor: 10_000, renewalDateIso: '2025-01-01', churnProbability: 0 },
    ]).result;
    expect(r.expectedMrrMinor).toBe(10_000);
    expect(r.churnedMrrMinor).toBe(0);
    expect(r.atRiskMrrMinor).toBe(0);
  });

  it('100% churn', () => {
    const r = forecastRenewals([
      { id: 's1', mrrMinor: 10_000, renewalDateIso: '2025-01-01', churnProbability: 1 },
    ]).result;
    expect(r.expectedMrrMinor).toBe(0);
    expect(r.churnedMrrMinor).toBe(10_000);
    expect(r.atRiskMrrMinor).toBe(10_000);
  });

  it('mixed probabilities', () => {
    const r = forecastRenewals([
      { id: 's1', mrrMinor: 10_000, renewalDateIso: '2025-01-01', churnProbability: 0.1 },
      { id: 's2', mrrMinor: 20_000, renewalDateIso: '2025-02-01', churnProbability: 0.5 },
    ]).result;
    expect(r.expectedMrrMinor).toBe(9_000 + 10_000);
    expect(r.atRiskMrrMinor).toBe(20_000);
  });

  it('empty subscriptions', () => {
    const r = forecastRenewals([]).result;
    expect(r.expectedMrrMinor).toBe(0);
    expect(r.netMrrMinor).toBe(0);
  });

  it('throws on invalid churn probability', () => {
    expect(() =>
      forecastRenewals([{ id: 's1', mrrMinor: 10_000, renewalDateIso: '2025-01-01', churnProbability: 1.5 }]),
    ).toThrow('churnProbability');
  });

  it('throws on invalid horizonMonths', () => {
    expect(() => forecastRenewals([], 0)).toThrow('horizonMonths');
  });

  it('accepts explicit horizonMonths', () => {
    const r = forecastRenewals([
      { id: 's1', mrrMinor: 10_000, renewalDateIso: '2025-01-01', churnProbability: 0 },
    ], 6).result;
    expect(r.expectedMrrMinor).toBe(10_000);
  });
});
