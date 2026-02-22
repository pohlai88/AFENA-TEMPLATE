/**
 * @see TX-07 — Deferred tax: temporary difference method (IAS 12)
 * Deferred Tax Service — IAS 12
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import {
  calculateTemporaryDifferences,
  computeDeferredTax,
} from '../calculators/deferred-tax-calc';
import {
  buildDeferredTaxCalculateIntent,
  buildDeferredTaxRecogniseIntent,
} from '../commands/deferred-tax-intent';

export async function calculateAndRecognise(
  db: DbSession,
  ctx: DomainContext,
  input: {
    entityId: string;
    periodKey: string;
    taxRate: number;
    items: Array<{ accountId: string; carryingMinor: number; taxBaseMinor: number }>;
    priorDtaMinor?: number;
    priorDtlMinor?: number;
  },
): Promise<DomainResult> {
  const { result: diffs } = calculateTemporaryDifferences(input.items);
  const { result } = computeDeferredTax({
    differences: diffs,
    taxRate: input.taxRate,
    ...(input.priorDtaMinor != null ? { priorDtaMinor: input.priorDtaMinor } : {}),
    ...(input.priorDtlMinor != null ? { priorDtlMinor: input.priorDtlMinor } : {}),
  });

  return {
    kind: 'intent',
    intents: [
      buildDeferredTaxCalculateIntent({
        entityId: input.entityId,
        periodKey: input.periodKey,
        taxRate: input.taxRate,
        temporaryDifferences: diffs.map((d) => ({
          accountId: d.accountId,
          carryingMinor: d.carryingMinor,
          taxBaseMinor: d.taxBaseMinor,
          differenceType: d.differenceType,
        })),
      }),
      buildDeferredTaxRecogniseIntent({
        entityId: input.entityId,
        periodKey: input.periodKey,
        dtaMinor: result.dtaMinor,
        dtlMinor: result.dtlMinor,
        movementMinor: result.movementMinor,
        recogniseTo: 'pnl',
      }),
    ],
  };
}
