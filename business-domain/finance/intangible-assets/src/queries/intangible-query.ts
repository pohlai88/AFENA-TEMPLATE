/**
 * Intangible Asset Queries — Drizzle-based read operations
 */
import type { DomainContext } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { intangibleAssets } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type IntangibleAssetReadModel = {
  id: string;
  assetNumber: string;
  name: string;
  category: string;
  measurementModel: string;
  usefulLifeType: string;
  usefulLifeMonths: number | null;
  amortizationMethod: string | null;
  acquisitionDate: string;
  acquisitionCostMinor: number;
  accumulatedAmortizationMinor: number;
  accumulatedImpairmentMinor: number;
  carryingAmountMinor: number;
  residualValueMinor: number;
  currencyCode: string;
  isActive: boolean;
};

export async function getIntangibleAsset(
  db: DbSession,
  ctx: DomainContext,
  assetId: string,
): Promise<IntangibleAssetReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select()
      .from(intangibleAssets)
      .where(and(eq(intangibleAssets.orgId, ctx.orgId), eq(intangibleAssets.id, assetId), eq(intangibleAssets.isDeleted, false)))
      .limit(1),
  );

  const row = rows[0];
  if (!row) throw new Error(`Intangible asset ${assetId} not found`);

  return {
    id: row.id,
    assetNumber: row.assetNumber,
    name: row.name,
    category: row.category,
    measurementModel: row.measurementModel,
    usefulLifeType: row.usefulLifeType,
    usefulLifeMonths: row.usefulLifeMonths,
    amortizationMethod: row.amortizationMethod,
    acquisitionDate: String(row.acquisitionDate),
    acquisitionCostMinor: Number(row.acquisitionCostMinor),
    accumulatedAmortizationMinor: Number(row.accumulatedAmortizationMinor),
    accumulatedImpairmentMinor: Number(row.accumulatedImpairmentMinor),
    carryingAmountMinor: Number(row.carryingAmountMinor),
    residualValueMinor: Number(row.residualValueMinor),
    currencyCode: row.currencyCode,
    isActive: row.isActive ?? true,
  };
}
