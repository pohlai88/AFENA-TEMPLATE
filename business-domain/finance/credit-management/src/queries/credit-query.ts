import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { creditLimits } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type CustomerCreditReadModel = {
  customerId: string;
  creditLimitMinor: number;
  currentExposureMinor: number;
  currency: string;
};

export async function getCustomerCredit(
  db: DbSession,
  ctx: DomainContext,
  customerId: string,
): Promise<CustomerCreditReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        customerId: creditLimits.customerId,
        creditLimitMinor: creditLimits.limitAmountMinor,
        currentExposureMinor: creditLimits.currentExposureMinor,
        currency: creditLimits.currencyCode,
      })
      .from(creditLimits)
      .where(
        and(
          eq(creditLimits.orgId, ctx.orgId),
          eq(creditLimits.customerId, customerId),
          eq(creditLimits.isActive, true),
          eq(creditLimits.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `No active credit limit for customer: ${customerId}`, {
      customerId,
    });
  }

  return rows[0]!;
}
