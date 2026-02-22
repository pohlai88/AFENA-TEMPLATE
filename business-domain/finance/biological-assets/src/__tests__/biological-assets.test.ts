import { describe, expect, it, vi } from 'vitest';

import { computeHarvestValue, measureBioAsset } from '../calculators/bio-calc';
import { buildBioAssetHarvestIntent, buildBioAssetMeasureIntent } from '../commands/bio-intent';
import { harvestProduce, measureAsset } from '../services/bio-service';

vi.mock('afenda-database', () => ({ db: {}, dbSession: vi.fn() }));

describe('measureBioAsset', () => {
  it('computes gain when FV increases', () => {
    const { result: r } = measureBioAsset({
      prevFvMinor: 100_000,
      currFvMinor: 120_000,
      costsToSellMinor: 5_000,
    });
    expect(r.fvLessCtsMinor).toBe(115_000);
    expect(r.gainLossMinor).toBe(20_000);
    expect(r.recogniseTo).toBe('pnl');
  });

  it('computes loss when FV decreases', () => {
    const { result: r } = measureBioAsset({
      prevFvMinor: 100_000,
      currFvMinor: 80_000,
      costsToSellMinor: 5_000,
    });
    expect(r.gainLossMinor).toBe(-20_000);
  });

  it('handles zero change', () => {
    const { result: r } = measureBioAsset({
      prevFvMinor: 100_000,
      currFvMinor: 100_000,
      costsToSellMinor: 5_000,
    });
    expect(r.gainLossMinor).toBe(0);
  });
});

describe('computeHarvestValue', () => {
  it('computes inventory cost at harvest', () => {
    const { result: r } = computeHarvestValue({
      fvAtHarvestMinor: 50_000,
      costsToSellMinor: 3_000,
    });
    expect(r.inventoryCostMinor).toBe(47_000);
  });

  it('floors at zero if CTS exceeds FV', () => {
    const { result: r } = computeHarvestValue({ fvAtHarvestMinor: 2_000, costsToSellMinor: 5_000 });
    expect(r.inventoryCostMinor).toBe(0);
  });
});

describe('buildBioAssetMeasureIntent', () => {
  it('builds bio-asset.measure intent', () => {
    const intent = buildBioAssetMeasureIntent({
      assetId: 'ba-1',
      assetClass: 'consumable',
      prevFvMinor: 100_000,
      currFvMinor: 120_000,
      costsToSellMinor: 5_000,
      periodKey: '2025-P06',
    });
    expect(intent.type).toBe('bio-asset.measure');
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildBioAssetHarvestIntent', () => {
  it('builds bio-asset.harvest intent', () => {
    const intent = buildBioAssetHarvestIntent({
      assetId: 'ba-1',
      produceId: 'prod-1',
      harvestDate: '2025-06-15',
      fvAtHarvestMinor: 50_000,
      costsToSellMinor: 3_000,
      quantityHarvested: 100,
      uom: 'kg',
    });
    expect(intent.type).toBe('bio-asset.harvest');
  });
});

describe('measureAsset (service)', () => {
  it('returns bio-asset.measure intent', async () => {
    const r = await measureAsset({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      assetId: 'ba-1',
      assetClass: 'consumable',
      prevFvMinor: 100_000,
      currFvMinor: 120_000,
      costsToSellMinor: 5_000,
      periodKey: '2025-P06',
    });
    expect(r.kind).toBe('intent');
  });
});

describe('harvestProduce (service)', () => {
  it('returns bio-asset.harvest intent', async () => {
    const r = await harvestProduce({} as any, { orgId: 'o1', userId: 'u1' } as any, {
      assetId: 'ba-1',
      produceId: 'prod-1',
      harvestDate: '2025-06-15',
      fvAtHarvestMinor: 50_000,
      costsToSellMinor: 3_000,
      quantityHarvested: 100,
      uom: 'kg',
    });
    expect(r.kind).toBe('intent');
  });
});
