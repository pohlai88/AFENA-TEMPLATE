import { describe, expect, it } from 'vitest';
import { calculateDepreciation } from '../calculators/depreciation';

describe('calculateDepreciation', () => {
  it('straight-line: equal monthly depreciation', () => {
    const r = calculateDepreciation(120_000, 0, 12, 'straight_line', 6).result;
    expect(r.periodDepreciationMinor).toBe(10_000);
    expect(r.accumulatedMinor).toBe(60_000);
    expect(r.netBookValueMinor).toBe(60_000);
  });

  it('straight-line: fully depreciated', () => {
    const r = calculateDepreciation(120_000, 0, 12, 'straight_line', 12).result;
    expect(r.periodDepreciationMinor).toBe(0);
    expect(r.accumulatedMinor).toBe(120_000);
    expect(r.netBookValueMinor).toBe(0);
  });

  it('straight-line: with salvage value', () => {
    const r = calculateDepreciation(120_000, 20_000, 10, 'straight_line', 5).result;
    expect(r.periodDepreciationMinor).toBe(10_000);
    expect(r.accumulatedMinor).toBe(50_000);
    expect(r.netBookValueMinor).toBe(70_000);
  });

  it('returns zero depreciation when cost equals salvage', () => {
    const r = calculateDepreciation(50_000, 50_000, 12, 'straight_line', 6).result;
    expect(r.periodDepreciationMinor).toBe(0);
    expect(r.netBookValueMinor).toBe(50_000);
  });

  it('double-declining: higher early depreciation', () => {
    const r = calculateDepreciation(100_000, 0, 10, 'double_declining', 0).result;
    expect(r.periodDepreciationMinor).toBe(20_000);
  });

  it('sum-of-years: decreasing depreciation', () => {
    const r0 = calculateDepreciation(100_000, 0, 4, 'sum_of_years', 0).result;
    const r1 = calculateDepreciation(100_000, 0, 4, 'sum_of_years', 1).result;
    expect(r0.periodDepreciationMinor).toBeGreaterThan(r1.periodDepreciationMinor);
  });

  it('throws on negative cost', () => {
    expect(() => calculateDepreciation(-1, 0, 12, 'straight_line', 0)).toThrow('costMinor');
  });

  it('throws on zero useful life', () => {
    expect(() => calculateDepreciation(100_000, 0, 0, 'straight_line', 0)).toThrow('usefulLifeMonths');
  });

  it('throws on negative elapsed months', () => {
    expect(() => calculateDepreciation(100_000, 0, 12, 'straight_line', -1)).toThrow('elapsedMonths');
  });
});
