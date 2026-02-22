import type { DomainContext, DomainResult } from 'afenda-canon';
import { stableCanonicalJson } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import type { ProratedResult } from '../calculators/proration';
import { prorateBilling } from '../calculators/proration';
import type { RenewalForecast, Subscription } from '../calculators/renewal-forecast';
import { forecastRenewals } from '../calculators/renewal-forecast';
import { buildSubscriptionInvoiceIntent } from '../commands/subscription-intent';
import { getActiveSubscriptions } from '../queries/subscription-query';

export async function getProration(
  _db: DbSession,
  _ctx: DomainContext,
  input: { planAmountMinor: number; billingCycleDays: number; usedDays: number },
): Promise<DomainResult<ProratedResult>> {
  const calc = prorateBilling(input.planAmountMinor, input.billingCycleDays, input.usedDays);
  return { kind: 'read', data: calc.result };
}

export async function getRenewalForecast(
  _db: DbSession,
  _ctx: DomainContext,
  input: { subscriptions: Subscription[]; horizonMonths?: number },
): Promise<DomainResult<RenewalForecast>> {
  const calc = forecastRenewals(input.subscriptions, input.horizonMonths);
  return { kind: 'read', data: calc.result };
}

export async function getRenewalForecastFromDb(
  db: DbSession,
  ctx: DomainContext,
  input: { companyId: string; horizonMonths?: number },
): Promise<DomainResult<RenewalForecast>> {
  const subs = await getActiveSubscriptions(db, ctx, { companyId: input.companyId });
  const asSub = (s: (typeof subs)[number]): Subscription => ({
    id: s.subscriptionId,
    mrrMinor: s.mrrMinor,
    renewalDateIso: s.renewalDateIso,
    churnProbability: 0.1,
  });
  const calc = forecastRenewals(subs.map(asSub), input.horizonMonths);
  return { kind: 'read', data: calc.result };
}

export async function generateBillingCycleInvoice(
  _db: DbSession,
  _ctx: DomainContext,
  input: {
    subscriptionId: string;
    billingCycleId: string;
    amountMinor: number;
    periodStart: string;
    periodEnd: string;
  },
): Promise<DomainResult> {
  const intent = buildSubscriptionInvoiceIntent(
    {
      subscriptionId: input.subscriptionId,
      billingCycleId: input.billingCycleId,
      amountMinor: input.amountMinor,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    },
    stableCanonicalJson({
      subscriptionId: input.subscriptionId,
      billingCycleId: input.billingCycleId,
    }),
  );
  return { kind: 'intent', intents: [intent] };
}
