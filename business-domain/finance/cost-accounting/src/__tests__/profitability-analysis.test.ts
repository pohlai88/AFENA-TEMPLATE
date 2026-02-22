import { describe, expect, it } from 'vitest';
import { analyzeProfitability } from '../calculators/profitability-analysis';
import type { ProfitabilityLineItem } from '../calculators/profitability-analysis';

describe('analyzeProfitability', () => {
  const items: ProfitabilityLineItem[] = [
    { dimensionKey: 'widget-A', dimensionType: 'product', revenueMinor: 100000, directCostMinor: 60000, allocatedOverheadMinor: 10000 },
    { dimensionKey: 'widget-B', dimensionType: 'product', revenueMinor: 200000, directCostMinor: 150000, allocatedOverheadMinor: 20000 },
    { dimensionKey: 'widget-A', dimensionType: 'product', revenueMinor: 50000, directCostMinor: 30000, allocatedOverheadMinor: 5000 },
  ];

  it('groups by dimension and computes contribution margin', () => {
    const { result } = analyzeProfitability(items);

    expect(result.segments).toHaveLength(2);

    const widgetA = result.segments.find((s) => s.dimensionKey === 'widget-A')!;
    expect(widgetA.revenueMinor).toBe(150000);
    expect(widgetA.directCostMinor).toBe(90000);
    expect(widgetA.contributionMarginMinor).toBe(60000);
    expect(widgetA.contributionMarginPct).toBe(40);
  });

  it('computes net profit after overhead', () => {
    const { result } = analyzeProfitability(items);

    const widgetA = result.segments.find((s) => s.dimensionKey === 'widget-A')!;
    expect(widgetA.netProfitMinor).toBe(45000);
    expect(widgetA.netProfitPct).toBe(30);
  });

  it('sorts segments by net profit descending', () => {
    const { result } = analyzeProfitability(items);

    expect(result.segments[0]!.dimensionKey).toBe('widget-A');
    expect(result.segments[1]!.dimensionKey).toBe('widget-B');
  });

  it('computes overall totals', () => {
    const { result } = analyzeProfitability(items);

    expect(result.totalRevenueMinor).toBe(350000);
    expect(result.totalDirectCostMinor).toBe(240000);
    expect(result.totalOverheadMinor).toBe(35000);
    expect(result.totalContributionMarginMinor).toBe(110000);
    expect(result.totalNetProfitMinor).toBe(75000);
  });

  it('computes overall margin percentage', () => {
    const { result } = analyzeProfitability(items);

    expect(result.overallMarginPct).toBeCloseTo(21.43, 1);
  });

  it('handles zero revenue without division error', () => {
    const zeroItems: ProfitabilityLineItem[] = [
      { dimensionKey: 'dormant', dimensionType: 'product', revenueMinor: 0, directCostMinor: 5000, allocatedOverheadMinor: 1000 },
    ];

    const { result } = analyzeProfitability(zeroItems);

    expect(result.segments[0]!.contributionMarginPct).toBe(0);
    expect(result.segments[0]!.netProfitPct).toBe(0);
    expect(result.overallMarginPct).toBe(0);
  });

  it('supports multiple dimension types', () => {
    const mixed: ProfitabilityLineItem[] = [
      { dimensionKey: 'APAC', dimensionType: 'region', revenueMinor: 100000, directCostMinor: 70000, allocatedOverheadMinor: 10000 },
      { dimensionKey: 'cust-1', dimensionType: 'customer', revenueMinor: 80000, directCostMinor: 50000, allocatedOverheadMinor: 8000 },
    ];

    const { result } = analyzeProfitability(mixed);

    expect(result.segments).toHaveLength(2);
    expect(result.segments.map((s) => s.dimensionType)).toContain('region');
    expect(result.segments.map((s) => s.dimensionType)).toContain('customer');
  });

  it('throws for empty items', () => {
    expect(() => analyzeProfitability([])).toThrow('At least one line item');
  });

  it('returns explanation with segment count and margin', () => {
    const calc = analyzeProfitability(items);

    expect(calc.explanation).toContain('2 segments');
    expect(calc.explanation).toContain('21.43%');
  });
});
