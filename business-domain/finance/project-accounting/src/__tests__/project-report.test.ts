import { describe, expect, it } from 'vitest';
import { computeProjectProfitabilityReport } from '../calculators/project-report';

describe('computeProjectProfitabilityReport', () => {
  it('computes actual margin', () => {
    const { result } = computeProjectProfitabilityReport({
      projectId: 'p1', projectName: 'Alpha', budgetRevenueMinor: 1000000, budgetCostMinor: 700000,
      actualRevenueMinor: 500000, actualCostMinor: 350000, commitmentMinor: 50000, percentComplete: 50,
    });
    expect(result.actualMarginMinor).toBe(150000);
    expect(result.actualMarginPct).toBe(30);
  });

  it('computes CPI and status', () => {
    const { result } = computeProjectProfitabilityReport({
      projectId: 'p2', projectName: 'Beta', budgetRevenueMinor: 2000000, budgetCostMinor: 1500000,
      actualRevenueMinor: 1000000, actualCostMinor: 900000, commitmentMinor: 100000, percentComplete: 50,
    });
    expect(result.cpi).toBeCloseTo(0.83, 1);
    expect(result.status).toBe('over-budget');
  });

  it('returns on-track for good CPI', () => {
    const { result } = computeProjectProfitabilityReport({
      projectId: 'p3', projectName: 'Gamma', budgetRevenueMinor: 1000000, budgetCostMinor: 800000,
      actualRevenueMinor: 500000, actualCostMinor: 390000, commitmentMinor: 0, percentComplete: 50,
    });
    expect(result.cpi).toBeGreaterThanOrEqual(0.95);
    expect(result.status).toBe('on-track');
  });

  it('computes EAC cost', () => {
    const { result } = computeProjectProfitabilityReport({
      projectId: 'p4', projectName: 'Delta', budgetRevenueMinor: 1000000, budgetCostMinor: 600000,
      actualRevenueMinor: 500000, actualCostMinor: 400000, commitmentMinor: 0, percentComplete: 50,
    });
    expect(result.eacCostMinor).toBeGreaterThan(600000);
  });

  it('throws for invalid percent complete', () => {
    expect(() => computeProjectProfitabilityReport({
      projectId: 'x', projectName: 'X', budgetRevenueMinor: 100, budgetCostMinor: 50,
      actualRevenueMinor: 50, actualCostMinor: 25, commitmentMinor: 0, percentComplete: 150,
    })).toThrow('0-100');
  });
});
