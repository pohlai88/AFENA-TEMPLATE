import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import {
  buildBorrowCostCapitaliseIntent,
  buildBorrowCostCeaseIntent,
} from '../commands/borrow-cost-intent';

export async function capitaliseBorrowingCost(
  db: DbSession,
  ctx: DomainContext,
  input: {
    qualifyingAssetId: string;
    periodKey: string;
    borrowingCostMinor: number;
    capitalisationRate: number;
    eligibleExpenditureMinor: number;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildBorrowCostCapitaliseIntent({
        qualifyingAssetId: input.qualifyingAssetId,
        periodKey: input.periodKey,
        borrowingCostMinor: input.borrowingCostMinor,
        capitalisationRate: input.capitalisationRate,
        eligibleExpenditureMinor: input.eligibleExpenditureMinor,
      }),
    ],
  };
}

export async function ceaseBorrowingCost(
  db: DbSession,
  ctx: DomainContext,
  input: {
    qualifyingAssetId: string;
    cessationDate: string;
    reason: 'completed' | 'suspended' | 'abandoned';
    totalCapitalisedMinor: number;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildBorrowCostCeaseIntent({
        qualifyingAssetId: input.qualifyingAssetId,
        cessationDate: input.cessationDate,
        reason: input.reason,
        totalCapitalisedMinor: input.totalCapitalisedMinor,
      }),
    ],
  };
}
