/**
 * Impairment Service — IAS 36
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { testImpairment } from '../calculators/impairment-calc';
import {
  buildImpairmentRecogniseIntent,
  buildImpairmentReverseIntent,
  buildImpairmentTestIntent,
} from '../commands/impairment-intent';

export async function performImpairmentTest(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    cguId?: string;
    carryingAmountMinor: number;
    viuMinor: number;
    fvlcdMinor: number;
    periodKey: string;
  },
): Promise<DomainResult> {
  const { result } = testImpairment({
    carryingAmountMinor: input.carryingAmountMinor,
    viuMinor: input.viuMinor,
    fvlcdMinor: input.fvlcdMinor,
  });

  return {
    kind: 'intent',
    intents: [
      buildImpairmentTestIntent({
        assetId: input.assetId,
        ...(input.cguId != null ? { cguId: input.cguId } : {}),
        carryingAmountMinor: input.carryingAmountMinor,
        recoverableAmountMinor: result.recoverableAmountMinor,
        viuMinor: input.viuMinor,
        fvlcdMinor: input.fvlcdMinor,
        periodKey: input.periodKey,
      }),
    ],
  };
}

export async function recogniseImpairment(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    cguId?: string;
    lossMinor: number;
    assetType: 'ppe' | 'intangible' | 'goodwill' | 'rou';
    impairmentDate: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildImpairmentRecogniseIntent({
        assetId: input.assetId,
        ...(input.cguId != null ? { cguId: input.cguId } : {}),
        lossMinor: input.lossMinor,
        assetType: input.assetType,
        impairmentDate: input.impairmentDate,
      }),
    ],
  };
}

export async function reverseImpairment(
  db: DbSession,
  ctx: DomainContext,
  input: {
    assetId: string;
    reversalMinor: number;
    newCarryingMinor: number;
    reversalDate: string;
    reason: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildImpairmentReverseIntent({
        assetId: input.assetId,
        reversalMinor: input.reversalMinor,
        newCarryingMinor: input.newCarryingMinor,
        reversalDate: input.reversalDate,
        reason: input.reason,
      }),
    ],
  };
}
