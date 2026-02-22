import { describe, expect, it } from 'vitest';
import { computeRouAsset } from '../calculators/rou-asset';

describe('computeRouAsset', () => {
  it('basic ROU asset calculation', () => {
    const r = computeRouAsset(100_000, 5_000, 2_000, 24).result;
    expect(r.initialValueMinor).toBe(103_000);
    expect(r.depreciationPerPeriodMinor).toBe(Math.round(103_000 / 24));
  });

  it('no direct costs or incentives', () => {
    const r = computeRouAsset(100_000, 0, 0, 12).result;
    expect(r.initialValueMinor).toBe(100_000);
    expect(r.depreciationPerPeriodMinor).toBe(Math.round(100_000 / 12));
  });

  it('incentives reduce initial value', () => {
    const r = computeRouAsset(100_000, 0, 30_000, 12).result;
    expect(r.initialValueMinor).toBe(70_000);
  });

  it('throws on negative liability', () => {
    expect(() => computeRouAsset(-1, 0, 0, 12)).toThrow('liabilityMinor');
  });

  it('throws on zero periods', () => {
    expect(() => computeRouAsset(100_000, 0, 0, 0)).toThrow('leasePeriods');
  });

  it('throws on negative incentives', () => {
    expect(() => computeRouAsset(100_000, 0, -1, 12)).toThrow('incentivesMinor');
  });
});
