/**
 * Hedge Accounting Service — IFRS 9 §6
 *
 * Read ops: fetchDesignation
 * Write ops: designate, recordEffectiveness, reclassOci
 */
import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import { computeOciMovement, testEffectiveness } from '../calculators/hedge-calc';
import {
  buildHedgeDesignateIntent,
  buildHedgeEffectivenessIntent,
  buildOciReclassIntent,
} from '../commands/hedge-intent';
import { getHedgeDesignation } from '../queries/hedge-query';

/* ---------- Read Operations ---------- */

export async function fetchDesignation(
  db: DbSession,
  ctx: DomainContext,
  designationId: string,
): Promise<DomainResult> {
  const designation = await getHedgeDesignation(db, ctx, designationId);
  return { kind: 'read', data: { designation } };
}

/* ---------- Write Operations ---------- */

export async function designate(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    designationId: string;
    hedgeType: 'fair-value' | 'cash-flow' | 'net-investment';
    hedgingInstrumentId: string;
    hedgedItem: string;
    hedgedRisk: 'interest-rate' | 'fx' | 'commodity-price' | 'credit' | 'equity-price';
    designationDate: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildHedgeDesignateIntent({
        designationId: input.designationId,
        hedgingInstrumentId: input.hedgingInstrumentId,
        hedgedItem: input.hedgedItem,
        hedgeType: input.hedgeType,
        hedgedRisk: input.hedgedRisk,
        designationDate: input.designationDate,
      }),
    ],
  };
}

export async function recordEffectiveness(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    designationId: string;
    testType: 'prospective' | 'retrospective';
    periodKey: string;
    hedgingInstrumentChangeMinor: number;
    hedgedItemChangeMinor: number;
  },
): Promise<DomainResult> {
  void testEffectiveness({
    hedgingInstrumentChangeMinor: input.hedgingInstrumentChangeMinor,
    hedgedItemChangeMinor: input.hedgedItemChangeMinor,
  });

  return {
    kind: 'intent',
    intents: [
      buildHedgeEffectivenessIntent({
        designationId: input.designationId,
        testType: input.testType,
        testMethod: 'dollar-offset',
        instrumentFvChangeMinor: input.hedgingInstrumentChangeMinor,
        hedgedItemFvChangeMinor: input.hedgedItemChangeMinor,
        periodKey: input.periodKey,
      }),
    ],
  };
}

export async function reclassOci(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    designationId: string;
    periodKey: string;
    cumulativeInstrumentMinor: number;
    cumulativeHedgedItemMinor: number;
    reason: string;
    effectiveAt: string;
  },
): Promise<DomainResult> {
  const { result: movement } = computeOciMovement({
    cumulativeInstrumentMinor: input.cumulativeInstrumentMinor,
    cumulativeHedgedItemMinor: input.cumulativeHedgedItemMinor,
  });

  return {
    kind: 'intent',
    intents: [
      buildOciReclassIntent({
        designationId: input.designationId,
        reclassAmountMinor: movement.reclassToPlMinor,
        fromReserve: 'oci',
        periodKey: input.periodKey,
        effectiveAt: input.effectiveAt,
        reason: input.reason,
      }),
    ],
  };
}
