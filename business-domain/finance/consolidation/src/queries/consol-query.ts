import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { icTransactions } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type IcBalanceReadModel = {
  transactionId: string;
  fromCompanyId: string;
  toCompanyId: string;
  amountMinor: number;
  currency: string;
  accountId: string | null;
};

/**
 * Load unmatched IC transactions for a given subsidiary, used to compute
 * elimination entries during consolidation.
 */
export async function getUnmatchedIcBalances(
  db: DbSession,
  ctx: DomainContext,
  subsidiaryCompanyId: string,
): Promise<IcBalanceReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        transactionId: icTransactions.id,
        fromCompanyId: icTransactions.fromCompanyId,
        toCompanyId: icTransactions.toCompanyId,
        amountMinor: icTransactions.amountMinor,
        currency: icTransactions.currencyCode,
        accountId: icTransactions.sourceDocRef,
      })
      .from(icTransactions)
      .where(
        and(
          eq(icTransactions.orgId, ctx.orgId),
          eq(icTransactions.fromCompanyId, subsidiaryCompanyId),
          eq(icTransactions.matchStatus, 'unmatched'),
          eq(icTransactions.isDeleted, false),
        ),
      ),
  );

  return rows.map((r) => ({
    transactionId: r.transactionId,
    fromCompanyId: r.fromCompanyId,
    toCompanyId: r.toCompanyId,
    amountMinor: r.amountMinor,
    currency: r.currency,
    accountId: r.accountId,
  }));
}
