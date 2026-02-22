import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { treasuryAccounts } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type CashAccountReadModel = {
  id: string;
  accountNo: string;
  bankName: string;
  accountType: string;
  currencyCode: string;
  bookBalanceMinor: number;
  asOfDate: string;
  isActive: boolean;
};

export async function getCashAccount(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<CashAccountReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: treasuryAccounts.id,
        accountNo: treasuryAccounts.accountNo,
        bankName: treasuryAccounts.bankName,
        accountType: treasuryAccounts.accountType,
        currencyCode: treasuryAccounts.currencyCode,
        bookBalanceMinor: treasuryAccounts.bookBalanceMinor,
        asOfDate: treasuryAccounts.asOfDate,
        isActive: treasuryAccounts.isActive,
      })
      .from(treasuryAccounts)
      .where(
        and(
          eq(treasuryAccounts.orgId, ctx.orgId),
          eq(treasuryAccounts.companyId, ctx.companyId),
          eq(treasuryAccounts.id, id),
          eq(treasuryAccounts.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Cash account not found: ${id}`);
  return rows[0]!;
}

export async function listActiveCashAccounts(
  db: DbSession,
  ctx: DomainContext,
): Promise<CashAccountReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: treasuryAccounts.id,
        accountNo: treasuryAccounts.accountNo,
        bankName: treasuryAccounts.bankName,
        accountType: treasuryAccounts.accountType,
        currencyCode: treasuryAccounts.currencyCode,
        bookBalanceMinor: treasuryAccounts.bookBalanceMinor,
        asOfDate: treasuryAccounts.asOfDate,
        isActive: treasuryAccounts.isActive,
      })
      .from(treasuryAccounts)
      .where(
        and(
          eq(treasuryAccounts.orgId, ctx.orgId),
          eq(treasuryAccounts.companyId, ctx.companyId),
          eq(treasuryAccounts.isActive, true),
          eq(treasuryAccounts.isDeleted, false),
        ),
      ),
  );
}
