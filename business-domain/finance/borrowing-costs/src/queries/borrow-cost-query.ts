import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { borrowingCostItems } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type BorrowingCostReadModel = {
  id: string;
  periodKey: string;
  qualifyingAssetId: string;
  currencyCode: string;
  borrowingMinor: number;
  capitalisedMinor: number;
  expensedMinor: number;
  capitalisationRateBps: number | null;
  status: string;
};

export async function getBorrowingCost(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<BorrowingCostReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: borrowingCostItems.id,
        periodKey: borrowingCostItems.periodKey,
        qualifyingAssetId: borrowingCostItems.qualifyingAssetId,
        currencyCode: borrowingCostItems.currencyCode,
        borrowingMinor: borrowingCostItems.borrowingMinor,
        capitalisedMinor: borrowingCostItems.capitalisedMinor,
        expensedMinor: borrowingCostItems.expensedMinor,
        capitalisationRateBps: borrowingCostItems.capitalisationRateBps,
        status: borrowingCostItems.status,
      })
      .from(borrowingCostItems)
      .where(
        and(
          eq(borrowingCostItems.orgId, ctx.orgId),
          eq(borrowingCostItems.companyId, ctx.companyId),
          eq(borrowingCostItems.id, id),
          eq(borrowingCostItems.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Borrowing cost item not found: ${id}`);
  return rows[0]!;
}

export async function listByAssetAndPeriod(
  db: DbSession,
  ctx: DomainContext,
  qualifyingAssetId: string,
  periodKey: string,
): Promise<BorrowingCostReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: borrowingCostItems.id,
        periodKey: borrowingCostItems.periodKey,
        qualifyingAssetId: borrowingCostItems.qualifyingAssetId,
        currencyCode: borrowingCostItems.currencyCode,
        borrowingMinor: borrowingCostItems.borrowingMinor,
        capitalisedMinor: borrowingCostItems.capitalisedMinor,
        expensedMinor: borrowingCostItems.expensedMinor,
        capitalisationRateBps: borrowingCostItems.capitalisationRateBps,
        status: borrowingCostItems.status,
      })
      .from(borrowingCostItems)
      .where(
        and(
          eq(borrowingCostItems.orgId, ctx.orgId),
          eq(borrowingCostItems.companyId, ctx.companyId),
          eq(borrowingCostItems.qualifyingAssetId, qualifyingAssetId),
          eq(borrowingCostItems.periodKey, periodKey),
          eq(borrowingCostItems.isDeleted, false),
        ),
      ),
  );
}
