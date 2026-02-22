import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { sbpGrants } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type SbpGrantReadModel = {
  id: string;
  grantDate: string;
  vestingPeriodMonths: number;
  currencyCode: string;
  exercisePriceMinor: number;
  fairValuePerUnitMinor: number;
  unitsGranted: number;
  unitsVested: number;
  unitsCancelled: number;
  settlementType: string;
  status: string;
};

export async function getSbpGrant(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<SbpGrantReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: sbpGrants.id,
        grantDate: sbpGrants.grantDate,
        vestingPeriodMonths: sbpGrants.vestingPeriodMonths,
        currencyCode: sbpGrants.currencyCode,
        exercisePriceMinor: sbpGrants.exercisePriceMinor,
        fairValuePerUnitMinor: sbpGrants.fairValuePerUnitMinor,
        unitsGranted: sbpGrants.unitsGranted,
        unitsVested: sbpGrants.unitsVested,
        unitsCancelled: sbpGrants.unitsCancelled,
        settlementType: sbpGrants.settlementType,
        status: sbpGrants.status,
      })
      .from(sbpGrants)
      .where(
        and(
          eq(sbpGrants.orgId, ctx.orgId),
          eq(sbpGrants.companyId, ctx.companyId),
          eq(sbpGrants.id, id),
          eq(sbpGrants.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `SBP grant not found: ${id}`);
  return rows[0]!;
}

export async function listActiveGrants(
  db: DbSession,
  ctx: DomainContext,
): Promise<SbpGrantReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: sbpGrants.id,
        grantDate: sbpGrants.grantDate,
        vestingPeriodMonths: sbpGrants.vestingPeriodMonths,
        currencyCode: sbpGrants.currencyCode,
        exercisePriceMinor: sbpGrants.exercisePriceMinor,
        fairValuePerUnitMinor: sbpGrants.fairValuePerUnitMinor,
        unitsGranted: sbpGrants.unitsGranted,
        unitsVested: sbpGrants.unitsVested,
        unitsCancelled: sbpGrants.unitsCancelled,
        settlementType: sbpGrants.settlementType,
        status: sbpGrants.status,
      })
      .from(sbpGrants)
      .where(
        and(
          eq(sbpGrants.orgId, ctx.orgId),
          eq(sbpGrants.companyId, ctx.companyId),
          eq(sbpGrants.status, 'active'),
          eq(sbpGrants.isDeleted, false),
        ),
      ),
  );
}
