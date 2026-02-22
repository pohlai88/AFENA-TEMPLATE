import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { investmentProperties } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type InvestmentPropertyReadModel = {
  id: string;
  propertyName: string;
  category: string;
  measurementModel: string;
  measurementDate: string;
  currencyCode: string;
  fairValueMinor: number;
  costMinor: number;
  accumulatedDeprMinor: number;
  isActive: boolean;
};

export async function getProperty(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<InvestmentPropertyReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: investmentProperties.id,
        propertyName: investmentProperties.propertyName,
        category: investmentProperties.category,
        measurementModel: investmentProperties.measurementModel,
        measurementDate: investmentProperties.measurementDate,
        currencyCode: investmentProperties.currencyCode,
        fairValueMinor: investmentProperties.fairValueMinor,
        costMinor: investmentProperties.costMinor,
        accumulatedDeprMinor: investmentProperties.accumulatedDeprMinor,
        isActive: investmentProperties.isActive,
      })
      .from(investmentProperties)
      .where(
        and(
          eq(investmentProperties.orgId, ctx.orgId),
          eq(investmentProperties.companyId, ctx.companyId),
          eq(investmentProperties.id, id),
          eq(investmentProperties.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Investment property not found: ${id}`);
  return rows[0]!;
}

export async function listActiveProperties(
  db: DbSession,
  ctx: DomainContext,
): Promise<InvestmentPropertyReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: investmentProperties.id,
        propertyName: investmentProperties.propertyName,
        category: investmentProperties.category,
        measurementModel: investmentProperties.measurementModel,
        measurementDate: investmentProperties.measurementDate,
        currencyCode: investmentProperties.currencyCode,
        fairValueMinor: investmentProperties.fairValueMinor,
        costMinor: investmentProperties.costMinor,
        accumulatedDeprMinor: investmentProperties.accumulatedDeprMinor,
        isActive: investmentProperties.isActive,
      })
      .from(investmentProperties)
      .where(
        and(
          eq(investmentProperties.orgId, ctx.orgId),
          eq(investmentProperties.companyId, ctx.companyId),
          eq(investmentProperties.isActive, true),
          eq(investmentProperties.isDeleted, false),
        ),
      ),
  );
}
