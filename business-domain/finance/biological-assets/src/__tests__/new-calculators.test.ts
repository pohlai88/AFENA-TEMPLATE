import { describe, expect, it } from 'vitest';

import { computeBearerPlantDepreciation } from '../calculators/bearer-plant-depreciation';
import { analyseBioAssetGainLoss } from '../calculators/bio-asset-gain-loss';
import { computeHarvestAtFairValue } from '../calculators/harvest-at-fair-value';
import { computeBioAssetDisclosure } from '../calculators/bio-asset-disclosure';

describe('computeBearerPlantDepreciation', () => {
  it('computes straight-line depreciation', () => {
    const { result } = computeBearerPlantDepreciation({
      costMinor: 120_000, residualValueMinor: 0, usefulLifeMonths: 120,
      elapsedMonths: 12, method: 'straight-line',
    });
    expect(result.depreciationMinor).toBe(1_000);
    expect(result.carryingAmountMinor).toBe(108_000);
  });

  it('computes units-of-production depreciation', () => {
    const { result } = computeBearerPlantDepreciation({
      costMinor: 100_000, residualValueMinor: 10_000, usefulLifeMonths: 120,
      elapsedMonths: 12, method: 'units-of-production',
      totalExpectedUnits: 1000, unitsProducedThisPeriod: 50,
    });
    expect(result.depreciationMinor).toBe(4_500);
  });

  it('throws on negative cost', () => {
    expect(() => computeBearerPlantDepreciation({
      costMinor: -1, residualValueMinor: 0, usefulLifeMonths: 120,
      elapsedMonths: 0, method: 'straight-line',
    })).toThrow('Cost cannot be negative');
  });

  it('throws when units-of-production missing totalExpectedUnits', () => {
    expect(() => computeBearerPlantDepreciation({
      costMinor: 100_000, residualValueMinor: 0, usefulLifeMonths: 120,
      elapsedMonths: 0, method: 'units-of-production',
    })).toThrow('totalExpectedUnits required');
  });
});

describe('analyseBioAssetGainLoss', () => {
  it('decomposes FV change correctly', () => {
    const { result } = analyseBioAssetGainLoss({
      openingFvMinor: 100_000, closingFvMinor: 130_000,
      purchasesMinor: 20_000, disposalsMinor: 5_000, harvestFvMinor: 10_000,
      openingCtsMinor: 3_000, closingCtsMinor: 4_000,
    });
    expect(result.totalChangeMinor).toBe(30_000);
    expect(result.fvChangeMinor).toBe(25_000);
    expect(result.ctsMovementMinor).toBe(1_000);
    expect(result.netGainLossMinor).toBe(24_000);
  });

  it('throws on negative opening FV', () => {
    expect(() => analyseBioAssetGainLoss({
      openingFvMinor: -1, closingFvMinor: 0, purchasesMinor: 0,
      disposalsMinor: 0, harvestFvMinor: 0, openingCtsMinor: 0, closingCtsMinor: 0,
    })).toThrow('Opening FV cannot be negative');
  });
});

describe('computeHarvestAtFairValue', () => {
  it('computes inventory cost at harvest', () => {
    const { result } = computeHarvestAtFairValue({
      assetId: 'ba-1', produceType: 'palm-fruit', quantityHarvested: 500,
      uom: 'kg', fvPerUnitMinor: 200, costsToSellPerUnitMinor: 20,
    });
    expect(result.totalFvMinor).toBe(100_000);
    expect(result.totalCtsMinor).toBe(10_000);
    expect(result.inventoryCostMinor).toBe(90_000);
    expect(result.costPerUnitMinor).toBe(180);
  });

  it('throws on zero quantity', () => {
    expect(() => computeHarvestAtFairValue({
      assetId: 'ba-1', produceType: 'fruit', quantityHarvested: 0,
      uom: 'kg', fvPerUnitMinor: 100, costsToSellPerUnitMinor: 10,
    })).toThrow('Quantity harvested must be positive');
  });
});

describe('computeBioAssetDisclosure', () => {
  it('reconciles carrying amounts', () => {
    const { result } = computeBioAssetDisclosure({
      openingCarryingMinor: 100_000, purchasesMinor: 20_000,
      salesDisposalsMinor: 10_000, fvGainLossMinor: 5_000,
      harvestTransfersMinor: 15_000, fxTranslationMinor: -2_000,
    });
    expect(result.closingCarryingMinor).toBe(98_000);
    expect(result.reconciliation.opening).toBe(100_000);
    expect(result.reconciliation.closing).toBe(98_000);
  });

  it('throws on negative opening', () => {
    expect(() => computeBioAssetDisclosure({
      openingCarryingMinor: -1, purchasesMinor: 0, salesDisposalsMinor: 0,
      fvGainLossMinor: 0, harvestTransfersMinor: 0, fxTranslationMinor: 0,
    })).toThrow('Opening carrying amount cannot be negative');
  });
});
