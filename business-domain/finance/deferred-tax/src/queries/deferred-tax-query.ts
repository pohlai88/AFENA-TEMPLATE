import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { deferredTaxItems } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type DeferredTaxReadModel = {
  id: string;
  periodKey: string;
  accountId: string | null;
  assetOrLiability: string;
  carryingMinor: number;
  taxBaseMinor: number;
  temporaryDiffMinor: number;
  taxRateBps: number;
  dtaMinor: number;
  dtlMinor: number;
  currencyCode: string;
};

export async function getDeferredTaxItem(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<DeferredTaxReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: deferredTaxItems.id,
        periodKey: deferredTaxItems.periodKey,
        accountId: deferredTaxItems.accountId,
        assetOrLiability: deferredTaxItems.assetOrLiability,
        carryingMinor: deferredTaxItems.carryingMinor,
        taxBaseMinor: deferredTaxItems.taxBaseMinor,
        temporaryDiffMinor: deferredTaxItems.temporaryDiffMinor,
        taxRateBps: deferredTaxItems.taxRateBps,
        dtaMinor: deferredTaxItems.dtaMinor,
        dtlMinor: deferredTaxItems.dtlMinor,
        currencyCode: deferredTaxItems.currencyCode,
      })
      .from(deferredTaxItems)
      .where(
        and(
          eq(deferredTaxItems.orgId, ctx.orgId),
          eq(deferredTaxItems.companyId, ctx.companyId),
          eq(deferredTaxItems.id, id),
          eq(deferredTaxItems.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Deferred tax item not found: ${id}`);
  return rows[0]!;
}

export async function listByPeriod(
  db: DbSession,
  ctx: DomainContext,
  periodKey: string,
): Promise<DeferredTaxReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: deferredTaxItems.id,
        periodKey: deferredTaxItems.periodKey,
        accountId: deferredTaxItems.accountId,
        assetOrLiability: deferredTaxItems.assetOrLiability,
        carryingMinor: deferredTaxItems.carryingMinor,
        taxBaseMinor: deferredTaxItems.taxBaseMinor,
        temporaryDiffMinor: deferredTaxItems.temporaryDiffMinor,
        taxRateBps: deferredTaxItems.taxRateBps,
        dtaMinor: deferredTaxItems.dtaMinor,
        dtlMinor: deferredTaxItems.dtlMinor,
        currencyCode: deferredTaxItems.currencyCode,
      })
      .from(deferredTaxItems)
      .where(
        and(
          eq(deferredTaxItems.orgId, ctx.orgId),
          eq(deferredTaxItems.companyId, ctx.companyId),
          eq(deferredTaxItems.periodKey, periodKey),
          eq(deferredTaxItems.isDeleted, false),
        ),
      ),
  );
}
