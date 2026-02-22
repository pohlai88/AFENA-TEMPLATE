import type {
  BorrowCostCapitalisePayload,
  BorrowCostCeasePayload,
  DomainIntent,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildBorrowCostCapitaliseIntent(
  payload: BorrowCostCapitalisePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'borrow-cost.capitalise',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        qualifyingAssetId: payload.qualifyingAssetId,
        periodKey: payload.periodKey,
      }),
  };
}

export function buildBorrowCostCeaseIntent(
  payload: BorrowCostCeasePayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'borrow-cost.cease',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({
        qualifyingAssetId: payload.qualifyingAssetId,
        cessationDate: payload.cessationDate,
      }),
  };
}
