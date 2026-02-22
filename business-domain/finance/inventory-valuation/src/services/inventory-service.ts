import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { computeInventoryCost, testNrv } from '../calculators/inventory-calc';
import { buildInventoryCostingIntent, buildNrvAdjustIntent } from '../commands/inventory-intent';

export async function valueInventory(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    itemId: string;
    method: 'fifo' | 'weighted-average' | 'specific-identification';
    totalCostMinor: number;
    quantityOnHand: number;
    periodKey: string;
  },
): Promise<DomainResult> {
  const { result: cost } = computeInventoryCost({
    method: input.method,
    totalCostMinor: input.totalCostMinor,
    quantityOnHand: input.quantityOnHand,
  });

  return {
    kind: 'intent',
    intents: [
      buildInventoryCostingIntent({
        itemId: input.itemId,
        method: input.method,
        quantityOnHand: input.quantityOnHand,
        totalCostMinor: cost.totalCostMinor,
        unitCostMinor: cost.unitCostMinor,
        periodKey: input.periodKey,
      }),
    ],
  };
}

export async function adjustNrv(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    itemId: string;
    costMinor: number;
    nrvMinor: number;
    periodKey: string;
  },
): Promise<DomainResult> {
  const { result: nrv } = testNrv({ costMinor: input.costMinor, nrvMinor: input.nrvMinor });

  if (nrv.writedownMinor === 0) {
    return { kind: 'read', data: { adjusted: false, explanation: nrv.explanation } };
  }

  return {
    kind: 'intent',
    intents: [
      buildNrvAdjustIntent({
        itemId: input.itemId,
        costMinor: input.costMinor,
        nrvMinor: input.nrvMinor,
        writedownMinor: nrv.writedownMinor,
        periodKey: input.periodKey,
        direction: 'writedown',
      }),
    ],
  };
}

/**
 * @see FIN-INV-VAL-01 — Post inventory valuation events to GL and reconcile.
 *
 * Computes cost for each item, emits costing intents, and returns a
 * summary that can be reconciled against the GL subledger.
 */
export async function postValuationBatchToGl(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    items: Array<{
      itemId: string;
      method: 'fifo' | 'weighted-average' | 'specific-identification';
      totalCostMinor: number;
      quantityOnHand: number;
    }>;
    periodKey: string;
  },
): Promise<DomainResult<{ totalCostMinor: number; itemCount: number }>> {
  const intents = [];
  let totalCostMinor = 0;

  for (const item of input.items) {
    const { result: cost } = computeInventoryCost({
      method: item.method,
      totalCostMinor: item.totalCostMinor,
      quantityOnHand: item.quantityOnHand,
    });
    totalCostMinor += cost.totalCostMinor;
    intents.push(
      buildInventoryCostingIntent({
        itemId: item.itemId,
        method: item.method,
        quantityOnHand: item.quantityOnHand,
        totalCostMinor: cost.totalCostMinor,
        unitCostMinor: cost.unitCostMinor,
        periodKey: input.periodKey,
      }),
    );
  }

  return {
    kind: 'intent+read',
    data: { totalCostMinor, itemCount: input.items.length },
    intents,
  };
}
