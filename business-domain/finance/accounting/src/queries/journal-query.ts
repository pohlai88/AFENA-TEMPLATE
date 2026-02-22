import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { journalLines } from 'afenda-database';
import { and, eq, sql } from 'drizzle-orm';

export type JournalLineReadModel = {
  journalId: string;
  lineNo: number;
  accountId: string;
  side: 'debit' | 'credit';
  amountMinor: number;
  currency: string;
  memo: string | null;
};

export type TrialBalanceRow = {
  accountId: string;
  debitMinor: number;
  creditMinor: number;
  netMinor: number;
};

export async function getJournalEntry(
  db: DbSession,
  ctx: DomainContext,
  journalId: string,
): Promise<JournalLineReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        journalId: journalLines.journalId,
        lineNo: journalLines.lineNo,
        accountId: journalLines.accountId,
        side: journalLines.side,
        amountMinor: journalLines.amountMinor,
        currency: journalLines.currency,
        memo: journalLines.memo,
      })
      .from(journalLines)
      .where(
        and(
          eq(journalLines.orgId, ctx.orgId),
          eq(journalLines.journalId, journalId),
          eq(journalLines.isDeleted, false),
        ),
      )
      .orderBy(journalLines.lineNo),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Journal entry not found: ${journalId}`, { journalId });
  }

  return rows.map((r) => ({
    journalId: r.journalId,
    lineNo: r.lineNo,
    accountId: r.accountId,
    side: r.side as 'debit' | 'credit',
    amountMinor: r.amountMinor,
    currency: r.currency,
    memo: r.memo ?? null,
  }));
}

export async function getTrialBalance(
  db: DbSession,
  ctx: DomainContext,
  _input: { asOf: string },
): Promise<TrialBalanceRow[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        accountId: journalLines.accountId,
        debitMinor: sql<number>`COALESCE(SUM(CASE WHEN ${journalLines.side} = 'debit' THEN ${journalLines.amountMinor} ELSE 0 END), 0)`,
        creditMinor: sql<number>`COALESCE(SUM(CASE WHEN ${journalLines.side} = 'credit' THEN ${journalLines.amountMinor} ELSE 0 END), 0)`,
      })
      .from(journalLines)
      .where(
        and(
          eq(journalLines.orgId, ctx.orgId),
          eq(journalLines.companyId, ctx.companyId),
        ),
      )
      .groupBy(journalLines.accountId),
  );

  return rows.map((r) => ({
    accountId: r.accountId,
    debitMinor: Number(r.debitMinor),
    creditMinor: Number(r.creditMinor),
    netMinor: Number(r.debitMinor) - Number(r.creditMinor),
  }));
}
