import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { impairmentTests } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type ImpairmentTestReadModel = {
  id: string;
  testDate: string;
  assetId: string | null;
  cguId: string | null;
  currencyCode: string;
  carryingMinor: number;
  recoverableMinor: number;
  impairmentMinor: number;
  recoveryMethod: string;
  isReversed: boolean;
};

export async function getImpairmentTest(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<ImpairmentTestReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: impairmentTests.id,
        testDate: impairmentTests.testDate,
        assetId: impairmentTests.assetId,
        cguId: impairmentTests.cguId,
        currencyCode: impairmentTests.currencyCode,
        carryingMinor: impairmentTests.carryingMinor,
        recoverableMinor: impairmentTests.recoverableMinor,
        impairmentMinor: impairmentTests.impairmentMinor,
        recoveryMethod: impairmentTests.recoveryMethod,
        isReversed: impairmentTests.isReversed,
      })
      .from(impairmentTests)
      .where(
        and(
          eq(impairmentTests.orgId, ctx.orgId),
          eq(impairmentTests.companyId, ctx.companyId),
          eq(impairmentTests.id, id),
          eq(impairmentTests.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Impairment test not found: ${id}`);
  return rows[0]!;
}

export async function listByAsset(
  db: DbSession,
  ctx: DomainContext,
  assetId: string,
): Promise<ImpairmentTestReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: impairmentTests.id,
        testDate: impairmentTests.testDate,
        assetId: impairmentTests.assetId,
        cguId: impairmentTests.cguId,
        currencyCode: impairmentTests.currencyCode,
        carryingMinor: impairmentTests.carryingMinor,
        recoverableMinor: impairmentTests.recoverableMinor,
        impairmentMinor: impairmentTests.impairmentMinor,
        recoveryMethod: impairmentTests.recoveryMethod,
        isReversed: impairmentTests.isReversed,
      })
      .from(impairmentTests)
      .where(
        and(
          eq(impairmentTests.orgId, ctx.orgId),
          eq(impairmentTests.companyId, ctx.companyId),
          eq(impairmentTests.assetId, assetId),
          eq(impairmentTests.isDeleted, false),
        ),
      ),
  );
}
