/**
 * Financial Instruments Service — IFRS 9
 *
 * Read ops: fetchInstrument
 * Write ops: recordFvChange, accrueInterest
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { computeEffectiveInterest, computeFairValueChange } from '../calculators/fi-calc';
import { buildEirAccrualIntent, buildFvChangeIntent } from '../commands/fi-intent';
import { getFinancialInstrument } from '../queries/fi-query';

import type { Classification } from '../calculators/fi-calc';

/* ---------- Read Operations ---------- */

export async function fetchInstrument(
  db: DbSession,
  ctx: DomainContext,
  instrumentId: string,
): Promise<DomainResult> {
  const instrument = await getFinancialInstrument(db, ctx, instrumentId);
  return { kind: 'read', data: { instrument } };
}

/* ---------- Write Operations ---------- */

export async function recordFvChange(
  db: DbSession,
  ctx: DomainContext,
  input: { instrumentId: string; currFvMinor: number; periodKey: string },
): Promise<DomainResult> {
  const instrument = await getFinancialInstrument(db, ctx, input.instrumentId);

  const classification = instrument.classification as Classification;
  if (classification === 'amortised-cost') {
    return {
      kind: 'read',
      data: { recorded: false, explanation: 'Amortised cost — no FV change recorded' },
    };
  }

  // FV change computed for audit trail but not consumed here — intent carries raw values
  void computeFairValueChange({
    prevFvMinor: instrument.fairValueMinor ?? instrument.carryingAmountMinor,
    currFvMinor: input.currFvMinor,
    classification,
  });

  return {
    kind: 'intent',
    intents: [
      buildFvChangeIntent({
        instrumentId: input.instrumentId,
        prevFvMinor: instrument.fairValueMinor ?? instrument.carryingAmountMinor,
        currFvMinor: input.currFvMinor,
        classification,
        periodKey: input.periodKey,
      }),
    ],
  };
}

export async function accrueInterest(
  db: DbSession,
  ctx: DomainContext,
  input: { instrumentId: string; periodKey: string; effectiveAt: string },
): Promise<DomainResult> {
  const instrument = await getFinancialInstrument(db, ctx, input.instrumentId);

  if (!instrument.effectiveInterestRate) {
    return {
      kind: 'read',
      data: { accrued: false, explanation: 'No effective interest rate — skip accrual' },
    };
  }

  const { result: calc } = computeEffectiveInterest({
    carryingMinor: instrument.carryingAmountMinor,
    effectiveRate: parseFloat(instrument.effectiveInterestRate),
  });

  return {
    kind: 'intent',
    intents: [
      buildEirAccrualIntent({
        instrumentId: input.instrumentId,
        periodKey: input.periodKey,
        effectiveAt: input.effectiveAt,
        interestMinor: calc.interestMinor,
        effectiveRate: parseFloat(instrument.effectiveInterestRate),
      }),
    ],
  };
}
