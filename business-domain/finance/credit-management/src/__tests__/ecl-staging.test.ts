import { describe, expect, it } from 'vitest';
import { computeEclStaging } from '../calculators/ecl-staging';
import type { CreditExposure } from '../calculators/ecl-staging';

const exposures: CreditExposure[] = [
  { exposureId: 'e1', counterpartyId: 'cp-A', outstandingMinor: 1000000, creditScore: 750, daysPastDue: 0, pdTwelveMonth: 0.01, pdLifetime: 0.05, lgdPct: 45 },
  { exposureId: 'e2', counterpartyId: 'cp-B', outstandingMinor: 500000, creditScore: 550, daysPastDue: 45, pdTwelveMonth: 0.03, pdLifetime: 0.15, lgdPct: 60 },
  { exposureId: 'e3', counterpartyId: 'cp-C', outstandingMinor: 200000, creditScore: 350, daysPastDue: 120, pdTwelveMonth: 0.10, pdLifetime: 0.80, lgdPct: 80 },
];

describe('computeEclStaging', () => {
  it('assigns Stage 1 to performing exposures', () => {
    const { result } = computeEclStaging(exposures);
    const e1 = result.entries.find((e) => e.exposureId === 'e1')!;
    expect(e1.stage).toBe(1);
    expect(e1.stagingReason).toBe('Performing');
  });

  it('assigns Stage 2 based on DPD or score', () => {
    const { result } = computeEclStaging(exposures);
    const e2 = result.entries.find((e) => e.exposureId === 'e2')!;
    expect(e2.stage).toBe(2);
  });

  it('assigns Stage 3 for credit-impaired', () => {
    const { result } = computeEclStaging(exposures);
    const e3 = result.entries.find((e) => e.exposureId === 'e3')!;
    expect(e3.stage).toBe(3);
  });

  it('uses 12-month PD for Stage 1, lifetime for Stage 2/3', () => {
    const { result } = computeEclStaging(exposures);
    expect(result.entries.find((e) => e.exposureId === 'e1')!.pdUsed).toBe(0.01);
    expect(result.entries.find((e) => e.exposureId === 'e2')!.pdUsed).toBe(0.15);
  });

  it('computes ECL = outstanding × PD × LGD', () => {
    const { result } = computeEclStaging(exposures);
    const e1 = result.entries.find((e) => e.exposureId === 'e1')!;
    expect(e1.eclMinor).toBe(Math.round(1000000 * 0.01 * 0.45));
  });

  it('provides stage counts and totals', () => {
    const { result } = computeEclStaging(exposures);
    expect(result.stage1Count).toBe(1);
    expect(result.stage2Count).toBe(1);
    expect(result.stage3Count).toBe(1);
    expect(result.totalEclMinor).toBeGreaterThan(0);
  });

  it('throws for empty exposures', () => {
    expect(() => computeEclStaging([])).toThrow('At least one');
  });
});
