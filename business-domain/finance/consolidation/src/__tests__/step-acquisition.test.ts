import { describe, expect, it } from 'vitest';
import { computeStepAcquisition } from '../calculators/step-acquisition';

describe('CO-07 — Step Acquisition', () => {
  it('computes step acquisition with remeasurement gain', () => {
    const { result } = computeStepAcquisition({
      subsidiaryId: 'SUB-1',
      previousOwnershipPct: 30,
      newOwnershipPct: 80,
      previousCarryingMinor: 200_000,
      acquisitionDateFairValueMinor: 350_000,
      considerationForNewSharesMinor: 500_000,
      netIdentifiableAssetsMinor: 900_000,
    });
    expect(result.remeasurementGainLossMinor).toBe(150_000);
    expect(result.totalConsiderationMinor).toBe(850_000);
    expect(result.isDisposal).toBe(false);
  });

  it('detects disposal when ownership decreases', () => {
    const { result } = computeStepAcquisition({
      subsidiaryId: 'SUB-2',
      previousOwnershipPct: 80,
      newOwnershipPct: 20,
      previousCarryingMinor: 500_000,
      acquisitionDateFairValueMinor: 400_000,
      considerationForNewSharesMinor: 0,
      netIdentifiableAssetsMinor: 600_000,
    });
    expect(result.isDisposal).toBe(true);
    expect(result.remeasurementGainLossMinor).toBe(-100_000);
  });

  it('computes remeasurement loss', () => {
    const { result } = computeStepAcquisition({
      subsidiaryId: 'SUB-3',
      previousOwnershipPct: 25,
      newOwnershipPct: 60,
      previousCarryingMinor: 300_000,
      acquisitionDateFairValueMinor: 250_000,
      considerationForNewSharesMinor: 400_000,
      netIdentifiableAssetsMinor: 1_000_000,
    });
    expect(result.remeasurementGainLossMinor).toBe(-50_000);
  });

  it('returns CalculatorResult shape', () => {
    const res = computeStepAcquisition({
      subsidiaryId: 'X', previousOwnershipPct: 10, newOwnershipPct: 60,
      previousCarryingMinor: 100, acquisitionDateFairValueMinor: 100,
      considerationForNewSharesMinor: 100, netIdentifiableAssetsMinor: 100,
    });
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on invalid ownership', () => {
    expect(() => computeStepAcquisition({
      subsidiaryId: 'X', previousOwnershipPct: -5, newOwnershipPct: 60,
      previousCarryingMinor: 100, acquisitionDateFairValueMinor: 100,
      considerationForNewSharesMinor: 100, netIdentifiableAssetsMinor: 100,
    })).toThrow('previousOwnershipPct must be 0–100');
  });
});
