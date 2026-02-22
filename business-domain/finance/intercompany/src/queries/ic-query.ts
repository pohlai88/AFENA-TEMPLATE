import { DomainError } from 'afenda-canon';
import { icTransactions } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

export type IcTransactionReadModel = {
  transactionId: string;
  transactionNo: string | null;
  fromCompanyId: string;
  toCompanyId: string;
  amountMinor: number;
  currencyCode: string;
  transactionDate: string;
  matchStatus: string;
  sourceDocRef: string | null;
};

export async function getUnmatchedIcTransactions(
  db: DbSession,
  ctx: DomainContext,
  input: { companyId: string },
): Promise<IcTransactionReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        transactionId: icTransactions.id,
        transactionNo: icTransactions.transactionNo,
        fromCompanyId: icTransactions.fromCompanyId,
        toCompanyId: icTransactions.toCompanyId,
        amountMinor: icTransactions.amountMinor,
        currencyCode: icTransactions.currencyCode,
        transactionDate: icTransactions.transactionDate,
        matchStatus: icTransactions.matchStatus,
        sourceDocRef: icTransactions.sourceDocRef,
      })
      .from(icTransactions)
      .where(
        and(
          eq(icTransactions.orgId, ctx.orgId),
          eq(icTransactions.matchStatus, 'unmatched'),
          eq(icTransactions.fromCompanyId, input.companyId),
          eq(icTransactions.isDeleted, false),
        ),
      ),
  );

  return rows.map((r) => ({
    ...r,
    transactionId: r.transactionId,
    transactionDate: String(r.transactionDate),
  }));
}

export async function getIcTransaction(
  db: DbSession,
  ctx: DomainContext,
  transactionId: string,
): Promise<IcTransactionReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        transactionId: icTransactions.id,
        transactionNo: icTransactions.transactionNo,
        fromCompanyId: icTransactions.fromCompanyId,
        toCompanyId: icTransactions.toCompanyId,
        amountMinor: icTransactions.amountMinor,
        currencyCode: icTransactions.currencyCode,
        transactionDate: icTransactions.transactionDate,
        matchStatus: icTransactions.matchStatus,
        sourceDocRef: icTransactions.sourceDocRef,
      })
      .from(icTransactions)
      .where(and(eq(icTransactions.orgId, ctx.orgId), eq(icTransactions.id, transactionId), eq(icTransactions.isDeleted, false)))
      .limit(1),
  );

  const row = rows[0];
  if (!row) {
    throw new DomainError('NOT_FOUND', `IC transaction not found: ${transactionId}`, {
      transactionId,
    });
  }

  return { ...row, transactionDate: String(row.transactionDate) };
}
