import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { buildBioAssetHarvestIntent, buildBioAssetMeasureIntent } from '../commands/bio-intent';

export async function measureAsset(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    assetClass: 'bearer-plant' | 'consumable' | 'produce';
    prevFvMinor: number;
    currFvMinor: number;
    costsToSellMinor: number;
    periodKey: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildBioAssetMeasureIntent({
        assetId: input.assetId,
        assetClass: input.assetClass,
        prevFvMinor: input.prevFvMinor,
        currFvMinor: input.currFvMinor,
        costsToSellMinor: input.costsToSellMinor,
        periodKey: input.periodKey,
      }),
    ],
  };
}

export async function harvestProduce(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    produceId: string;
    harvestDate: string;
    fvAtHarvestMinor: number;
    costsToSellMinor: number;
    quantityHarvested: number;
    uom: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildBioAssetHarvestIntent({
        assetId: input.assetId,
        produceId: input.produceId,
        harvestDate: input.harvestDate,
        fvAtHarvestMinor: input.fvAtHarvestMinor,
        costsToSellMinor: input.costsToSellMinor,
        quantityHarvested: input.quantityHarvested,
        uom: input.uom,
      }),
    ],
  };
}
