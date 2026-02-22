import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { subscriptions } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type SubscriptionReadModel = {
  subscriptionId: string;
  customerId: string;
  planName: string;
  mrrMinor: number;
  renewalDateIso: string;
  status: 'active' | 'cancelled' | 'paused';
};

export async function getSubscription(
  db: DbSession,
  ctx: DomainContext,
  subscriptionId: string,
): Promise<SubscriptionReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        subscriptionId: subscriptions.id,
        customerId: subscriptions.customerId,
        planName: subscriptions.planName,
        mrrMinor: subscriptions.recurringAmountMinor,
        renewalDateIso: subscriptions.nextBillingDate,
        status: subscriptions.status,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.orgId, ctx.orgId),
          eq(subscriptions.id, subscriptionId),
          eq(subscriptions.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Subscription not found: ${subscriptionId}`, {
      subscriptionId,
    });
  }

  const r = rows[0]!;
  return {
    subscriptionId: r.subscriptionId,
    customerId: r.customerId,
    planName: r.planName,
    mrrMinor: r.mrrMinor,
    renewalDateIso: String(r.renewalDateIso),
    status: r.status as 'active' | 'cancelled' | 'paused',
  };
}

export async function getActiveSubscriptions(
  db: DbSession,
  ctx: DomainContext,
): Promise<SubscriptionReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        subscriptionId: subscriptions.id,
        customerId: subscriptions.customerId,
        planName: subscriptions.planName,
        mrrMinor: subscriptions.recurringAmountMinor,
        renewalDateIso: subscriptions.nextBillingDate,
        status: subscriptions.status,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.orgId, ctx.orgId),
          eq(subscriptions.companyId, ctx.companyId),
          eq(subscriptions.status, 'active'),
          eq(subscriptions.isDeleted, false),
        ),
      ),
  );

  return rows.map((r) => ({
    subscriptionId: r.subscriptionId,
    customerId: r.customerId,
    planName: r.planName,
    mrrMinor: r.mrrMinor,
    renewalDateIso: String(r.renewalDateIso),
    status: r.status as 'active' | 'cancelled' | 'paused',
  }));
}
