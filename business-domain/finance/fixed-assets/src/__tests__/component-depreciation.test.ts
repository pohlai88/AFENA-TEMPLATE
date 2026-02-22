import { describe, expect, it } from 'vitest';
import { computeComponentDepreciation } from '../calculators/component-depreciation';

describe('FA-04 — Component Depreciation', () => {
  it('depreciates components separately (straight-line)', () => {
    const { result } = computeComponentDepreciation('ASSET-1', [
      { componentId: 'C1', name: 'Engine', costMinor: 100_000, residualValueMinor: 10_000, usefulLifeMonths: 120, method: 'straight-line', elapsedMonths: 24 },
      { componentId: 'C2', name: 'Body', costMinor: 50_000, residualValueMinor: 5_000, usefulLifeMonths: 240, method: 'straight-line', elapsedMonths: 24 },
    ]);
    expect(result.components).toHaveLength(2);
    // Engine: (100k-10k)/120 = 750/month, 24 months = 18000 accumulated
    expect(result.components[0].accumulatedDepreciationMinor).toBe(18_000);
    expect(result.components[0].currentPeriodDepreciationMinor).toBe(750);
    expect(result.totalCostMinor).toBe(150_000);
  });

  it('stops depreciation at end of useful life', () => {
    const { result } = computeComponentDepreciation('ASSET-2', [
      { componentId: 'C1', name: 'Part', costMinor: 12_000, residualValueMinor: 0, usefulLifeMonths: 12, method: 'straight-line', elapsedMonths: 15 },
    ]);
    expect(result.components[0].accumulatedDepreciationMinor).toBe(12_000);
    expect(result.components[0].currentPeriodDepreciationMinor).toBe(0);
    expect(result.components[0].netBookValueMinor).toBe(0);
  });

  it('handles declining balance method', () => {
    const { result } = computeComponentDepreciation('ASSET-3', [
      { componentId: 'C1', name: 'Machine', costMinor: 100_000, residualValueMinor: 10_000, usefulLifeMonths: 60, method: 'declining-balance', elapsedMonths: 12 },
    ]);
    expect(result.components[0].accumulatedDepreciationMinor).toBeGreaterThan(0);
    expect(result.components[0].netBookValueMinor).toBeLessThan(100_000);
  });

  it('returns CalculatorResult shape', () => {
    const res = computeComponentDepreciation('X', [
      { componentId: 'C1', name: 'P', costMinor: 1000, residualValueMinor: 0, usefulLifeMonths: 12, method: 'straight-line', elapsedMonths: 1 },
    ]);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty components', () => {
    expect(() => computeComponentDepreciation('X', [])).toThrow('At least one component');
  });

  it('throws on negative cost', () => {
    expect(() => computeComponentDepreciation('X', [
      { componentId: 'C1', name: 'P', costMinor: -100, residualValueMinor: 0, usefulLifeMonths: 12, method: 'straight-line', elapsedMonths: 1 },
    ])).toThrow('Negative cost');
  });
});
