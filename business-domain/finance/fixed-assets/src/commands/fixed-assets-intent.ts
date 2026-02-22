import type {
  AssetDepreciatePayload,
  AssetDisposePayload,
  AssetRevaluePayload,
  DomainIntent,
} from 'afenda-canon';

export function buildAssetDepreciateIntent(
  payload: AssetDepreciatePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'asset.depreciate', payload, idempotencyKey };
}

export function buildAssetDisposalIntent(
  payload: AssetDisposePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'asset.dispose', payload, idempotencyKey };
}

export function buildAssetRevalueIntent(
  payload: AssetRevaluePayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'asset.revalue', payload, idempotencyKey };
}
