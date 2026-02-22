import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type {
  AllocatedObligation,
  PerformanceObligation,
} from '../calculators/performance-obligation';
import { allocateTransactionPrice } from '../calculators/performance-obligation';
import type { RevenueMethod, RevenueScheduleEntry } from '../calculators/revenue-schedule';
import { buildRevenueSchedule } from '../calculators/revenue-schedule';
import { buildDeferRevenueIntent, buildRecognizeRevenueIntent } from '../commands/revenue-intent';
import { getRevenueContract } from '../queries/revenue-query';

export type DeferralResult = {
  deferredMinor: number;
  recognizedToDateMinor: number;
  remainingPeriods: number;
};

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getRevenueSchedule(
  _db: DbSession,
  _ctx: DomainContext,
  input: { totalMinor: number; startDateIso: string; endDateIso: string; method: RevenueMethod },
): Promise<DomainResult<RevenueScheduleEntry[]>> {
  const calc = buildRevenueSchedule(
    input.totalMinor,
    input.startDateIso,
    input.endDateIso,
    input.method,
  );
  return { kind: 'read', data: calc.result };
}

export async function deferRevenue(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    totalMinor: number;
    startDateIso: string;
    endDateIso: string;
    method: RevenueMethod;
    asOfDateIso: string;
  },
): Promise<DomainResult<DeferralResult>> {
  const calc = buildRevenueSchedule(
    input.totalMinor,
    input.startDateIso,
    input.endDateIso,
    input.method,
  );
  let recognizedToDateMinor = 0;
  let remainingPeriods = 0;
  for (const entry of calc.result) {
    if (entry.periodStartIso <= input.asOfDateIso) {
      recognizedToDateMinor += entry.recognizedMinor;
    } else {
      remainingPeriods++;
    }
  }
  const deferredMinor = input.totalMinor - recognizedToDateMinor;
  return { kind: 'read', data: { deferredMinor, recognizedToDateMinor, remainingPeriods } };
}

export async function getAllocatedObligations(
  _db: DbSession,
  _ctx: DomainContext,
  input: { transactionPriceMinor: number; obligations: PerformanceObligation[] },
): Promise<DomainResult<AllocatedObligation[]>> {
  const calc = allocateTransactionPrice(input.transactionPriceMinor, input.obligations);
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Load a revenue schedule from DB, build the schedule, and emit
 * a `revenue.recognize` intent for the given period.
 */
export async function recognizeRevenueFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    scheduleId: string;
    obligationId: string;
    periodKey: string;
    method: 'point_in_time' | 'over_time';
  },
): Promise<DomainResult<RevenueScheduleEntry[]>> {
  const contract = await getRevenueContract(db, ctx, input.scheduleId);

  const calc = buildRevenueSchedule(
    contract.totalMinor,
    contract.startDateIso,
    contract.endDateIso,
    contract.recognitionMethod as RevenueMethod,
  );

  // Find the entry for the current period
  const periodEntry = calc.result.find(
    (e) => e.periodStartIso <= input.periodKey && e.periodEndIso > input.periodKey,
  );

  const intent = buildRecognizeRevenueIntent(
    {
      contractId: contract.scheduleId,
      obligationId: input.obligationId,
      amountMinor: periodEntry?.recognizedMinor ?? 0,
      method: input.method,
      periodKey: input.periodKey,
    },
    stableCanonicalJson({
      type: 'revenue.recognize',
      contractId: contract.scheduleId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * Defer revenue for a contract and emit a `revenue.defer` intent.
 */
export async function deferRevenueFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    scheduleId: string;
    periodKey: string;
    deferralAccountId: string;
    asOfDateIso: string;
  },
): Promise<DomainResult<DeferralResult>> {
  const contract = await getRevenueContract(db, ctx, input.scheduleId);

  const calc = buildRevenueSchedule(
    contract.totalMinor,
    contract.startDateIso,
    contract.endDateIso,
    contract.recognitionMethod as RevenueMethod,
  );

  let recognizedToDateMinor = 0;
  let remainingPeriods = 0;
  for (const entry of calc.result) {
    if (entry.periodStartIso <= input.asOfDateIso) {
      recognizedToDateMinor += entry.recognizedMinor;
    } else {
      remainingPeriods++;
    }
  }
  const deferredMinor = contract.totalMinor - recognizedToDateMinor;

  const intent = buildDeferRevenueIntent(
    {
      contractId: contract.scheduleId,
      amountMinor: deferredMinor,
      deferralAccountId: input.deferralAccountId,
      periodKey: input.periodKey,
    },
    stableCanonicalJson({
      type: 'revenue.defer',
      contractId: contract.scheduleId,
      periodKey: input.periodKey,
    }),
  );

  return {
    kind: 'intent+read',
    data: { deferredMinor, recognizedToDateMinor, remainingPeriods },
    intents: [intent],
  };
}
