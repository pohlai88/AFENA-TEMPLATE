import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { computeGrantAmortisation } from '../calculators/grant-calc';
import { buildGrantAmortiseIntent, buildGrantRecogniseIntent } from '../commands/grant-intent';
import { getGrant } from '../queries/grant-query';

export async function recogniseGrant(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    grantId: string;
    approach: 'income' | 'capital';
    amountMinor: number;
    grantDate: string;
    relatedAssetId?: string;
    conditions: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildGrantRecogniseIntent({
        grantId: input.grantId,
        approach: input.approach,
        amountMinor: input.amountMinor,
        grantDate: input.grantDate,
        ...(input.relatedAssetId != null ? { relatedAssetId: input.relatedAssetId } : {}),
        conditions: input.conditions,
      }),
    ],
  };
}

export async function amortiseGrant(
  db: DbSession,
  ctx: DomainContext,
  input: {
    grantId: string;
    periodKey: string;
    usefulLifeMonths: number;
  },
): Promise<DomainResult> {
  const grant = await getGrant(db, ctx, input.grantId);
  const { result: calc } = computeGrantAmortisation({
    totalGrantMinor: grant.grantAmountMinor,
    cumulativeAmortisedMinor: grant.amortisedMinor,
    usefulLifeMonths: input.usefulLifeMonths,
  });

  if (calc.periodAmortisationMinor === 0) {
    return { kind: 'read', data: { amortised: false, explanation: calc.explanation } };
  }

  return {
    kind: 'intent',
    intents: [
      buildGrantAmortiseIntent({
        grantId: input.grantId,
        periodKey: input.periodKey,
        amortisationMinor: calc.periodAmortisationMinor,
        remainingMinor: calc.remainingDeferredMinor,
      }),
    ],
  };
}
