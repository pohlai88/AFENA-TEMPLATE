import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { computeVestingExpense } from '../calculators/sbp-calc';
import {
  buildSbpExpenseIntent,
  buildSbpGrantIntent,
  buildSbpVestIntent,
} from '../commands/sbp-intent';
import { getSbpGrant } from '../queries/sbp-query';

export async function grantSbp(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    grantId: string;
    settlementType: 'equity' | 'cash' | 'choice';
    grantDate: string;
    vestingPeriodMonths: number;
    instrumentsGranted: number;
    fairValuePerUnitMinor: number;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildSbpGrantIntent({
        grantId: input.grantId,
        settlementType: input.settlementType,
        grantDate: input.grantDate,
        vestingPeriodMonths: input.vestingPeriodMonths,
        instrumentsGranted: input.instrumentsGranted,
        fairValuePerUnitMinor: input.fairValuePerUnitMinor,
      }),
    ],
  };
}

export async function vestSbp(
  db: DbSession,
  ctx: DomainContext,
  input: {
    grantId: string;
    periodKey: string;
    elapsedMonths: number;
    forfeitureRate: number;
    prevCumulativeMinor: number;
  },
): Promise<DomainResult> {
  const grant = await getSbpGrant(db, ctx, input.grantId);
  const { result: calc } = computeVestingExpense({
    instrumentsGranted: grant.unitsGranted,
    fairValuePerUnitMinor: grant.fairValuePerUnitMinor,
    vestingPeriodMonths: grant.vestingPeriodMonths,
    elapsedMonths: input.elapsedMonths,
    forfeitureRate: input.forfeitureRate,
    prevCumulativeMinor: input.prevCumulativeMinor,
  });

  return {
    kind: 'intent',
    intents: [
      buildSbpVestIntent({
        grantId: input.grantId,
        periodKey: input.periodKey,
        expenseMinor: calc.periodExpenseMinor,
        cumulativeExpenseMinor: calc.cumulativeExpenseMinor,
        forfeitureRate: input.forfeitureRate,
      }),
    ],
  };
}

export async function recogniseSbpExpense(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    grantId: string;
    periodKey: string;
    expenseMinor: number;
    recogniseTo: 'equity-reserve' | 'liability';
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildSbpExpenseIntent({
        grantId: input.grantId,
        periodKey: input.periodKey,
        expenseMinor: input.expenseMinor,
        recogniseTo: input.recogniseTo,
      }),
    ],
  };
}
