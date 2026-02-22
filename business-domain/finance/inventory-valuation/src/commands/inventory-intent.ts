import type {
  DomainIntent,
  InventoryCostingPayload,
  InventoryNrvAdjustPayload,
} from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';

export function buildInventoryCostingIntent(
  payload: InventoryCostingPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'inventory.costing',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ itemId: payload.itemId, periodKey: payload.periodKey }),
  };
}

export function buildNrvAdjustIntent(
  payload: InventoryNrvAdjustPayload,
  idempotencyKey?: string,
): DomainIntent {
  return {
    type: 'inventory.nrv.adjust',
    payload,
    idempotencyKey:
      idempotencyKey ??
      stableCanonicalJson({ itemId: payload.itemId, periodKey: payload.periodKey }),
  };
}
