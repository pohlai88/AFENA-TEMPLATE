import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { LeaseLiabilityResult, LeasePayment } from '../calculators/lease-liability';
import { computeLeaseLiability } from '../calculators/lease-liability';
import type { RouAssetResult } from '../calculators/rou-asset';
import { computeRouAsset } from '../calculators/rou-asset';
import { buildLeaseAmortizeIntent, buildLeaseModifyIntent } from '../commands/lease-intent';
import { getLease } from '../queries/lease-query';

/* ── pure calculator wrappers (backward-compatible) ─────────── */

export async function getLeaseLiability(
  _db: DbSession,
  _ctx: DomainContext,
  input: { payments: LeasePayment[]; annualDiscountRate: number },
): Promise<DomainResult<LeaseLiabilityResult>> {
  const calc = computeLeaseLiability(input.payments, input.annualDiscountRate);
  return { kind: 'read', data: calc.result };
}

export async function getRouAsset(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    liabilityMinor: number;
    initialDirectCostsMinor: number;
    incentivesMinor: number;
    leasePeriods: number;
  },
): Promise<DomainResult<RouAssetResult>> {
  const calc = computeRouAsset(
    input.liabilityMinor,
    input.initialDirectCostsMinor,
    input.incentivesMinor,
    input.leasePeriods,
  );
  return { kind: 'read', data: calc.result };
}

/* ── DB-wired operations ────────────────────────────────────── */

/**
 * Load a lease from DB, compute the amortization for a period, and
 * emit a `lease.amortize` intent.
 */
export async function amortizeLeaseFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    leaseId: string;
    periodKey: string;
    payments: LeasePayment[];
    annualDiscountRate: number;
    currentPeriod: number;
  },
): Promise<DomainResult<LeaseLiabilityResult>> {
  const lease = await getLease(db, ctx, input.leaseId);
  const calc = computeLeaseLiability(input.payments, input.annualDiscountRate);

  const scheduleEntry = calc.result.schedule.find((s) => s.period === input.currentPeriod);

  const intent = buildLeaseAmortizeIntent(
    {
      leaseId: lease.leaseId,
      periodKey: input.periodKey,
      principalMinor: scheduleEntry?.principalMinor ?? 0,
      interestMinor: scheduleEntry?.interestMinor ?? 0,
    },
    stableCanonicalJson({
      type: 'lease.amortize',
      leaseId: lease.leaseId,
      periodKey: input.periodKey,
    }),
  );

  return { kind: 'intent+read', data: calc.result, intents: [intent] };
}

/**
 * Modify an existing lease and emit a `lease.modify` intent.
 */
export async function modifyLeaseFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: {
    leaseId: string;
    modificationDate: string;
    newTermMonths?: number;
    newPaymentMinor?: number;
    reason: string;
  },
): Promise<DomainResult<{ leaseId: string; modified: true }>> {
  const lease = await getLease(db, ctx, input.leaseId);

  const intent = buildLeaseModifyIntent(
    {
      leaseId: lease.leaseId,
      modificationDate: input.modificationDate,
      ...(input.newTermMonths != null ? { newTermMonths: input.newTermMonths } : {}),
      ...(input.newPaymentMinor != null ? { newPaymentMinor: input.newPaymentMinor } : {}),
      reason: input.reason,
    },
    stableCanonicalJson({
      type: 'lease.modify',
      leaseId: lease.leaseId,
      date: input.modificationDate,
    }),
  );

  return {
    kind: 'intent+read',
    data: { leaseId: lease.leaseId, modified: true },
    intents: [intent],
  };
}
