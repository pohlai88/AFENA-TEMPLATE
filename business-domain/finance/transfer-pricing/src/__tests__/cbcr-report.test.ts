import { describe, expect, it } from 'vitest';
import { generateCbcrReport } from '../calculators/cbcr-report';

describe('generateCbcrReport', () => {
  const entities = [
    { entityName: 'E1', jurisdiction: 'MY', revenueRelatedMinor: 5000, revenueUnrelatedMinor: 1000, profitBeforeTaxMinor: 2000, taxPaidMinor: 500, taxAccruedMinor: 600, statedCapitalMinor: 10000, retainedEarningsMinor: 3000, employeeCount: 10, tangibleAssetsMinor: 8000 },
    { entityName: 'E2', jurisdiction: 'SG', revenueRelatedMinor: 8000, revenueUnrelatedMinor: 2000, profitBeforeTaxMinor: 3000, taxPaidMinor: 510, taxAccruedMinor: 510, statedCapitalMinor: 15000, retainedEarningsMinor: 5000, employeeCount: 20, tangibleAssetsMinor: 12000 },
    { entityName: 'E3', jurisdiction: 'MY', revenueRelatedMinor: 3000, revenueUnrelatedMinor: 500, profitBeforeTaxMinor: 1000, taxPaidMinor: 250, taxAccruedMinor: 300, statedCapitalMinor: 5000, retainedEarningsMinor: 1000, employeeCount: 5, tangibleAssetsMinor: 4000 },
  ];

  it('aggregates by jurisdiction', () => {
    const r = generateCbcrReport(entities);
    expect(r.result.totalJurisdictions).toBe(2);
    expect(r.result.totalEntities).toBe(3);
    const my = r.result.jurisdictions.find((j) => j.jurisdiction === 'MY');
    expect(my?.entityCount).toBe(2);
  });

  it('computes effective tax rate', () => {
    const r = generateCbcrReport(entities);
    const sg = r.result.jurisdictions.find((j) => j.jurisdiction === 'SG');
    expect(sg?.effectiveTaxRatePct).toBe(17);
  });

  it('throws on empty entities', () => {
    expect(() => generateCbcrReport([])).toThrow();
  });
});
