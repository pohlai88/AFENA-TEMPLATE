import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { biologicalAssetItems } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type BioAssetReadModel = {
  id: string;
  assetName: string;
  assetClass: string;
  measurementDate: string;
  currencyCode: string;
  fairValueMinor: number;
  costMinor: number;
  harvestYield: string | null;
  harvestUom: string | null;
};

export async function getBioAsset(
  db: DbSession,
  ctx: DomainContext,
  id: string,
): Promise<BioAssetReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: biologicalAssetItems.id,
        assetName: biologicalAssetItems.assetName,
        assetClass: biologicalAssetItems.assetClass,
        measurementDate: biologicalAssetItems.measurementDate,
        currencyCode: biologicalAssetItems.currencyCode,
        fairValueMinor: biologicalAssetItems.fairValueMinor,
        costMinor: biologicalAssetItems.costMinor,
        harvestYield: biologicalAssetItems.harvestYield,
        harvestUom: biologicalAssetItems.harvestUom,
      })
      .from(biologicalAssetItems)
      .where(
        and(
          eq(biologicalAssetItems.orgId, ctx.orgId),
          eq(biologicalAssetItems.companyId, ctx.companyId),
          eq(biologicalAssetItems.id, id),
          eq(biologicalAssetItems.isDeleted, false),
        ),
      )
      .limit(1),
  );
  if (rows.length === 0)
    throw new DomainError('NOT_FOUND', `Biological asset not found: ${id}`);
  return rows[0]!;
}

export async function listByClass(
  db: DbSession,
  ctx: DomainContext,
  assetClass: string,
): Promise<BioAssetReadModel[]> {
  return db.read((tx) =>
    tx
      .select({
        id: biologicalAssetItems.id,
        assetName: biologicalAssetItems.assetName,
        assetClass: biologicalAssetItems.assetClass,
        measurementDate: biologicalAssetItems.measurementDate,
        currencyCode: biologicalAssetItems.currencyCode,
        fairValueMinor: biologicalAssetItems.fairValueMinor,
        costMinor: biologicalAssetItems.costMinor,
        harvestYield: biologicalAssetItems.harvestYield,
        harvestUom: biologicalAssetItems.harvestUom,
      })
      .from(biologicalAssetItems)
      .where(
        and(
          eq(biologicalAssetItems.orgId, ctx.orgId),
          eq(biologicalAssetItems.companyId, ctx.companyId),
          eq(biologicalAssetItems.assetClass, assetClass),
          eq(biologicalAssetItems.isDeleted, false),
        ),
      ),
  );
}
