import type { BioAssetHarvestPayload, BioAssetMeasurePayload, DomainIntent } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildBioAssetMeasureIntent(
  payload: BioAssetMeasurePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'bio-asset.measure',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, periodKey: payload.periodKey }),
  };
}

export function buildBioAssetHarvestIntent(
  payload: BioAssetHarvestPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'bio-asset.harvest',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ assetId: payload.assetId, harvestDate: payload.harvestDate }),
  };
}
